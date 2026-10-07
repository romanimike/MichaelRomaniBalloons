#!/usr/bin/env python3
"""
Turn raw photos into web-ready WebP files.

  python3 tools/optimize_images.py                      # everything in raw-photos/
  python3 tools/optimize_images.py raw-photos/IMG_1.HEIC --name birthday-party
  python3 tools/optimize_images.py --crop 1:1           # square crops (gallery thumbs)
  python3 tools/optimize_images.py --hero               # print hero <img> (eager + high priority)

For each photo it writes assets/img/<name>-<width>.webp at 400/800/1200/1600px wide
(never upscaled), auto-rotates from the phone's EXIF orientation, converts to sRGB, and
strips ALL metadata (including GPS location). It then prints a ready-to-paste <img> tag
with srcset, width/height (prevents layout shift) and lazy loading.

Accepts JPG, PNG, HEIC/HEIF (converted with macOS `sips`), TIFF and WebP.
"""
import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parent.parent
RAW_DIR = SITE / "raw-photos"
OUT_DIR = SITE / "assets" / "img"
WIDTHS = [400, 800, 1200, 1600]
EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".tif", ".tiff", ".webp"}
QUALITY = 80


def slugify(stem: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")
    return s or "photo"


def load(path: Path) -> Image.Image:
    if path.suffix.lower() in {".heic", ".heif"}:
        with tempfile.TemporaryDirectory() as tmp:
            jpg = Path(tmp) / "x.jpg"
            subprocess.run(["sips", "-s", "format", "jpeg", str(path), "--out", str(jpg)],
                           check=True, capture_output=True)
            im = Image.open(jpg)
            im.load()
    else:
        im = Image.open(path)
        im.load()
    im = ImageOps.exif_transpose(im)  # honor phone rotation
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
    if im.mode == "RGBA":  # flatten transparency onto white
        bg = Image.new("RGB", im.size, "white")
        bg.paste(im, mask=im.split()[3])
        im = bg
    return im


def crop_ratio(im: Image.Image, ratio: str, focus: tuple) -> Image.Image:
    rw, rh = (float(x) for x in ratio.split(":"))
    target = rw / rh
    w, h = im.size
    if w / h > target:  # too wide
        nw = round(h * target)
        left = round((w - nw) * focus[0])
        return im.crop((left, 0, left + nw, h))
    nh = round(w / target)
    top = round((h - nh) * focus[1])
    return im.crop((0, top, w, top + nh))


def process(path: Path, name: str, args) -> None:
    im = load(path)
    if args.crop:
        im = crop_ratio(im, args.crop, args.focus)
    w0, h0 = im.size
    # every standard width smaller than the photo, plus the photo itself (capped at the max)
    top = min(w0, args.max_width or WIDTHS[-1])
    widths = sorted(set([w for w in WIDTHS if w < top] + [top]))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sizes_written = []
    for w in widths:
        h = round(h0 * w / w0)
        out = OUT_DIR / f"{name}-{w}.webp"
        im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
        sizes_written.append((w, h, out.stat().st_size))
    print(f"\n{path.name}  ->  {name}   ({w0}x{h0} source)")
    for w, h, size in sizes_written:
        print(f"   {name}-{w}.webp   {w}x{h}   {size/1024:.0f} KB")
    # snippet
    mid = min(sizes_written, key=lambda t: abs(t[0] - 800))
    srcset = ", ".join(f"assets/img/{name}-{w}.webp {w}w" for w, _, _ in sizes_written)
    attrs = ('loading="eager" fetchpriority="high"' if args.hero else 'loading="lazy"')
    sizes = args.sizes or ("(max-width: 900px) 100vw, 50vw" if args.hero else "(max-width: 639px) 47vw, 31vw")
    print("   paste:")
    print(f'   <img src="assets/img/{name}-{mid[0]}.webp" srcset="{srcset}" sizes="{sizes}" '
          f'alt="DESCRIBE THE PHOTO" {attrs} width="{mid[0]}" height="{mid[1]}">')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("inputs", nargs="*", help=f"files or folders (default: {RAW_DIR.relative_to(SITE)}/)")
    ap.add_argument("--name", help="output name (only with a single input file)")
    ap.add_argument("--crop", help="center crop to a ratio first, e.g. 1:1, 4:3, 4:5")
    ap.add_argument("--focus", default="0.5,0.5",
                    help="crop focus x,y from 0 to 1 (0=left/top, 1=right/bottom); default 0.5,0.5")
    ap.add_argument("--max-width", type=int, help="largest output width (default 1600)")
    ap.add_argument("--hero", action="store_true", help="snippet loads eagerly with high priority")
    ap.add_argument("--sizes", help="override the sizes= attribute in the printed snippet")
    args = ap.parse_args()
    args.focus = tuple(float(x) for x in args.focus.split(","))

    files = []
    for item in (args.inputs or [str(RAW_DIR)]):
        p = Path(item)
        if p.is_dir():
            files += sorted(f for f in p.iterdir() if f.suffix.lower() in EXTS and not f.name.startswith("."))
        elif p.is_file():
            files.append(p)
        else:
            sys.exit(f"Not found: {item}")
    if not files:
        sys.exit(f"No photos found. Put raw photos in {RAW_DIR} and run again.")
    if args.name and len(files) != 1:
        sys.exit("--name only works with a single photo")
    for f in files:
        process(f, slugify(args.name) if args.name else slugify(f.stem), args)
    print(f"\nDone. {len(files)} photo(s) written to {OUT_DIR.relative_to(SITE)}/")


if __name__ == "__main__":
    main()
