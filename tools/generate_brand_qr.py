from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".vendor"))

from PIL import Image, ImageDraw
from qrcodegen import QrCode


URL = "https://www.nilesoft.tech/"
INK = "#141413"
PAPER = "#FAFAF8"
COPPER = "#C06B3E"


def draw_mark(
    draw: ImageDraw.ImageDraw,
    box: tuple[float, float, float, float],
    ink: str = INK,
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


def save_mark(output: Path, ink: str) -> None:
    image = Image.new("RGBA", (1008, 640), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw_mark(draw, (0, 0, 1008, 640), ink=ink)
    image.save(output, format="PNG", optimize=True)


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


def inside_finder(x: int, y: int, size: int) -> bool:
    return (
        (x < 7 and y < 7)
        or (x >= size - 7 and y < 7)
        or (x < 7 and y >= size - 7)
    )


def draw_finder(draw: ImageDraw.ImageDraw, x: float, y: float, module: int) -> None:
    outer = (x, y, x + 7 * module, y + 7 * module)
    middle = (x + module, y + module, x + 6 * module, y + 6 * module)
    center = (x + 2 * module, y + 2 * module, x + 5 * module, y + 5 * module)
    chamfered_box(draw, outer, module * 0.58, INK)
    chamfered_box(draw, middle, module * 0.42, PAPER)
    chamfered_box(draw, center, module * 0.34, COPPER)


def main() -> None:
    qr = QrCode.encode_text(URL, QrCode.Ecc.HIGH)
    module = 36
    quiet = 4
    accent = 2
    extent = qr.get_size() + quiet * 2
    qr_pixels = extent * module
    canvas_size = qr_pixels + accent * module * 2
    offset = accent * module

    image = Image.new("RGB", (canvas_size, canvas_size), PAPER)
    draw = ImageDraw.Draw(image)

    for y in range(qr.get_size()):
        for x in range(qr.get_size()):
            if qr.get_module(x, y) and not inside_finder(x, y, qr.get_size()):
                x0 = offset + (x + quiet) * module
                y0 = offset + (y + quiet) * module
                functional = x == 6 or y == 6
                copper_accent = not functional and (x * 7 + y * 11) % 29 == 0
                fill = COPPER if copper_accent else INK
                inset = module * 0.06
                chamfered_box(
                    draw,
                    (x0 + inset, y0 + inset, x0 + module - inset, y0 + module - inset),
                    module * 0.17,
                    fill,
                )

    finder_origin = offset + quiet * module
    finder_far = finder_origin + (qr.get_size() - 7) * module
    draw_finder(draw, finder_origin, finder_origin, module)
    draw_finder(draw, finder_far, finder_origin, module)
    draw_finder(draw, finder_origin, finder_far, module)

    center_x = canvas_size / 2
    center_y = canvas_size / 2
    plate_width = module * 9.2
    plate_height = module * 6.4
    plate = (
        center_x - plate_width / 2,
        center_y - plate_height / 2,
        center_x + plate_width / 2,
        center_y + plate_height / 2,
    )
    draw.rounded_rectangle(plate, radius=module * 0.8, fill=PAPER)
    logo_margin = module * 0.85
    draw_mark(
        draw,
        (
            plate[0] + logo_margin,
            plate[1] + logo_margin,
            plate[2] - logo_margin,
            plate[3] - logo_margin,
        ),
    )

    stroke = max(8, module // 4)
    corner = module * 2.2
    inset = module * 0.55
    edge = canvas_size - inset
    for points in (
        [(inset, inset + corner), (inset, inset), (inset + corner, inset)],
        [(edge - corner, inset), (edge, inset), (edge, inset + corner)],
        [(inset, edge - corner), (inset, edge), (inset + corner, edge)],
        [(edge - corner, edge), (edge, edge), (edge, edge - corner)],
    ):
        draw.line(points, fill=COPPER, width=stroke, joint="curve")

    output = ROOT / "assets" / "brand-v2" / "nilesoft-qr.png"
    image.save(output, format="PNG", optimize=True)
    save_mark(ROOT / "assets" / "brand-v2" / "nilesoft-mark-ink.png", INK)
    save_mark(ROOT / "assets" / "brand-v2" / "nilesoft-mark-ivory.png", "#F5F5F1")
    print(output)


if __name__ == "__main__":
    main()
