"""PNG to WebP for the art lane. Usage: python3 tools/webp.py in.png out.webp [long_side]
Resizes so the long side is long_side (default 512), keeps alpha, quality 80. Prints WxH, KB and whether all four corners are transparent."""
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]; long_side = int(sys.argv[3]) if len(sys.argv) > 3 else 512
im = Image.open(src).convert("RGBA")
w, h = im.size; k = long_side / max(w, h)
if k != 1: im = im.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
bbox = im.getbbox()
im.save(dst, "WEBP", quality=80, method=6, lossless=False)
w, h = im.size; corners = all(im.getpixel(p)[3] == 0 for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
import os; print(f"{os.path.basename(dst)} {w}x{h} {os.path.getsize(dst)//1024}KB corners_clear={corners} empty={bbox is None}")
