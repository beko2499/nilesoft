from __future__ import annotations

from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".vendor"))

from qrcodegen import QrCode


URL = "https://www.nilesoft.tech/"
INK = "#141413"
PAPER = "#FAFAF8"
COPPER = "#C06B3E"
COPPER_PALE = "#F6ECE6"
MUTED = "#66645F"


def chamfered_box(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    cut: float,
    fill: str,
) -> None:
    left, top, right, bottom = box
    draw.polygon(
        [
            (left + cut, top),
            (right - cut, top),
            (right, top + cut),
            (right, bottom - cut),
            (right - cut, bottom),
            (left + cut, bottom),
            (left, bottom - cut),
            (left, top + cut),
        ],
        fill=fill,
    )


def draw_mark(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    ink: str = INK,
    paper: str = PAPER,
    mosaic: bool = False,
) -> None:
    left, top, right, bottom = box
    scale = min((right - left) / 252, (bottom - top) / 160)
    offset_x = left + ((right - left) - 252 * scale) / 2
    offset_y = top + ((bottom - top) - 160 * scale) / 2

    def point(x: float, y: float) -> tuple[float, float]:
        return offset_x + x * scale, offset_y + y * scale

    draw.polygon([point(0, 0), point(58, 0), point(202, 160), point(144, 160)], fill=ink)
    draw.polygon(
        [point(170, 70), point(228, 70), point(252, 96.7), point(252, 126), point(220.4, 126)],
        fill=ink,
    )
    draw.polygon(
        [point(214, 134), point(244, 134), point(252, 142.9), point(252, 160), point(237.4, 160)],
        fill=ink,
    )
    draw.rectangle([point(188, 0), point(224, 36)], fill=ink)
    draw.rectangle([point(0, 124), point(36, 160)], fill=COPPER)

    if not mosaic:
        return

    hole = max(5, int(scale * 5.4))
    gap = max(7, int(scale * 10.5))
    start_x = int(left + gap * 0.6)
    start_y = int(top + gap * 0.4)
    for row, y in enumerate(range(start_y, int(bottom), gap)):
        for column, x in enumerate(range(start_x, int(right), gap)):
            if (row * 5 + column * 3) % 7 in (1, 4):
                draw.rounded_rectangle(
                    (x, y, x + hole, y + hole),
                    radius=max(1, hole // 5),
                    fill=paper,
                )


def inside_finder(x: int, y: int, size: int) -> bool:
    return (
        (x < 7 and y < 7)
        or (x >= size - 7 and y < 7)
        or (x < 7 and y >= size - 7)
    )


def inside_logo_clearance(x: int, y: int, size: int) -> bool:
    center = (size - 1) / 2
    normalized_x = (x - center) / 3.15
    normalized_y = (y - center) / 2.25
    return normalized_x * normalized_x + normalized_y * normalized_y <= 1


def draw_signature_finder(
    draw: ImageDraw.ImageDraw,
    left: float,
    top: float,
    module: int,
) -> None:
    size = 7 * module
    draw.rectangle((left, top, left + size, top + size), fill=INK)
    draw.rectangle(
        (
            left + module,
            top + module,
            left + size - module,
            top + size - module,
        ),
        fill=PAPER,
    )
    draw.rectangle(
        (
            left + module * 2,
            top + module * 2,
            left + size - module * 2,
            top + size - module * 2,
        ),
        fill=INK,
    )
    center_x = left + size / 2
    center_y = top + size / 2
    radius = module * 0.53
    draw.ellipse(
        (center_x - radius, center_y - radius, center_x + radius, center_y + radius),
        fill=COPPER,
    )


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = (
        Path("C:/Windows/Fonts/bahnschrift.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    )
    for path in paths:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def draw_centerpiece(
    draw: ImageDraw.ImageDraw,
    center_x: float,
    center_y: float,
    module: int,
) -> None:
    width = module * 6.35
    height = module * 4.45
    plate = (
        center_x - width / 2,
        center_y - height / 2,
        center_x + width / 2,
        center_y + height / 2,
    )
    draw.ellipse(plate, fill=PAPER)
    draw.arc(plate, start=205, end=335, fill=COPPER, width=max(7, module // 5))
    mark_box = (
        center_x - module * 2.42,
        center_y - module * 1.55,
        center_x + module * 2.42,
        center_y + module * 1.55,
    )
    draw_mark(draw, mark_box)


def main() -> None:
    qr = QrCode.encode_text(URL, QrCode.Ecc.HIGH)
    module = 44
    quiet = 4
    matrix_size = qr.get_size()
    qr_extent = (matrix_size + quiet * 2) * module
    canvas_width = 2048
    canvas_height = 2400
    qr_left = (canvas_width - qr_extent) // 2
    qr_top = 86
    matrix_left = qr_left + quiet * module
    matrix_top = qr_top + quiet * module

    image = Image.new("RGB", (canvas_width, canvas_height), PAPER)
    draw = ImageDraw.Draw(image)

    matrix_center_x = matrix_left + matrix_size * module / 2
    matrix_center_y = matrix_top + matrix_size * module / 2
    for y in range(matrix_size):
        for x in range(matrix_size):
            if not qr.get_module(x, y):
                continue
            if inside_finder(x, y, matrix_size) or inside_logo_clearance(x, y, matrix_size):
                continue

            x0 = matrix_left + x * module
            y0 = matrix_top + y * module
            fill = INK
            inset = module * 0.018
            chamfered_box(
                draw,
                (x0 + inset, y0 + inset, x0 + module - inset, y0 + module - inset),
                module * 0.055,
                fill,
            )

    finder_far = matrix_left + (matrix_size - 7) * module
    draw_signature_finder(draw, matrix_left, matrix_top, module)
    draw_signature_finder(draw, finder_far, matrix_top, module)
    draw_signature_finder(draw, matrix_left, finder_far, module)
    draw_centerpiece(draw, matrix_center_x, matrix_center_y, module)

    title_font = load_font(116)
    detail_font = load_font(48)
    title = "SCAN NILESOFT"
    domain = "nilesoft.tech"
    title_box = draw.textbbox((0, 0), title, font=title_font)
    detail_box = draw.textbbox((0, 0), domain, font=detail_font)
    title_y = 2028
    detail_y = 2198
    draw.text(
        ((canvas_width - (title_box[2] - title_box[0])) / 2, title_y),
        title,
        font=title_font,
        fill=INK,
    )
    draw.rounded_rectangle(
        (canvas_width / 2 - 142, title_y + 143, canvas_width / 2 + 142, title_y + 151),
        radius=4,
        fill=COPPER,
    )
    draw.text(
        ((canvas_width - (detail_box[2] - detail_box[0])) / 2, detail_y),
        domain,
        font=detail_font,
        fill=MUTED,
    )

    output = ROOT / "assets" / "brand-v2" / "nilesoft-qr-signature.png"
    image.save(output, format="PNG", optimize=True, dpi=(300, 300))
    print(output)


if __name__ == "__main__":
    main()
