from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "brand-v2" / "nilesoft-mark-ink.png"


def build_master() -> Image.Image:
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle(
        (12, 12, 500, 500),
        radius=118,
        fill="#FAFAF8",
        outline="#E4E1DA",
        width=8,
    )

    mark = Image.open(SOURCE).convert("RGBA")
    mark.thumbnail((400, 254), Image.Resampling.LANCZOS)
    position = ((512 - mark.width) // 2, (512 - mark.height) // 2)
    canvas.alpha_composite(mark, position)
    return canvas


def main() -> None:
    master = build_master()
    sizes = {
        "favicon-48.png": 48,
        "favicon-96.png": 96,
        "apple-touch-icon.png": 180,
        "favicon-192.png": 192,
        "favicon-512.png": 512,
    }
    for name, size in sizes.items():
        image = master.resize((size, size), Image.Resampling.LANCZOS)
        image.save(ROOT / name, optimize=True)

    master.save(ROOT / "assets" / "favicon.png", optimize=True)
    master.save(
        ROOT / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


if __name__ == "__main__":
    main()
