const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();
const failures = [];

function exists(relativePath) {
  return fs.existsSync(path.resolve(root, relativePath));
}

function stripQuery(value) {
  return value.split("?")[0];
}

function checkAsset(reference, file) {
  if (!reference || reference.startsWith("#")) return;
  if (/^(https?:|mailto:|tel:)/.test(reference)) return;
  const target = stripQuery(reference).split("#")[0];
  if (target && !exists(target)) {
    failures.push(`${file}: missing asset or page ${reference}`);
  }
}

function idsFor(markup) {
  return Array.from(markup.matchAll(/\sid="([^"]+)"/g)).map((match) => match[1]);
}

const pageIds = new Map();
for (const file of htmlFiles) {
  const markup = fs.readFileSync(path.join(root, file), "utf8");
  const ids = idsFor(markup);
  pageIds.set(file, new Set(ids));

  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of duplicateIds) {
    failures.push(`${file}: duplicate id ${id}`);
  }

  for (const match of markup.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
    const reference = match[1];
    if (reference.startsWith("https://fonts.googleapis.com") || reference.startsWith("https://fonts.gstatic.com")) continue;
    checkAsset(reference, file);
  }

  for (const match of markup.matchAll(/\ssrcset="([^"]+)"/g)) {
    const candidates = match[1].split(",").map((entry) => entry.trim().split(/\s+/)[0]).filter(Boolean);
    for (const candidate of candidates) {
      checkAsset(candidate, file);
    }
  }
}

for (const file of htmlFiles) {
  const markup = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of markup.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.includes("#") || /^(https?:|mailto:|tel:)/.test(href)) continue;

    const [targetPage, hash] = href.split("#");
    if (!hash) continue;

    const page = targetPage || file;
    const normalizedPage = page === "" ? file : page;
    if (!pageIds.has(normalizedPage)) {
      failures.push(`${file}: missing hash target page ${href}`);
      continue;
    }
    if (!pageIds.get(normalizedPage).has(hash)) {
      failures.push(`${file}: missing hash target ${href}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files: links, hash targets, duplicate ids, and assets are valid.`);
