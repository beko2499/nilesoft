from __future__ import annotations

import base64
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "brand-assets"
sys.path.insert(0, str(ROOT / ".vendor"))

from qrcodegen import QrCode


URL = "https://www.nilesoft.tech/"
BLACK = "#111315"
GREEN = "#007A3A"
RED = "#D42B1E"
OFF_WHITE = "#FAFAF7"


def data_uri(path: Path, mime: str) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def qr_svg() -> str:
    qr = QrCode.encode_text(URL, QrCode.Ecc.HIGH)
    border = 4
    size = qr.get_size()
    total = size + border * 2
    path_parts: list[str] = []
    for y in range(size):
        for x in range(size):
            if qr.get_module(x, y):
                path_parts.append(f"M{x + border},{y + border}h1v1h-1z")

    logo_uri = data_uri(ROOT / "assets" / "logo-mark.png", "image/png")
    logo_box = 7.4
    logo_x = (total - logo_box) / 2
    logo_y = (total - logo_box) / 2
    logo_size = 5.25
    logo_img_x = (total - logo_size) / 2
    logo_img_y = (total - logo_size) / 2
    path_data = "".join(path_parts)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="2400" viewBox="0 0 {total} {total}" shape-rendering="crispEdges">
  <title>NILESOFT QR — {URL}</title>
  <rect width="{total}" height="{total}" rx="2.2" fill="#FFFFFF"/>
  <path d="{path_data}" fill="{BLACK}"/>
  <rect x="{logo_x:.3f}" y="{logo_y:.3f}" width="{logo_box}" height="{logo_box}" rx="1.55" fill="#FFFFFF"/>
  <image href="{logo_uri}" x="{logo_img_x:.3f}" y="{logo_img_y:.3f}" width="{logo_size}" height="{logo_size}" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''


def card_svg(qr_source: str) -> str:
    qr_uri = "data:image/svg+xml;base64," + base64.b64encode(qr_source.encode("utf-8")).decode("ascii")
    logo_uri = data_uri(ROOT / "assets" / "logo-mark.png", "image/png")

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="3400" height="2200" viewBox="0 0 3400 2200">
  <title>NILESOFT Business Card</title>
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="{OFF_WHITE}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{GREEN}"/>
      <stop offset="1" stop-color="#005D2C"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="34" flood-color="#111315" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="3400" height="2200" rx="96" fill="url(#paper)"/>
  <path d="M0 0H1260C1130 260 1095 520 1170 790C1260 1115 1185 1450 940 1710C720 1945 410 2110 0 2200Z" fill="url(#accent)"/>
  <circle cx="340" cy="290" r="255" fill="#FFFFFF" opacity="0.035"/>
  <circle cx="1080" cy="1920" r="430" fill="#FFFFFF" opacity="0.035"/>
  <path d="M3290 120C3080 255 2990 470 3030 765" fill="none" stroke="{RED}" stroke-width="22" stroke-linecap="round" opacity="0.9"/>

  <g filter="url(#shadow)">
    <rect x="160" y="310" width="930" height="930" rx="82" fill="#FFFFFF"/>
    <image href="{qr_uri}" x="215" y="365" width="820" height="820"/>
  </g>
  <text x="625" y="1365" text-anchor="middle" direction="rtl" font-family="Tahoma, Arial, sans-serif" font-size="66" font-weight="700" fill="#FFFFFF">امسح لتبدأ مشروعك</text>
  <text x="625" y="1450" text-anchor="middle" font-family="Arial, sans-serif" font-size="37" font-weight="700" letter-spacing="4" fill="#FFFFFF" opacity="0.76">SCAN TO CONNECT</text>

  <g transform="translate(1500 275)">
    <image href="{logo_uri}" x="1480" y="0" width="235" height="295" preserveAspectRatio="xMidYMid meet"/>
    <text x="1450" y="450" text-anchor="end" font-family="Arial, sans-serif" font-size="220" font-weight="800" letter-spacing="11" fill="{BLACK}">NILESOFT</text>
    <text x="1450" y="555" text-anchor="end" direction="rtl" font-family="Tahoma, Arial, sans-serif" font-size="67" font-weight="700" fill="{GREEN}">نايل سوفت</text>

    <rect x="0" y="710" width="1450" height="3" fill="#111315" opacity="0.11"/>

    <text x="350" y="945" text-anchor="start" font-family="Tahoma, Arial, sans-serif" font-size="132" font-weight="700" fill="{BLACK}">حلول رقمية</text>
    <text x="350" y="1110" text-anchor="start" font-family="Tahoma, Arial, sans-serif" font-size="132" font-weight="700" fill="{RED}">تنمو معك.</text>

    <text x="350" y="1315" text-anchor="start" font-family="Tahoma, Arial, sans-serif" font-size="47" font-weight="400" fill="#5B5D60">مواقع • متاجر • أنظمة • تطبيقات • أتمتة</text>

    <g transform="translate(0 1515)">
      <circle cx="1415" cy="0" r="17" fill="{GREEN}"/>
      <text x="1365" y="18" text-anchor="end" font-family="Arial, sans-serif" font-size="58" font-weight="700" letter-spacing="1" fill="{BLACK}">www.nilesoft.tech</text>
    </g>
  </g>

  <rect x="0" y="2158" width="3400" height="42" fill="{RED}"/>
</svg>
'''


def main() -> None:
    OUT.mkdir(exist_ok=True)
    qr = qr_svg()
    card = card_svg(qr)
    (OUT / "nilesoft-qr.svg").write_text(qr, encoding="utf-8")
    (OUT / "nilesoft-business-card.svg").write_text(card, encoding="utf-8")
    print(OUT / "nilesoft-qr.svg")
    print(OUT / "nilesoft-business-card.svg")


if __name__ == "__main__":
    main()
