#!/usr/bin/env python3
"""Regenerate every raster brand asset from the premium SVG sources.

Sources of truth:
  public/logo/e-outilles-icon.svg     -> square app icon / PWA / apple-touch
  public/logo/e-outilles-favicon.svg  -> favicon.ico

Run after any change to the logo SVGs so the PNG/ICO assets never drift:
  python3 scripts/generate-icons.py

Requires: cairosvg, pillow (both already used by this project).
"""
import io
from pathlib import Path

import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ICON = PUBLIC / "logo" / "e-outilles-icon.svg"
FAVICON = PUBLIC / "logo" / "e-outilles-favicon.svg"

BRAND_BG = (18, 18, 18, 255)  # #121212
SAFE_ZONE = 0.72  # maskable icons must keep content inside the inner 80%


def render(svg: Path, size: int) -> Image.Image:
    png = cairosvg.svg2png(url=str(svg), output_width=size, output_height=size)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def save_png(image: Image.Image, path: Path) -> None:
    image.save(path, "PNG", optimize=True)
    print(f"  wrote {path.relative_to(ROOT)} ({image.width}x{image.height})")


def maskable(size: int) -> Image.Image:
    # Pad the icon into the safe zone, filling the rest with the brand black so
    # Android's circle/squircle mask never clips the gear ring.
    canvas = Image.new("RGBA", (size, size), BRAND_BG)
    inner = int(size * SAFE_ZONE)
    art = render(ICON, inner)
    offset = (size - inner) // 2
    canvas.paste(art, (offset, offset), art)
    return canvas


def main() -> None:
    print("Brand icons from", ICON.relative_to(ROOT))

    save_png(render(ICON, 192), PUBLIC / "icon-192.png")
    save_png(render(ICON, 512), PUBLIC / "icon-512.png")
    save_png(render(ICON, 180), PUBLIC / "apple-touch-icon.png")
    save_png(render(ICON, 32), PUBLIC / "favicon-32.png")
    save_png(maskable(192), PUBLIC / "icon-maskable-192.png")
    save_png(maskable(512), PUBLIC / "icon-maskable-512.png")

    # Multi-resolution .ico for legacy browsers.
    ico_sizes = [16, 32, 48, 64]
    frames = [render(FAVICON, s) for s in ico_sizes]
    frames[0].save(PUBLIC / "favicon.ico", format="ICO", sizes=[(s, s) for s in ico_sizes])
    print(f"  wrote public/favicon.ico ({', '.join(str(s) for s in ico_sizes)})")

    print("Done.")


if __name__ == "__main__":
    main()
