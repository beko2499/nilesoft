from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE_PATH = ROOT / "site-source.html"

PAGES = {
    "index.html": {
        "name": "home",
        "title_key": "title_home",
        "sections": ["top", "cta"],
        "primary": "top",
    },
    "services.html": {
        "name": "services",
        "title_key": "title_services",
        "sections": ["services", "cta"],
        "primary": "services",
    },
    "work.html": {
        "name": "work",
        "title_key": "title_work",
        "sections": ["work", "cta"],
        "primary": "work",
    },
    "about.html": {
        "name": "about",
        "title_key": "title_about",
        "sections": ["story", "process", "clients", "cta"],
        "primary": "story",
    },
    "contact.html": {
        "name": "contact",
        "title_key": "title_contact",
        "sections": ["contact"],
        "primary": "contact",
    },
}

TARGET_PAGES = {
    "top": "index.html",
    "services": "services.html",
    "work": "work.html",
    "story": "about.html",
    "process": "about.html",
    "clients": "about.html",
    "contact": "contact.html",
}

ROOT_TARGETS = {
    "index.html": "top",
    "services.html": "services",
    "work.html": "work",
    "about.html": "story",
    "contact.html": "contact",
}


def required_match(pattern: str, text: str, label: str) -> re.Match[str]:
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        raise RuntimeError(f"Could not find {label} in {SOURCE_PATH.name}")
    return match


def extract_section(source: str, section_id: str) -> str:
    match = required_match(
        rf'<section\b[^>]*\bid="{re.escape(section_id)}"[^>]*>.*?</section>',
        source,
        f"section #{section_id}",
    )
    return match.group(0)


def rewrite_asset_data_urls(fragment: str) -> str:
    fragment = re.sub(
        r'(<span class="island-nail"><img)\s+src="data:image/[^\"]+"',
        r'\1 src="assets/logo-mark.png"',
        fragment,
        count=1,
    )
    fragment = re.sub(
        r'(<div class="foot-brand">\s*<img)\s+src="data:image/[^\"]+"',
        r'\1 src="assets/logo-full.png"',
        fragment,
        count=1,
    )
    return fragment


def destination_for(target: str, current_file: str) -> str | None:
    if target.startswith("service-"):
        destination = "services.html"
    else:
        destination = TARGET_PAGES.get(target)

    if not destination:
        return None
    if destination == current_file:
        return f"#{target}"
    if ROOT_TARGETS[destination] == target:
        return destination
    return f"{destination}#{target}"


def rewrite_links(document: str, current_file: str) -> str:
    def replace_anchor(match: re.Match[str]) -> str:
        target = match.group(1)
        destination = destination_for(target, current_file)
        return f'href="{destination}"' if destination else match.group(0)

    return re.sub(r'href="#([A-Za-z0-9_-]+)"', replace_anchor, document)


def add_navigation_home(chrome: str) -> str:
    home_link = (
        '<a href="index.html"><span data-i18n="nav_home">الرئيسية</span> '
        '<span class="k">00</span></a>'
    )
    return chrome.replace(
        '<nav aria-label="Primary">',
        '<nav aria-label="Primary">\n        ' + home_link,
        1,
    )


def mark_current_navigation(document: str, target: str) -> str:
    target_key = {
        "top": "nav_home",
        "services": "nav_services",
        "work": "nav_work",
        "story": "nav_story",
        "contact": "nav_contact",
    }[target]
    pattern = rf'(<a\s+)([^>]*><span data-i18n="{target_key}")'
    return re.sub(pattern, r'\1aria-current="page" \2', document, count=1)


def build() -> None:
    if not SOURCE_PATH.exists():
        current_index = ROOT / "index.html"
        SOURCE_PATH.write_text(current_index.read_text(encoding="utf-8"), encoding="utf-8")

    source = SOURCE_PATH.read_text(encoding="utf-8")

    style_match = required_match(r'<style>\s*(.*?)\s*</style>', source, "main style block")
    app_match = required_match(
        r'<script>\s*(\(\(\) => \{.*?\}\)\(\);)\s*</script>',
        source,
        "application script",
    )
    body_start = source.index("<body>")
    main_start = source.index("<main>", body_start) + len("<main>")

    styles = style_match.group(1).rstrip() + "\n\n" + (
        '.island-menu a[aria-current="page"]{color:var(--green);font-weight:800}\n'
        '.island-menu a[aria-current="page"] .k{background:rgba(0,122,58,.12);color:var(--green)}\n'
    )
    (ROOT / "styles.css").write_text(styles, encoding="utf-8")
    (ROOT / "app.js").write_text(app_match.group(1).strip() + "\n", encoding="utf-8")

    head = source[: style_match.start()]
    head = re.sub(
        r'<link rel="icon"[^>]+>',
        '<link rel="icon" type="image/png" href="assets/favicon.png">',
        head,
        count=1,
    )
    head += '<link rel="stylesheet" href="styles.css">\n</head>\n'

    chrome = source[body_start:main_start]
    chrome = rewrite_asset_data_urls(add_navigation_home(chrome))
    footer = required_match(r'<footer class="site">.*?</footer>', source, "footer").group(0)
    footer = rewrite_asset_data_urls(footer)

    section_cache = {
        section_id: extract_section(source, section_id)
        for page in PAGES.values()
        for section_id in page["sections"]
    }

    scripts = (
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n'
        '<script src="app.js"></script>\n'
    )

    for filename, page in PAGES.items():
        page_chrome = chrome.replace(
            "<body>",
            f'<body data-page="{page["name"]}" data-title-key="{page["title_key"]}">',
            1,
        )
        content = "\n\n".join(section_cache[section_id] for section_id in page["sections"])
        document = (
            head
            + page_chrome
            + "\n\n"
            + content
            + "\n\n</main>\n\n"
            + footer
            + "\n\n"
            + scripts
            + "</body>\n</html>\n"
        )
        document = rewrite_links(document, filename)
        document = mark_current_navigation(document, page["primary"])
        (ROOT / filename).write_text(document, encoding="utf-8")


if __name__ == "__main__":
    build()
