# نايل سوفت — NILESOFT

موقع تعريفي لخدمات نايل سوفت البرمجية في الإمارات والخليج: مواقع، متاجر إلكترونية، أنظمة، تطبيقات، وأتمتة بالذكاء الاصطناعي.

**Landing page for NILESOFT** — software services for businesses in the UAE and the Gulf: websites, online stores, business systems, mobile apps and AI automation.

## المحتويات

- `index.html` — الصفحة الرئيسية الكاملة (عربي/إنجليزي، صفحة واحدة بدون اعتماديات خارجية عدا الخطوط)
- `demos/` — صفحات النماذج الحية الثلاثة:
  - `diafa.html` — مطعم «ضيافة»: منيو رقمي يرسل الطلب إلى الكاشير أو واتساب
  - `lamsa.html` — صالون «لمسة»: نظام حجز مواعيد
  - `dukkan.html` — متجر «دكان»: تجربة شراء كاملة (جوال + كمبيوتر)
- `assets/` — الشعارات، خلفية الهيرو، فيديو الموشن، ولقطات الشاشات

## التشغيل محلياً

افتح `index.html` مباشرة في المتصفح، أو شغّل خادماً محلياً:

```bash
python -m http.server 8000
```

ثم افتح `http://localhost:8000`.

## النشر على Render (الموصى به)

المشروع يحتوي على `render.yaml` جاهزاً، فلا تحتاج ضبط أي إعدادات يدوياً:

1. ارفع المشروع على GitHub (شغّل `push-to-github.bat`).
2. من [dashboard.render.com](https://dashboard.render.com) اختر **New → Static Site**.
3. اربط المستودع، وستُقرأ الإعدادات تلقائياً من `render.yaml`.
4. اضغط **Create Static Site**.

الموقع يصبح حياً خلال دقيقتين على `https://nilesoft.onrender.com` (مجاناً مع شهادة TLS)، ويُحدَّث تلقائياً مع كل `git push`.

**الإعدادات يدوياً** (إن لم يُقرأ الملف): Build Command = `true`، Publish Directory = `./`

## النشر على GitHub Pages (بديل)

من صفحة المستودع: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root` → Save**.

يصبح الموقع متاحاً على: `https://<username>.github.io/<repo-name>/`

## ملاحظات

- رقم واتساب مُعرّف في `index.html` عبر الثابت `WA_NUMBER`.
- العلامات التجارية في النماذج (ضيافة، لمسة، دكان) علامات افتراضية للعرض فقط.

---

© 2026 نايل سوفت — جميع الحقوق محفوظة.
