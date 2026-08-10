// NILESOFT logo-morph — shared helpers, palette, shapes.
(function () {
  const IVORY = '#FAFAF8', INK = '#141413', DEEP = '#0C0C0B', MIST = '#DEDED8',
    STONE = '#8A8A84', COPPER = '#C06B3E';
  const PANEL = '#F1F1EC', LINE = '#DAD9D2', THUMB = '#E8E8E2', SOFT = '#ECECE6',
    BACK = '#F3F3EE', TXT = '#A9A9A2';

  // The only three motion curves in the piece.
  const MOTION = {
    move: t => t <= 0 ? 0 : t >= 1 ? 1 : (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    snap: t => { if (t <= 0) return 0; if (t >= 2) return 1; const s = 1.15, u = t - 1; return 1 + (s + 1) * u * u * u + s * u * u; },
    draw: t => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3)
  };
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const hx = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mix = (a, b, t) => {
    t = clamp01(t);
    if (t <= 0 || a === b) return a;
    if (t >= 1) return b;
    if (a[0] !== '#' || b[0] !== '#') return t < .5 ? a : b;
    const A = hx(a), B = hx(b);
    return 'rgb(' + Math.round(lerp(A[0], B[0], t)) + ',' + Math.round(lerp(A[1], B[1], t)) + ',' + Math.round(lerp(A[2], B[2], t)) + ')';
  };

  const K = (t, s, e) => ({ t, s, e });
  // Merge sparse keyframes into full states, in order.
  function resolve(frames) {
    let acc = {}; const out = [];
    for (let i = 0; i < frames.length; i++) {
      acc = Object.assign({}, acc, frames[i].s);
      out.push({ t: frames[i].t, e: frames[i].e || 'move', s: acc });
    }
    return out;
  }
  // Evaluate a resolved track at authored time T.
  function ev(rf, T) {
    if (T <= rf[0].t) return Object.assign({}, rf[0].s);
    const n = rf.length;
    if (T >= rf[n - 1].t) return Object.assign({}, rf[n - 1].s);
    let i = 0; while (i < n - 2 && rf[i + 1].t < T) i++;
    const a = rf[i], b = rf[i + 1], span = b.t - a.t;
    const p = span <= 0 ? 1 : MOTION[b.e]((T - a.t) / span);
    const o = {};
    for (const k in b.s) {
      const av = a.s[k], bv = b.s[k];
      if (av === bv || av == null) { o[k] = bv; continue; }
      if (typeof bv === 'number' && typeof av === 'number') o[k] = lerp(av, bv, p);
      else if (k === 'f' || k === 'sc') o[k] = mix(av, bv, p);
      else if (Array.isArray(bv) && Array.isArray(av)) o[k] = bv.map((pt, j) => [lerp(av[j][0], pt[0], p), lerp(av[j][1], pt[1], p)]);
      else o[k] = p < .5 ? av : bv;
    }
    return o;
  }

  // 5-point clip shapes (constant vertex count so any shape morphs into any other).
  const P = {
    BAR: [[0, 0], [30, 0], [100, 100], [100, 100], [70, 100]],      // logo main diagonal
    BARB: [[0, 0], [18, 0], [100, 100], [100, 100], [82, 100]],     // bolder-thin diagonal
    BART: [[0, 0], [6, 0], [100, 100], [100, 100], [94, 100]],      // thin falling line
    UPT: [[100, 0], [88, 0], [0, 100], [0, 100], [12, 100]],        // thin rising line
    SBAR: [[0, 0], [71, 0], [100, 54], [100, 100], [61, 100]],      // short bar w/ chamfer
    TICK: [[0, 0], [78, 0], [100, 45], [100, 100], [53, 100]],      // small finishing piece
    RECT: [[0, 0], [100, 0], [100, 100], [100, 100], [0, 100]],
    CART: [[0, 0], [100, 0], [85, 100], [85, 100], [15, 100]],      // minimal cart body
    PLAY: [[10, 2], [98, 50], [98, 50], [98, 50], [10, 98]]         // play triangle
  };

  // Assembled logo geometry on the 1920x1080 stage (from the supplied mark).
  const LOGO = {
    bar: { x: 901, y: 452, w: 477, h: 380 },
    sqt: { x: 1146.5, y: 304, w: 81, h: 81 },
    sbar: { x: 1162, y: 490, w: 187, h: 125 },
    tick: { x: 1214, y: 608, w: 89, h: 60 },
    sqc: { x: 704, y: 599, w: 85, h: 85 }
  };
  const U = { x: .66, y: .752 }; // unit vector of the brand diagonal

  window.NS = {
    IVORY, INK, DEEP, MIST, STONE, COPPER, PANEL, LINE, THUMB, SOFT, BACK, TXT,
    MOTION, clamp01, lerp, mix, K, resolve, ev, P, LOGO, U,
    fade: (T, a, b, c, d) => MOTION.move(clamp01((T - a) / (b - a))) * (1 - MOTION.move(clamp01((T - c) / (d - c))))
  };
})();
