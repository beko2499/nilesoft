from __future__ import annotations

import json
import re
from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE_PATH = ROOT / "site-source.html"
BASE_URL = "https://www.nilesoft.tech"
OG_IMAGE = f"{BASE_URL}/assets/brand-v2/nilesoft-business-card-back.png"
GOOGLE_ANALYTICS_ID = "G-MYRTW6VKN8"
FAVICON_URL = f"{BASE_URL}/favicon-512.png"
FAVICON_LINKS = '''<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">'''

PAGES = {
    "index.html": {
        "name": "home",
        "title_key": "title_home",
        "title": "شركة برمجة في عجمان والإمارات | نايل سوفت",
        "description": "نايل سوفت شركة برمجة ونمو رقمي في عجمان تخدم جميع الإمارات والخليج. نصمم مواقع ومتاجر وأنظمة وتطبيقات، ونقدم SEO وإدارة إعلانات Google بأسعار واضحة.",
        "path": "",
        "schema_type": "WebPage",
        "sections": ["top", "cta"],
        "primary": "top",
    },
    "services.html": {
        "name": "services",
        "title_key": "title_services",
        "title": "خدمات المواقع والتطبيقات وSEO وإعلانات Google | نايل سوفت",
        "description": "خدمات تطوير المواقع والمتاجر والأنظمة والتطبيقات والأتمتة، مع تحسين محركات البحث وإدارة إعلانات Google في عجمان وجميع الإمارات.",
        "path": "services.html",
        "schema_type": "CollectionPage",
        "sections": ["services", "cta"],
        "primary": "services",
    },
    "work.html": {
        "name": "work",
        "title_key": "title_work",
        "title": "نماذج مواقع وأنظمة وتطبيقات تجريبية | نايل سوفت",
        "description": "جرّب نماذج نايل سوفت الحية: منيو مطعم رقمي، نظام حجز مواعيد ومتجر إلكتروني متكامل قبل أن تبدأ مشروعك البرمجي.",
        "path": "work.html",
        "schema_type": "CollectionPage",
        "sections": ["work", "cta"],
        "primary": "work",
    },
    "about.html": {
        "name": "about",
        "title_key": "title_about",
        "title": "عن نايل سوفت | شركة تطوير برمجيات في عجمان",
        "description": "تعرّف إلى نايل سوفت ومنهجيتنا في بناء حلول برمجية واضحة ومرنة للشركات الصغيرة والمتوسطة في عجمان وجميع الإمارات والخليج.",
        "path": "about.html",
        "schema_type": "AboutPage",
        "sections": ["story", "process", "clients", "cta"],
        "primary": "story",
    },
    "contact.html": {
        "name": "contact",
        "title_key": "title_contact",
        "title": "تواصل مع نايل سوفت للبرمجة في عجمان والإمارات",
        "description": "تواصل مع نايل سوفت عبر واتساب لطلب موقع أو متجر أو نظام أو تطبيق أو أتمتة أو خدمة SEO وإعلانات Google. ننطلق من عجمان ونخدم جميع الإمارات والخليج.",
        "path": "contact.html",
        "schema_type": "ContactPage",
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


def promote_primary_heading(fragment: str) -> str:
    if re.search(r"<h1\b", fragment):
        return fragment
    fragment = re.sub(r"<h2(\b[^>]*)>", r"<h1\1>", fragment, count=1)
    return fragment.replace("</h2>", "</h1>", 1)


def rewrite_asset_data_urls(fragment: str) -> str:
    fragment = re.sub(
        r'(<span class="island-nail"><img)\s+src="data:image/[^\"]+"',
        r'\1 src="assets/brand-v2/nilesoft-mark.svg"',
        fragment,
        count=1,
    )
    fragment = re.sub(
        r'(<div class="foot-brand">\s*<img)\s+src="data:image/[^\"]+"',
        r'\1 src="assets/brand-v2/nilesoft-lockup.svg"',
        fragment,
        count=1,
    )
    fragment = fragment.replace(
        'assets/logo-mark.png',
        'assets/brand-v2/nilesoft-mark.svg',
    )
    fragment = fragment.replace(
        'assets/logo-full.png',
        'assets/brand-v2/nilesoft-lockup.svg',
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


def page_url(page: dict[str, object]) -> str:
    path = str(page["path"])
    return f"{BASE_URL}/{path}" if path else f"{BASE_URL}/"


def structured_data(page: dict[str, object]) -> str:
    canonical = page_url(page)
    organization_id = f"{BASE_URL}/#organization"
    website_id = f"{BASE_URL}/#website"
    page_id = f"{canonical}#webpage"
    graph: list[dict[str, object]] = [
        {
            "@type": "Organization",
            "@id": organization_id,
            "name": "NILESOFT",
            "alternateName": ["نايل سوفت", "NILESOFT UAE"],
            "url": f"{BASE_URL}/",
            "logo": {
                "@type": "ImageObject",
                "url": FAVICON_URL,
                "width": 512,
                "height": 512,
            },
            "image": OG_IMAGE,
            "description": "شركة تطوير برمجيات ونمو عبر Google في عجمان تخدم الشركات في جميع الإمارات والخليج.",
            "email": "abubkr249@icloud.com",
            "telephone": "+971504494638",
            "areaServed": [
                {"@type": "Country", "name": "United Arab Emirates"},
                {"@type": "Place", "name": "Gulf Cooperation Council"},
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+971504494638",
                "contactType": "sales",
                "availableLanguage": ["Arabic", "English"],
                "areaServed": "AE",
            },
        },
        {
            "@type": "WebSite",
            "@id": website_id,
            "url": f"{BASE_URL}/",
            "name": "NILESOFT",
            "alternateName": "نايل سوفت الإمارات",
            "publisher": {"@id": organization_id},
            "inLanguage": ["ar", "en"],
        },
        {
            "@type": str(page["schema_type"]),
            "@id": page_id,
            "url": canonical,
            "name": str(page["title"]),
            "description": str(page["description"]),
            "isPartOf": {"@id": website_id},
            "about": {"@id": organization_id},
            "inLanguage": "ar-AE",
        },
    ]

    if page["name"] != "home":
        graph.append(
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical}#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "الرئيسية",
                        "item": f"{BASE_URL}/",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": str(page["title"]).split("|")[0].strip(),
                        "item": canonical,
                    },
                ],
            }
        )

    if page["name"] == "services":
        graph.append(
            {
                "@type": "Service",
                "@id": f"{canonical}#digital-services",
                "name": "خدمات البرمجة والنمو عبر Google للأعمال",
                "serviceType": "تطوير مواقع ومتاجر وأنظمة وتطبيقات وأتمتة وتحسين محركات البحث وإدارة إعلانات Google",
                "provider": {"@id": organization_id},
                "areaServed": {"@type": "Country", "name": "United Arab Emirates"},
                "url": canonical,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "خدمات نايل سوفت",
                    "itemListElement": [
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "صفحة تعريفية احترافية"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "موقع شركة متكامل"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "متجر إلكتروني"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "نظام حجوزات وإدارة"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "تطبيق موبايل MVP"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "أتمتة وذكاء اصطناعي"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "SEO وإعلانات Google"}},
                    ],
                },
            }
        )

    return json.dumps(
        {"@context": "https://schema.org", "@graph": graph},
        ensure_ascii=False,
        separators=(",", ":"),
    )


def page_head(head_template: str, page: dict[str, object]) -> str:
    canonical = page_url(page)
    title = escape(str(page["title"]))
    description = escape(str(page["description"]), quote=True)
    head = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", head_template, count=1)
    head = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{description}">',
        head,
        count=1,
    )
    seo = f'''<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="author" content="NILESOFT">
<meta name="theme-color" content="#FAFAF8">
<meta name="geo.region" content="AE-AJ">
<meta name="geo.placename" content="Ajman">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NILESOFT">
<meta property="og:locale" content="ar_AE">
<meta property="og:locale:alternate" content="en_AE">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{OG_IMAGE}">
<meta property="og:image:width" content="1800">
<meta property="og:image:height" content="1000">
<meta property="og:image:alt" content="هوية نايل سوفت وخدماتها البرمجية">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{OG_IMAGE}">
<script type="application/ld+json">{structured_data(page)}</script>'''
    head = re.sub(
        r'(<meta name="description" content="[^"]*">)',
        r"\1\n" + seo,
        head,
        count=1,
    )
    google_tag = f'''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GOOGLE_ANALYTICS_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', '{GOOGLE_ANALYTICS_ID}');
</script>'''
    return head.replace("<head>", "<head>\n" + google_tag, 1)


def write_indexing_files() -> None:
    urls = "\n".join(
        f"  <url><loc>{page_url(page)}</loc></url>"
        for page in PAGES.values()
    )
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>
'''
    robots = f'''User-agent: *
Allow: /
Disallow: /.vendor/
Disallow: /tmp/
Disallow: /tools/
Disallow: /brand-assets/
Disallow: /site-source.html

Sitemap: {BASE_URL}/sitemap.xml
'''
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")
    (ROOT / "robots.txt").write_text(robots, encoding="utf-8")


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

    head_template = source[: style_match.start()]
    head_template = re.sub(
        r'<script src="assets/brand-v2/nilesoft-(?:morph-core|morph-tracks|about-morph)\.js"></script>\s*',
        '',
        head_template,
    )
    head_template = re.sub(
        r'<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>\s*',
        '',
        head_template,
    )
    head_template = re.sub(
        r'(<meta name="description" content="[^"]*">)',
        r'\1\n' + FAVICON_LINKS,
        head_template,
        count=1,
    )
    head_template += (
        '<script src="assets/brand-v2/nilesoft-splash.js"></script>\n'
        '<script src="assets/brand-v2/nilesoft-hero.js"></script>\n'
        '<link rel="stylesheet" href="styles.css">\n</head>\n'
    )

    chrome = source[body_start:main_start]
    chrome = rewrite_asset_data_urls(add_navigation_home(chrome))
    footer = required_match(r'<footer class="site">.*?</footer>', source, "footer").group(0)
    footer = rewrite_asset_data_urls(footer)

    section_cache = {
        section_id: extract_section(source, section_id)
        for page in PAGES.values()
        for section_id in page["sections"]
    }

    splash_boot = '''<script>
(function(){
  var key='ns-splash-v2-seen',show=true;
  try{show=sessionStorage.getItem(key)!=='1';if(show)sessionStorage.setItem(key,'1');}catch(e){}
  if(!show||!window.NilesoftSplash)return;
  var started=Date.now(),done=false;
  var splash=NilesoftSplash.mount({theme:'dark',accent:'#C06B3E',speed:1.15,wordmark:true,autoHideMs:0,loadFont:false});
  function finish(){
    if(done)return;
    done=true;
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var wait=Math.max(0,(reduced?250:2200)-(Date.now()-started));
    setTimeout(function(){splash.hide();},wait);
  }
  if(document.readyState==='complete')finish();else window.addEventListener('load',finish,{once:true});
  setTimeout(finish,4200);
})();
</script>'''

    scripts = '<script src="app.js"></script>\n'
    morph_scripts = (
        '<script src="assets/brand-v2/nilesoft-morph-core.js"></script>\n'
        '<script src="assets/brand-v2/nilesoft-morph-tracks.js"></script>\n'
        '<script src="assets/brand-v2/nilesoft-about-morph.js"></script>\n'
    )

    for filename, page in PAGES.items():
        head = page_head(head_template, page)
        page_chrome = chrome.replace(
            "<body>",
            f'<body data-page="{page["name"]}" data-title-key="{page["title_key"]}">{splash_boot}',
            1,
        )
        content = "\n\n".join(
            promote_primary_heading(section_cache[section_id])
            if section_id == page["primary"]
            else section_cache[section_id]
            for section_id in page["sections"]
        )
        page_scripts = morph_scripts + scripts if filename == "about.html" else scripts
        document = (
            head
            + page_chrome
            + "\n\n"
            + content
            + "\n\n</main>\n\n"
            + footer
            + "\n\n"
            + page_scripts
            + "</body>\n</html>\n"
        )
        document = rewrite_links(document, filename)
        document = mark_current_navigation(document, page["primary"])
        (ROOT / filename).write_text(document, encoding="utf-8")

    write_indexing_files()


if __name__ == "__main__":
    build()
