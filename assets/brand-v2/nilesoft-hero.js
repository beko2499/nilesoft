/*!
 * Nilesoft Hero Scenes — 9 animated geometric 2D illustrations (vanilla JS + SVG/CSS).
 *
 * Usage:
 *   <script src="nilesoft-hero.js"></script>
 *   const hero = NilesoftHero.mount({ target, scene: 1..9, theme: 'light'|'dark', accent: '#C06B3E', speed: 1 });
 *   hero.setScene(4); hero.update({theme:'dark'}); hero.destroy();
 * Responsive (SVG viewBox 1200×640), honors prefers-reduced-motion.
 */
(function () {
  'use strict';
  var CSS = [
    '.nsh-svg{display:block;width:100%;height:auto;overflow:hidden;}',
    '.nsh-svg [style*="animation"]{transform-box:fill-box;transform-origin:center;}',
    '@keyframes nshPop{0%{opacity:0;transform:scale(.3)}70%{opacity:1;transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}',
    '@keyframes nshRise{0%{opacity:0;transform:translateY(26px)}100%{opacity:1;transform:none}}',
    '@keyframes nshTravel{0%{transform:translate(var(--fx,0px),var(--fy,0px)) rotate(var(--fr,0deg))}100%{transform:translate(var(--tx,0px),var(--ty,0px)) rotate(var(--tr,0deg))}}',
    '@keyframes nshTravelFade{0%{transform:translate(var(--fx,0px),var(--fy,0px)) rotate(var(--fr,0deg));opacity:0}12%{opacity:1}86%{opacity:1}100%{transform:translate(var(--tx,0px),var(--ty,0px)) rotate(var(--tr,0deg));opacity:0}}',
    '@keyframes nshBob{0%,100%{transform:translateY(0)}50%{transform:translateY(var(--by,-8px))}}',
    '@keyframes nshSway{0%,100%{transform:rotate(var(--sa,-2deg))}50%{transform:rotate(var(--sb,2deg))}}',
    '@keyframes nshPulse{0%,100%{opacity:1}50%{opacity:var(--po,.45)}}',
    '@keyframes nshRing{0%{transform:scale(.35);opacity:.9}100%{transform:scale(2.1);opacity:0}}',
    '@keyframes nshSpin{to{transform:rotate(360deg)}}',
    '@keyframes nshGrowY{0%{transform:scaleY(0)}100%{transform:scaleY(1)}}',
    '@keyframes nshFillX{0%{transform:scaleX(0)}55%{transform:scaleX(1)}100%{transform:scaleX(1)}}',
    '@keyframes nshShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(3px)}}',
    '@keyframes nshStep{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-3px) rotate(-1.5deg)}75%{transform:translateY(-3px) rotate(1.5deg)}}',
    '@keyframes nshRevealW{0%{width:0}100%{width:var(--rw,840px)}}',
    '@media (prefers-reduced-motion:reduce){.nsh-svg *{animation-duration:.01s!important;animation-delay:0s!important;animation-iteration-count:1!important}}'
  ].join('\n');

  var THEMES = {
    light: { ink: '#141413', sub: '#8A8A84', mist: '#DEDED8', ivory: '#FAFAF8', line: 'rgba(20,20,19,0.14)', shadow: 'rgba(20,20,19,0.10)', deep: '#141413', knock: '#FAFAF8' },
    dark: { ink: '#F5F5F1', sub: '#8A8A84', mist: '#3A3A36', ivory: '#F5F5F1', line: 'rgba(245,245,241,0.16)', shadow: 'rgba(0,0,0,0.35)', deep: '#141413', knock: '#0C0C0B' }
  };

  function ensureStyle() {
    if (document.getElementById('nsh-style')) return;
    var s = document.createElement('style');
    s.id = 'nsh-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---- helpers -------------------------------------------------------------
  function mk(k) {
    function A(name, dur, o) {
      o = o || {};
      return 'animation:' + name + ' ' + (dur / k).toFixed(2) + 's ' + (o.ease || 'ease-in-out') + ' ' +
        ((o.delay || 0) / k).toFixed(2) + 's ' + (o.iter || 'infinite') + ' ' + (o.dir || 'normal') + ' both;';
    }
    function V(v) { var out = ''; for (var key in v) out += '--' + key + ':' + v[key] + ';'; return out; }
    return { A: A, V: V };
  }
  function rect(x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function poly(pts, fill, extra) { return '<polygon points="' + pts + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function circ(cx, cy, r, fill, extra) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" ' + (extra || '') + '/>'; }
  function lineEl(x1, y1, x2, y2, stroke, w, extra) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + stroke + '" stroke-width="' + w + '" ' + (extra || '') + '/>'; }
  function g(style, inner, extra) { return '<g ' + (extra || '') + (style ? ' style="' + style + '"' : '') + '>' + inner + '</g>'; }
  // A proper little person: head, neck, torso with shoulders, two legs. Anchored at the feet (0,0).
  function figure(x, y, s, fill) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">' +
      '<circle cx="0" cy="-80" r="13" fill="' + fill + '"/>' +
      '<rect x="-16" y="-64" width="32" height="42" rx="10" fill="' + fill + '"/>' +
      '<rect x="-12" y="-23" width="9" height="23" rx="3" fill="' + fill + '"/>' +
      '<rect x="3" y="-23" width="9" height="23" rx="3" fill="' + fill + '"/></g>';
  }
  function shadow(cx, cy, w, col) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + w / 2 + '" ry="7" fill="' + col + '"/>'; }

  // ---- scenes ---------------------------------------------------------------
  // 1 — digital presence: a modest structure becomes a confident landmark; a copper path brings customers.
  function s1(c, a, ac) {
    var m = '';
    m += lineEl(60, 542, 1140, 542, c.line, 3);
    // faded skyline
    m += rect(70, 380, 120, 162, 'none', 'stroke="' + c.line + '" stroke-width="3"');
    m += rect(120, 330, 90, 60, 'none', 'stroke="' + c.line + '" stroke-width="3"');
    // unfinished blocks (left, dim)
    m += g(a.A('nshPulse', 6) + a.V({ po: 0.55 }),
      rect(210, 452, 84, 90, 'none', 'stroke="' + c.mist + '" stroke-width="4"') +
      rect(310, 484, 58, 58, c.mist) +
      rect(238, 402, 46, 46, 'none', 'stroke="' + c.mist + '" stroke-width="4" transform="rotate(-7 261 425)"'));
    // landmark storefront
    m += shadow(846, 546, 330, c.shadow);
    m += g(a.A('nshRise', 0.7, { iter: 1, delay: 0.15 }),
      rect(700, 330, 292, 212, c.ivory, 'stroke="' + c.ink + '" stroke-width="5"') +
      rect(700, 522, 292, 20, c.sub) + // plinth
      rect(686, 300, 320, 14, c.ink)); // fascia
    for (var i = 0; i < 5; i++) { // awning
      m += g(a.A('nshPop', 0.5, { iter: 1, delay: 0.6 + i * 0.11, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        poly((700 + i * 58.4) + ',314 ' + (758.4 + i * 58.4) + ',314 ' + (748.4 + i * 58.4) + ',350 ' + (690 + i * 58.4) + ',350', i % 2 ? ac : c.deep));
    }
    m += g(a.A('nshPop', 0.5, { iter: 1, delay: 1.15, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(864, 424, 74, 98, c.deep) + circ(878, 474, 4, c.sub)); // door + handle
    m += g(a.A('nshPop', 0.5, { iter: 1, delay: 1.3, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(730, 400, 104, 84, c.mist) + lineEl(782, 400, 782, 484, c.ivory, 5) + // display window
      rect(744, 448, 28, 36, c.deep) + rect(786, 460, 24, 24, ac)); // products
    m += g(a.A('nshPop', 0.5, { iter: 1, delay: 1.45, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(920, 348, 34, 34, ac)); // sign
    // copper path
    m += g(a.A('nshFillX', 1.4, { iter: 1, delay: 1.4 }) + 'transform-origin:0% 50%;',
      poly('130,590 830,548 830,558 130,602', ac));
    // customers walking the path
    for (var j = 0; j < 3; j++) {
      m += g(a.A('nshTravelFade', 6.5, { delay: 1.9 + j * 2.1, ease: 'linear' }) + a.V({ fx: '0px', fy: '0px', tx: '660px', ty: '-42px' }),
        g(a.A('nshStep', 0.6, { delay: j * 0.2 }), figure(160, 592, 0.85, c.ink)));
    }
    return m;
  }

  // 2 — the app in every pocket: a walking customer, phone in hand, services tethered to it.
  function s2(c, a, ac) {
    var m = '';
    m += lineEl(120, 574, 1080, 574, c.line, 3);
    m += shadow(430, 578, 150, c.shadow);
    // customer glides + steps
    m += g(a.A('nshTravel', 8, { dir: 'alternate' }) + a.V({ fx: '-26px', tx: '26px' }),
      g(a.A('nshStep', 0.7), figure(430, 574, 2.3, c.ink)) +
      // arm + phone in hand
      g(a.A('nshSway', 3) + a.V({ sa: '-2deg', sb: '2deg' }),
        rect(455, 466, 44, 14, c.ink, 'rx="7"') +
        rect(486, 428, 54, 92, c.ivory, 'rx="9" stroke="' + ac + '" stroke-width="4.5"') +
        rect(500, 448, 26, 5, c.deep) + rect(500, 462, 26, 5, c.mist) + rect(500, 476, 18, 5, c.mist) +
        circ(513, 504, 5, c.deep)));
    // dashed tethers
    m += lineEl(536, 452, 726, 330, c.line, 2.5, 'stroke-dasharray="8 8"');
    m += lineEl(540, 472, 812, 498, c.line, 2.5, 'stroke-dasharray="8 8"');
    m += lineEl(532, 492, 722, 596, c.line, 2.5, 'stroke-dasharray="8 8"');
    // notification
    m += g(a.A('nshBob', 2.2) + a.V({ by: '-10px' }),
      rect(700, 304, 52, 52, ac, 'rx="12"') + circ(744, 310, 8, c.ink) +
      g(a.A('nshRing', 2.2, { ease: 'ease-out' }), rect(700, 304, 52, 52, 'none', 'rx="12" stroke="' + ac + '" stroke-width="4"')));
    // parcel with tape + flap
    m += g(a.A('nshBob', 2.8, { delay: 0.4 }) + a.V({ by: '-12px' }),
      rect(812, 470, 64, 56, c.ivory, 'stroke="' + c.deep + '" stroke-width="4"') +
      rect(840, 470, 9, 56, c.sub) + lineEl(812, 486, 876, 486, c.sub, 3));
    // loyalty token
    m += g(a.A('nshBob', 2.5, { delay: 0.8 }) + a.V({ by: '-9px' }),
      circ(722, 600, 28, c.ink) + circ(722, 600, 28, 'none', 'stroke="' + c.line + '" stroke-width="3"') +
      rect(712, 590, 20, 20, ac));
    return m;
  }

  // 3 — automation: loose paperwork enters the machine, sealed parcels come out; the clock keeps turning.
  function s3(c, a, ac) {
    var m = '';
    m += lineEl(80, 540, 1120, 540, c.line, 3);
    // worker + tidy pile
    m += shadow(166, 544, 90, c.shadow);
    m += g(a.A('nshBob', 1.8) + a.V({ by: '-4px' }), figure(166, 540, 1.2, c.ink));
    m += rect(216, 530, 76, 11, c.mist) + rect(224, 514, 76, 11, c.mist, 'transform="rotate(-4 262 519)"') + rect(218, 498, 76, 11, c.mist, 'transform="rotate(3 256 503)"');
    // machine: chassis, legs, intake, chute, lights
    m += shadow(620, 544, 260, c.shadow);
    m += rect(530, 500, 16, 40, c.sub) + rect(694, 500, 16, 40, c.sub);
    m += rect(500, 300, 240, 202, c.ivory, 'stroke="' + c.ink + '" stroke-width="5"');
    m += poly('452,352 500,332 500,392 452,412', c.sub); // intake hopper
    m += poly('740,428 796,444 796,484 740,468', c.sub); // output chute
    m += rect(500, 300, 240, 30, c.deep); // header
    for (var L = 0; L < 3; L++) m += g(L === 2 ? a.A('nshPulse', 1.2) + a.V({ po: 0.25 }) : '', rect(514 + L * 24, 308, 14, 14, L === 2 ? ac : c.mist));
    m += g(a.A('nshPulse', 1.6) + a.V({ po: 0.6 }), poly('500,502 540,502 740,362 740,330 700,330 500,470', ac)); // conveyor band
    m += rect(560, 380, 52, 52, c.deep) + rect(628, 380, 52, 52, c.deep) + rect(594, 444, 52, 42, c.deep); // modules
    // papers flying in (with folded corner + text lines)
    for (var i = 0; i < 3; i++) {
      m += g(a.A('nshTravelFade', 3.3, { delay: i * 1.1, ease: 'ease-in' }) +
        a.V({ fx: '0px', fy: '0px', fr: '-9deg', tx: '190px', ty: '46px', tr: '4deg' }),
        poly('280,330 324,330 336,342 336,374 280,374', c.ivory) +
        '<polygon points="280,330 324,330 336,342 336,374 280,374" fill="none" stroke="' + c.deep + '" stroke-width="3"/>' +
        lineEl(288, 344, 322, 344, c.sub, 3) + lineEl(288, 354, 314, 354, c.sub, 3) + lineEl(288, 364, 326, 364, c.sub, 3));
    }
    // sealed parcels out
    for (var jj = 0; jj < 3; jj++) {
      m += g(a.A('nshTravelFade', 3.3, { delay: 0.9 + jj * 1.1, ease: 'ease-out' }) +
        a.V({ fx: '-36px', tx: [130, 208, 286][jj] + 'px' }),
        rect(806, 478, 58, 58, c.ink) + rect(831, 478, 9, 58, c.knock) + lineEl(806, 496, 864, 496, c.knock, 3));
    }
    // clock with ticks + two hands
    m += circ(1010, 190, 66, 'none', 'stroke="' + c.ink + '" stroke-width="5"');
    m += rect(1007, 128, 6, 12, c.ink) + rect(1007, 240, 6, 12, c.ink) + rect(948, 187, 12, 6, c.ink) + rect(1060, 187, 12, 6, c.ink);
    m += g(a.A('nshSpin', 8, { ease: 'linear' }) + 'transform-origin:1010px 190px;transform-box:view-box;', rect(1007, 142, 6, 52, ac));
    m += g(a.A('nshSpin', 48, { ease: 'linear' }) + 'transform-origin:1010px 190px;transform-box:view-box;', rect(1006, 156, 8, 38, c.ink));
    m += circ(1010, 190, 7, c.ink);
    return m;
  }

  // 4 — chaos → system: scattered speech bubbles funnel into four labelled trays.
  function s4(c, a, ac) {
    var m = '';
    // hopper with rim
    m += poly('392,128 424,128 606,306 588,324', c.ink);
    m += poly('776,128 808,128 612,324 594,306', c.ink);
    m += rect(376, 112, 64, 16, c.ink) + rect(760, 112, 64, 16, c.ink);
    // chat bubbles with tails
    var msgs = [[276, 46, -10], [508, 8, 5], [688, 42, -5], [842, 22, 9], [416, 0, 3]];
    for (var i = 0; i < msgs.length; i++) {
      var mm = msgs[i], bx = mm[0], by = mm[1];
      m += g(a.A('nshTravelFade', 3.6, { delay: i * 0.72, ease: 'ease-in' }) +
        a.V({ fr: mm[2] + 'deg', tx: (565 - bx) + 'px', ty: (290 - by) + 'px', tr: '0deg' }),
        rect(bx, by, 74, 46, c.ivory, 'rx="12" stroke="' + c.deep + '" stroke-width="3.5"') +
        poly(bx + 14 + ',' + (by + 44) + ' ' + (bx + 30) + ',' + (by + 44) + ' ' + (bx + 16) + ',' + (by + 58), c.ivory) +
        lineEl(bx + 14, by + 17, bx + 58, by + 17, c.sub, 4) + lineEl(bx + 14, by + 30, bx + (i % 2 ? 44 : 52), by + 30, c.sub, 4));
    }
    // copper unit through the gate
    m += g(a.A('nshTravelFade', 3.6, { delay: 1.4 }) + a.V({ ty: '196px' }), rect(590, 246, 20, 20, ac));
    // trays: open boxes, front face lighter, slot label
    for (var t = 0; t < 4; t++) {
      var tx = 322 + t * 150;
      m += shadow(tx + 62, 564, 120, c.shadow);
      m += rect(tx, 452, 124, 26, c.sub); // back rim
      m += rect(tx, 478, 124, 82, c.ivory, 'stroke="' + c.ink + '" stroke-width="4"');
      m += rect(tx + 16, 500, 92, 10, c.mist);
      m += g(a.A('nshPulse', 3.6, { delay: 2.2 + t * 0.9 }) + a.V({ po: 0.3 }),
        rect(tx + 44, 424, 36, 36, t === 1 ? ac : c.mist));
    }
    m += lineEl(300, 562, 920, 562, c.line, 3);
    return m;
  }

  // 5 — idea → MVP: a sketched sheet crosses a supported bridge and ships as a real product.
  function s5(c, a, ac) {
    var m = '';
    m += lineEl(100, 560, 1100, 560, c.line, 3);
    // sketch sheet: folded corner, wireframe
    m += g(a.A('nshSway', 4) + a.V({ sa: '-2deg', sb: '1deg' }),
      '<g transform="rotate(-4 250 400)">' +
      poly('170,296 306,296 330,320 330,504 170,504', 'none', 'stroke="' + c.sub + '" stroke-width="4" stroke-dasharray="12 9"') +
      poly('306,296 330,320 306,320', c.sub) +
      rect(192, 330, 96, 56, 'none', 'stroke="' + c.mist + '" stroke-width="4"') +
      circ(214, 424, 16, 'none', 'stroke="' + c.mist + '" stroke-width="4"') +
      lineEl(244, 414, 306, 414, c.mist, 5) + lineEl(244, 434, 292, 434, c.mist, 5) + lineEl(192, 470, 306, 470, c.mist, 5) +
      '</g>');
    // bridge blocks with posts
    for (var i = 0; i < 5; i++) {
      var bx = 420 + i * 84, by = 496 - i * 28;
      m += g(a.A('nshPop', 0.5, { iter: 1, delay: 0.3 + i * 0.16, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        rect(bx, by, 64, 64, i === 2 ? ac : c.ink) + rect(bx + 26, by + 64, 12, 560 - by - 64, c.mist));
    }
    // product tile with mark cut + base shadow
    m += shadow(972, 564, 200, c.shadow);
    m += g(a.A('nshPop', 0.7, { iter: 1, delay: 1.35, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(878, 268, 190, 190, c.ink, 'rx="36"') +
      poly('916,306 948,306 1034,418 1002,418', c.knock) +
      rect(1020, 306, 28, 28, c.knock) + rect(916, 398, 20, 20, ac));
    // progress with end tick
    m += rect(560, 596, 420, 8, c.mist);
    m += g(a.A('nshFillX', 4.5, { ease: 'cubic-bezier(.76,0,.24,1)' }) + 'transform-origin:0% 50%;', rect(560, 596, 420, 8, ac));
    m += rect(976, 588, 4, 24, c.sub);
    // settling pieces
    m += g(a.A('nshTravelFade', 3, { delay: 2, ease: 'ease-out' }) + a.V({ fy: '-70px', ty: '0px' }), rect(898, 236, 22, 22, c.mist));
    m += g(a.A('nshTravelFade', 3, { delay: 3.1, ease: 'ease-out' }) + a.V({ fy: '-90px', ty: '0px' }), rect(1044, 244, 16, 16, c.mist));
    return m;
  }

  // 6 — first impressions: two entrances; the visitor decides in one beat.
  function s6(c, a, ac) {
    var m = '';
    m += lineEl(80, 560, 1120, 560, c.line, 3);
    // weak entrance: thin, tilted sign, crack
    m += g(a.A('nshPulse', 5) + a.V({ po: 0.55 }),
      '<g transform="rotate(-1.6 335 452)">' +
      rect(252, 344, 166, 216, 'none', 'stroke="' + c.mist + '" stroke-width="4"') +
      rect(296, 446, 76, 114, c.mist) +
      rect(282, 316, 106, 22, 'none', 'stroke="' + c.mist + '" stroke-width="3.5" transform="rotate(-5 335 327)"') +
      '<polyline points="262,376 286,398 270,424 292,446" fill="none" stroke="' + c.mist + '" stroke-width="3"/>' +
      '</g>');
    // strong entrance: double frame, lamp, copper corner, mat
    m += shadow(852, 564, 260, c.shadow);
    m += rect(742, 288, 220, 272, c.ivory, 'stroke="' + c.ink + '" stroke-width="6"');
    m += rect(766, 314, 172, 246, 'none', 'stroke="' + c.ink + '" stroke-width="3"');
    m += rect(806, 420, 92, 140, c.deep) + circ(824, 492, 5, c.sub);
    m += poly('726,268 760,268 838,346 838,380', ac);
    m += g(a.A('nshPulse', 2.4) + a.V({ po: 0.4 }), rect(890, 320, 26, 26, ac));
    m += rect(778, 560, 148, 12, c.deep); // mat
    // the visitor: approach, pause, enter
    m += g(a.A('nshTravelFade', 6.5, { ease: 'cubic-bezier(.6,0,.3,1)' }) + a.V({ fx: '-90px', tx: '318px' }),
      g(a.A('nshStep', 0.65), figure(534, 560, 1.1, c.ink)));
    return m;
  }

  // 7 — the race: a sleek modern car pulls ahead; the boxy one rattles and falls back.
  function s7(c, a, ac) {
    var m = '';
    m += lineEl(60, 300, 1140, 300, c.line, 2); // horizon
    m += lineEl(60, 540, 1140, 540, c.ink, 4);  // road
    // dashed centre line scrolling
    for (var d = 0; d < 6; d++) {
      m += g(a.A('nshTravel', 2.4, { delay: d * 0.4, ease: 'linear' }) + a.V({ tx: '-1300px' }), rect(1240, 568, 64, 6, c.sub));
    }
    // roadside markers
    for (var i = 0; i < 4; i++) {
      m += g(a.A('nshTravel', 5, { delay: i * 1.25, ease: 'linear' }) + a.V({ tx: '-1300px' }),
        rect(1250, 486, 10, 54, i % 2 ? c.mist : c.sub) + rect(1244, 478, 22, 14, ac));
    }
    // speed lines behind the leader
    for (var s = 0; s < 3; s++) {
      m += g(a.A('nshTravelFade', 1.5, { delay: s * 0.5, ease: 'linear' }) + a.V({ fx: '170px', tx: '-330px' }),
        rect(520 + s * 30, 404 + s * 34, 110, 7, s === 1 ? ac : c.sub, 'transform="skewX(-30)"'));
    }
    // modern car (ahead): faceted low silhouette, window, stripe, spoiler
    m += g(a.A('nshTravel', 3.4, { dir: 'alternate' }) + a.V({ tx: '30px' }),
      shadow(790, 544, 280, c.shadow) +
      g(a.A('nshBob', 0.55) + a.V({ by: '-3px' }),
        poly('654,516 664,478 700,452 764,436 848,436 916,458 952,486 952,516', c.ivory) +
        '<polygon points="654,516 664,478 700,452 764,436 848,436 916,458 952,486 952,516" fill="none" stroke="' + c.ink + '" stroke-width="5"/>' +
        poly('712,452 762,442 844,442 872,458 712,458', c.deep) +
        lineEl(800, 442, 800, 516, c.ink, 3) +
        poly('648,470 668,470 664,484 652,484', c.deep) + // spoiler
        poly('660,496 950,496 950,486 668,488', ac) +
        circ(880, 500, 6, c.deep)) + // handle
      g(a.A('nshSpin', 0.8, { ease: 'linear' }) + 'transform-box:fill-box;', circ(716, 516, 26, c.ink) + circ(716, 516, 12, c.knock) + rect(713, 496, 6, 40, c.knock) + rect(696, 513, 40, 6, c.knock)) +
      g(a.A('nshSpin', 0.8, { ease: 'linear' }) + 'transform-box:fill-box;', circ(892, 516, 26, c.ink) + circ(892, 516, 12, c.knock) + rect(889, 496, 6, 40, c.knock) + rect(872, 513, 40, 6, c.knock)));
    // boxy old car (behind): stepped hood/roof, two panes, bumper, exhaust
    m += g(a.A('nshTravel', 3.4, { dir: 'alternate' }) + a.V({ tx: '-26px' }),
      shadow(255, 544, 230, c.shadow) +
      g(a.A('nshShake', 0.45),
        rect(150, 458, 210, 58, c.sub) +
        rect(184, 414, 118, 48, c.sub) +
        rect(192, 422, 44, 32, c.mist) + rect(246, 422, 44, 32, c.mist) +
        rect(142, 496, 20, 14, c.deep) + rect(348, 496, 18, 14, c.deep) +
        rect(160, 470, 190, 6, c.deep)) +
      circ(206, 516, 24, c.ink) + circ(206, 516, 10, c.knock) +
      circ(318, 516, 24, c.ink) + circ(318, 516, 10, c.knock));
    // exhaust puffs
    for (var p = 0; p < 3; p++) {
      m += g(a.A('nshTravelFade', 1.8, { delay: p * 0.6, ease: 'ease-out' }) + a.V({ fx: '0px', tx: '-70px', ty: '-26px' }),
        rect(120, 492, 18 + p * 4, 18 + p * 4, c.mist, 'rx="6"'));
    }
    return m;
  }

  // 8 — one investment, years of value: a copper seed grows a modular tree; seasons turn.
  function s8(c, a, ac) {
    var m = '';
    m += lineEl(120, 560, 1080, 560, c.line, 3);
    m += poly('520,560 680,560 656,540 544,540', c.mist); // mound
    m += g(a.A('nshPop', 0.6, { iter: 1, ease: 'cubic-bezier(.34,1.56,.64,1)' }), rect(588, 566, 24, 24, ac, 'transform="rotate(45 600 578)"'));
    // tapering trunk
    m += g(a.A('nshGrowY', 1.2, { iter: 1, delay: 0.5, ease: 'cubic-bezier(.76,0,.24,1)' }) + 'transform-origin:50% 100%;',
      poly('586,540 614,540 606,300 594,300', c.ink));
    // branches with joint blocks + fruit
    var br = [[596, 420, -1], [604, 366, 1], [596, 312, -1], [604, 262, 1]];
    for (var i = 0; i < br.length; i++) {
      var b = br[i], dir = b[2], bx = b[0], by = b[1];
      var x2 = bx + dir * 128, y2 = by - 50;
      m += g(a.A('nshPop', 0.5, { iter: 1, delay: 1.5 + i * 0.25, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        poly(bx + ',' + by + ' ' + (bx + dir * 22) + ',' + by + ' ' + (x2 + dir * 22) + ',' + y2 + ' ' + x2 + ',' + y2, c.ink) +
        rect(bx + (dir > 0 ? -4 : -18), by - 11, 22, 22, c.ink) +
        rect(x2 + (dir > 0 ? 10 : -42), y2 - 42, 32, 32, i === 1 ? ac : c.ivory, 'stroke="' + c.ink + '" stroke-width="4"') +
        lineEl(x2 + (dir > 0 ? 26 : -26), y2, x2 + (dir > 0 ? 26 : -26), y2 - 10, c.ink, 4));
    }
    // crown
    m += g(a.A('nshPop', 0.6, { iter: 1, delay: 2.6, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(566, 196, 68, 68, c.ink) + rect(590, 220, 20, 20, ac) + rect(556, 240, 88, 8, c.ink));
    // rising value tokens
    for (var t = 0; t < 3; t++) {
      m += g(a.A('nshTravelFade', 4.4, { delay: 3 + t * 1.5, ease: 'ease-out' }) + a.V({ tx: (56 + t * 30) + 'px', ty: '-140px' }),
        rect(648, 236, 18, 18, t === 1 ? ac : c.mist, 'transform="rotate(45 657 245)"'));
    }
    // seasons dial
    m += circ(1010, 206, 76, 'none', 'stroke="' + c.ink + '" stroke-width="5"');
    m += rect(1007, 124, 6, 12, c.ink) + rect(1007, 276, 6, 12, c.ink) + rect(928, 203, 12, 6, c.ink) + rect(1080, 203, 12, 6, c.ink);
    m += g(a.A('nshSpin', 10, { ease: 'linear' }) + 'transform-origin:1010px 206px;transform-box:view-box;', rect(1006, 144, 7, 64, c.ink));
    m += g(a.A('nshSpin', 10, { ease: 'linear' }) + 'transform-origin:1010px 206px;transform-box:view-box;animation-direction:reverse;', rect(1078, 202, 9, 9, ac));
    m += circ(1010, 206, 7, c.ink);
    // drifting season shapes
    m += g(a.A('nshTravelFade', 9, { ease: 'linear' }) + a.V({ fx: '0px', tx: '260px' }), rect(150, 150, 16, 16, c.mist, 'transform="rotate(45 158 158)"'));
    m += g(a.A('nshTravelFade', 11, { delay: 3, ease: 'linear' }) + a.V({ fx: '0px', tx: '300px' }), circ(240, 110, 9, 'none', 'stroke="' + c.mist + '" stroke-width="3"'));
    return m;
  }

  // 9 — trust is built before the call: one bridge holds, one doesn't; the customer knows which.
  function s9(c, a, ac) {
    var m = '';
    // cliffs with edge highlights + depth lines
    m += rect(60, 470, 250, 130, c.ink) + rect(890, 470, 250, 130, c.ink);
    m += rect(60, 470, 250, 10, c.sub) + rect(890, 470, 250, 10, c.sub);
    m += lineEl(360, 610, 360, 640, c.line, 3) + lineEl(500, 616, 500, 640, c.line, 3) + lineEl(720, 612, 720, 640, c.line, 3);
    // weak bridge: sagging broken planks, one falling
    var wx = [326, 424, 536, 656, 764];
    for (var i = 0; i < wx.length; i++) {
      if (i === 2) continue;
      m += g(a.A('nshSway', 2 + i * 0.3) + a.V({ sa: '-3deg', sb: '2deg' }),
        rect(wx[i], 352 + (i % 2) * 16, 70, 18, 'none', 'stroke="' + c.mist + '" stroke-width="4" transform="rotate(' + (i % 2 ? 6 : -7) + ' ' + (wx[i] + 35) + ' ' + (361 + (i % 2) * 16) + ')"'));
    }
    m += g(a.A('nshTravelFade', 3.4, { ease: 'ease-in' }) + a.V({ fr: '-6deg', ty: '110px', tr: '38deg' }),
      rect(536, 362, 70, 18, 'none', 'stroke="' + c.mist + '" stroke-width="4"')); // falling plank
    // solid bridge: deck, railing, trestle pier, keystone, shield
    m += shadow(600, 610, 300, c.shadow);
    for (var j = 0; j < 8; j++) {
      m += g(a.A('nshPop', 0.45, { iter: 1, delay: 0.2 + j * 0.1, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        rect(310 + j * 72.5, 492, 72.5, 26, c.ivory, 'stroke="' + c.deep + '" stroke-width="3"'));
    }
    m += lineEl(310, 478, 890, 478, c.ink, 4); // railing
    for (var r = 0; r < 5; r++) m += rect(340 + r * 130, 478, 5, 14, c.ink);
    m += poly('560,518 640,518 612,586 588,586', c.ink); // pier
    m += g(a.A('nshPop', 0.6, { iter: 1, delay: 1.1, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      rect(586, 538, 28, 28, ac, 'transform="rotate(45 600 552)"'));
    m += g(a.A('nshPop', 0.6, { iter: 1, delay: 1.3, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
      poly('574,600 626,600 626,636 600,654 574,636', c.ivory, 'stroke="' + c.ink + '" stroke-width="4"') + rect(592, 612, 16, 16, ac));
    // the customer crosses the solid bridge
    m += g(a.A('nshTravelFade', 6, { delay: 1.6, ease: 'cubic-bezier(.5,0,.4,1)' }) + a.V({ tx: '700px' }),
      g(a.A('nshStep', 0.6), figure(200, 492, 0.95, c.ink)));
    return m;
  }

  // ---- direct-mode scenes (10-15): the service itself, no metaphor ----------
  var duid = 0;
  // 10 — company website: a real RTL landing page assembles inside a browser window; the cursor clicks the CTA.
  function s10(c, a, ac) {
    var m = '';
    m += shadow(600, 566, 640, c.shadow);
    m += rect(140, 78, 920, 476, c.ivory, 'rx="12" stroke="' + c.ink + '" stroke-width="5"');
    m += rect(140, 78, 920, 52, c.deep, 'rx="12"') + rect(140, 106, 920, 24, c.deep);
    m += circ(172, 104, 7, c.sub) + circ(196, 104, 7, c.sub) + circ(220, 104, 7, ac);
    m += rect(430, 92, 340, 24, c.sub, 'rx="12" opacity=".5"');
    // nav (RTL: logo right, menu left of it)
    m += g(a.A('nshRise', 0.5, { iter: 1, delay: 0.2 }),
      rect(986, 152, 22, 22, ac) + rect(880, 158, 66, 10, c.deep, 'rx="5"') + rect(790, 158, 66, 10, c.mist, 'rx="5"') + rect(700, 158, 66, 10, c.mist, 'rx="5"'));
    // hero copy (right-aligned) + CTA
    m += g(a.A('nshRise', 0.5, { iter: 1, delay: 0.45 }), rect(618, 212, 390, 20, c.deep, 'rx="8"') + rect(718, 248, 290, 14, c.sub, 'rx="7"') + rect(778, 274, 230, 14, c.sub, 'rx="7"'));
    m += g(a.A('nshRise', 0.5, { iter: 1, delay: 0.65 }), rect(868, 316, 140, 46, ac, 'rx="8"') + rect(898, 334, 80, 10, c.knock, 'rx="5"'));
    // media block with slash cut
    m += g(a.A('nshRise', 0.6, { iter: 1, delay: 0.55 }),
      rect(186, 200, 380, 200, c.mist, 'rx="8"') + poly('246,400 306,400 466,200 406,200', c.ivory) + rect(258, 236, 30, 30, ac));
    // section cards
    for (var i = 0; i < 3; i++) {
      m += g(a.A('nshPop', 0.5, { iter: 1, delay: 0.9 + i * 0.15, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        rect(186 + i * 288, 438, 254, 84, 'none', 'rx="8" stroke="' + c.deep + '" stroke-width="3.5"') +
        rect(206 + i * 288, 458, 26, 26, i === 1 ? ac : c.mist) + rect(246 + i * 288, 460, 130, 9, c.sub, 'rx="4"') + rect(246 + i * 288, 478, 96, 9, c.mist, 'rx="4"'));
    }
    // cursor → click the CTA
    m += g(a.A('nshTravel', 4.5, { ease: 'cubic-bezier(.5,0,.3,1)' }) + a.V({ fx: '-260px', fy: '160px' }),
      rect(930, 332, 15, 15, c.ink, 'transform="rotate(-14 937 339)" stroke="' + c.knock + '" stroke-width="2.5"'));
    m += g(a.A('nshRing', 4.5, { delay: 4.2, ease: 'ease-out' }), rect(868, 316, 140, 46, 'none', 'rx="8" stroke="' + ac + '" stroke-width="4"'));
    return m;
  }

  // 11 — online store: product grid, a buy click, the parcel flies to the cart and the counter fills.
  function s11(c, a, ac) {
    var m = '';
    m += shadow(600, 576, 640, c.shadow);
    m += rect(170, 68, 860, 496, c.ivory, 'rx="12" stroke="' + c.ink + '" stroke-width="5"');
    m += rect(170, 68, 860, 58, c.deep, 'rx="12"') + rect(170, 100, 860, 26, c.deep);
    m += rect(920, 88, 80, 12, c.knock, 'rx="6"');
    // cart + counter squares
    m += poly('208,90 244,90 238,114 214,114', 'none', 'stroke="' + c.knock + '" stroke-width="4"') + circ(218, 120, 4, c.knock) + circ(234, 120, 4, c.knock);
    for (var q = 0; q < 3; q++) m += g(a.A('nshPulse', 4.2, { delay: 1.5 + q * 1.4 }) + a.V({ po: 0.15 }), rect(256 + q * 18, 96, 12, 12, ac));
    // product cards 2×2
    var cards = [[214, 158], [416, 158], [214, 358], [416, 358]];
    for (var i = 0; i < 4; i++) {
      var cx0 = cards[i][0], cy0 = cards[i][1];
      m += g(a.A('nshPop', 0.5, { iter: 1, delay: 0.25 + i * 0.13, ease: 'cubic-bezier(.34,1.56,.64,1)' }),
        rect(cx0, cy0, 178, 176, 'none', 'rx="10" stroke="' + c.deep + '" stroke-width="3.5"') +
        rect(cx0 + 16, cy0 + 16, 146, 76, c.mist, 'rx="6"') + poly((cx0 + 46) + ',' + (cy0 + 92) + ' ' + (cx0 + 76) + ',' + (cy0 + 92) + ' ' + (cx0 + 116) + ',' + (cy0 + 16) + ' ' + (cx0 + 86) + ',' + (cy0 + 16), c.ivory) +
        rect(cx0 + 16, cy0 + 106, 104, 9, c.sub, 'rx="4"') + rect(cx0 + 16, cy0 + 124, 66, 9, c.mist, 'rx="4"') +
        rect(cx0 + 16, cy0 + 142, 64, 24, i === 1 ? ac : c.deep, 'rx="5"') + rect(cx0 + 28, cy0 + 151, 40, 6, c.knock, 'rx="3"'));
    }
    // flying parcel: buy → cart
    m += g(a.A('nshTravelFade', 4.2, { delay: 1, ease: 'cubic-bezier(.4,0,.4,1)' }) + a.V({ fx: '0px', fy: '0px', tx: '-236px', ty: '-212px' }),
      rect(448, 306, 30, 30, c.ink) + rect(460, 306, 6, 30, c.knock));
    // order panel
    m += rect(650, 158, 348, 376, 'none', 'rx="10" stroke="' + c.deep + '" stroke-width="3.5"');
    m += rect(674, 182, 140, 12, c.deep, 'rx="6"');
    for (var r = 0; r < 3; r++) {
      m += g(a.A('nshRise', 0.5, { iter: 1, delay: 0.7 + r * 0.15 }),
        rect(674, 216 + r * 54, 30, 30, c.mist, 'rx="6"') + rect(716, 222 + r * 54, 168, 9, c.sub, 'rx="4"') + rect(716, 238 + r * 54, 110, 9, c.mist, 'rx="4"') + rect(920, 222 + r * 54, 56, 12, c.deep, 'rx="6"'));
    }
    m += lineEl(674, 396, 976, 396, c.line, 3);
    m += rect(674, 416, 180, 14, c.deep, 'rx="7"') + rect(902, 412, 74, 20, ac, 'rx="6"');
    m += g(a.A('nshPulse', 2.4) + a.V({ po: 0.55 }), rect(674, 462, 302, 48, ac, 'rx="10"') + rect(760, 481, 130, 10, c.knock, 'rx="5"'));
    return m;
  }

  // 12 — mobile app: a real screen — rows slide in, a copper notification drops and retracts, bottom nav.
  function s12(c, a, ac) {
    var m = '';
    m += shadow(600, 592, 260, c.shadow);
    m += rect(495, 58, 210, 520, c.ivory, 'rx="32" stroke="' + c.ink + '" stroke-width="5"');
    m += rect(700, 150, 5, 56, c.ink) + rect(700, 226, 5, 34, c.ink); // side buttons
    m += rect(566, 74, 68, 8, c.deep, 'rx="4"'); // speaker
    m += rect(511, 96, 178, 446, c.knock === '#0C0C0B' ? '#161614' : '#FFFFFF', 'rx="14"'); // screen
    m += rect(511, 96, 178, 44, c.deep) + rect(527, 110, 20, 20, ac) + rect(559, 115, 90, 9, c.knock, 'rx="4"'); // app bar
    // list rows
    for (var i = 0; i < 4; i++) {
      m += g(a.A('nshRise', 0.5, { iter: 1, delay: 0.35 + i * 0.14 }),
        rect(527, 158 + i * 74, 146, 58, 'none', 'rx="9" stroke="' + c.sub + '" stroke-width="2.5"') +
        rect(539, 170 + i * 74, 26, 26, i === 2 ? ac : c.mist, 'rx="6"') +
        rect(577, 172 + i * 74, 82, 8, c.sub, 'rx="4"') + rect(577, 188 + i * 74, 58, 8, c.mist, 'rx="4"'));
    }
    // bottom nav
    m += rect(511, 498, 178, 44, c.deep);
    m += rect(543, 512, 16, 16, c.knock, 'opacity=".55"') + rect(592, 512, 16, 16, ac) + rect(641, 512, 16, 16, c.knock, 'opacity=".55"');
    // notification banner drop-in / out
    m += g(a.A('nshTravelFade', 4, { delay: 1.2, ease: 'cubic-bezier(.34,1.2,.5,1)' }) + a.V({ fy: '-70px', ty: '0px' }),
      rect(521, 146, 158, 42, ac, 'rx="9"') + rect(535, 158, 18, 18, c.knock, 'rx="4"') + rect(563, 156, 92, 8, c.knock, 'rx="4"') + rect(563, 170, 66, 8, c.knock, 'rx="4" opacity=".7"'));
    m += g(a.A('nshRing', 4, { delay: 1.4, ease: 'ease-out' }), circ(600, 88, 10, 'none', 'stroke="' + ac + '" stroke-width="3.5"'));
    return m;
  }

  // 13 — automation: a task board completes itself — the switch flips, bars fill one after another.
  function s13(c, a, ac) {
    var m = '';
    m += shadow(600, 570, 640, c.shadow);
    m += rect(170, 82, 860, 460, c.ivory, 'rx="12" stroke="' + c.ink + '" stroke-width="5"');
    m += rect(170, 82, 860, 62, c.deep, 'rx="12"') + rect(170, 116, 860, 28, c.deep);
    m += rect(900, 104, 106, 14, c.knock, 'rx="7"');
    // master toggle (auto ON/OFF)
    m += rect(206, 100, 74, 30, c.sub, 'rx="15"');
    m += g(a.A('nshPulse', 6, { ease: 'steps(1)' }) + a.V({ po: 0 }), rect(206, 100, 74, 30, ac, 'rx="15"'));
    m += g(a.A('nshTravel', 3, { dir: 'alternate', ease: 'cubic-bezier(.6,0,.3,1)' }) + a.V({ tx: '44px' }), circ(221, 115, 11, c.knock));
    // clock chip
    m += circ(330, 115, 15, 'none', 'stroke="' + c.knock + '" stroke-width="3"');
    m += g(a.A('nshSpin', 4, { ease: 'linear' }) + 'transform-origin:330px 115px;transform-box:view-box;', rect(328.5, 103, 3, 12, c.knock));
    // task rows: bar fills, then the status square lights copper
    for (var i = 0; i < 4; i++) {
      var ry = 190 + i * 84;
      m += rect(214, ry, 190, 12, c.sub, 'rx="6" opacity=".7"');
      m += rect(214, ry + 28, 600, 14, c.mist, 'rx="7"');
      m += g(a.A('nshFillX', 6, { delay: i * 0.9, ease: 'cubic-bezier(.65,0,.3,1)' }) + 'transform-origin:0% 50%;', rect(214, ry + 28, 600, 14, ac, 'rx="7"'));
      m += rect(852, ry + 12, 34, 34, 'none', 'rx="8" stroke="' + c.deep + '" stroke-width="3.5"');
      m += g(a.A('nshPulse', 6, { delay: 2.2 + i * 0.9, ease: 'steps(1)' }) + a.V({ po: 0 }), rect(859, ry + 19, 20, 20, ac, 'rx="5"'));
      m += lineEl(214, ry + 62, 986, ry + 62, c.line, 2);
    }
    return m;
  }

  // 14 — business system: a chaotic inbox on one side is auto-filed into labelled rows with counters.
  function s14(c, a, ac) {
    var m = '';
    m += shadow(600, 574, 640, c.shadow);
    // inbox column
    m += rect(180, 88, 300, 452, c.ivory, 'rx="12" stroke="' + c.ink + '" stroke-width="5"');
    m += rect(180, 88, 300, 52, c.deep, 'rx="12"') + rect(180, 116, 300, 24, c.deep) + rect(212, 106, 120, 12, c.knock, 'rx="6"');
    for (var i = 0; i < 3; i++) { // incoming chips drop in, slightly askew
      m += g(a.A('nshTravelFade', 4.5, { delay: i * 1.5, ease: 'ease-out' }) + a.V({ fy: '-90px', fr: (i % 2 ? 7 : -8) + 'deg', ty: '0px', tr: (i % 2 ? 3 : -3) + 'deg' }),
        rect(216, 170 + i * 66, 228, 46, 'none', 'rx="10" stroke="' + c.sub + '" stroke-width="3"') +
        rect(232, 184 + i * 66, 120, 8, c.sub, 'rx="4"') + rect(232, 198 + i * 66, 84, 8, c.mist, 'rx="4"'));
    }
    m += rect(216, 420, 228, 8, c.mist, 'rx="4"') + rect(216, 444, 170, 8, c.mist, 'rx="4"') + rect(216, 468, 200, 8, c.mist, 'rx="4"');
    // sorted rows (invoices / customers / orders)
    var icons = [
      function (x, y) { return rect(x, y, 34, 42, c.ivory, 'stroke="' + c.deep + '" stroke-width="3.5"') + lineEl(x + 8, y + 12, x + 26, y + 12, c.deep, 3) + lineEl(x + 8, y + 21, x + 26, y + 21, c.deep, 3) + lineEl(x + 8, y + 30, x + 20, y + 30, ac, 3); },
      function (x, y) { return circ(x + 17, y + 12, 10, c.deep) + rect(x + 3, y + 26, 28, 18, c.deep, 'rx="8"'); },
      function (x, y) { return rect(x, y + 6, 34, 34, c.deep) + rect(x + 14, y + 6, 6, 34, c.knock) + lineEl(x, y + 17, x + 34, y + 17, c.knock, 3); }
    ];
    for (var r = 0; r < 3; r++) {
      var ry = 110 + r * 150;
      m += rect(560, ry, 460, 122, 'none', 'rx="12" stroke="' + c.ink + '" stroke-width="4.5"');
      m += icons[r](588, ry + 38);
      m += rect(644, ry + 32, 150, 11, c.sub, 'rx="5"') + rect(644, ry + 54, 100, 11, c.mist, 'rx="5"');
      for (var q2 = 0; q2 < 4; q2++) {
        m += rect(852 + q2 * 34, ry + 44, 22, 22, 'none', 'stroke="' + c.sub + '" stroke-width="2.5"');
        m += g(a.A('nshPulse', 4.5, { delay: 1.4 + r * 1.5 + q2 * 0.3, ease: 'steps(1)' }) + a.V({ po: 0 }), rect(856 + q2 * 34, ry + 48, 14, 14, q2 === 3 ? ac : c.deep));
      }
      m += g(a.A('nshTravelFade', 4.5, { delay: 0.8 + r * 1.5, ease: 'cubic-bezier(.5,0,.4,1)' }) + a.V({ fx: '-300px', fy: (170 + r * 66 - (ry + 50)) + 'px' }),
        rect(700, ry + 50, 20, 20, ac));
    }
    return m;
  }

  // 15 — MVP: a copper build-line sweeps the wireframe and leaves a finished product behind.
  function s15(c, a, ac) {
    var m = '';
    var id = 'nsh-mvp-' + (++duid);
    m += shadow(600, 578, 700, c.shadow);
    m += rect(180, 90, 840, 470, c.ivory, 'rx="12" stroke="' + c.ink + '" stroke-width="5"');
    function layout(wire) {
      var s2 = wire ? 'none' : c.deep, dash = wire ? ' stroke-dasharray="10 8"' : '';
      var st = function (col) { return 'rx="8" stroke="' + col + '" stroke-width="3.5"' + dash; };
      var o = '';
      o += wire ? rect(220, 126, 220, 18, 'none', st(c.sub)) : rect(220, 126, 220, 18, c.deep, 'rx="8"');
      o += wire ? rect(220, 170, 760, 150, 'none', st(c.sub)) : rect(220, 170, 760, 150, c.mist, 'rx="8"') + poly('320,320 380,320 540,170 480,170', c.ivory) + rect(252, 200, 34, 34, ac);
      for (var k2 = 0; k2 < 3; k2++) {
        o += wire ? rect(220 + k2 * 262, 348, 236, 110, 'none', st(c.sub))
          : rect(220 + k2 * 262, 348, 236, 110, 'none', st(c.deep)) + rect(240 + k2 * 262, 368, 30, 30, k2 === 1 ? ac : c.mist) + rect(284 + k2 * 262, 372, 120, 9, c.sub, 'rx="4"') + rect(284 + k2 * 262, 390, 88, 9, c.mist, 'rx="4"');
      }
      o += wire ? rect(220, 486, 170, 46, 'none', st(c.sub)) : rect(220, 486, 170, 46, ac, 'rx="10"') + rect(252, 504, 106, 10, c.knock, 'rx="5"');
      return o;
    }
    m += g('', layout(true));
    m += '<defs><clipPath id="' + id + '"><rect x="180" y="90" width="0" height="470" style="' + a.A('nshRevealW', 5, { ease: 'linear' }) + '--rw:840px;"/></clipPath></defs>';
    m += g('', layout(false), 'clip-path="url(#' + id + ')"');
    // the build beam, aligned with the reveal edge
    m += g(a.A('nshTravel', 5, { ease: 'linear' }) + a.V({ fx: '0px', tx: '840px' }),
      rect(176, 78, 8, 494, ac) + rect(170, 66, 20, 20, ac, 'transform="rotate(45 180 76)"'));
    m += g(a.A('nshRing', 5, { delay: 4.6, ease: 'ease-out' }), rect(220, 486, 170, 46, 'none', 'rx="10" stroke="' + ac + '" stroke-width="4"'));
    return m;
  }

  var SCENES = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15];

  function render(el, opts) {
    var theme = THEMES[opts.theme] || THEMES.light;
    var helpers = mk(opts.speed || 1);
    var fn = SCENES[(opts.scene || 1) - 1] || s1;
    el.innerHTML = '<svg class="nsh-svg" viewBox="0 0 1200 640" role="img">' +
      fn(theme, helpers, opts.accent || '#C06B3E') + '</svg>';
  }

  function mount(opts) {
    opts = opts || {};
    ensureStyle();
    var host = opts.target || document.body;
    var el = document.createElement('div');
    el.className = 'nsh-hero';
    host.appendChild(el);
    render(el, opts);
    return {
      el: el,
      setScene: function (n) { opts.scene = n; render(el, opts); },
      update: function (patch) { for (var kk in patch) opts[kk] = patch[kk]; render(el, opts); },
      destroy: function () { if (el.parentNode) el.parentNode.removeChild(el); }
    };
  }

  window.NilesoftHero = { mount: mount, SCENE_COUNT: SCENES.length };
})();
