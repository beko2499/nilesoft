(function () {
  'use strict';

  var Nilesoft = window.NS;
  if (!Nilesoft || !Nilesoft.buildTracks) return;

  var STAGE_WIDTH = 1920;
  var STAGE_HEIGHT = 1080;
  var DURATION = 12.8;
  var CUES = {
    Assemble: 0,
    Landing: 1,
    Store: 2.2,
    Mobile: 3.4,
    Automation: 4.6,
    System: 5.8,
    MVP: 7,
    Services: 8.2,
    Reform: 9.5,
    Hold: 11
  };
  var built = Nilesoft.buildTracks(CUES);

  function createElement(tag, className, parent) {
    var element = document.createElement(tag || 'div');
    if (className) element.className = className;
    if (parent) parent.appendChild(element);
    return element;
  }

  function createSvgElement(tag, parent) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (parent) parent.appendChild(element);
    return element;
  }

  function setBar(element, left, top, width, height, color, opacity, radius) {
    if (opacity <= 0.004) {
      element.style.display = 'none';
      return;
    }
    element.style.display = 'block';
    element.style.left = typeof left === 'number' ? left + 'px' : left;
    element.style.top = typeof top === 'number' ? top + 'px' : top;
    element.style.width = typeof width === 'number' ? width + 'px' : width;
    element.style.height = typeof height === 'number' ? height + 'px' : height;
    element.style.background = color;
    element.style.opacity = opacity;
    element.style.borderRadius = (radius == null ? 4 : radius) + 'px';
  }

  function createCardDetails(card, index) {
    var details = {};
    var names = [
      'landA', 'landB', 'productThumb', 'productShape', 'productA', 'productB', 'productC',
      'rowBox', 'rowA', 'rowB', 'node', 'moduleA', 'moduleB', 'moduleC', 'moduleD',
      'wireA', 'wireB'
    ];
    names.forEach(function (name) {
      details[name] = createElement('div', 'ns-morph-detail', card);
    });
    details.productShape.style.position = 'absolute';
    details.productThumb.appendChild(details.productShape);
    details.charts = [0, 1, 2].map(function () {
      return createElement('div', 'ns-morph-detail', card);
    });
    details.grid = [0, 1, 2].map(function () {
      return createElement('div', 'ns-morph-detail', card);
    });
    details.index = index;
    return details;
  }

  function updateCardDetails(details, time, cue) {
    var index = details.index;
    var fade = Nilesoft.fade;
    var landingWeight = index < 3 ? fade(time, cue.L + 0.9, cue.L + 1.15, cue.S + 0.05, cue.S + 0.4) : 0;
    var productWeight = fade(time, cue.S + 0.45, cue.S + 0.8, cue.M + 0.05, cue.M + 0.45);
    var rowWeight = index < 2 ? fade(time, cue.M + 0.45, cue.M + 0.8, cue.W + 0.05, cue.W + 0.4) : 0;
    var nodeWeight = index === 0 || index === 2 || index === 5 ? fade(time, cue.W + 0.45, cue.W + 0.75, cue.D + 0.05, cue.D + 0.4) : 0;
    var moduleWeight = fade(time, cue.D + 0.45, cue.D + 0.8, cue.V + 0.05, cue.V + 0.38);
    var wireWeight = index === 0 || index === 1 || index === 5 ? fade(time, cue.V + 0.4, cue.V + 0.62, cue.X + 0.05, cue.X + 0.35) : 0;
    var gridWeight = index === 4 ? fade(time, cue.X + 0.75, cue.X + 1, cue.R + 0.05, cue.R + 0.28) : 0;

    setBar(details.landA, '24%', '38%', '50%', 9, Nilesoft.TXT, landingWeight);
    setBar(details.landB, '24%', '56%', '36%', 8, Nilesoft.LINE, landingWeight);

    setBar(details.productThumb, '7%', '6%', '86%', '52%', Nilesoft.THUMB, productWeight, 8);
    details.productThumb.style.overflow = 'hidden';
    if (index > 0 && productWeight > 0.004) {
      setBar(details.productShape, '22%', '22%', '56%', '56%', Nilesoft.INK, productWeight, 0);
      details.productShape.style.clipPath = index % 2
        ? 'polygon(0 0,26% 0,100% 100%,74% 100%)'
        : 'polygon(100% 0,74% 0,0 100%,26% 100%)';
    } else {
      details.productShape.style.display = 'none';
    }
    setBar(details.productA, '8%', '68%', '46%', 11, Nilesoft.STONE, productWeight);
    setBar(details.productB, '8%', '80%', '30%', 9, Nilesoft.LINE, productWeight);
    setBar(details.productC, '70%', '78%', '22%', 12, Nilesoft.STONE, index > 0 ? productWeight : 0);

    setBar(details.rowBox, '5%', '18%', '17%', '64%', Nilesoft.THUMB, rowWeight, 6);
    setBar(details.rowA, '27%', '28%', '42%', 9, Nilesoft.STONE, rowWeight);
    setBar(details.rowB, '27%', '52%', '30%', 8, Nilesoft.LINE, rowWeight);
    setBar(details.node, '41%', '41%', '18%', '18%', Nilesoft.STONE, nodeWeight, 3);

    if (index < 3) {
      setBar(details.moduleA, '8%', '14%', '34%', 10, Nilesoft.STONE, moduleWeight);
      setBar(details.moduleB, index === 0 ? '30%' : index === 1 ? '26%' : '8%', '42%', '46%', 9, Nilesoft.TXT, moduleWeight);
      setBar(details.moduleC, index === 0 ? '30%' : index === 1 ? '26%' : '8%', '62%', '36%', 9, Nilesoft.LINE, moduleWeight);
      setBar(details.moduleD, '8%', '80%', '60%', 9, Nilesoft.LINE, index === 2 ? moduleWeight : 0);
      details.charts.forEach(function (chart) { chart.style.display = 'none'; });
    } else if (index < 5) {
      setBar(details.moduleA, '12%', '18%', '40%', 9, Nilesoft.TXT, moduleWeight);
      setBar(details.moduleB, '12%', '44%', '46%', '26%', Nilesoft.INK, moduleWeight, 4);
      setBar(details.moduleC, '12%', '80%', '26%', 8, Nilesoft.LINE, moduleWeight);
      details.moduleD.style.display = 'none';
      details.charts.forEach(function (chart) { chart.style.display = 'none'; });
    } else {
      details.moduleA.style.display = 'none';
      details.moduleB.style.display = 'none';
      details.moduleC.style.display = 'none';
      details.moduleD.style.display = 'none';
      [22, 30, 26].forEach(function (height, chartIndex) {
        var chart = details.charts[chartIndex];
        setBar(chart, (58 + chartIndex * 7) + '%', 'auto', '4.2%', (height * moduleWeight) + '%', chartIndex === 1 ? Nilesoft.STONE : Nilesoft.MIST, moduleWeight, 3);
        chart.style.top = 'auto';
        chart.style.bottom = '8%';
      });
    }

    setBar(details.wireA, '8%', index === 5 ? '30%' : '10%', index === 5 ? '20%' : '38%', 8, Nilesoft.STONE, wireWeight * 0.8);
    setBar(details.wireB, '8%', '20%', '26%', 7, Nilesoft.STONE, index !== 5 ? wireWeight * 0.6 : 0);
    [['56%', '30%'], ['30%', '56%'], ['56%', '56%']].forEach(function (position, gridIndex) {
      setBar(details.grid[gridIndex], position[0], position[1], '14%', '14%', Nilesoft.STONE, gridWeight, 2);
    });
  }

  function createCheck(parent) {
    var svg = createSvgElement('svg', parent);
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.style.position = 'absolute';
    svg.style.width = '40px';
    svg.style.height = '40px';
    var circle = createSvgElement('circle', svg);
    circle.setAttribute('cx', '20');
    circle.setAttribute('cy', '20');
    circle.setAttribute('r', '17');
    circle.setAttribute('fill', Nilesoft.IVORY);
    circle.setAttribute('stroke', Nilesoft.INK);
    circle.setAttribute('stroke-width', '2.5');
    var check = createSvgElement('polyline', svg);
    check.setAttribute('points', '12,21 18,27 29,13');
    check.setAttribute('fill', 'none');
    check.setAttribute('stroke', Nilesoft.INK);
    check.setAttribute('stroke-width', '3');
    check.setAttribute('stroke-linecap', 'round');
    check.setAttribute('stroke-linejoin', 'round');
    check.setAttribute('stroke-dasharray', '30');
    return { svg: svg, check: check };
  }

  function updateCheck(reference, state) {
    if (!state || state.o <= 0.01) {
      reference.svg.style.display = 'none';
      return;
    }
    reference.svg.style.display = 'block';
    reference.svg.style.left = (state.x - 20) + 'px';
    reference.svg.style.top = (state.y - 20) + 'px';
    reference.svg.style.opacity = Nilesoft.clamp01(state.o);
    reference.svg.style.transform = 'scale(' + state.k + ')';
    reference.check.setAttribute('stroke-dashoffset', String((1 - Nilesoft.clamp01(state.p)) * 30));
  }

  function applyState(element, state) {
    if (!state || (state.o != null && state.o <= 0.004)) {
      element.style.display = 'none';
      return;
    }
    element.style.display = 'block';
    element.style.left = (state.x - state.w / 2) + 'px';
    element.style.top = (state.y - state.h / 2) + 'px';
    element.style.width = state.w + 'px';
    element.style.height = state.h + 'px';
    element.style.opacity = state.o == null ? 1 : Nilesoft.clamp01(state.o);
    element.style.background = state.f && state.f !== 'none' ? state.f : 'transparent';
    element.style.transform = state.r ? 'rotate(' + state.r + 'deg)' : 'none';
    element.style.clipPath = state.clip
      ? 'polygon(' + state.clip.map(function (point) { return point[0] + '% ' + point[1] + '%'; }).join(',') + ')'
      : 'none';
    element.style.borderRadius = state.clip ? '0' : ((state.rx || 0) + 'px');
    element.style.border = state.sw ? state.sw + 'px solid ' + (state.sc || Nilesoft.INK) : 'none';
  }

  function createMorph(root) {
    root.innerHTML = '';
    var stage = createElement('div', 'ns-about-morph-stage', root);
    stage.dir = 'ltr';
    var scene = createElement('div', 'ns-about-morph-scene', stage);
    scene.dir = 'ltr';
    var elementNames = ['hero', 'frame', 'tl1', 'tl2', 'nav1', 'nav2', 'nav3', 'rail', 'progress', 'bar', 'sbar', 'sqt', 'dot1', 'dot2', 'dot3', 'sqc', 'tick', 'pulse', 'dash'];
    var elements = {};
    elementNames.forEach(function (name, index) {
      elements[name] = createElement('div', 'ns-morph-el ns-morph-' + name, scene);
      elements[name].style.zIndex = String(index + 2);
    });

    var cards = [];
    var cardDetails = [];
    for (var cardIndex = 0; cardIndex < 6; cardIndex += 1) {
      var card = createElement('div', 'ns-morph-el ns-morph-card', scene);
      card.style.zIndex = '8';
      card.style.overflow = 'hidden';
      cards.push(card);
      cardDetails.push(createCardDetails(card, cardIndex));
    }

    var checks = [createCheck(scene), createCheck(scene), createCheck(scene)];
    checks.forEach(function (reference) { reference.svg.style.zIndex = '18'; });

    var wordmark = createElement('div', 'ns-about-morph-wordmark', scene);
    wordmark.dir = 'ltr';
    var wordmarkLetters = 'NILESOFT'.split('').map(function (character) {
      var letter = document.createElement('span');
      letter.textContent = character;
      wordmark.appendChild(letter);
      return letter;
    });
    var wipe = createElement('div', 'ns-about-morph-wipe', stage);

    function render(time) {
      var cue = built.cue;
      var states = {};
      Object.keys(built.tr).forEach(function (key) {
        states[key] = Nilesoft.ev(built.tr[key], time);
      });

      if (time < cue.L) {
        var entryFade = function (start) {
          return Nilesoft.MOTION.draw(Nilesoft.clamp01((time - start) / 0.22));
        };
        states.bar.o *= entryFade(cue.A + 0.05);
        states.sqt.o *= entryFade(cue.A + 0.1);
        states.sbar.o *= entryFade(cue.A + 0.15);
        states.sqc.o *= entryFade(cue.A + 0.25);
        states.tick.o *= entryFade(cue.A + 0.35);
      }

      var flowOpacity = Nilesoft.fade(time, cue.W + 0.25, cue.W + 0.42, cue.D + 0.05, cue.D + 0.35);
      var progressX = Math.min(time < cue.D ? states.sqc.x : 1420, 1420);
      var railState = { x: 1070, y: 500, w: 1040, h: 5, f: Nilesoft.STONE, o: flowOpacity };
      var progressState = {
        x: (550 + progressX) / 2,
        y: 500,
        w: Math.max(0, progressX - 550),
        h: 5,
        f: Nilesoft.COPPER,
        o: flowOpacity * Nilesoft.MOTION.draw(Nilesoft.clamp01((time - cue.W - 0.32) / 0.08))
      };

      var pulse = function (center, width) {
        return Math.max(0, 1 - Math.abs(time - center) / width);
      };
      var drift = 1 + 0.005 * Math.sin(time * 0.6 + 0.8)
        + 0.012 * Math.pow(pulse(cue.A + 0.92, 0.3), 2)
        + 0.012 * Math.pow(pulse(cue.R + 1.06, 0.3), 2);
      scene.style.transform = 'scale(' + drift + ')';

      ['hero', 'frame', 'tl1', 'tl2', 'nav1', 'nav2', 'nav3', 'bar', 'sbar', 'sqt', 'dot1', 'dot2', 'dot3', 'sqc', 'tick', 'pulse', 'dash'].forEach(function (name) {
        applyState(elements[name], states[name]);
      });
      applyState(elements.rail, railState);
      applyState(elements.progress, progressState);
      cards.forEach(function (card, index) {
        applyState(card, states['c' + (index + 1)]);
        updateCardDetails(cardDetails[index], time, cue);
      });
      updateCheck(checks[0], states.chk1);
      updateCheck(checks[1], states.chk2);
      updateCheck(checks[2], states.chk3);

      var wordmarkStart = cue.R + 1.02;
      if (time < wordmarkStart) {
        wordmark.style.display = 'none';
      } else {
        wordmark.style.display = 'block';
        var spacing = Nilesoft.lerp(0.55, 0.38, Nilesoft.MOTION.move(Nilesoft.clamp01((time - wordmarkStart) / 0.45)));
        wordmark.style.letterSpacing = spacing + 'em';
        wordmark.style.textIndent = spacing + 'em';
        wordmarkLetters.forEach(function (letter, index) {
          var progress = Nilesoft.MOTION.draw(Nilesoft.clamp01((time - wordmarkStart - index * 0.04) / 0.32));
          letter.style.opacity = progress;
          letter.style.transform = 'translateY(' + ((1 - progress) * 12) + 'px)';
        });
      }

      var wipeProgress = Nilesoft.MOTION.move(Nilesoft.clamp01((time - cue.H - 0.55) / 0.41));
      if (wipeProgress <= 0.001) {
        wipe.style.display = 'none';
      } else {
        var wipeStart = 150 - 202 * wipeProgress;
        wipe.style.display = 'block';
        wipe.style.clipPath = 'polygon(' + wipeStart + '% 0%,300% 0%,300% 100%,' + (wipeStart + 49.4) + '% 100%)';
      }
    }

    function resize() {
      stage.style.transform = 'scale(' + (root.clientWidth / STAGE_WIDTH) + ')';
    }
    resize();
    var resizeObserver = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(root);
    else window.addEventListener('resize', resize);

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      render(11.3);
      return;
    }

    var frameId = 0;
    var running = false;
    var startedAt = 0;
    var elapsed = 0;

    function tick(now) {
      if (!running) return;
      render(((elapsed + now - startedAt) / 1000) % DURATION);
      frameId = requestAnimationFrame(tick);
    }

    function setRunning(nextRunning) {
      if (nextRunning === running) return;
      running = nextRunning;
      if (running) {
        startedAt = performance.now();
        frameId = requestAnimationFrame(tick);
      } else {
        elapsed += performance.now() - startedAt;
        cancelAnimationFrame(frameId);
      }
    }

    var visible = true;
    var visibilityObserver = window.IntersectionObserver ? new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      setRunning(visible && !document.hidden);
    }, { threshold: 0.12 }) : null;
    if (visibilityObserver) visibilityObserver.observe(root);
    else setRunning(true);

    document.addEventListener('visibilitychange', function () {
      setRunning(visible && !document.hidden);
    });
  }

  function boot() {
    document.querySelectorAll('[data-nilesoft-morph]').forEach(function (root) {
      if (root.dataset.morphReady === '1') return;
      root.dataset.morphReady = '1';
      createMorph(root);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
