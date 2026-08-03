# برومبتات صور الخدمتين ٠٤ و ٠٦

## القرارات التصميمية قبل البرومبتات

**١. كل خدمة = منتج واحد بصورتين، لا صورتان منفصلتان.**
كل خدمة تعرض لوحة على الكمبيوتر + شاشة جوال بجانبها. لو خرجتا بهويتين مختلفتين، يفهم الزائر أنهما نظامان لا نظام واحد يعمل على الجهازين — وهذا يهدم بالضبط ما نبيعه («يعمل من الجوال والكمبيوتر»). لذلك لكل خدمة **شركة واحدة، لون واحد، شعار واحد، خط واحد**، ونفس أسماء العملاء والأرقام تتكرر في الصورتين.

**٢. الخدمة ٠٤ لعميل «مركز خدمة سيارات» لا عيادة.**
النص في الموقع يعد بأربعة أشياء: مواعيد، مخزون، فواتير، عملاء. العيادة تُظهر المواعيد فقط. مركز صيانة السيارات يُظهر الأربعة في لوحة واحدة بصدق: حجز موعد، قطع غيار، فاتورة، ملف عميل. واخترت الشارقة لأن الجمهور المستهدف هناك كثيف.

**٣. الخدمة ٠٦ لشركة توريد لا لمكتب عقارات.**
التعليق تحت الصورة نصّه «من الطلب للفاتورة للتقرير». شركة توريد للمطاعم تنتج هذه السلسلة فعلياً: المطعم يرسل طلبه واتساب ← البوت يؤكد ← فاتورة آلية ← تقرير يومي للمالك. أي قطاع آخر يجعل الصورة تعد بما لا تُظهره.

**٤. ثلاثة قيود تقنية تُذكر حرفياً في كل برومبت — تجاهُلها يفسد الصورة مهما كانت جميلة:**

- **لا إطار.** الموقع يرسم إطار المتصفح (شريط رمادي بثلاث نقاط) وإطار الجهاز (معدن + جزيرة ديناميكية) بنفسه. أي إطار داخل الصورة = إطار داخل إطار.
- **القصّ من الأسفل.** الصور تُعرض بـ `object-fit:cover` من الأعلى، فأي شيء أسفل الصورة قد يُقتطع. المحتوى الحاسم يبقى في الثلثين العلويين.
- **أعلى شاشة الجوال محجوز.** الجزيرة الديناميكية تغطي **الثلث الأوسط من أعلى ٦٪** من الصورة. شريط الحالة يُبقي الوقت أقصى اليمين والأيقونات أقصى اليسار، والوسط فارغ.

**٥. سطر Negative يُلحق بنهاية كل برومبت:**
> No browser window chrome, no URL bar, no traffic-light buttons, no device frame, no phone bezel or notch drawn in the image, no hands holding a device, no desk or office background, no drop shadow around the screen, no watermark, no lorem ipsum, no Latin filler in the body, no broken or disconnected Arabic letterforms — Arabic must be joined and right-to-left.

---

# الخدمة ٠٤ — نظام حجوزات وإدارة

**العميل الافتراضي:** «ميكانو» — مركز خدمة وصيانة سيارات، الشارقة.
**الهوية:** كحلي `#0F2942` · أزرق `#2D7FF9` · رمادي فاتح `#F4F6F9` · أبيض. تنبيه برتقالي `#F59E0B` للمتأخر. خط Noto Kufi Arabic.

## ٤أ — لوحة التحكم → `sys-dash.webp`

**المقاس: 1900 × 1000 بكسل (نسبة 1.9:1 أفقي).**

> A full-bleed Arabic (RTL) SaaS dashboard UI for **«ميكانو»**, a car-service centre in Sharjah. Render the application interface only, edge to edge, filling the entire canvas — this is the app itself, not a screenshot sitting on a desk.
>
> **Right-hand sidebar** (RTL, so navigation lives on the right), dark navy `#0F2942`, ~14% of the width: a small blue wrench monogram beside **«ميكانو»** at the top, then vertical nav items with thin line icons — **«لوحة التحكم» (active, blue pill) · «المواعيد» · «أوامر التشغيل» · «المخزون» · «الفواتير» · «العملاء» · «التقارير»**. A small user chip at the bottom.
>
> **Top bar** across the remaining width on a light `#F4F6F9` background: a page title **«لوحة التحكم»** with today's Arabic date beneath it in small grey, a search field **«ابحث برقم اللوحة أو اسم العميل»**, a bell icon with a blue dot, and a blue button **«+ حجز جديد»**.
>
> **Four KPI cards in a row**, white with hairline borders and rounded corners, each with a small tinted icon square, a large bold number, an Arabic label and a tiny trend chip: **«١٨ موعداً اليوم» · «٧ سيارات في الورشة» · **«٤٢,٦٠٠ د.إ إيراد الشهر» · «٥ قطع تحت الحد الأدنى»** (this last one in amber).
>
> **Main area, two columns.** The wider left column holds a **booking table** with a light header row and six rows, columns reading right-to-left: **«الوقت» / «العميل» / «رقم اللوحة» / «الخدمة» / «الفني» / «الحالة»** — realistic Arabic names, plate strings like **«ش ٤٤٢٩١»**, services like **«تغيير زيت» / «فحص فرامل» / «صيانة دورية»**, and coloured status pills **«مؤكد» (blue) / «قيد التنفيذ» (amber) / «مكتمل» (green)**. The narrower right column stacks a small weekly bar chart titled **«الحجوزات هذا الأسبوع»** with seven blue bars, and a compact low-stock list titled **«مخزون تحت الحد»** with three parts and quantity chips.
>
> Clean, dense-but-breathable modern SaaS design in the spirit of Linear and Stripe: 1px hairlines, soft shadows, generous padding, a single blue accent used sparingly. Sharp UI rendering, crisp text, high resolution.
>
> *(+ سطر Negative)*

## ٤ب — شاشة الجوال → `sys-mobile.webp`

**المقاس: 900 × 1930 بكسل (نسبة 9:19.3 رأسي).**

> An Arabic (RTL) mobile app screen for the **same** system, **«ميكانو»** — identical navy/blue identity, identical logo, same fonts and same customer names as the dashboard, so the two images read as one product on two devices. Render the screen content only, edge to edge, no phone frame.
>
> **Top 6% of the image is reserved:** a normal iOS status bar with the time pushed to the far right and signal / wifi / battery icons to the far left, and **nothing in the middle third** — leave that area as flat header colour.
>
> **Header** in navy `#0F2942`: the **«ميكانو»** wordmark, a greeting line **«مساء الخير، خالد»**, and beneath it a wide white summary card that overlaps the header edge showing **«مواعيد اليوم»** with a large **«١٨»**, and two small stats beside it — **«٧ في الورشة»** and **«٣ بانتظار قطعة»**.
>
> **A row of four quick actions** with round tinted icon buttons: **«حجز جديد» · «أمر تشغيل» · «فاتورة» · «عميل»**.
>
> **Then the day's list — the main body:** a section title **«جدول اليوم»** with a small **«الكل ←»** link, followed by five appointment cards. Each card is white with a hairline border: a time on the right in bold (**«٩:٠٠ ص»**, **«١٠:٣٠ ص»**, **«١١:١٥ ص»**…), the customer's Arabic name, the plate number and service in smaller grey, and a coloured status pill on the left (**«مؤكد» / «قيد التنفيذ» / «مكتمل»**). One card carries a small amber flag **«بانتظار قطعة»**.
>
> **A bottom tab bar** with five icons, the first active in blue: **«الرئيسية» · «المواعيد» · «الورشة» · «الفواتير» · «المزيد»**.
>
> Keep the strongest content in the upper two-thirds — the lower part of the image may be trimmed. Modern iOS-native feel, rounded cards, soft shadows, crisp text, high resolution.
>
> *(+ سطر Negative)*

---

# الخدمة ٠٦ — أتمتة وذكاء اصطناعي

**العميل الافتراضي:** «الندى للتوريدات» — توريد مواد غذائية للمطاعم، دبي.
**الهوية:** كحلي بنفسجي `#1B1F3B` · بنفسجي `#6C5CE7` · نعناعي `#16C79A` للنجاح · خلفية `#F7F7FB`. خط Noto Kufi Arabic.

## ٦أ — مسار الأتمتة → `ai-flow.webp`

**المقاس: 1650 × 740 بكسل (نسبة 2.23:1 أفقي عريض).** يُعرض بلا إطار متصفح، بحواف دائرية، وتحته تعليق «أتمتة تشتغل بدالك — من الطلب للفاتورة للتقرير».

> A wide Arabic (RTL) **automation flow canvas** for **«الندى للتوريدات»**, a Dubai food-supply company — the kind of node graph you see inside Make or n8n, but designed with real taste. Fill the canvas edge to edge on a very light `#F7F7FB` background with a barely-visible dot grid.
>
> **Five nodes connected right-to-left** (the flow starts on the right, as Arabic reads), joined by smooth curved connector lines in violet `#6C5CE7` with small arrowheads and a subtle animated-looking glow along the path:
>
> 1. **«طلب واتساب»** — a WhatsApp-green rounded node with the WhatsApp glyph and a one-line caption **«المطعم يرسل طلبه»**.
> 2. **«الذكاء الاصطناعي يقرأ الطلب»** — the largest node, white with a violet border and a soft violet glow, a sparkle/AI glyph, and inside it a tiny parsed-order preview: three lines reading **«طماطم — ٢٠ كجم» / «زيت زيتون — ٦ علب» / «دجاج طازج — ١٥ كجم»** with small violet checkmarks.
> 3. **«فاتورة تُصدر تلقائياً»** — a white node holding a miniature invoice with a total line **«١,٢٤٠ د.إ»**.
> 4. **«تحديث المخزون»** — a white node with a small descending bar chart.
> 5. **«تقرير يومي للمالك»** — a mint `#16C79A` node with an envelope/report glyph and the caption **«٦:٠٠ م كل يوم»**.
>
> **A branch splitting off the AI node downward** to a small grey node **«طلب غير واضح ← تحويل لموظف»**, drawn with a dashed connector — this single detail is what makes the diagram read as a real system rather than a marketing drawing.
>
> **A slim strip along the bottom edge** with three tiny stat pills: **«١٤٠ طلباً/شهر» · «٤ ثوانٍ متوسط الرد» · «٠ إدخال يدوي»**.
>
> Flat, precise, generous white space, thin strokes, one violet accent plus one mint accent, no gradients on gradients. Vector-crisp, high resolution.
>
> *(+ سطر Negative)*

## ٦ب — محادثة البوت → `ai-chat.webp`

**المقاس: 900 × 1930 بكسل (نسبة 9:19.3 رأسي).** تُعرض داخل إطار جهاز حقيقي وتحتها «البوت يرد خلال ثانية — حتى وأنت نايم».

> A realistic Arabic (RTL) **WhatsApp Business conversation** on a phone screen — the customer side of the same automation, for **«الندى للتوريدات»**. Render the screen content only, edge to edge, no phone frame. Use authentic WhatsApp visual language: the familiar pale patterned chat wallpaper, green outgoing bubbles on the right, white incoming bubbles on the left, tick marks, and rounded bubble tails.
>
> **Top 6% reserved:** iOS status bar, time at the far right, icons at the far left, **middle third empty**.
>
> **Chat header** in WhatsApp dark-teal: a circular avatar with the **«الندى»** logo, the business name **«الندى للتوريدات»** with a small blue verified badge, and beneath it in small green **«يرد عادةً خلال ثوانٍ»**, plus video / call icons.
>
> **The conversation, newest at the bottom — around seven bubbles:**
> - Outgoing (green, right): **«مساء الخير، أبغى طلبية لمطعم الأصيل»**
> - Incoming (white, left): **«أهلاً بك 👋 أرسل الأصناف والكميات في رسالة واحدة وسأجهّز الطلب فوراً.»**
> - Outgoing: a three-line order — **«طماطم ٢٠ كجم / زيت زيتون ٦ علب / دجاج طازج ١٥ كجم»**
> - Incoming: a **structured confirmation card** inside the bubble — a small table of the three items with quantities and prices, a divider, then **«الإجمالي: ١,٢٤٠ د.إ»** and a line **«التوصيل: غداً ٧:٠٠ ص»**.
> - Incoming: two quick-reply buttons rendered as WhatsApp's own bordered button rows — **«تأكيد الطلب»** and **«تعديل الكمية»**.
> - Outgoing: **«تأكيد»**
> - Incoming: **«تم ✅ رقم الطلب ND-4471 — الفاتورة في الطريق إليك.»**
>
> **A timestamp separator** reading **«اليوم»** above the first bubble, and a normal WhatsApp input bar pinned at the bottom.
>
> The point of this screen is that a machine answered like a good employee would — so the tone of the Arabic must be natural and warm, never robotic. Keep the confirmation card and the total in the upper two-thirds; the bottom may be trimmed. Crisp text, high resolution.
>
> *(+ سطر Negative)*

---

## ملاحظات التسليم

المقاسات أعلاه مطابقة تماماً لأبعاد العرض في الموقع، فلن يُقتطع شيء. إن رفض المولّد مقاساً منها:

- **اللوحات الأفقية:** اطلب أقرب مقاس أفقي (3:2) وسأقصّ أنا من الأعلى والأسفل.
- **شاشات الجوال:** اطلب أطول مقاس رأسي متاح (2:3) — سأتكفّل بالباقي، لكن أخبرني حتى أقصّ بوعي بدل أن أضغط الصورة وتتشوّه النسب.

أسماء الملفات النهائية — تُستخدم كما هي بلا تعديل في الكود:

```
assets/shots/sys-dash.webp     ← ٤أ لوحة التحكم
assets/shots/sys-mobile.webp   ← ٤ب جوال ميكانو
assets/shots/ai-flow.webp      ← ٦أ مسار الأتمتة
assets/shots/ai-chat.webp      ← ٦ب محادثة البوت
```
