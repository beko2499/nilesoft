(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = window.NS = {};

  /* ============ WhatsApp (ضع رقمك هنا — بصيغة دولية بدون + أو مسافات، مثال: 9715XXXXXXXX) ============ */
  const WA_NUMBER = '971504494638';
  function waReady(){ return /^\d{9,15}$/.test(WA_NUMBER); }
  function trackLead(method, service){
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'generate_lead', {
      method,
      service: service || 'general'
    });
  }
  function waOpen(serviceKey){
    if (!waReady()) return false;
    let msg = t('wa_msg');
    if (serviceKey && serviceKey !== 'general') {
      msg += ' — ' + String(t(serviceKey + '_t')).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
    }
    trackLead('whatsapp', serviceKey);
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    return true;
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-wa]');
    if (!a) return;
    if (waOpen(a.dataset.wa)) e.preventDefault();
    // إن لم يُضبط الرقم بعد: يتابع الرابط إلى نموذج التواصل (#contact) بشكل طبيعي
  });

  /* ============ Haptic feedback (visual press + vibration where supported) ============ */
  const haptic = (ms = 8) => { if (navigator.vibrate) navigator.vibrate(ms); };
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.pressable')) haptic(8);
  }, {passive:true});

  /* ============ i18n dictionary ============ */
  const dict = {
    en: {
      title: 'NILESOFT — Software services in the UAE: websites, stores, apps & automation',
      brand: 'NILESOFT', menu_label: 'Menu', island_sent: '\u2713 Message sent',
      nav_home: 'Home', nav_services: 'Services & Pricing', nav_work: 'Live Demos', nav_story: 'About', nav_process: 'Process', nav_clients: 'Why Us', nav_contact: 'Contact',
      title_home: 'Software Development Company in Ajman & UAE | NILESOFT', title_services: 'Website, App & Business Software Services UAE | NILESOFT', title_work: 'Live Website, Store & Booking System Demos | NILESOFT', title_about: 'About NILESOFT | Ajman Software Development Company', title_contact: 'Contact NILESOFT Software Development UAE',
      island_cta: 'Free Consultation',
      mark_alt: 'NILESOFT geometric N mark',
      hero_eyebrow: 'Websites · Stores · Systems · Apps · Automation',
      hs1_tag: 'Business Website', hs1_1: 'A digital presence you deserve', hs1_2: 'fairly priced.', hs1_d: 'A professional website that introduces your business and turns visitors into customers.',
      hs2_tag: 'Online Store', hs2_1: 'Your store sells all day', hs2_2: 'even while you sleep.', hs2_d: 'Products, orders and payments in one simple customer experience.',
      hs3_tag: 'Mobile App', hs3_1: 'Their phone is always on.', hs3_2: 'Is your app on it?', hs3_d: 'Your brand in every pocket — alerts, orders and loyalty.',
      hs4_tag: 'Automation', hs4_1: 'Every manual minute', hs4_2: 'costs you money.', hs4_d: 'We turn repetitive work into tasks that complete themselves.',
      hs5_tag: 'Business System', hs5_1: 'Orders stuck in WhatsApp?', hs5_2: 'Time to level up.', hs5_d: 'One system organises orders, invoices and customers clearly.',
      hs6_tag: 'MVP', hs6_1: 'The idea exists.', hs6_2: 'Let’s build it.', hs6_d: 'From an early wireframe to a real product ready to test and launch.',
      hs7_tag: 'Brand', hs7_1: 'A first impression', hs7_2: 'never comes twice.', hs7_d: 'A confident interface that reflects your level in three seconds.',
      hs8_tag: 'Race', hs8_1: 'Not online yet?', hs8_2: 'You’re already behind.', hs8_d: 'Your competitor moves faster and reaches the customer first.',
      hs9_tag: 'Trust', hs9_1: 'Before they call,', hs9_2: 'they decide to trust you.', hs9_d: 'Your presence is the first trust test. Make it count.',
      cta_demos: 'Try the live demos',
      hero_h1: 'A digital presence your business deserves —<br><span class="accent">fairly priced</span>.',
      hero_accent: 'حضور رقمي يليق بعملك — بسعر عادل',
      hero_lede: 'We turn your ideas into integrated digital solutions that help you grow and stand out in today\'s market.',
      cta_start: 'Start Your Project Now', cta_explore: 'See How We Work',
      sec_1: 'Restaurants & Cafés', sec_2: 'Salons & Beauty', sec_3: 'Clinics', sec_4: 'Real Estate', sec_5: 'Traders & Shops', sec_6: 'Service Offices',
      svc_nav_1: 'Landing Page', svc_nav_2: 'Business Website', svc_nav_3: 'Online Store', svc_nav_4: 'Booking System', svc_nav_5: 'Mobile App', svc_nav_6: 'Automation & AI',
      svc_eyebrow: 'Services & Pricing', svc_h2: 'Clear services,<br>clear prices.',
      svc_sub: 'Every service is a defined product: you know exactly what you get, when, and for how much — before paying a dirham.',
      price_from: 'From', svc_pop: 'Most popular', svc_cta: 'Order via WhatsApp',
      svc1_t: 'Professional One-Page Website', svc1_d: 'For any business that needs a respectable online front today — one powerful page with everything your customer needs to reach you.',
      svc1_f1: 'Modern design in Arabic & English', svc1_f2: 'WhatsApp button, contact form & Google Maps', svc1_f3: 'Domain, hosting and full launch included',
      svc1_p: 'AED 300', svc1_tm: 'Within 3 days max',
      svc2_t: 'Complete Business Website', svc2_d: 'A full website worthy of your brand that shows up on Google — your official front for customers and partners.',
      svc2_f1: '5–8 bilingual pages with an easy admin panel', svc2_f2: 'Solid SEO foundations and fast loading', svc2_f3: 'Training so you manage content yourself',
      svc2_p: 'AED 1,000', svc2_tm: 'Within 1 week max',
      svc3_t: 'Online Store', svc3_d: 'Move from selling in chat messages to a store that works 24/7, taking orders and payments automatically.',
      svc3_f1: 'Local payment gateways, VAT & invoicing setup', svc3_f2: 'Products, inventory and shipping management', svc3_f3: 'Full training on running your store',
      svc3_p: 'AED 1,500', svc3_tm: 'Within 10 days max',
      svc4_t: 'Booking & Management System', svc4_d: 'Stop running your business on notebooks and spreadsheets — one system for bookings, inventory, invoices or customers.',
      svc4_f1: 'Appointments, inventory, invoicing or CRM', svc4_f2: 'Reports, dashboards and staff permissions', svc4_f3: 'Works on phone and computer',
      svc4_p: 'AED 1,700', svc4_tm: 'Within 2 weeks max',
      svc5_t: 'Mobile App (MVP)', svc5_d: 'Your brand on the Google and Apple stores — we start with a smart first version, then grow it with your users.',
      svc5_f1: 'Android & iOS from one codebase', svc5_f2: 'Store publishing, notifications & admin panel', svc5_f3: 'A real, launchable first version',
      svc5_p: 'AED 2,500', svc5_tm: 'Within 3 weeks max',
      svc6_t: 'Automation & AI', svc6_d: 'Put AI to work in your business: instant customer replies and automations that save hours every day.',
      svc6_f1: 'WhatsApp bot answering your customers', svc6_f2: 'Automating repetitive office tasks & integrations', svc6_f3: 'Automatic reports to your email or WhatsApp',
      svc6_p: 'AED 2,000', svc6_tm: 'Within 12 days max',
      svc_note: 'Every project includes one month of free support after delivery and two free revision rounds within scope — payment is 50% to start, 50% on delivery. Ongoing care plans from AED 250/month.',
      work_eyebrow: 'Live demos', work_h2: 'Try it yourself before you decide.',
      work_sub: 'Complete demo products we build so you can test the quality with your own hands — honestly presented as capability demos, not client work.',
      work1_tag: 'Restaurants', work1_t: 'Digital Restaurant Menu', work1_d: 'A bilingual menu opened from a QR code on the table, with direct WhatsApp ordering.',
      work2_tag: 'Appointments', work2_t: 'Salon Booking System', work2_d: 'An elegant page where clients book their own appointments — reaching you instantly.',
      work3_tag: 'Commerce', work3_t: 'Demo Online Store', work3_d: 'A full store with cart and test checkout — try the entire purchase journey.',
      demo_soon: 'In progress — available soon',
      story_eyebrow: 'About NILESOFT', story_h2: 'We don’t just build screens. We build room for your idea to grow.',
      story_p: 'Our name began with the Nile, but our outlook reaches anywhere a good idea can make a difference. At NILESOFT, we treat your project like our own: we understand the people it serves, choose technology that fits your stage, and build a clear solution that can start focused and grow with you. From a first landing page to the system behind your operations, you work directly with the people who design and build it — with honesty, flexibility and care that never gets lost between departments.',
      story_alt: 'NILESOFT logo mark',
      val1_t: 'Innovate', val1_d: 'Modern stacks and proven patterns — no hype for hype\'s sake.',
      val2_t: 'Empower', val2_d: 'Every delivery includes training — run your website or store yourself, no dependency.',
      val3_t: 'Transform', val3_d: 'Success is measured in business impact — more customers, hours saved, growing revenue.',
      pl1_b: 'Only 50% to start', pl1_s: 'the rest after you receive the result',
      pl2_b: '1 month free support', pl2_s: 'after every delivery',
      pl3_b: '2 free revision rounds', pl3_s: 'within every project scope',
      pl4_b: 'Written delivery date', pl4_s: 'scope, price and date agreed in writing',
      proc_eyebrow: 'How we work', proc_h2: 'A process that flows.',
      proc_sub: 'Four clear stages — you always know exactly where your project stands.',
      step1_t: 'Discover', step1_d: 'A free conversation to map your goals, customers and budget — then a written offer.',
      step2_t: 'Design', step2_d: 'You see and approve the design before full build begins.',
      step3_t: 'Build', step3_d: 'Regular progress updates — no disappearing for weeks.',
      step4_t: 'Launch & Support', step4_d: 'Full launch, training, and a free month of support — then an optional care plan.',
      cl_eyebrow: 'Why NILESOFT?', cl_h2: 'Agency quality — without agency prices.',
      cl_sub: 'Compare for yourself: business websites at Dubai agencies start around AED 10,000 and can exceed 100,000 — here you get what your business actually needs for a fraction of that.',
      why1: '<b>You deal with the actual builder.</b> No sales reps and no middle layers — the person who replies is the one designing and coding your project, so decisions are faster and details never get lost.',
      why2: '<b>Today\'s tools, not yesterday\'s.</b> Building with modern platforms and AI tooling means faster delivery at lower cost — with zero compromise on quality.',
      why3: '<b>Full clarity before you pay.</b> Written scope, fixed price and an agreed delivery date — no surprises and no hidden costs halfway through.',
      cta_h2: '<span class="accent">A free consultation</span><br>for your project.', cta_badge: 'A consulting session with experts', cta_f1: 'No commitment', cta_f2: '30 focused minutes', cta_f3: 'Practical tailored solutions',
      cta_p: 'A 30-minute call to discuss your idea and define the right solution and its real cost — with zero obligation.',
      cta_btn: 'Book Your Consultation',
      ct_eyebrow: 'Get in touch', ct_h2: 'Every successful project starts with a conversation.',
      ct_sub: 'WhatsApp is the fastest way — or use the form and you\'ll hear back within working hours the same day.',
      ct_email: 'Email', ct_phone: 'WhatsApp', ct_wa_v: '+971 50 449 4638', ct_hq: 'Location', ct_hq_v: 'Ajman, UAE — serving all Emirates & the Gulf',
      form_h3: 'Tell us about your project',
      f_name_l: 'Full name', f_name_ph: 'Mohamed Ali',
      f_email_l: 'Email or WhatsApp number', f_email_ph: 'you@company.com',
      f_company_l: 'Business name', f_company_ph: 'Shop or company name',
      f_topic_l: 'I need',
      opt1: 'Professional one-page website', opt2: 'Complete business website', opt3: 'Online store', opt4: 'Booking & management system', opt5: 'Mobile app', opt6: 'Automation & AI',
      f_msg_l: 'Project details', f_msg_ph: 'Describe your business and what you need — you\'ll get a clear plan and price.',
      f_send: 'Send Request',
      f_success: 'Thank you — your request is in. You\'ll hear back within working hours today.',
      wa_msg: 'Hello! I\'m interested in a service from NILESOFT',
      foot_about: 'NILESOFT — software services for businesses in the UAE & Gulf: websites, stores, systems, apps and AI automation.',
      foot_tag: 'نايل سوفت — خدمات برمجية تنمّي أعمالك',
      foot_company: 'Links', foot_about_l: 'About', foot_how: 'How we work', foot_why: 'Why NILESOFT', foot_demos: 'Live demos',
      foot_services: 'Services', foot_s1: 'Websites & one-page sites', foot_s2: 'Online stores', foot_s3: 'Systems & apps', foot_s4: 'Automation & AI',
      foot_contact: 'Contact', foot_wa: 'Direct WhatsApp', foot_addr: 'Ajman, UAE',
      foot_rights: '\u00a9 2026 NILESOFT. All rights reserved.',
      ssn1: 'Service 01', ssn2: 'Service 02', ssn3: 'Service 03', ssn4: 'Service 04', ssn5: 'Service 05', ssn6: 'Service 06',
      g1a_t: 'Online training academy', g1a_s: 'New cohort signup · built in 3 days',
      g1b_t: 'Luxury watch store', g1b_s: 'Products & direct checkout',
      g1c_t: 'Travel booking platform', g1c_s: 'Tours, stays & direct booking',
      p_home: 'Home', p_about: 'About', p_srv: 'Services', p_work: 'Portfolio', p_contact: 'Contact', p_lang: 'Bilingual AR ⇄ EN',
      ba_b: 'Before', ba_a: 'After — your store sells on its own', st_swipe: 'Drag to see the full purchase journey',
      ba_cap: 'Every order = ten messages, and payments get lost in between',
      st_t1: 'Open 24/7', st_t2: 'Automatic payments & invoices', st_t3: 'Inventory & shipping connected',
      j1_b: '1 · Week 1', j1_t: 'We lock the idea', j1_s: 'Wireframes + user flow',
      j2_b: '2 · Week 2', j2_t: 'We design & review with you', j2_s: 'Your brand on every screen',
      j3_b: '3 · Week 3', j3_t: 'We launch on both stores', j3_s: 'iOS & Android + full training',
      ai_t: 'Automation that works for you', ai_s: 'From order to invoice to report — no copy-paste',
      ai_p1: 'The bot replies within a second', ai_p2: 'even while you sleep',
      qr_open: 'Open the demo', swipe: 'Swipe to see the rest',
      ct_qr_t: 'Open the site on your phone', ct_qr_s: 'Scan with your phone camera to browse the site and the live demos — or share it with whoever needs it.',
      dc1_qsm: 'Open the menu instantly —<br>no app to download',
      dc2_qsm: 'Open the booking flow —<br>it takes under a minute',
      dc3_qsm: 'Open the store instantly —<br>full checkout through WhatsApp',
      dc4_qsm: 'Best viewed on desktop —<br>but try it from here too',
      dc1_qt: 'Try the menu now', dc1_qs: 'Scan the code with your phone camera —<br>no app to download',
      dc1_bd: 'Live demo', dc1_cl: '\u201cDiafa\u201d Restaurant — fictional client',
      dc1_h: 'A digital menu taking orders<br>from the table to the cashier system or WhatsApp',
      dc1_f1_t: 'Menu categories in one tap', dc1_f1_s: 'Grills, mains, drinks, desserts — switch instantly',
      dc1_f2_t: 'Photo & price for every dish', dc1_f2_s: 'Customers see before they order — in AED, no confusion',
      dc1_f3_t: 'The cart sends orders to WhatsApp', dc1_f3_s: 'A ready message with items and total — no app needed',
      dc2_qt: 'Try booking now', dc2_qs: 'Scan the code with your phone camera —<br>booking takes under a minute',
      dc2_bd: 'Live demo', dc2_cl: '\u201cLamsa\u201d Salon — fictional client',
      dc2_h: 'A booking system that fills your calendar<br>without calls or notebooks',
      dc2_f1_t: 'Services with price & duration', dc2_f1_s: 'Clients know the cost and time before booking',
      dc2_f2_t: 'The calendar shows free slots only', dc2_f2_s: 'Booked times lock automatically — no clashes',
      dc2_f3_t: 'Confirmation lands on WhatsApp', dc2_f3_s: 'Confirmation plus a reminder — fewer no-shows',
      dc3_qt: 'Try the store now', dc3_qs: 'Scan the code —<br>the full purchase journey up to WhatsApp',
      dc3_bd: 'Live demo · Mobile', dc3_cl: '\u201cDukkan\u201d Store — fictional client',
      dc3_h: 'A full store in your customer\u2019s pocket<br>from browsing to checkout',
      dc3_f1_t: 'Categories & featured products', dc3_f1_s: 'Search, offers and \u201cnew\u201d badges — one tap away',
      dc3_f2_t: 'A cart that calculates everything', dc3_f2_s: 'Shipping, VAT and the total — no surprises',
      dc3_f3_t: 'Orders arrive on WhatsApp', dc3_f3_s: 'Confirmation and tracking sent automatically',
      dc4_qt: 'Try it on desktop', dc4_qs: 'The same store in a full layout —<br>hero, product grid & checkout',
      dc4_bd: 'Live demo · Desktop', dc4_cl: '\u201cDukkan\u201d Store — fictional client',
      dc4_h: 'A checkout that reassures customers<br>so they pay without hesitation',
      dc4_f1_t: 'Their details in two steps only', dc4_f1_s: 'Delivery then payment — no forced signup',
      dc4_f2_t: 'Three local payment methods', dc4_f2_s: 'Card, digital wallet, or cash on delivery',
      foot_made1: 'Proudly built by Sudanese hands', foot_made2: 'serving the UAE & the Gulf'
    },
    ar: {
      title: 'نايل سوفت — خدمات برمجية في الإمارات: مواقع، متاجر، تطبيقات وأتمتة',
      brand: 'نايل سوفت', menu_label: 'القائمة', island_sent: '\u2713 تم إرسال الطلب',
      nav_home: 'الرئيسية', nav_services: 'الخدمات والأسعار', nav_work: 'النماذج الحية', nav_story: 'من نحن', nav_process: 'منهجيتنا', nav_clients: 'لماذا نحن', nav_contact: 'تواصل معنا',
      title_home: 'شركة برمجة في عجمان والإمارات | نايل سوفت', title_services: 'خدمات برمجة المواقع والتطبيقات في الإمارات | نايل سوفت', title_work: 'نماذج مواقع وأنظمة وتطبيقات تجريبية | نايل سوفت', title_about: 'عن نايل سوفت | شركة تطوير برمجيات في عجمان', title_contact: 'تواصل مع نايل سوفت للبرمجة في عجمان والإمارات',
      island_cta: 'استشارة مجانية',
      mark_alt: 'علامة نايل سوفت الهندسية الجديدة',
      hero_eyebrow: 'مواقع · متاجر · أنظمة · تطبيقات · أتمتة',
      hs1_tag: 'موقع شركة', hs1_1: 'حضور رقمي يليق بعملك', hs1_2: 'بسعر عادل.', hs1_d: 'موقع احترافي يعرّف بك ويحوّل الزائر إلى عميل بخطوة واضحة.',
      hs2_tag: 'متجر إلكتروني', hs2_1: 'متجرك يبيع طوال اليوم', hs2_2: 'حتى وأنت نائم.', hs2_d: 'منتجات وطلبات ودفع في تجربة واحدة سهلة وواضحة لعميلك.',
      hs3_tag: 'تطبيق', hs3_1: 'عميلك لا يترك هاتفه', hs3_2: 'فأين تطبيقك؟', hs3_d: 'تطبيق باسمك في جيب كل عميل — إشعارات وطلبات وولاء.',
      hs4_tag: 'أتمتة', hs4_1: 'كل دقيقة يدويّة', hs4_2: 'تكلّفك مالاً.', hs4_d: 'نحوّل التكرار والنسخ واللصق إلى مهام تنجز نفسها.',
      hs5_tag: 'نظام', hs5_1: 'طلباتك في واتساب؟', hs5_2: 'حان وقت التطوّر.', hs5_d: 'نظام واحد يرتّب الطلبات والفواتير والعملاء في مكان واضح.',
      hs6_tag: 'MVP', hs6_1: 'الفكرة موجودة.', hs6_2: 'دعنا نبنيها.', hs6_d: 'من مسودة أولى إلى منتج حقيقي جاهز للاختبار والإطلاق.',
      hs7_tag: 'هوية', hs7_1: 'أول انطباع', hs7_2: 'لا يتكرر مرتين.', hs7_d: 'واجهة واثقة تعكس مستوى شركتك في أول ثلاث ثوانٍ.',
      hs8_tag: 'سباق', hs8_1: 'غير موجود رقمياً؟', hs8_2: 'أنت متأخر إذاً.', hs8_d: 'منافسك يتحرك أسرع ويصل إلى عميلك قبلك.',
      hs9_tag: 'ثقة', hs9_1: 'قبل أن يتصل بك', hs9_2: 'قرّر أن يثق بك.', hs9_d: 'حضورك الرقمي أول اختبار للثقة — اجعله يستحقها.',
      cta_demos: 'جرّب النماذج الحية',
      hero_h1: 'حضور رقمي يليق بعملك<br><span class="accent">بسعر عادل</span>.',
      hero_accent: 'Websites · Stores · Systems · Apps — built right, priced fair',
      hero_lede: 'نحوّل أفكارك إلى حلول رقمية متكاملة تساعدك على النمو والتميز في سوق اليوم.',
      cta_start: 'ابدأ مشروعك الآن', cta_explore: 'شاهد كيف نعمل',
      sec_1: 'مطاعم وكافيهات', sec_2: 'صالونات وتجميل', sec_3: 'عيادات', sec_4: 'عقارات', sec_5: 'تجار ومتاجر', sec_6: 'مكاتب خدمات',
      svc_nav_1: 'صفحة تعريفية', svc_nav_2: 'موقع شركة', svc_nav_3: 'متجر إلكتروني', svc_nav_4: 'نظام حجوزات', svc_nav_5: 'تطبيق موبايل', svc_nav_6: 'أتمتة وذكاء اصطناعي',
      svc_eyebrow: 'الخدمات والأسعار', svc_h2: 'خدمات واضحة،<br>بأسعار واضحة.',
      svc_sub: 'كل خدمة منتج محدد: تعرف ماذا ستستلم، ومتى، وبكم — قبل أن تدفع درهماً واحداً.',
      price_from: 'يبدأ من', svc_pop: 'الأكثر طلباً', svc_cta: 'اطلبها عبر واتساب',
      svc1_t: 'صفحة تعريفية احترافية', svc1_d: 'لأي نشاط يحتاج واجهة أونلاين محترمة اليوم — صفحة واحدة قوية تجمع كل ما يحتاجه عميلك للوصول إليك.',
      svc1_f1: 'تصميم عصري بالعربية والإنجليزية', svc1_f2: 'زر واتساب ونموذج تواصل وخرائط Google', svc1_f3: 'النطاق والاستضافة والإطلاق الكامل',
      svc1_p: '300 د.إ', svc1_tm: 'خلال 3 أيام كحد أقصى',
      svc2_t: 'موقع شركة متكامل', svc2_d: 'موقع متكامل يليق باسم نشاطك ويظهر في نتائج البحث — واجهتك الرسمية أمام عملائك وشركائك.',
      svc2_f1: '5–8 صفحات بلغتين مع لوحة تحكم سهلة', svc2_f2: 'تهيئة قوية لمحركات البحث وسرعة عالية', svc2_f3: 'تدريب لتدير المحتوى بنفسك',
      svc2_p: '1,000 د.إ', svc2_tm: 'خلال أسبوع كحد أقصى',
      svc3_t: 'متجر إلكتروني', svc3_d: 'انتقل من البيع عبر الرسائل إلى متجر يعمل 24 ساعة ويستقبل الطلبات والمدفوعات آلياً.',
      svc3_f1: 'بوابات دفع محلية وإعداد الضريبة والفواتير', svc3_f2: 'إدارة المنتجات والمخزون والشحن', svc3_f3: 'تدريب كامل على إدارة متجرك',
      svc3_p: '1,500 د.إ', svc3_tm: 'خلال 10 أيام كحد أقصى',
      svc4_t: 'نظام حجوزات وإدارة', svc4_d: 'أوقف إدارة عملك بالدفاتر وجداول الإكسل — نظام واحد يضبط الحجوزات أو المخزون أو الفواتير أو العملاء.',
      svc4_f1: 'مواعيد أو مخزون أو فواتير أو إدارة عملاء', svc4_f2: 'تقارير ولوحات متابعة وصلاحيات موظفين', svc4_f3: 'يعمل من الجوال والكمبيوتر',
      svc4_p: '1,700 د.إ', svc4_tm: 'خلال أسبوعين كحد أقصى',
      svc5_t: 'تطبيق موبايل (MVP)', svc5_d: 'تطبيق باسم علامتك على متجري Google و Apple — نبدأ بنسخة أولى ذكية ثم نطورها مع نمو مستخدميك.',
      svc5_f1: 'Android و iOS بكود واحد', svc5_f2: 'نشر في المتاجر وإشعارات ولوحة إدارة', svc5_f3: 'نسخة أولى حقيقية قابلة للإطلاق',
      svc5_p: '2,500 د.إ', svc5_tm: 'خلال 3 أسابيع كحد أقصى',
      svc6_t: 'أتمتة وذكاء اصطناعي', svc6_d: 'وظّف الذكاء الاصطناعي في عملك: ردود فورية على عملائك وأتمتة توفر عليك ساعات كل يوم.',
      svc6_f1: 'بوت واتساب يرد على استفسارات عملائك', svc6_f2: 'أتمتة المهام المكتبية المتكررة وربط الأنظمة', svc6_f3: 'تقارير آلية إلى بريدك أو واتسابك',
      svc6_p: '2,000 د.إ', svc6_tm: 'خلال 12 يوماً كحد أقصى',
      svc_note: 'كل مشروع يشمل شهر دعم مجاني بعد التسليم وتعديلين مجانيين ضمن النطاق — والدفع 50% عند البدء و50% عند التسليم. عقود صيانة وتطوير مستمرة تبدأ من 250 د.إ شهرياً.',
      work_eyebrow: 'نماذج حية', work_h2: 'جرّب بنفسك قبل أن تقرر.',
      work_sub: 'نماذج تجريبية كاملة نبنيها لتختبر مستوى الجودة بيدك — نعرضها بصراحة كنماذج قدرات، لا كأعمال لعملاء.',
      work1_tag: 'مطاعم', work1_t: 'منيو رقمي لمطعم', work1_d: 'منيو ثنائي اللغة يُفتح من QR على الطاولة، مع طلب مباشر عبر واتساب.',
      work2_tag: 'مواعيد', work2_t: 'نظام حجز لصالون', work2_d: 'صفحة أنيقة يحجز منها العميل موعده بنفسه — وتصلك الحجوزات فوراً.',
      work3_tag: 'تجارة', work3_t: 'متجر إلكتروني تجريبي', work3_d: 'متجر كامل بسلة شراء ودفع تجريبي — جرّب رحلة الشراء من أولها لآخرها.',
      demo_soon: 'قيد الإنشاء — متاح قريباً',
      story_eyebrow: 'عن نايل سوفت', story_h2: 'لا نبني مجرد شاشات؛ نبني المساحة التي تنمو فيها فكرتك.',
      story_p: 'بدأ اسمنا من النيل، لكن رؤيتنا تمتد إلى كل مكان تستطيع فيه فكرة جيدة أن تصنع فرقاً. في نايل سوفت نتعامل مع مشروعك كأنه مشروعنا: نفهم الناس الذين تخدمهم، ونختار التقنية التي تناسب مرحلتك، ثم نبني حلاً واضحاً يمكن أن يبدأ مركزاً ويتطور معك. من أول صفحة إلى نظام يدير تفاصيل عملك، ستتعامل مباشرة مع من يصمم ويبني — بصدق ومرونة واهتمام لا يضيع بين الأقسام.',
      story_alt: 'شعار نايل سوفت',
      val1_t: 'نبتكر', val1_d: 'تقنيات حديثة وأنماط مجرّبة — دون انسياق وراء الضجيج.',
      val2_t: 'نمكّن', val2_d: 'مع كل تسليم تدريب كامل — تدير موقعك ومتجرك بنفسك دون الرجوع لأحد.',
      val3_t: 'نحوّل', val3_d: 'نقيس النجاح بأثره على عملك — عملاء أكثر، وساعات تُوفَّر، وإيرادات تنمو.',
      pl1_b: '50% فقط للبدء', pl1_s: 'والباقي بعد استلامك النتيجة',
      pl2_b: 'شهر دعم مجاني', pl2_s: 'بعد كل تسليم',
      pl3_b: 'تعديلان مجانيان', pl3_s: 'ضمن نطاق كل مشروع',
      pl4_b: 'موعد تسليم مكتوب', pl4_s: 'نطاق وسعر وتاريخ متفق عليها كتابياً',
      proc_eyebrow: 'كيف نعمل', proc_h2: 'منهجية تنساب.',
      proc_sub: 'أربع مراحل واضحة — تعرف دائماً أين يقف مشروعك بالضبط.',
      step1_t: 'اكتشاف', step1_d: 'نحلل احتياجاتك ونفهم رؤيتك لنحدد الفرص ونضع الأساس الصحيح لمشروعك.',
      step2_t: 'تصميم', step2_d: 'نحوّل الأفكار إلى تصاميم ذكية وتجارب مستخدم متميزة تعكس هوية علامتك.',
      step3_t: 'بناء', step3_d: 'نطوّر ونبني باحترافية عالية بأحدث التقنيات لضمان الأداء والجودة.',
      step4_t: 'إطلاق ودعم', step4_d: 'نطلق مشروعك بثقة ونبقى معك بدعم مستمر لضمان النمو والتطوير.',
      cl_eyebrow: 'لماذا نايل سوفت؟', cl_h2: 'جودة الوكالات — بلا أسعار الوكالات.',
      cl_sub: 'قارن بنفسك: موقع الشركات لدى وكالات دبي يبدأ من حوالي 10,000 د.إ وقد يتجاوز 100,000 — هنا تحصل على ما يحتاجه عملك فعلاً بجزء من ذلك.',
      why1: '<b>تتعامل مع من يبني فعلاً.</b> لا مندوب مبيعات ولا طبقات وسيطة — من يرد عليك هو من يصمم ويبرمج مشروعك، فالقرارات أسرع والتفاصيل لا تضيع.',
      why2: '<b>أدوات اليوم، لا الأمس.</b> البناء بأحدث المنصات وأدوات الذكاء الاصطناعي يعني تسليماً أسرع وتكلفة أقل — دون أي تنازل عن الجودة.',
      why3: '<b>وضوح كامل قبل الدفع.</b> نطاق مكتوب وسعر ثابت وتاريخ تسليم متفق عليه — لا مفاجآت ولا تكاليف خفية في منتصف الطريق.',
      cta_h2: '<span class="accent">استشارة مجانية</span><br>لمشروعك.', cta_badge: 'جلسة استشارية مع خبراء', cta_f1: 'بدون أي التزام', cta_f2: '30 دقيقة مركّزة', cta_f3: 'حلول عملية ومخصصة',
      cta_p: 'مكالمة 30 دقيقة نناقش فيها فكرتك ونحدد الحل الأنسب وتكلفته الحقيقية — دون أي التزام.',
      cta_btn: 'احجز استشارتك الآن',
      ct_eyebrow: 'تواصل معنا', ct_h2: 'كل مشروع ناجح يبدأ بمحادثة.',
      ct_sub: 'أسرع طريقة هي واتساب — أو استخدم النموذج وسيصلك الرد خلال ساعات العمل في نفس اليوم.',
      ct_email: 'البريد الإلكتروني', ct_phone: 'واتساب', ct_wa_v: '+971 50 449 4638', ct_hq: 'الموقع', ct_hq_v: 'عجمان، الإمارات — نخدم جميع الإمارات والخليج',
      form_h3: 'أخبرنا عن مشروعك',
      f_name_l: 'الاسم الكامل', f_name_ph: 'محمد علي',
      f_email_l: 'البريد أو رقم الواتساب', f_email_ph: 'you@company.com',
      f_company_l: 'اسم النشاط التجاري', f_company_ph: 'اسم المحل أو الشركة',
      f_topic_l: 'أحتاج',
      opt1: 'صفحة تعريفية احترافية', opt2: 'موقع شركة متكامل', opt3: 'متجر إلكتروني', opt4: 'نظام حجوزات وإدارة', opt5: 'تطبيق موبايل', opt6: 'أتمتة وذكاء اصطناعي',
      f_msg_l: 'تفاصيل المشروع', f_msg_ph: 'صف نشاطك وما تحتاجه — وسنعود إليك بخطة وسعر واضحين.',
      f_send: 'أرسل الطلب',
      f_success: 'شكراً — وصلنا طلبك وسنرد عليك خلال ساعات العمل في نفس اليوم.',
      wa_msg: 'مرحباً! مهتم بخدمة من نايل سوفت',
      foot_about: 'نايل سوفت — خدمات برمجية للأعمال في الإمارات والخليج: مواقع ومتاجر وأنظمة وتطبيقات وأتمتة بالذكاء الاصطناعي.',
      foot_tag: 'NILESOFT — Software services, built right',
      foot_company: 'روابط', foot_about_l: 'من نحن', foot_how: 'كيف نعمل', foot_why: 'لماذا نايل سوفت', foot_demos: 'النماذج الحية',
      foot_services: 'الخدمات', foot_s1: 'مواقع وصفحات تعريفية', foot_s2: 'متاجر إلكترونية', foot_s3: 'أنظمة وتطبيقات', foot_s4: 'أتمتة وذكاء اصطناعي',
      foot_contact: 'تواصل', foot_wa: 'واتساب مباشر', foot_addr: 'عجمان، الإمارات',
      foot_rights: '\u00a9 2026 نايل سوفت — جميع الحقوق محفوظة.',
      ssn1: 'الخدمة ٠١', ssn2: 'الخدمة ٠٢', ssn3: 'الخدمة ٠٣', ssn4: 'الخدمة ٠٤', ssn5: 'الخدمة ٠٥', ssn6: 'الخدمة ٠٦',
      g1a_t: 'أكاديمية تدريب أونلاين', g1a_s: 'تسجيل الدفعة الجديدة · ٣ أيام تنفيذ',
      g1b_t: 'متجر ساعات فاخرة', g1b_s: 'عرض المنتجات والشراء المباشر',
      g1c_t: 'منصة حجوزات سياحية', g1c_s: 'رحلات وإقامات وحجز مباشر',
      p_home: 'الرئيسية', p_about: 'من نحن', p_srv: 'خدماتنا', p_work: 'أعمالنا', p_contact: 'اتصل بنا', p_lang: 'بلغتين AR ⇄ EN',
      ba_b: 'قبل', ba_a: 'بعد — متجرك يبيع وحده', st_swipe: 'اسحب لترى رحلة الشراء كاملة',
      ba_cap: 'كل طلب = عشر رسائل، وتحويلات تضيع بينها',
      st_t1: 'يعمل 24 ساعة', st_t2: 'دفع وفواتير آلية', st_t3: 'مخزون وشحن مربوط',
      j1_b: '١ · الأسبوع الأول', j1_t: 'نثبّت الفكرة', j1_s: 'شاشات ورقية + مسار المستخدم',
      j2_b: '٢ · الأسبوع الثاني', j2_t: 'نصمم ونراجع معك', j2_s: 'هوية تطبيقك على كل شاشة',
      j3_b: '٣ · الأسبوع الثالث', j3_t: 'نطلق على المتجرين', j3_s: 'iOS وAndroid + تدريب كامل',
      ai_t: 'أتمتة تشتغل بدالك', ai_s: 'من الطلب للفاتورة للتقرير — بلا نسخ ولصق',
      ai_p1: 'البوت يرد خلال ثانية', ai_p2: 'حتى وأنت نايم',
      qr_open: 'افتح الديمو', swipe: 'اسحب لاستعراض الباقي',
      ct_qr_t: 'افتح الموقع على جوالك', ct_qr_s: 'امسح الكود بكاميرا جوالك لتتصفّح الموقع والنماذج الحية — أو شاركه مع من يهمه الأمر.',
      dc1_qsm: 'افتح المنيو مباشرة —<br>بدون تحميل أي تطبيق',
      dc2_qsm: 'افتحي الحجز مباشرة —<br>يأخذ أقل من دقيقة',
      dc3_qsm: 'افتح المتجر مباشرة —<br>تجربة الشراء كاملة حتى واتساب',
      dc4_qsm: 'يفضّل فتحه من الكمبيوتر —<br>لكن جرّبه من هنا أيضاً',
      dc1_qt: 'جرّب المنيو الآن', dc1_qs: 'امسح الباركود بكاميرا جوالك —<br>بدون تحميل أي تطبيق',
      dc1_bd: 'ديمو حي', dc1_cl: 'مطعم «ضيافة» — عميل افتراضي',
      dc1_h: 'منيو رقمي يستقبل الطلبات<br>من الطاولة إلى سيستم الكاشير أو واتساب',
      dc1_f1_t: 'فئات المنيو بضغطة', dc1_f1_s: 'مشاوي، رئيسية، مشروبات، حلويات — تتبدل فوراً',
      dc1_f2_t: 'صورة وسعر لكل طبق', dc1_f2_s: 'الزبون يشوف قبل ما يطلب — بالدرهم وبدون لبس',
      dc1_f3_t: 'السلة ترسل الطلب واتساب', dc1_f3_s: 'رسالة جاهزة بالأصناف والإجمالي — بدون تطبيق',
      dc2_qt: 'جرّبي الحجز الآن', dc2_qs: 'امسحي الباركود بكاميرا جوالك —<br>الحجز يأخذ أقل من دقيقة',
      dc2_bd: 'ديمو حي', dc2_cl: 'صالون «لمسة» — عميل افتراضي',
      dc2_h: 'نظام حجز يملأ جدولك<br>بدون مكالمات ولا دفتر',
      dc2_f1_t: 'الخدمات بالسعر والمدة', dc2_f1_s: 'العميلة تعرف التكلفة والوقت قبل الحجز',
      dc2_f2_t: 'التقويم يعرض المتاح فقط', dc2_f2_s: 'المواعيد المحجوزة تُقفل تلقائياً — لا تعارض',
      dc2_f3_t: 'التأكيد يوصل واتساب', dc2_f3_s: 'تأكيد وتذكير قبل الموعد — تقل نسبة الغياب',
      dc3_qt: 'جرّب المتجر الآن', dc3_qs: 'امسح الباركود بكاميرا جوالك —<br>تجربة الشراء كاملة حتى واتساب',
      dc3_bd: 'ديمو حي · الجوال', dc3_cl: 'متجر «دكان» — عميل افتراضي',
      dc3_h: 'متجر كامل في جيب زبونك<br>من التصفح إلى الدفع',
      dc3_f1_t: 'فئات ومنتجات مميزة', dc3_f1_s: 'بحث وعروض وشارة «جديد» — كل شيء بضغطة',
      dc3_f2_t: 'سلة تحسب كل شيء', dc3_f2_s: 'الشحن والضريبة والإجمالي — بدون مفاجآت',
      dc3_f3_t: 'الطلب يوصل واتساب', dc3_f3_s: 'تأكيد ورقم تتبع يصل الزبون تلقائياً',
      dc4_qt: 'جرّبه من الكمبيوتر', dc4_qs: 'نفس المتجر بواجهة كاملة —<br>هيرو وشبكة منتجات وCheckout',
      dc4_bd: 'ديمو حي · الكمبيوتر', dc4_cl: 'متجر «دكان» — عميل افتراضي',
      dc4_h: 'إتمام طلب يطمّن الزبون<br>ويدفع بدون تردد',
      dc4_f1_t: 'بياناته في خطوتين فقط', dc4_f1_s: 'توصيل ثم دفع — بدون تسجيل إجباري',
      dc4_f2_t: 'ثلاث طرق دفع محلية', dc4_f2_s: 'بطاقة، محفظة رقمية، أو عند الاستلام',
      foot_made1: 'صُنع بأيادٍ سودانية', foot_made2: 'لخدمة الإمارات والخليج'
    }
  };
  let lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  const t = (k) => (dict[lang][k] != null ? dict[lang][k] : dict.en[k] || k);

  function applyLang(l){
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.title = t(document.body.dataset.titleKey || 'title');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh).replace(/&amp;/g,'&'));
    document.querySelectorAll('[data-i18n-alt]').forEach(el => el.alt = t(el.dataset.i18nAlt).replace(/&amp;/g,'&'));
    // the accent line always shows the *other* language
    const accent = document.getElementById('accentLine');
    if (accent){ accent.lang = l === 'ar' ? 'en' : 'ar'; accent.dir = l === 'ar' ? 'ltr' : 'rtl'; }
    const footTag = document.getElementById('footTagline');
    if (footTag){ footTag.lang = l === 'ar' ? 'en' : 'ar'; footTag.dir = l === 'ar' ? 'ltr' : 'rtl'; }
    document.getElementById('langBtn').textContent = l === 'ar' ? 'EN' : 'ع';
    if (!menuOpen) label.textContent = t('brand');
    try { localStorage.setItem('ns-lang', l); } catch(e) {}
  }

  document.getElementById('langBtn').addEventListener('click', () => {
    applyLang(lang === 'ar' ? 'en' : 'ar');
  });

  /* ============ 3D background — interactive particle river (the Nile) ============ */
  (function initBackground(){
    const canvas = document.getElementById('bg3d');
    if (!window.THREE || new URLSearchParams(location.search).has('no3d')) { canvas.remove(); return; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:false, powerPreference:'low-power'});
    } catch(e) { canvas.remove(); return; }
    // Software rasterizers (SwiftShader/llvmpipe) can't sustain this — fall back to the CSS gradient
    try {
      const gl = renderer.getContext();
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const glName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
      if (/swiftshader|llvmpipe|software|basic render/i.test(glName)) {
        renderer.dispose(); canvas.remove(); return;
      }
    } catch(e) {}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 220);
    camera.position.set(0, 13, 30);
    const lookTarget = new THREE.Vector3(0, 0, -8);
    camera.lookAt(lookTarget);

    // Particle field
    const COUNT = 9000;
    const positions = new Float32Array(COUNT * 3);
    const rands = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    const paletteIdx = new Uint8Array(COUNT);
    const palettes = {
      light: [
        [0.55, 0.56, 0.60],  // neutral (majority)
        [0.83, 0.17, 0.12],  // brand red
        [0.05, 0.42, 0.18],  // brand green
        [0.93, 0.63, 0.05]   // brand amber
      ],
      dark: [
        [0.62, 0.63, 0.70],
        [0.98, 0.34, 0.27],
        [0.28, 0.78, 0.45],
        [1.00, 0.76, 0.20]
      ]
    };
    for (let i = 0; i < COUNT; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 116;  // x
      positions[i*3+1] = 0;
      positions[i*3+2] = -78 + Math.random() * 84;     // z
      rands[i] = Math.random();
      const r = Math.random();
      paletteIdx[i] = r < 0.76 ? 0 : r < 0.87 ? 1 : r < 0.95 ? 2 : 3;
    }
    function paintColors(mode){
      const pal = palettes[mode];
      for (let i = 0; i < COUNT; i++) {
        const c = pal[paletteIdx[i]];
        colors[i*3] = c[0]; colors[i*3+1] = c[1]; colors[i*3+2] = c[2];
      }
    }
    paintColors(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const uniforms = {
      uTime:  {value: 0},
      uMouse: {value: new THREE.Vector2(999, 999)},
      uBoost: {value: document.documentElement.dataset.theme === 'dark' ? 1.35 : 1.0}
    };
    const mat = new THREE.ShaderMaterial({
      uniforms, transparent:true, depthWrite:false,
      vertexShader: `
        attribute float aRand;
        attribute vec3 aColor;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uBoost;
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          vec3 pos = position;
          float t = uTime;
          // meandering river channel
          float channelX = sin(pos.z * 0.09 + t * 0.18) * 9.0;
          float dx = pos.x - channelX;
          float channel = exp(-dx * dx * 0.012);
          float y = 0.0;
          y += sin(pos.x * 0.16 + t * 0.7)  * 0.9;
          y += sin(pos.z * 0.21 + t * 0.55) * 0.7;
          y += sin((pos.x + pos.z) * 0.10 + t * 0.4) * 1.1;
          y += channel * (1.6 * sin(t * 1.1 + pos.z * 0.28) + 0.8);
          // cursor ripple
          float md = distance(pos.xz, uMouse);
          float ripple = exp(-md * md * 0.018);
          y += ripple * 2.4 * sin(t * 2.6 - md * 0.9);
          pos.y = y * (0.85 + aRand * 0.3) - 2.4;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float size = (1.0 + aRand * 1.4) * (1.0 + channel * 0.7 + ripple * 1.1);
          gl_PointSize = size * (95.0 / -mv.z);
          vColor = aColor;
          float fogFade  = smoothstep(-95.0, -30.0, mv.z);          // fade far rows
          float nearFade = 1.0 - smoothstep(-26.0, -14.0, mv.z);    // recede near camera
          vAlpha = (0.17 + channel * 0.34 + ripple * 0.30) * fogFade * nearFade * uBoost;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.12, d) * vAlpha;
          if (a < 0.012) discard;
          gl_FragColor = vec4(vColor, a);
        }`
    });
    scene.add(new THREE.Points(geo, mat));

    NS.setSceneDark = (isDark) => {
      paintColors(isDark ? 'dark' : 'light');
      geo.attributes.aColor.needsUpdate = true;
      uniforms.uBoost.value = isDark ? 1.35 : 1.0;
      if (degraded || reduceMotion) frame();   // repaint the still frame
    };

    // Cursor -> world position on the water plane (y = 0)
    const targetMouse = new THREE.Vector2(999, 999);
    const ndc = new THREE.Vector3();
    window.addEventListener('pointermove', (e) => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
      ndc.unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      if (Math.abs(dir.y) > 1e-4) {
        const t = -camera.position.y / dir.y;
        if (t > 0) targetMouse.set(camera.position.x + dir.x * t, camera.position.z + dir.z * t);
      }
    }, {passive:true});
    window.addEventListener('pointerleave', () => targetMouse.set(999, 999));

    // Gentle scroll parallax + fade the scene out as content takes over
    let scrollY = 0;
    const fadeCanvas = () => {
      const vh = window.innerHeight;
      const base = window.innerWidth < 640 ? 0.72 : 1;   // calmer field on narrow screens
      const f = 1 - Math.min(Math.max((scrollY - vh * 1.1) / (vh * 1.1), 0), 1) * 0.75;
      canvas.style.opacity = (f * base).toFixed(3);
    };
    window.addEventListener('scroll', () => { scrollY = window.scrollY; fadeCanvas(); }, {passive:true});
    fadeCanvas();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    let running = true, degraded = false;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running && !reduceMotion && !degraded) loop(); });

    function frame(){
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(targetMouse, 0.06);
      const p = Math.min(scrollY / 900, 1);
      camera.position.y = 13 + p * 4.5;
      camera.position.z = 30 - p * 3;
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
    }
    // FPS watchdog: if the device can't hold ~24fps, settle into a still frame
    let frames = 0, watchStart = 0;
    function loop(){
      if (!running || reduceMotion || degraded) return;
      // Skip work once the scene has faded behind the content
      if (scrollY < window.innerHeight * 2.3) {
        frame();
        if (watchStart === 0) watchStart = performance.now();
        else if (++frames === 72) {
          const fps = frames / ((performance.now() - watchStart) / 1000);
          if (fps < 24) { degraded = true; return; }
        }
      }
      requestAnimationFrame(loop);
    }
    if (reduceMotion) { uniforms.uTime.value = 2.0; frame(); } else loop();
  })();

  /* ============ Dynamic Island ============ */
  const island = document.getElementById('island');
  const core = document.getElementById('islandCore');

  /* Attention hint: label swaps to "click here" once on load */
  setTimeout(function(){
    var lb = document.getElementById('islandLabel');
    if (!lb) return;
    var orig = lb.textContent;
    var hint = (document.documentElement.lang === 'ar') ? 'اضغط هنا' : 'Tap here';
    function swapTo(txt, cb){
      lb.classList.add('swap-out');
      setTimeout(function(){
        lb.textContent = txt;
        lb.classList.remove('swap-out');
        lb.classList.add('swap-prep');
        requestAnimationFrame(function(){ requestAnimationFrame(function(){
          lb.classList.remove('swap-prep');
          if (cb) setTimeout(cb, 1200);
        }); });
      }, 330);
    }
    swapTo(hint, function(){ swapTo(orig, null); });
  }, 900);
  const label = document.getElementById('islandLabel');
  const dot = document.getElementById('islandDot');
  let menuOpen = false, notifyTimer = null, labelTimer = null;

  function setLabel(text){
    if (label.textContent === text) return;
    label.classList.add('swap');
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => { label.textContent = text; label.classList.remove('swap'); }, 180);
  }
  function setMenu(open){
    menuOpen = open;
    island.classList.toggle('open', open);
    island.classList.remove('notify');
    core.setAttribute('aria-expanded', String(open));
    setLabel(open ? t('menu_label') : t('brand'));
    haptic(10);
  }
  core.addEventListener('click', () => setMenu(!menuOpen));
  document.addEventListener('click', (e) => { if (menuOpen && !island.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) setMenu(false); });
  island.querySelectorAll('.island-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  function notify(text, ms = 2000){
    if (menuOpen) return;
    island.classList.add('notify');
    setLabel(text);
    clearTimeout(notifyTimer);
    notifyTimer = setTimeout(() => { island.classList.remove('notify'); setLabel(t('brand')); }, ms);
  }

  // Announce the section being viewed
  let currentSection = '';
  const sio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const key = e.target.dataset.island;
      if (key && key !== currentSection) { currentSection = key; notify(t(key)); }
    });
  }, {rootMargin:'-35% 0px -55% 0px'});
  document.querySelectorAll('[data-island]').forEach(s => sio.observe(s));

  /* ============ Scroll reveal ============ */
  const rio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal:not(.in)').forEach(el => rio.observe(el));

  /* ============ Animated counters ============ */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, dur = 1400, t0 = performance.now();
      const tick = (tm) => {
        const p = Math.min((tm - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, {threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ============ Contact form — opens WhatsApp with the composed request (or shows success) ============ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = ev.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (waReady()) {
      const g = (id) => (document.getElementById(id) || {}).value || '';
      const topicSel = document.getElementById('f-topic');
      const topic = topicSel ? topicSel.options[topicSel.selectedIndex].text : '';
      const lines = [t('wa_msg'), t('f_name_l') + ': ' + g('f-name'), t('f_company_l') + ': ' + g('f-company'), t('f_topic_l') + ': ' + topic, t('f_msg_l') + ': ' + g('f-msg'), t('f_email_l') + ': ' + g('f-email')];
      trackLead('contact_form', topic);
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    }
    document.getElementById('formSuccess').classList.add('show');
    haptic(20);
    notify(t('island_sent'), 2600);
    window.setTimeout(() => { window.location.href = 'thank-you.html'; }, 350);
  });

  /* ============ Wave reveal (service sections) ============ */
  (function(){
    const SPEED = 130;
    document.querySelectorAll('[data-wavegroup]').forEach(root => {
      const anim = root.dataset.anim || 'wv';
      const items = Array.from(root.querySelectorAll('[data-wave]'));
      if (reduceMotion) return;
      items.forEach(el => { el.style.opacity = '0'; });
      const reveal = (el, i) => {
        if (el.dataset.revealed) return;
        el.dataset.revealed = '1';
        el.style.opacity = '';
        el.style.animation = anim + ' .78s cubic-bezier(.18,.85,.24,1) ' + (i * SPEED) + 'ms both';
      };
      if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            reveal(e.target, items.indexOf(e.target));
            io.unobserve(e.target);
          });
        }, {threshold: 0, rootMargin: '300px 0px'});
        items.forEach(el => io.observe(el));
      }
      setTimeout(() => items.forEach((el, i) => reveal(el, i)), 4000);
    });
  })();

  /* ============ Store journey slider (drag to browse) ============ */
  (function(){
    const el = document.getElementById('storeSlider');
    if (!el) return;
    let down = false, startX = 0, startL = 0;
    el.addEventListener('pointerdown', (e) => {
      down = true; startX = e.clientX; startL = el.scrollLeft;
      el.classList.add('dragging');
      try { el.setPointerCapture(e.pointerId); } catch(err) {}
    });
    el.addEventListener('pointermove', (e) => {
      if (!down) return;
      el.scrollLeft = startL - (e.clientX - startX);
    });
    const up = () => { down = false; el.classList.remove('dragging'); };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', (e) => { if (Math.abs(el.scrollLeft - startL) > 5) e.preventDefault(); }, true);
    const dots = document.querySelectorAll('#storeDots i');
    el.addEventListener('scroll', () => {
      const idx = Math.min(dots.length - 1, Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    }, {passive: true});
  })();

  /* ============ Boot ============ */

  /* ---- rotating campaign hero ---- */
  (function(){
    var hero=document.getElementById('top'); if(!hero) return;
    var slides=[].slice.call(hero.querySelectorAll('.hslide'));
    var rows=[].slice.call(hero.querySelectorAll('.hrow'));
    var dots=[].slice.call(hero.querySelectorAll('.hc-dot'));
    var N=slides.length, cur=0, timer=null, paused=false;
    var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function load(i){var slide=slides[i],art=slide&&slide.querySelector('[data-hero-scene]'); if(!slide||!art||art.dataset.mounted==='1'||!window.NilesoftHero)return; window.NilesoftHero.mount({target:art,scene:parseInt(art.dataset.heroScene,10),theme:'light',accent:'#C06B3E',speed:1}); art.dataset.mounted='1';}
    function show(i){ i=((i%N)+N)%N; load(i); load((i+1)%N);
      slides[cur].classList.remove('is-active'); rows[cur].classList.remove('is-active'); dots[cur].classList.remove('is-active');
      cur=i;
      slides[i].classList.add('is-active'); rows[i].classList.add('is-active'); dots[i].classList.add('is-active');
    }
    function next(){show(cur+1);} function prev(){show(cur-1);}
    function stop(){ if(timer){clearInterval(timer);timer=null;} }
    function start(){ stop(); if(RM) return; timer=setInterval(function(){ if(!paused) next(); },5000); }
    dots.forEach(function(d,i){ d.addEventListener('click',function(){ show(i); start(); }); });
    var nx=hero.querySelector('.hc-next'), pv=hero.querySelector('.hc-prev');
    if(nx) nx.addEventListener('click',function(){ next(); start(); });
    if(pv) pv.addEventListener('click',function(){ prev(); start(); });
    var cp=hero.querySelector('.hero-copy');
    if(cp){ cp.addEventListener('pointerenter',function(){ paused=true; }); cp.addEventListener('pointerleave',function(){ paused=false; }); }
    hero.addEventListener('focusin',function(){ paused=true; });
    hero.addEventListener('focusout',function(){ paused=false; });
    document.addEventListener('visibilitychange',function(){ paused=document.hidden; });
    var sx=null;
    hero.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; },{passive:true});
    hero.addEventListener('touchend',function(e){ if(sx==null) return; var dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>44){ (dx<0)?next():prev(); start(); } sx=null; },{passive:true});
    var map={web:0,store:1,shop:1,app:2,auto:3,automation:3,system:4,systems:4,mvp:5,brand:6,presence:7,race:7,trust:8};
    function fromHash(){ var h=(location.hash||'').replace('#','').toLowerCase(); if(map.hasOwnProperty(h)){ show(map[h]); return true; } var m=h.match(/^h([1-9])$/); if(m){ show((+m[1])-1); return true; } return false; }
    load(0); load(1); fromHash(); window.addEventListener('hashchange',fromHash);
    start();
  })();

  applyLang(lang);
})();
