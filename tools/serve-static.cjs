const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const root = path.resolve(process.argv[2] || process.cwd());
const port = Number(process.argv[3] || 4177);
const host = process.argv[4] || "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function resolveRequest(url = "/") {
  const requestPath = decodeURIComponent(url.split("?")[0]);
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.resolve(root, `.${normalized.replace(/\\/g, "/")}`);
  return filePath.startsWith(root) ? filePath : null;
}

const server = http.createServer(async (request, response) => {
  try {
    const filePath = resolveRequest(request.url);
    if (!filePath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    const data = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(data);
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
});
