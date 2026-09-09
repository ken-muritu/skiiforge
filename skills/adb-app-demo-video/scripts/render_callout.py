#!/usr/bin/env python3
"""
render_callout.py — generic message-bubble + arrow callout renderer for the
adb-app-demo-video skill (see ../skill.md, Method §4).

Renders one full-canvas transparent PNG per callout: a rounded-rectangle
"message bubble" background (sample your app's real chat-bubble color rather
than guessing), two lines of text, and a curved hand-drawn-style arrow with an
arrowhead pointing from the bubble to a target screen coordinate.

Usage (as a library):

    from render_callout import make_callout, screen_to_canvas

    # 1. Work out the coordinate transform once per video, from your crop/scale
    #    values (see skill.md Method §3-4):
    to_canvas = screen_to_canvas(statusbar_px=52, source_h=1560, canvas_h=1920,
                                  x_offset=82)

    # 2. Render each callout, in raw-screenshot coordinates for the target:
    make_callout(
        out_path="callout_1_price.png",
        lines=[("Real cars. Real hosts.", (26, 26, 28, 255)),
               ("Real KSh pricing.", (45, 130, 190, 255))],   # sample real brand color!
        text_xy=(70, 1530),
        target=to_canvas(150, 1478),
        font_path="PermanentMarker.ttf",
    )

Then composite each PNG onto its video segment with ffmpeg (see skill.md's
"Fade a looped PNG overlay in/out" pattern) — this script only produces the
static image.
"""

import math
from PIL import Image, ImageDraw, ImageFont

CANVAS_W, CANVAS_H = 1080, 1920
BUBBLE_BG = (255, 255, 255, 255)
BUBBLE_SHADOW = (0, 0, 0, 90)


def screen_to_canvas(statusbar_px: float, source_h: float, canvas_h: float, x_offset: float):
    """
    Build a coordinate-mapping function from raw device-screenshot (x, y) to
    the final padded/scaled canvas (x, y), per skill.md Method §4.

    scale = canvas_h / (source_h - statusbar_px)
    """
    scale = canvas_h / (source_h - statusbar_px)

    def _map(x, y):
        return (x_offset + x * scale, (y - statusbar_px) * scale)

    return _map


def _draw_text_line(draw, xy, text, font, fill, shadow_offset=3, shadow_color=(0, 0, 0, 200)):
    x, y = xy
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=fill)


def _draw_curved_arrow(draw, start, end, color, width=7, curve=0.25, head_len=22):
    sx, sy = start
    ex, ey = end
    mx, my = (sx + ex) / 2, (sy + ey) / 2
    dx, dy = ex - sx, ey - sy
    length = math.hypot(dx, dy) or 1
    nx, ny = -dy / length, dx / length
    cx, cy = mx + nx * length * curve, my + ny * length * curve

    pts = []
    steps = 24
    for i in range(steps + 1):
        t = i / steps
        px = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t ** 2 * ex
        py = (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t ** 2 * ey
        pts.append((px, py))
    draw.line(pts, fill=color, width=width, joint="curve")

    ang = math.atan2(pts[-1][1] - pts[-3][1], pts[-1][0] - pts[-3][0])
    for a in (ang + math.radians(150), ang - math.radians(150)):
        hx = ex + head_len * math.cos(a)
        hy = ey + head_len * math.sin(a)
        draw.line([(ex, ey), (hx, hy)], fill=color, width=width)


def make_callout(
    out_path: str,
    lines,                       # list of (text, rgba_color) tuples, one per line
    text_xy,                     # top-left of the text block, canvas coords
    target,                      # (x, y) the arrow should point to, canvas coords
    font_path: str,
    fontsize: int = 46,
    line_gap: int = 58,
    pad_x: int = 28,
    pad_y: int = 22,
    bubble_radius: int = 28,
    arrow_color=(45, 130, 190, 255),   # sample this from the real app's brand UI, don't guess
    arrow_width: int = 7,
    curve: float = 0.25,
    canvas_size=(CANVAS_W, CANVAS_H),
):
    """
    Render one callout (bubble + text + arrow) to a transparent PNG at
    `out_path`, sized to `canvas_size`.

    `curve` sign controls which side the arrow bows toward — try a small
    positive or negative value (e.g. ±0.15 to ±0.35) and check the rendered
    PNG; there's no formula for "correct," it's a per-callout visual call
    based on where the bubble sits relative to the target.
    """
    W, H = canvas_size
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    font = ImageFont.truetype(font_path, fontsize)

    x, y = text_xy
    widths = [d.textlength(t, font=font) for t, _ in lines]
    max_w = max(widths)
    text_block_h = len(lines) * line_gap

    bx0, by0 = x - pad_x, y - pad_y - 4
    bx1, by1 = x + max_w + pad_x, y + text_block_h + pad_y - 14

    d.rounded_rectangle([bx0 + 6, by0 + 8, bx1 + 6, by1 + 8], radius=bubble_radius, fill=BUBBLE_SHADOW)
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=bubble_radius, fill=BUBBLE_BG)

    for i, (txt, color) in enumerate(lines):
        _draw_text_line(d, (x, y + i * line_gap), txt, font, color)

    tx, ty = target
    bcx = (bx0 + bx1) / 2
    start = (bcx, by1) if ty > by1 else (bcx, by0)
    _draw_curved_arrow(d, start, target, arrow_color, width=arrow_width, curve=curve, head_len=head_len_default())

    im.save(out_path)
    return out_path


def head_len_default():
    return 22


if __name__ == "__main__":
    import argparse

    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", required=True)
    p.add_argument("--font", required=True)
    p.add_argument("--line1", required=True)
    p.add_argument("--line2", default=None)
    p.add_argument("--color1", default="26,26,28,255")
    p.add_argument("--color2", default="45,130,190,255")
    p.add_argument("--text-x", type=int, required=True)
    p.add_argument("--text-y", type=int, required=True)
    p.add_argument("--target-x", type=float, required=True)
    p.add_argument("--target-y", type=float, required=True)
    p.add_argument("--curve", type=float, default=0.25)
    args = p.parse_args()

    def _parse_color(s):
        return tuple(int(v) for v in s.split(","))

    lines = [(args.line1, _parse_color(args.color1))]
    if args.line2:
        lines.append((args.line2, _parse_color(args.color2)))

    make_callout(
        out_path=args.out,
        lines=lines,
        text_xy=(args.text_x, args.text_y),
        target=(args.target_x, args.target_y),
        font_path=args.font,
        curve=args.curve,
    )
    print(f"wrote {args.out}")
