from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "assets" / "brand-v2"
CARD_SIZE = (1800, 1000)


def resize_contain(image: Image.Image, width: int) -> Image.Image:
    height = round(width * image.height / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def paste_with_shadow(
    canvas: Image.Image,
    asset: Image.Image,
    position: tuple[int, int],
    blur: int = 14,
    opacity: int = 95,
) -> None:
    shadow = Image.new("RGBA", asset.size, (0, 0, 0, 0))
    alpha = asset.getchannel("A").point(lambda value: value * opacity // 255)
    shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(blur)))
    canvas.alpha_composite(shadow, (position[0] + 5, position[1] + 8))
    canvas.alpha_composite(asset, position)


def build_front() -> None:
    source = BRAND / "nilesoft-business-card-front-base.png"
    if not source.exists():
        return
    base = Image.open(source).convert("RGBA")
    base = base.resize(CARD_SIZE, Image.Resampling.LANCZOS)
    mark = Image.open(BRAND / "nilesoft-mark-ivory.png").convert("RGBA")
    mark = resize_contain(mark, 675)
    paste_with_shadow(base, mark, (96, 286))
    base.convert("RGB").save(
        BRAND / "nilesoft-business-card-front.png",
        format="PNG",
        optimize=True,
    )


def build_back() -> None:
    source = BRAND / "nilesoft-business-card-back-base.png"
    if not source.exists():
        source = BRAND / "nilesoft-business-card-back.png"
    base = Image.open(source).convert("RGBA")
    base = base.resize(CARD_SIZE, Image.Resampling.LANCZOS)

    qr = Image.open(BRAND / "nilesoft-qr.png").convert("RGBA")
    qr = qr.resize((660, 660), Image.Resampling.LANCZOS)
    base.alpha_composite(qr, (86, 116))

    mark = Image.open(BRAND / "nilesoft-mark-ink.png").convert("RGBA")
    mark = resize_contain(mark, 286)
    base.alpha_composite(mark, (1116, 145))

    base.convert("RGB").save(
        BRAND / "nilesoft-business-card-back.png",
        format="PNG",
        optimize=True,
    )


if __name__ == "__main__":
    build_front()
    build_back()
