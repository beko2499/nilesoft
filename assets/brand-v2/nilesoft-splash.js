/*!
 * Nilesoft Splash — animated logo splash screen (vanilla JS, zero deps).
 *
 * Usage:
 *   <script src="nilesoft-splash.js"></script>
 *   const splash = NilesoftSplash.mount({
 *     theme: 'dark' | 'light',     // default 'dark'
 *     accent: '#C06B3E',           // guide/cursor color
 *     speed: 1,                    // 0.5 = slower … 2 = faster
 *     wordmark: true,              // show NILESOFT under the mark
 *     autoHideMs: 0,               // >0 = hide automatically after N ms
 *     zIndex: 9999,
 *     loadFont: true,              // auto-inject Chakra Petch <link>
 *     onHidden: () => {}
 *   });
 *   splash.hide();                 // diagonal wipe out, returns a Promise
 *   NilesoftSplash.hide();         // same, for the current instance
 *
 * Also fires: document → CustomEvent 'nilesoft-splash:hidden'.
 * Responsive by design (clamp/vmin sizing), honors prefers-reduced-motion.
 */
(function () {
  'use strict';
  var THEMES = {
    dark: { bg: '#0C0C0B', ink: '#F5F5F1' },
    light: { bg: '#FAFAF8', ink: '#141413' }
  };
  var CSS = [
    '.ns-splash{position:fixed;inset:0;z-index:var(--ns-z,9999);display:grid;place-items:center;background:var(--ns-bg);',
    'clip-path:polygon(calc(0% - 200vh) 0%,calc(100% + 300vh) 0%,calc(100% + 300vh) 100%,calc(0% - 110vh) 100%);',
    'transition:clip-path calc(var(--ns-s,1)*.85s) cubic-bezier(.76,0,.24,1);}',
    '.ns-splash.ns-hide{clip-path:polygon(calc(100% + 10vh) 0%,calc(100% + 300vh) 0%,calc(100% + 300vh) 100%,calc(100% + 100vh) 100%);}',
    '.ns-splash .ns-center{display:grid;justify-items:center;transition:transform calc(var(--ns-s,1)*.85s) cubic-bezier(.76,0,.24,1);}',
    '.ns-splash.ns-hide .ns-center{transform:scale(1.05);}',
    '.ns-mark{width:clamp(170px,30vmin,320px);height:auto;overflow:visible;display:block;',
    'animation:nsSnap calc(var(--ns-s,1)*.5s) ease-in-out both;animation-delay:calc(var(--ns-s,1)*1.75s);}',
    '.ns-px{fill:var(--ns-ink);transform-box:fill-box;transform-origin:center;',
    'animation:nsPop calc(var(--ns-s,1)*.5s) cubic-bezier(.34,1.56,.64,1) both,nsBlink calc(var(--ns-s,1)*1.8s) ease-in-out infinite;}',
    '.ns-px-tr{animation-delay:calc(var(--ns-s,1)*.12s),calc(var(--ns-s,1)*2.6s);}',
    '.ns-px-bl{animation:nsPop calc(var(--ns-s,1)*.5s) cubic-bezier(.34,1.56,.64,1) both,nsBlink calc(var(--ns-s,1)*1.8s) ease-in-out infinite,nsToAccent calc(var(--ns-s,1)*.45s) ease both;',
    'animation-delay:calc(var(--ns-s,1)*.32s),calc(var(--ns-s,1)*3.5s),calc(var(--ns-s,1)*1.9s);}',
    '.ns-slash{fill:var(--ns-ink);}',
    '.ns-reveal{height:0;animation:nsDraw calc(var(--ns-s,1)*.8s) cubic-bezier(.76,0,.24,1) both;animation-delay:calc(var(--ns-s,1)*.5s);}',
    '.ns-stem{fill:var(--ns-ink);opacity:0;animation:nsSlide calc(var(--ns-s,1)*.55s) cubic-bezier(.22,1,.36,1) both;}',
    '.ns-stem-mid{animation-delay:calc(var(--ns-s,1)*1.2s);}',
    '.ns-stem-tail{animation-delay:calc(var(--ns-s,1)*1.38s);}',
    '.ns-cursor{fill:var(--ns-accent);opacity:0;animation:nsCursor calc(var(--ns-s,1)*.8s) cubic-bezier(.76,0,.24,1) both;animation-delay:calc(var(--ns-s,1)*.5s);}',
    '.ns-word{font:600 clamp(20px,3.4vmin,34px)/1.2 "Chakra Petch",ui-sans-serif,system-ui,sans-serif;color:var(--ns-ink);',
    'letter-spacing:.42em;padding-left:.42em;margin-top:clamp(26px,5vmin,50px);white-space:nowrap;}',
    '.ns-l{display:inline-block;opacity:0;transform:translateX(calc(var(--lx)*1px));',
    'animation:nsLetter calc(var(--ns-s,1)*.5s) cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--ns-s,1)*(1.5s + var(--i)*.06s));}',
    '.ns-rule{width:0;height:3px;background:var(--ns-accent);margin-top:clamp(16px,2.6vmin,24px);',
    'animation:nsRule calc(var(--ns-s,1)*.5s) cubic-bezier(.76,0,.24,1) both;animation-delay:calc(var(--ns-s,1)*2.05s);}',
    '@keyframes nsPop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1);opacity:1}}',
    '@keyframes nsBlink{0%,100%{opacity:1}50%{opacity:.45}}',
    '@keyframes nsDraw{to{height:172px}}',
    '@keyframes nsSlide{from{opacity:0;transform:translate(-31px,-34px)}to{opacity:1;transform:none}}',
    '@keyframes nsSnap{0%{transform:scale(1)}40%{transform:scale(1.028)}100%{transform:scale(1)}}',
    '@keyframes nsCursor{0%{opacity:0;x:22px;y:-8px}8%{opacity:1}92%{opacity:1}100%{opacity:0;x:166px;y:152px}}',
    '@keyframes nsToAccent{to{fill:var(--ns-accent)}}',
    '@keyframes nsRule{to{width:clamp(44px,7vmin,64px)}}',
    '@keyframes nsLetter{to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.ns-splash *{animation-duration:.01s!important;animation-delay:0s!important}}'
  ].join('\n');

  var uid = 0, current = null;

  function ensureStyle() {
    if (document.getElementById('ns-splash-style')) return;
    var s = document.createElement('style');
    s.id = 'ns-splash-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  function ensureFont() {
    if (document.getElementById('ns-splash-font')) return;
    if (document.fonts && [].some.call(document.fonts, function (f) { return f.family.indexOf('Chakra Petch') > -1; })) return;
    var l = document.createElement('link');
    l.id = 'ns-splash-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&display=swap';
    document.head.appendChild(l);
  }
  function markSVG(id) {
    return '<svg class="ns-mark" viewBox="-8 -8 268 176" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><rect class="ns-reveal" x="-6" y="-6" width="264" height="0"/></clipPath></defs>' +
      '<rect class="ns-px ns-px-tr" x="188" y="0" width="36" height="36"/>' +
      '<rect class="ns-px ns-px-bl" x="0" y="124" width="36" height="36"/>' +
      '<g clip-path="url(#' + id + ')"><polygon class="ns-slash" points="0,0 58,0 202,160 144,160"/></g>' +
      '<rect class="ns-cursor" x="22" y="-8" width="16" height="16"/>' +
      '<polygon class="ns-stem ns-stem-mid" points="170,70 228,70 252,96.7 252,126 220.4,126"/>' +
      '<polygon class="ns-stem ns-stem-tail" points="214,134 244,134 252,142.9 252,160 237.4,160"/>' +
      '</svg>';
  }
  function wordHTML() {
    var out = '';
    var word = 'NILESOFT';
    for (var i = 0; i < word.length; i++) {
      out += '<span class="ns-l" style="--i:' + i + ';--lx:' + ((i - 3.5) * 10).toFixed(1) + '">' + word[i] + '</span>';
    }
    return '<div class="ns-word" dir="ltr" aria-label="NILESOFT">' + out + '</div>';
  }

  function mount(opts) {
    opts = opts || {};
    var theme = THEMES[opts.theme] || THEMES.dark;
    ensureStyle();
    if (opts.loadFont !== false) ensureFont();
    if (current) current.destroy();

    var el = document.createElement('div');
    el.className = 'ns-splash';
    el.setAttribute('role', 'status');
    el.style.setProperty('--ns-bg', opts.bg || theme.bg);
    el.style.setProperty('--ns-ink', opts.ink || theme.ink);
    el.style.setProperty('--ns-accent', opts.accent || '#C06B3E');
    el.style.setProperty('--ns-s', String(1 / (opts.speed || 1)));
    el.style.setProperty('--ns-z', String(opts.zIndex || 9999));
    el.innerHTML = '<div class="ns-center">' + markSVG('ns-clip-' + (++uid)) +
      (opts.wordmark === false ? '' : wordHTML()) + '<div class="ns-rule"></div></div>';
    (opts.target || document.body).appendChild(el);

    var hidden = false, timer = null;
    var inst = {
      el: el,
      hide: function () {
        if (hidden) return Promise.resolve();
        hidden = true;
        if (timer) clearTimeout(timer);
        el.classList.add('ns-hide');
        return new Promise(function (res) {
          setTimeout(function () {
            inst.destroy();
            if (typeof opts.onHidden === 'function') opts.onHidden();
            document.dispatchEvent(new CustomEvent('nilesoft-splash:hidden'));
            res();
          }, 900 / (opts.speed || 1));
        });
      },
      destroy: function () {
        if (timer) clearTimeout(timer);
        if (el.parentNode) el.parentNode.removeChild(el);
        if (current === inst) current = null;
      }
    };
    if (opts.autoHideMs > 0) timer = setTimeout(inst.hide, opts.autoHideMs);
    current = inst;
    return inst;
  }

  window.NilesoftSplash = {
    mount: mount,
    hide: function () { return current ? current.hide() : Promise.resolve(); },
    get current() { return current; }
  };
})();
