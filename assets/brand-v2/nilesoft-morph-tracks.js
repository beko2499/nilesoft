// NILESOFT logo-morph — the full keyframe choreography (all times are cue-relative).
(function () {
  const N = window.NS;
  const { K, P, LOGO: G, IVORY, INK, MIST, STONE, COPPER, PANEL, LINE, SOFT, BACK, TXT } = N;

  N.buildTracks = function (C) {
    const A = C.Assemble ?? 0, L = C.Landing ?? 1, S = C.Store ?? 2.2, M = C.Mobile ?? 3.4,
      W = C.Automation ?? 4.6, D = C.System ?? 5.8, V = C.MVP ?? 7, X = C.Services ?? 8.2,
      R = C.Reform ?? 9.5, H = C.Hold ?? 11;
    const tr = {};

    // ── the five logo pieces ──────────────────────────────────────────────
    tr.bar = [
      K(A + .05, { x: 617, y: 129, w: G.bar.w, h: G.bar.h, clip: P.BAR, f: INK, o: 1, r: 0 }),
      K(A + .58, { x: G.bar.x, y: G.bar.y }, 'snap'),
      K(L + .20, {}), K(L + .78, { x: 680, y: 580, w: 760, h: 520 }),          // hero diagonal
      K(S + .05, {}), K(S + .60, { x: 720, y: 346, w: 260, h: 168 }),          // card 1 thumb
      K(M + .05, {}), K(M + .60, { x: 960, y: 352, w: 320, h: 200 }),          // phone hero
      K(W + .05, {}), K(W + .60, { x: 1243, y: 608, w: 160, h: 176, clip: P.BART, f: STONE }), // branch link
      K(D + .05, {}), K(D + .60, { x: 1252, y: 700, w: 520, h: 240, clip: P.UPT, f: INK }),  // trend line
      K(V + .08, {}), K(V + .45, { x: 600, y: 470, w: 520, h: 330, clip: P.BART, f: STONE }),
      K(V + .56, {}), K(V + .70, { f: INK, clip: P.BARB }),                    // refined
      K(X + .08, {}), K(X + .50, { x: 960, y: 540, w: 200, h: 124, clip: P.BAR }),
      K(X + .85, { x: 960, y: 190, w: 58, h: 44 }),                            // ring 1 glyph
      K(R + .15, {}), K(R + .52, { x: 966, y: 362, w: 300, h: 240 }),
      K(R + .90, { x: G.bar.x, y: G.bar.y, w: G.bar.w, h: G.bar.h }, 'snap')
    ];
    tr.sbar = [
      K(A + .15, { x: 1327, y: 678, w: G.sbar.w, h: G.sbar.h, clip: P.SBAR, f: INK, o: 1 }),
      K(A + .68, { x: G.sbar.x, y: G.sbar.y }, 'snap'),
      K(L + .20, {}), K(L + .75, { x: 1350, y: 360, w: 440, h: 64, clip: P.RECT }), // headline
      K(S + .05, {}), K(S + .60, { x: 392, y: 320, w: 180, h: 30 }),           // sidebar title
      K(M + .05, {}), K(M + .60, { x: 900, y: 492, w: 200, h: 26 }),           // phone headline
      K(W + .05, {}), K(W + .55, { x: 430, y: 300, w: 200, h: 16, f: STONE }),// canvas label
      K(D + .05, {}), K(D + .55, { x: 430, y: 170, w: 220, h: 22, f: INK }),   // header title
      K(V + .08, {}), K(V + .42, { f: STONE }), K(V + .60, {}), K(V + .72, { f: INK }),
      K(X + .08, {}), K(X + .50, { x: 960, y: 540, w: 130, h: 12 }),
      K(X + .85, { x: 1246, y: 685, w: 24, h: 44, clip: P.RECT }),             // ring 3 glyph
      K(R + .20, {}), K(R + .55, { x: 1240, y: 620, w: 110, h: 80 }),
      K(R + .95, { x: G.sbar.x, y: G.sbar.y, w: G.sbar.w, h: G.sbar.h, clip: P.SBAR }, 'snap')
    ];
    tr.sqt = [
      K(A + .10, { x: G.sqt.x, y: 44, w: G.sqt.w, h: G.sqt.h, clip: P.RECT, f: INK, o: 1, r: 0 }),
      K(A + .62, { y: G.sqt.y }, 'snap'),
      K(L + .20, {}), K(L + .72, { x: 1596, y: 182, w: 72, h: 36 }),           // nav block
      K(S + .05, {}), K(S + .55, { x: 1600, y: 184, w: 46, h: 36, clip: P.CART }), // cart
      K(M + .05, {}), K(M + .60, { x: 1070, y: 296, w: 30, h: 24, clip: P.RECT }), // app-bar block
      K(W + .05, {}), K(W + .60, { x: 940, y: 500, w: 34, h: 34, r: 45 }),     // decision diamond
      K(D + .05, {}), K(D + .60, { x: 984, y: 290, w: 30, h: 30, r: 0 }),      // KPI icon
      K(V + .08, {}), K(V + .50, { x: 1310, y: 400, w: 40, h: 40, f: STONE }),
      K(V + .72, {}), K(V + .84, { f: INK }),
      K(X + .08, {}), K(X + .50, { x: 960, y: 540, w: 22, h: 22 }),
      K(X + .85, { x: 666, y: 677, w: 28, h: 28 }),                            // ring 5 glyph
      K(R + .18, {}), K(R + .52, { x: 942, y: 531, w: 56, h: 56 }),
      K(R + .88, { x: G.sqt.x, y: G.sqt.y, w: G.sqt.w, h: G.sqt.h }, 'snap')
    ];
    tr.sqc = [
      K(A + .25, { x: 506, y: 373, w: G.sqc.w, h: G.sqc.h, f: COPPER, o: 1, rx: 0 }),
      K(A + .85, { x: G.sqc.x, y: G.sqc.y }, 'snap'),
      K(L + .25, {}), K(L + .80, { x: 1246, y: 570, w: 196, h: 58, rx: 10 }),  // hero CTA
      K(S + .05, {}), K(S + .60, { x: 800, y: 496, w: 110, h: 34, rx: 8 }),    // buy button
      K(M + .05, {}), K(M + .60, { x: 1078, y: 768, w: 64, h: 64, rx: 32 }),   // FAB
      K(W + .10, {}), K(W + .30, { x: 520, y: 500, w: 26, h: 26, rx: 13 }),    // runner
      K(W + .42, { x: 700 }, 'draw'), K(W + .54, { x: 940 }, 'draw'),
      K(W + .66, { x: 1180 }, 'draw'), K(W + .78, { x: 1420 }, 'draw'),
      K(W + .95, { w: 30, h: 30, rx: 7 }),
      K(D + .05, {}), K(D + .60, { x: 1436, y: 806, w: 44, h: 170, rx: 4 }),   // chart highlight
      K(V + .08, {}), K(V + .40, { x: 348, y: 540, w: 8, h: 740, rx: 4 }),     // build-line
      K(V + 1.0, { x: 1560 }),
      K(X + .06, {}), K(X + .32, { x: 960, y: 540, w: 18, h: 18, rx: 4 }),
      K(X + .80, { x: 1246, y: 355, w: 32, h: 32, rx: 8 }),                    // ring 2 glyph
      K(R + .22, {}), K(R + .58, { x: 1011, y: 518, w: 56, h: 56 }),
      K(R + 1.0, { x: G.sqc.x, y: G.sqc.y, w: G.sqc.w, h: G.sqc.h, rx: 0 }, 'snap')
    ];
    tr.tick = [
      K(A + .35, { x: 1386, y: 804, w: G.tick.w, h: G.tick.h, clip: P.TICK, f: INK, o: 1 }),
      K(A + .85, { x: G.tick.x, y: G.tick.y }, 'snap'),
      K(L + .20, {}), K(L + .70, { x: 270, y: 182, w: 42, h: 28 }),            // brand mark
      K(S + .10, {}), K(S + .45, { x: 276, y: 182 }),
      K(M + .05, {}), K(M + .60, { x: 832, y: 288, w: 30, h: 20 }),            // hero chip
      K(W + .05, {}), K(W + .55, { x: 524, y: 500, w: 20, h: 22, clip: P.PLAY }), // play
      K(D + .05, {}), K(D + .60, { x: 282, y: 170, w: 36, h: 24, clip: P.TICK }),
      K(V + .08, {}), K(V + .42, { f: STONE }), K(V + .52, {}), K(V + .64, { f: INK }),
      K(X + .08, {}), K(X + .50, { x: 960, y: 540, w: 26, h: 18 }),
      K(X + .85, { x: 674, y: 352, w: 28, h: 18 }),                            // ring 6 glyph
      K(R + .25, {}), K(R + .62, { x: 1000, y: 500, w: 60, h: 40 }),
      K(R + 1.05, { x: G.tick.x, y: G.tick.y, w: G.tick.w, h: G.tick.h }, 'snap')
    ];

    // ── containers ────────────────────────────────────────────────────────
    tr.frame = [
      K(L + .10, { x: 901, y: 452, w: 477, h: 380, rx: 8, sw: 3, sc: INK, f: 'none', o: 0 }),
      K(L + .70, { x: 960, y: 540, w: 1560, h: 900, rx: 18, o: 1 }, 'draw'),
      K(M + .05, {}), K(M + .65, { x: 960, y: 560, w: 400, h: 820, rx: 48, sw: 4 }),
      K(W + .05, {}), K(W + .55, { x: 960, y: 540, w: 1620, h: 660, rx: 26, sw: 2, o: 0 }),
      K(D + .08, { x: 960, y: 540, w: 1480, h: 820, rx: 18, sw: 3, o: 0 }),
      K(D + .55, { w: 1600, h: 900, o: 1 }, 'draw'),
      K(V + .08, {}), K(V + .42, { sc: STONE }), K(V + .85, {}), K(V + .98, { sc: INK }),
      K(X + .08, {}), K(X + .50, { x: 960, y: 540, w: 300, h: 210, rx: 12 }),
      K(X + .90, { x: 674, y: 355, w: 46, h: 34, rx: 5, sw: 2.5 }),            // ring 6 glyph
      K(R + .20, {}), K(R + .90, { x: 1190, y: 590, w: 12, h: 10, o: 0 })
    ];
    tr.hero = [
      K(L + .15, { x: 901, y: 452, w: 477, h: 380, rx: 10, f: MIST, o: 0 }),
      K(L + .75, { x: 680, y: 580, w: 760, h: 520, rx: 12, o: 1 }),
      K(S + .05, {}), K(S + .60, { x: 415, y: 600, w: 270, h: 700, f: SOFT }),
      K(M + .05, {}), K(M + .60, { x: 960, y: 352, w: 320, h: 200, rx: 14, f: MIST }),
      K(W + .05, {}), K(W + .60, { x: 960, y: 540, w: 1560, h: 620, rx: 22, f: PANEL }),
      K(D + .05, {}), K(D + .60, { x: 960, y: 595, w: 1500, h: 750, rx: 14, f: BACK }),
      K(V + .10, {}), K(V + .50, { o: 0 })
    ];

    // ── six cards: sections → products → rows/tabs → nodes → modules → wire → rings
    const grid = [[720, 405], [1060, 405], [1400, 405], [720, 775], [1060, 775], [1400, 775]];
    const land = [[466, 918], [900, 918], [1334, 918]];
    const mob = [[960, 642, 320, 86, 12], [960, 742, 320, 86, 12], [852, 872, 36, 36, 9], [924, 872, 36, 36, 9], [996, 872, 36, 36, 9], [1068, 872, 36, 36, 9]];
    const nodes = [[700, 500, 110, 96], [940, 500, 110, 96], [1180, 500, 110, 96], [1420, 500, 110, 96], [820, 700, 96, 84], [1300, 700, 96, 84]];
    const mods = [[536, 336, 420, 224], [536, 584, 420, 224], [536, 832, 420, 224], [1084, 336, 296, 224], [1420, 336, 296, 224], [1252, 708, 632, 464]];
    const rings = [[960, 190], [1246, 355], [1246, 685], [960, 850], [674, 685], [674, 355]];
    const wire = { 0: [600, 480, 560, 380], 1: [1310, 480, 560, 380], 5: [960, 800, 1280, 140] };
    const sink = { 2: [600, 480], 3: [1310, 480], 4: [960, 800] };
    const refT = { 0: [V + .56, V + .70], 1: [V + .70, V + .84], 5: [V + .62, V + .76] };
    for (let i = 0; i < 6; i++) {
      const st = i * .08, fr = [];
      if (i < 3) {
        fr.push(K(L + .70 + i * .09, { x: 680, y: 842, w: 220, h: 26, rx: 10, sw: 2, sc: LINE, f: IVORY, o: 0 }));
        fr.push(K(L + 1.02 + i * .09, { x: land[i][0], y: land[i][1], w: 332, h: 76, o: 1 }, 'draw'));
        fr.push(K(S + .05, {})); fr.push(K(S + .60, { x: grid[i][0], y: grid[i][1], w: 300, h: 330, rx: 12 }));
      } else {
        fr.push(K(S + .28 + st, { x: grid[i - 3][0], y: grid[i - 3][1] + 40, w: 280, h: 60, rx: 12, sw: 2, sc: LINE, f: IVORY, o: 0 }));
        fr.push(K(S + .70 + st, { x: grid[i][0], y: grid[i][1], w: 300, h: 330, o: 1 }, 'draw'));
      }
      fr.push(K(M + .05, {})); fr.push(K(M + .60, { x: mob[i][0], y: mob[i][1], w: mob[i][2], h: mob[i][3], rx: mob[i][4], sw: i >= 2 ? 2.5 : 2, sc: i >= 2 ? INK : LINE }));
      fr.push(K(W + .05 + st * .5, {})); fr.push(K(W + .55 + st * .5, { x: nodes[i][0], y: nodes[i][1], w: nodes[i][2], h: nodes[i][3], rx: 14, sw: 2.5, sc: INK }));
      fr.push(K(D + .05, {})); fr.push(K(D + .60, { x: mods[i][0], y: mods[i][1], w: mods[i][2], h: mods[i][3], rx: 12, sw: 2, sc: LINE }));
      if (wire[i]) {
        fr.push(K(V + .08, {}));
        fr.push(K(V + .45, { x: wire[i][0], y: wire[i][1], w: wire[i][2], h: wire[i][3], rx: 8, sw: 2.5, sc: STONE }));
        fr.push(K(refT[i][0], {})); fr.push(K(refT[i][1], { sc: INK }));
      } else {
        fr.push(K(V + .08, {})); fr.push(K(V + .40, { x: sink[i][0], y: sink[i][1], w: 80, h: 60, o: 0 }));
      }
      fr.push(K(X + .02 + st * .5, {}));
      fr.push(K(X + .30 + st, { x: 960, y: 540, w: 44, h: 44, rx: 22, sw: 2.5, sc: STONE, f: IVORY, o: 0 }));
      fr.push(K(X + .72 + st, { x: rings[i][0], y: rings[i][1], w: 130, h: 130, rx: 65, o: 1 }, 'draw'));
      fr.push(K(R + .10 + st * .5, {}));
      fr.push(K(R + .38 + st * .5, { w: 24, h: 24, rx: 12, o: 0 }));
      tr['c' + (i + 1)] = fr;
    }

    // ── small bars: nav links / status / node labels / header links ──────
    const navL = [[1250, 182], [1356, 182], [1462, 182]];
    const navS = [[1150, 182], [1256, 182], [1362, 182]];
    const navM = [[845, 212, 44, 7], [1062, 212, 22, 7], [1094, 212, 12, 7]];
    const navW = [[700, 566, 60, 6], [940, 566, 60, 6], [1180, 566, 60, 6]];
    const navD = [[1420, 170, 54, 7], [1506, 170, 54, 7], [1592, 170, 54, 7]];
    for (let i = 0; i < 3; i++) {
      const fr = [
        K(L + .30 + i * .07, { x: 1596, y: 182, w: 10, h: 8, rx: 4, f: TXT, o: 0 }),
        K(L + .75 + i * .07, { x: navL[i][0], y: navL[i][1], w: 70, h: 9, o: 1 }, 'draw'),
        K(S + .05, {}), K(S + .50, { x: navS[i][0] }),
        K(M + .05, {}), K(M + .55, { x: navM[i][0], y: navM[i][1], w: navM[i][2], h: navM[i][3] }),
        K(W + .05, {}), K(W + .55, { x: navW[i][0], y: navW[i][1], w: navW[i][2], h: navW[i][3], f: STONE }),
        K(D + .05, {}), K(D + .55, { x: navD[i][0], y: navD[i][1], w: navD[i][2], h: navD[i][3], f: TXT })
      ];
      if (i === 0) fr.push(K(V + .08, {}), K(V + .45, { f: STONE }), K(V + .70, {}), K(V + .90, { f: TXT }));
      else fr.push(K(V + .08, {}), K(V + .35, { x: 960, y: 170, o: 0 }));
      fr.push(K(X + .08, {}), K(X + .45, { x: 960, y: 540, w: 20, h: 6, o: 0 }));
      tr['nav' + (i + 1)] = fr;
    }
    tr.tl1 = [
      K(L + .35, { x: 1350, y: 392, w: 60, h: 12, rx: 5, f: TXT, o: 0 }),
      K(L + .80, { x: 1320, y: 452, w: 380, h: 14, o: 1 }, 'draw'),
      K(S + .05, {}), K(S + .60, { x: 392, y: 380, w: 164, h: 12 }),
      K(M + .05, {}), K(M + .60, { x: 884, y: 532, w: 168, h: 11 }),
      K(W + .05, {}), K(W + .55, { x: 820, y: 600, w: 5, h: 120, f: STONE }),
      K(D + .05, {}), K(D + .60, { x: 1178, y: 512, w: 200, h: 10, f: TXT }),
      K(V + .08, {}), K(V + .45, { x: 760, y: 790, w: 300, h: 9, f: STONE }),
      K(V + .65, {}), K(V + .80, { f: TXT }),
      K(X + .08, {}), K(X + .45, { x: 960, y: 540, w: 24, h: 6, o: 0 })
    ];
    tr.tl2 = [
      K(L + .42, { x: 1350, y: 392, w: 60, h: 12, rx: 5, f: TXT, o: 0 }),
      K(L + .87, { x: 1290, y: 486, w: 320, h: 14, o: 1 }, 'draw'),
      K(S + .05, {}), K(S + .60, { x: 392, y: 414, w: 132, h: 12 }),
      K(M + .05, {}), K(M + .60, { x: 860, y: 558, w: 120, h: 11 }),
      K(W + .05, {}), K(W + .55, { x: 1420, y: 566, w: 64, h: 6, f: STONE }),
      K(D + .05, {}), K(D + .40, { x: 1252, y: 640, w: 80, h: 8, o: 0 })
    ];

    // ── dots: bullets → chrome → phone hardware → flow endpoints → avatars
    tr.dot1 = [
      K(L + .75, { x: 680, y: 845, w: 8, h: 8, rx: 9, f: STONE, o: 0, sw: 0, sc: INK }),
      K(L + 1.05, { x: 350, y: 918, w: 18, h: 18, o: 1 }, 'draw'),
      K(S + .05, {}), K(S + .60, { x: 332, y: 872, w: 20, h: 20, rx: 10 }),
      K(M + .05, {}), K(M + .60, { x: 960, y: 212, w: 10, h: 10, rx: 5, f: INK }),
      K(W + .05, {}), K(W + .50, { x: 520, y: 500, w: 58, h: 58, rx: 29, sw: 3, sc: INK, f: PANEL }),
      K(D + .05, {}), K(D + .55, { x: 1664, y: 170, w: 28, h: 28, rx: 14, sw: 0, f: STONE }),
      K(V + .08, {}), K(V + .35, { o: 0 })
    ];
    tr.dot2 = [
      K(L + .83, { x: 680, y: 845, w: 8, h: 8, rx: 9, f: STONE, o: 0 }),
      K(L + 1.13, { x: 784, y: 918, w: 18, h: 18, o: 1 }, 'draw'),
      K(S + .05, {}), K(S + .60, { x: 944, y: 962, w: 10, h: 10, rx: 5 }),
      K(M + .05, {}), K(M + .60, { x: 960, y: 916, w: 110, h: 8, rx: 4, f: INK }),
      K(W + .05, {}), K(W + .50, { x: 1560, y: 500, w: 14, h: 14, rx: 7, f: INK }),
      K(D + .05, {}), K(D + .55, { x: 368, y: 300, w: 20, h: 20, rx: 10, f: STONE }),
      K(V + .08, {}), K(V + .35, { o: 0 })
    ];
    tr.dot3 = [
      K(L + .91, { x: 680, y: 845, w: 8, h: 8, rx: 9, f: STONE, o: 0 }),
      K(L + 1.21, { x: 1218, y: 918, w: 18, h: 18, o: 1 }, 'draw'),
      K(S + .05, {}), K(S + .55, { x: 1600, y: 212, w: 8, h: 8, rx: 4, f: INK }),
      K(M + .05, {}), K(M + .60, { x: 852, y: 900, w: 6, h: 6 }),
      K(W + .05, {}), K(W + .40, { x: 1300, y: 700, w: 6, h: 6, o: 0 }),
      K(D + .08, { x: 368, y: 346, w: 6, h: 6, rx: 10, f: STONE, o: 0 }),
      K(D + .55, { w: 20, h: 20, o: 1 }, 'draw'),
      K(V + .08, {}), K(V + .35, { o: 0 })
    ];

    // ── one-offs ─────────────────────────────────────────────────────────
    tr.pulse = [
      K(L + .02, { x: G.sqc.x, y: G.sqc.y, w: 85, h: 85, rx: 12, sw: 3, sc: COPPER, f: 'none', o: 0 }),
      K(L + .08, { o: .85 }), K(L + .45, { w: 240, h: 240, rx: 120, o: 0 }, 'draw'),
      K(R + .98, { x: G.sqc.x, y: G.sqc.y, w: 88, h: 88, rx: 20, o: 0 }),
      K(R + 1.04, { o: .8 }), K(R + 1.42, { w: 250, h: 250, rx: 125, o: 0 }, 'draw')
    ];
    tr.dash = [
      K(R + 1.22, { x: 960, y: 872, w: 4, h: 8, f: COPPER, o: 0, rx: 0 }),
      K(R + 1.26, { o: 1 }), K(R + 1.52, { w: 112 }, 'draw')
    ];

    // ── check marks (x, y, scale k, opacity o, draw progress p) ──────────
    tr.chk1 = [
      K(W + .48, { x: 746, y: 462, k: 1, o: 0, p: 0 }),
      K(W + .56, { o: 1 }), K(W + .80, { p: 1 }, 'draw'),
      K(D + .05, {}), K(D + .55, { x: 404, y: 540 }),
      K(V + .08, {}), K(V + .30, { o: 0 }),
      K(X + .55, { x: 960, y: 850, k: 1.35, o: 0, p: 0 }),
      K(X + .62, { o: 1 }), K(X + .92, { p: 1 }, 'draw'),
      K(R + .06, {}), K(R + .30, { o: 0, k: .5 })
    ];
    tr.chk2 = [
      K(W + .60, { x: 986, y: 462, k: 1, o: 0, p: 0 }),
      K(W + .68, { o: 1 }), K(W + .92, { p: 1 }, 'draw'),
      K(D + .05, {}), K(D + .55, { x: 404, y: 586 }),
      K(V + .08, {}), K(V + .30, { o: 0 })
    ];
    tr.chk3 = [
      K(W + .78, { x: 864, y: 664, k: 1, o: 0, p: 0 }),
      K(W + .86, { o: 1 }), K(W + 1.10, { p: 1 }, 'draw'),
      K(D + .05, {}), K(D + .55, { x: 404, y: 632 }),
      K(V + .08, {}), K(V + .30, { o: 0 })
    ];

    for (const k in tr) tr[k] = N.resolve(tr[k]);
    return { tr, cue: { A, L, S, M, W, D, V, X, R, H } };
  };
})();
