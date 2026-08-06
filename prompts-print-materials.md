# برومبتات المطبوعات الأربعة — نايل سوفت

## اقرأ هذا أولاً (يوفّر عليك إعادة توليد)

**١. لا تدع المولّد يرسم الـQR.** أي كود يولّده لن يُقرأ بأي ماسح — سيبدو باركوداً وهو ليس كذلك. كل برومبت أدناه يطلب **مربعاً أبيض فارغاً تماماً** في مكان الكود، وأركّب أنا الكود الحقيقي المُثبَت القراءة بعد التوليد.

**٢. ولا الشعار.** المولّد لن يرسم شعارك. كل برومبت يطلب **دائرة رمادية فارغة** مكان الشعار، وأركّب الشعار الحقيقي.

**٣. اطلب أعلى دقة متاحة.** الطباعة تحتاج ٣٠٠ نقطة/بوصة. بطاقة A5 بهذه الدقة = ١٧٤٨×٢٤٨٠ بكسل. إن كان أقصى ما يعطيك المولّد ١٠٢٤×١٥٣٦ فلا بأس — أرفعها أنا بخوارزمية Lanczos، لكن كلما بدأنا أكبر كانت النتيجة أنظف.

**٤. النِّسَب لن تكون مضبوطة.** المولّدات تعطي مقاسات ثابتة (٢:٣ أو مربع). البرومبتات تطلب التصميم **متوسّطاً على خلفية بيضاء سادة**، فأقصّه أنا على المقاس الصحيح بلا تشويه.

---

## الثوابت — تتكرر في كل برومبت بلا تغيير

| العنصر | القيمة |
|---|---|
| الاسم | **نايل سوفت** (وتحته بحروف لاتينية صغيرة: NILESOFT) |
| اللون الأساسي | فحمي `#1D1D1F` |
| الأخضر | `#0E6B2E` — والفاتح `#0BA45A` |
| الأحمر | `#D42B1E` (لمسة واحدة فقط، لا أكثر) |
| الخلفية | أبيض `#FFFFFF` وفاتح جداً `#F7F7F9` |
| الخط | Noto Kufi Arabic — عناوين ثقيلة جداً، نصوص خفيفة |
| رقم واتساب | `+971 50 449 4638` |
| السعر | «يبدأ من ٣٠٠ درهم» |

**السطر الذي يُلحق بنهاية كل برومبت (Negative):**
> No QR code pattern of any kind — the reserved square must be pure flat white and completely empty. No real logo, no lettermark, no icon inside the reserved grey circle — it must be a flat solid grey circle. No mockup, no perspective, no hands, no desk, no shadows cast by the card, no photograph of paper, no folded corners, no watermark, no Latin filler text, no broken or disconnected Arabic letterforms — Arabic must be joined and right-to-left.

---

# ١ — بطاقة A5 (الوجه الأمامي) → `card-a5-front`

**المقاس النهائي: ١٤٨ × ٢١٠ مم رأسي.** اطلب أطول مقاس رأسي متاح.

> A flat, straight-on graphic design for the **front face** of an A5 portrait flyer card, Arabic (RTL). Render the artwork flat and edge-to-edge as pure 2D artwork — not a photograph of paper, not a mockup, no perspective, no shadow under the card.
>
> **Background:** clean white with a very soft, wide diagonal band of pale mint-green `#0BA45A` at about 8% opacity sweeping from the top-right corner — barely there, just enough to lift the white.
>
> **Top area:** a flat solid grey circle, 20mm across, positioned top-right — **completely empty, no mark inside it** (a real logo will be placed there later). Directly beside it, right-aligned, the words **«نايل سوفت»** in very heavy Noto Kufi Arabic, and beneath them in small light grey letter-spaced Latin caps: **NILESOFT**.
>
> **The headline — the largest thing on the card**, right-aligned, three lines, very heavy weight, charcoal `#1D1D1F`, tight line spacing:
> **«لا تصدّقني.»** / **«امسح الكود»** / **«وجرّب موقعاً حياً الآن.»**
> The word **«امسح الكود»** in green `#0E6B2E`, the rest charcoal.
>
> **One supporting line** beneath it, light grey, single line: **«ثلاثة نماذج حقيقية تفتح على جوالك — بدون تحميل أي تطبيق.»**
>
> **The reserved QR area — the visual centre of the card:** a perfectly plain **flat pure-white rounded square, 55mm × 55mm**, with a 2px light grey outline and a soft drop shadow, sitting centred with generous white space around it. **Nothing inside it at all — it must be entirely empty white.** Directly under it, one small centred line in charcoal: **«وجّه كاميرا جوالك على الكود»**.
>
> **A slim horizontal strip near the bottom** holding three short items separated by thin vertical hairlines, each with a tiny green line icon above it: **«مواقع ومتاجر» · «أنظمة حجوزات» · «بوتات واتساب»**.
>
> **Bottom bar:** a full-width charcoal `#1D1D1F` band, and inside it, in white, the price on the right — **«يبدأ من ٣٠٠ درهم»** with the number large and in green — and on the left a WhatsApp glyph beside **«+971 50 449 4638»** in clear Latin numerals.
>
> Design language: Apple-clean. Enormous white space, one accent colour, hairlines instead of boxes, no frames around anything, strong typographic hierarchy. Crisp vector-sharp rendering, print quality.
>
> *(+ سطر Negative)*

---

# ٢ — بطاقة A5 (الوجه الخلفي) → `card-a5-back`

**نفس المقاس.** الوجه الخلفي يبيع، والأمامي يوقف العين.

> The **back face** of the same A5 portrait card, Arabic (RTL), same brand system, same fonts, same colours, flat 2D artwork edge to edge.
>
> **Background:** solid charcoal `#1D1D1F` — the reverse of the front, so the two faces read as a pair.
>
> **Top:** right-aligned in white, a short heavy headline over two lines: **«موقعك جاهز خلال ٣ أيام.»** and beneath it in pale grey a single line: **«تصميم، تنفيذ، وتدريب لتديره بنفسك.»**
>
> **The core of the card — a price list, six rows**, each row a thin hairline separator in `rgba(255,255,255,0.12)` with the service name on the right in white and the starting price on the left in green `#0BA45A`:
> **«صفحة تعريفية — من ٣٠٠ د.إ»** / **«موقع شركة متكامل — من ١,٠٠٠ د.إ»** / **«متجر إلكتروني — من ١,٥٠٠ د.إ»** / **«نظام حجوزات وإدارة — من ١,٧٠٠ د.إ»** / **«تطبيق موبايل — من ٢,٥٠٠ د.إ»** / **«أتمتة وبوت واتساب — من ٢,٠٠٠ د.إ»**
>
> **Three reassurance chips in a row**, small pale-green tinted pills with dark green text: **«٥٠٪ عند البدء» · **«تعديلان مجاناً» · «تدريب بعد التسليم»**.
>
> **Bottom third:** on the right, a flat solid grey circle 16mm across, **completely empty**, beside **«نايل سوفت»** in white heavy Kufi. On the left, a plain **flat pure-white rounded square 34mm × 34mm, entirely empty**, with one tiny white line under it: **«الموقع الكامل»**.
>
> **Very bottom:** a single centred line in pale grey: **«دبي، الإمارات — نخدم جميع الإمارات والخليج»** and beside it **«+971 50 449 4638»**.
>
> Same restraint as the front: no boxes, no frames, hairlines only, enormous breathing room. Crisp, print quality.
>
> *(+ سطر Negative)*

---

# ٣ — معلّقة الباب → `door-hanger`

**المقاس النهائي: ٩٥ × ٢٨٠ مم، بفتحة دائرية قطرها ٣٥ مم في الأعلى.**

> A flat, straight-on 2D graphic design for a tall narrow **door hanger**, Arabic (RTL), proportion roughly 1 : 3 (very tall and slim). Place the door hanger **centred on a plain pure-white background** with wide empty margins on the left and right — render it as flat artwork, not a photograph, no perspective, no shadow.
>
> **The shape:** a tall rounded-corner rectangle in white, with a **perfect circular hole cut through it near the top** (the hole shows the white background through it) and a narrow slit running from the hole up to the top edge. Below the hole, a soft green `#0BA45A` gradient band fades downward into white.
>
> **Under the hole, right-aligned:** a flat solid grey circle 16mm across, **completely empty**, beside **«نايل سوفت»** in heavy Kufi charcoal.
>
> **The headline**, stacked vertically to suit the narrow column, very heavy, tight leading:
> **«مررتُ ولم أجدك.»** in charcoal, then **«هذا نموذج حي**» in green `#0E6B2E`, then **«يفتح على جوالك.»** in charcoal.
>
> **One light grey line:** **«امسح الكود وشوف كيف يصير موقعك.»**
>
> **Reserved QR area:** a plain **flat pure-white rounded square, 45mm × 45mm**, with a thin grey outline, centred in the lower-middle of the strip, **completely empty inside**.
>
> **Near the bottom:** the price **«يبدأ من ٣٠٠ درهم»** with the number large in green, and beneath it a charcoal pill containing a WhatsApp glyph and **«+971 50 449 4638»** in white.
>
> Very vertical composition, generous vertical rhythm, no frames, hairlines only, one accent colour. Crisp, print quality.
>
> *(+ سطر Negative)*

**⚠️ ملاحظة استخدام:** علّقها على أبواب المحلات **بإذن صاحب المحل** أو سلّمها باليد. تعليقها بلا إذن على الأبواب والواجهات هو ما حُرِّرت عليه غرامات ١٠٠٠ درهم في أبوظبي.

---

# ٤ — الملصق → `sticker`

**المقاس النهائي: ٧٥ × ٧٥ مم، مربع بحواف دائرية (Die-cut).**

> A flat, straight-on 2D design for a **square sticker with generously rounded corners**, Arabic (RTL), perfectly square proportion. Centre it on a plain pure-white background with a thin dashed grey cut-line showing the die-cut edge. Flat artwork, no mockup, no perspective, no shadow.
>
> **Background of the sticker:** solid deep green `#0E6B2E`, with one very subtle darker green circular shape bleeding off the bottom-left corner for depth.
>
> **Layout, top to bottom, all centred:**
> A flat solid grey circle 10mm across, **completely empty**. Beneath it **«نايل سوفت»** in white heavy Kufi, small.
> Then the reserved QR area: a plain **flat pure-white rounded square, 38mm × 38mm**, **completely empty inside**, with a little breathing room around it.
> Then one short line in white: **«امسح — وجرّب موقعاً حياً»**.
> Then, at the very bottom in pale mint, small: **«+971 50 449 4638»**.
>
> Extremely simple and bold — a sticker is read from a metre away, so it carries only three things: the mark, the code, and one line. No decoration beyond the single background shape. Crisp, print quality.
>
> *(+ سطر Negative)*

**⚠️ ملاحظة استخدام:** الملصقات آمنة على سطح **تملكه أنت** أو بموافقة صاحب المكان (كاونتر محل، لابتوب عميل، ملف تسليم المشروع). لصقها على الجدران والأعمدة والواجهات هو المخالفة التي تلاحقها بلديتا الشارقة وأبوظبي.

---

# ٥ — القطعة المقصوصة اللافتة → `diecut-phone`

فكرتها: **قطعة مقصوصة على شكل جوال، والـQR هو شاشته.** تربط المطبوع بلغة الموقع كلها (كل الصور فيه داخل إطارات هواتف)، وتجعل الناس يلتقطونها لأنها ليست ورقة عادية.

**المقاس النهائي: ٧٠ × ١٤٠ مم، مقصوصة على محيط الجوال، بفتحة تعليق صغيرة في الأعلى.**

> A flat, straight-on 2D design for a **die-cut card shaped exactly like a modern smartphone**, Arabic (RTL), proportion 1 : 2. Centre it on a plain pure-white background with wide empty margins, and draw a thin dashed grey cut-line following the phone silhouette. Flat artwork, no mockup, no perspective, no shadow, no hand holding it.
>
> **The shape:** a phone body with strongly rounded corners in charcoal `#1D1D1F`, with a slim brushed-metal edge suggested by a light 2mm inner outline, a small dynamic-island pill near the top in pure black, and two tiny side-button notches on the left edge. A small circular punch hole for hanging sits in the very top edge, above the island.
>
> **The "screen" — the whole point:** a plain **flat pure-white rounded rectangle filling the phone's screen area, 56mm × 56mm**, **completely empty inside** — it must read as a blank white screen. Above it, small white text on the charcoal body: **«شاشة عميلك القادم»**. Below it, centred in white heavy Kufi: **«امسح الكود»** and beneath in pale grey: **«يفتح متجراً حياً على جوالك»**.
>
> **At the very bottom of the phone body:** a flat solid grey circle 9mm across, **completely empty**, beside **«نايل سوفت»** in small white Kufi, and under them one line in green `#0BA45A`: **«من ٣٠٠ درهم · +971 50 449 4638»**.
>
> The card should look, at a glance across a room, exactly like someone left a real phone hanging there. Crisp, print quality.
>
> *(+ سطر Negative)*

**⚠️ ملاحظة استخدام:** سلّمها باليد أو علّقها بإذن. قوّتها أنها تُلتقط، لا أنها تُلصق.

---

## بعد التوليد

أرسل لي الخمس (الوجهان + المعلّقة + الملصق + المقصوصة) وأتولّى:

١. تركيب **الـQR الحقيقي** المُثبَت القراءة في كل مربع أبيض محجوز.
٢. تركيب **الشعار الحقيقي** في كل دائرة رمادية.
٣. القصّ على المقاس الصحيح بالضبط + إضافة **٣ مم Bleed** وعلامات القص.
٤. الرفع إلى ٣٠٠ نقطة/بوصة والتصدير **PDF جاهز للمطبعة**.
٥. فحص نهائي: أمسح كل كود بمحرّكَي قراءة مستقلَّين للتأكد أنه يعمل قبل أن تدفع للمطبعة.

وتذكّر: لا نطبع قبل أن تشتري النطاق — الأكواد ستشير إليه.
