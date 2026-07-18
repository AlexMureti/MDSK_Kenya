from __future__ import annotations

import hashlib
import json
import math
import sys
from datetime import datetime, timedelta
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


MEDIA_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".mp4",
    ".mov",
    ".m4v",
    ".mp3",
    ".mpeg",
    ".wav",
    ".m4a",
    ".ogg",
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def dhash(path: Path) -> str | None:
    try:
        image = Image.open(path).convert("L").resize((9, 8), Image.Resampling.LANCZOS)
    except Exception:
        return None

    pixels = list(image.getdata())
    bits: list[str] = []
    for y in range(8):
        row = pixels[y * 9 : (y + 1) * 9]
        bits.extend("1" if row[i] > row[i + 1] else "0" for i in range(8))
    return "".join(bits)


def hamming(left: str | None, right: str | None) -> int:
    if not left or not right or len(left) != len(right):
        return 999
    return sum(a != b for a, b in zip(left, right))


def is_candidate(path: Path, cutoff: datetime) -> bool:
    if not path.is_file() or path.suffix.lower() not in MEDIA_EXTENSIONS:
        return False
    if path.name.lower().startswith("whatsapp"):
        return True
    return datetime.fromtimestamp(path.stat().st_mtime) >= cutoff


def collect_existing(root: Path) -> tuple[dict[str, list[str]], list[tuple[str, str]]]:
    exact: dict[str, list[str]] = {}
    visual: list[tuple[str, str]] = []
    for base in [root / "_ASSET_DROPZONE", root / "assets"]:
        if not base.exists():
            continue
        for path in base.rglob("*"):
            if not path.is_file() or path.suffix.lower() not in MEDIA_EXTENSIONS:
                continue
            if "NEW_MEDIA_INTAKE" in str(path):
                continue
            try:
                file_hash = sha256(path)
                exact.setdefault(file_hash, []).append(str(path.relative_to(root)))
                image_hash = dhash(path)
                if image_hash:
                    visual.append((image_hash, str(path.relative_to(root))))
            except Exception:
                continue
    return exact, visual


def make_contact_sheet(thumbs: list[tuple[int, str, Image.Image, dict]], output: Path) -> None:
    if not thumbs:
        return

    columns = 3
    cell_width = 320
    cell_height = 250
    sheet = Image.new("RGB", (columns * cell_width, math.ceil(len(thumbs) / columns) * cell_height), "white")
    draw = ImageDraw.Draw(sheet)

    for index, (item_index, name, thumb, item) in enumerate(thumbs):
        x = (index % columns) * cell_width + 24
        y = (index // columns) * cell_height + 20
        sheet.paste(thumb, (x, y))
        draw.rectangle([x, y, x + thumb.width, y + thumb.height], outline=(180, 180, 180))
        draw.text((x, y + thumb.height + 8), f"{item_index:02d} {name[:32]}", fill=(0, 0, 0))
        if item.get("exact_duplicate_of"):
            draw.text((x, y + thumb.height + 28), "EXACT DUP", fill=(180, 0, 0))
        elif item.get("near_duplicates"):
            draw.text((x, y + thumb.height + 28), "NEAR DUP?", fill=(180, 90, 0))

    sheet.save(output, quality=88)


def main() -> int:
    root = Path.cwd()
    downloads = Path.home() / "Downloads"
    output = root / "_ASSET_DROPZONE" / "NEW_MEDIA_INTAKE_20260718"
    output.mkdir(parents=True, exist_ok=True)

    cutoff = datetime.now() - timedelta(days=5)
    candidates = sorted(
        [path for path in downloads.iterdir() if is_candidate(path, cutoff)],
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )

    existing_exact, existing_visual = collect_existing(root)
    rows: list[dict] = []
    thumbs: list[tuple[int, str, Image.Image, dict]] = []

    for index, path in enumerate(candidates, 1):
        stat = path.stat()
        item: dict = {
            "index": index,
            "name": path.name,
            "path": str(path),
            "bytes": stat.st_size,
            "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
            "ext": path.suffix.lower(),
        }

        try:
            item["sha256"] = sha256(path)
            item["exact_duplicate_of"] = existing_exact.get(item["sha256"], [])
        except Exception as error:
            item["sha_error"] = str(error)
            item["exact_duplicate_of"] = []

        if path.suffix.lower() in IMAGE_EXTENSIONS:
            try:
                image = Image.open(path)
                item["dimensions"] = [image.width, image.height]
                image_hash = dhash(path)
                item["dhash"] = image_hash
                near = sorted(
                    [(hamming(image_hash, known_hash), known_path) for known_hash, known_path in existing_visual],
                    key=lambda row: row[0],
                )[:5]
                item["near_duplicates"] = [
                    {"distance": distance, "file": known_path} for distance, known_path in near if distance <= 8
                ]
                thumb = ImageOps.contain(image.convert("RGB"), (260, 180))
                thumbs.append((index, path.name, thumb.copy(), item))
            except Exception as error:
                item["image_error"] = str(error)

        rows.append(item)

    (output / "inventory.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")

    lines = [
        "# New Media Intake - 2026-07-18",
        "",
        "Scanned Downloads for recent WhatsApp/media files. Exact duplicates compare against `_ASSET_DROPZONE` and `assets`. Image near-duplicates use a simple dHash distance; <=8 means visually likely related.",
        "",
    ]
    for item in rows:
        duplicate = " exact-duplicate" if item.get("exact_duplicate_of") else ""
        dimensions = f" {tuple(item['dimensions'])}" if "dimensions" in item else ""
        near = ""
        if item.get("near_duplicates"):
            near_items = ", ".join(f"{row['distance']} {row['file']}" for row in item["near_duplicates"][:2])
            near = f" near: {near_items}"
        lines.append(f"- {item['index']:02d}. `{item['name']}` {item['bytes']} bytes{dimensions}{duplicate}{near}")

    (output / "README.md").write_text("\n".join(lines), encoding="utf-8")
    make_contact_sheet(thumbs, output / "contact-sheet.jpg")

    print(json.dumps({"out": str(output), "count": len(rows), "images": len(thumbs)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
