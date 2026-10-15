import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PerspectiveCamera, Scene, Vector3 } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { clamp, docking, orbit, smooth } from './motion';
import { projects, type Project } from './projects';
import { PaperCard, paperSegments, paperWidth } from './PaperCard';
import type { PaperRenderer } from './PaperRenderer';

type Props = { paused: boolean; onOpen: (project: Project) => void; onFail: () => void };

export function HeroScene({ paused, onOpen, onFail }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rearRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const cards = useMemo(() => projects.map(() => {
    const element = document.createElement('div');
    element.className = 'spatial-card';
    return { element, object: new CSS3DObject(element), hovered: false, hover: 0, idleClock: 0, turnOffset: 0, layer: 1, layerTransforms: new Map<Scene, string>() };
  }), []);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const glass = glassRef.current!;
    let paperRenderer: PaperRenderer | null = null;
    let disposed = false;
    const paperFallback = () => {
      paperRenderer?.dispose();
      paperRenderer = null;
      stage.classList.remove('webgl-papers');
      stage.dataset.paperRenderer = 'css-fallback';
      dirty = true;
      wake();
    };
    let rearRenderer: CSS3DRenderer;
    let frontRenderer: CSS3DRenderer;
    try {
      rearRenderer = new CSS3DRenderer();
      frontRenderer = new CSS3DRenderer();
    } catch {
      onFail();
      return;
    }
    rearRef.current!.append(rearRenderer.domElement);
    frontRef.current!.append(frontRenderer.domElement);
    const rearScene = new Scene();
    const frontScene = new Scene();
    const camera = new PerspectiveCamera(45, 1, 1, 3000);
    camera.position.z = 1000;
    cards.forEach(card => frontScene.add(card.object));
    let width = 1;
    let height = 1;
    let start = 0;
    let distance = 1;
    let progress = 0;
    let previousTime = 0;
    let frame = 0;
    let visible = true;
    let dirty = true;
    let dimensions: { x: number; y: number; width: number; height: number }[] = [];
    const destination = new Vector3();
    const strips = cards.map(card => Array.from(card.element.querySelectorAll<HTMLElement>('.paper-strip')));
    const layout = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      start = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - height);
      camera.fov = 2 * Math.atan(height / 2000) * 180 / Math.PI;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rearRenderer.setSize(width, height);
      frontRenderer.setSize(width, height);
      const grid = slotsRef.current!;
      dimensions = Array.from(grid.children).map(child => {
        const slot = child as HTMLElement;
        return { x: glass.offsetLeft + grid.offsetLeft + slot.offsetLeft, y: grid.offsetTop + slot.offsetTop, width: slot.offsetWidth, height: slot.offsetHeight };
      });
      cards.forEach((card, index) => {
        card.element.style.width = '280px';
        card.element.style.height = `${280 * dimensions[index].height / dimensions[index].width}px`;
      });
      paperRenderer?.resize(width, height, dimensions.map(slot => paperWidth * slot.height / slot.width));
      dirty = true;
    };
    const onScroll = () => { dirty = true; wake(); };
    const render = (time: number) => {
      frame = 0;
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0;
      previousTime = time;
      if (document.hidden || !visible) return;
      progress = clamp((window.scrollY - start) / distance);
      const idle = !pausedRef.current && progress < 0.78;
      if (dirty || idle || cards.some(card => Math.abs(card.hover - Number(card.hovered)) > 0.01)) {
        dirty = false;
        const reveal = smooth(0.12, 0.78, progress);
        const glassTop = height + 45 - reveal * (height - 66);
        glass.style.transform = `translate3d(0,${glassTop}px,0)`;
        stage.style.setProperty('--intro-opacity', String(1 - smooth(0.12, 0.24, progress)));
        stage.style.setProperty('--reveal', String(reveal));
        stage.dataset.progress = progress.toFixed(4);
        let docked = 0;
        cards.forEach((card, index) => {
          const amount = docking(progress, index);
          if (idle && amount < 1) card.idleClock += elapsed * (1 - smooth(0, 1, amount));
          const source = orbit(index, progress, card.idleClock, width, height);
          if (amount === 0) card.turnOffset = Math.floor((source.rotation[1] + Math.PI) / (Math.PI * 2)) * Math.PI * 2;
          source.rotation[1] -= card.turnOffset;
          const slot = dimensions[index];
          const planeScale = 0.68;
          destination.set((slot.x + slot.width / 2 - width / 2) * planeScale, (height / 2 - glassTop - slot.y - slot.height / 2) * planeScale, 320);
          card.object.position.copy(source.position).lerp(destination, amount);
          card.hover += (Number(card.hovered) - card.hover) * 0.15;
          const hover = card.hover;
          card.object.position.z += hover * (1 - amount) * 22;
          card.object.position.y += hover * amount * 4;
          card.object.rotation.set(source.rotation[0] * (1 - amount) * (1 - hover * 0.65), source.rotation[1] * (1 - amount) * (1 - hover * 0.65), source.rotation[2] * (1 - amount) * (1 - hover * 0.65));
          const bend = source.bend * (1 - amount) * (1 - hover * 0.4);
          card.element.dataset.bend = bend.toFixed(3);
          if (!paperRenderer) strips[index].forEach((strip, segment) => {
            const offset = ((segment + 0.5) / paperSegments - 0.5) * paperWidth;
            const angle = offset / paperWidth * bend;
            const horizontal = Math.abs(bend) < 0.001 ? offset : Math.sin(angle) * paperWidth / bend;
            const depth = Math.abs(bend) < 0.001 ? 0 : (1 - Math.cos(angle)) * paperWidth / bend;
            strip.style.transform = `translate3d(${horizontal - offset}px,0,${depth}px) rotateY(${-angle}rad)`;
            strip.style.setProperty('--paper-shade', String(Math.abs(Math.sin(angle + source.rotation[1])) * 0.16 * (1 - amount)));
          });
          const targetScale = slot.width / 280 * planeScale;
          card.object.scale.setScalar(source.scale * (1 - amount) + targetScale * amount);
          if (card.object.position.z < -12) card.layer = 0;
          else if (card.object.position.z > 12) card.layer = 1;
          paperRenderer?.update(index, card.object, bend, card.idleClock, amount, elapsed, idle, card.layer);
          const parent = card.layer === 0 ? rearScene : frontScene;
          if (card.object.parent !== parent) {
            if (card.object.parent) card.layerTransforms.set(card.object.parent as Scene, card.element.style.transform);
            card.element.style.transform = card.layerTransforms.get(parent) ?? '';
            parent.add(card.object);
          }
          const settled = amount >= 0.999;
          card.element.dataset.docked = String(settled);
          card.element.dataset.depth = card.object.position.z.toFixed(1);
          card.element.dataset.layer = card.layer === 0 ? 'rear' : 'front';
          const button = card.element.querySelector('button')!;
          button.tabIndex = settled ? 0 : -1;
          if (settled) docked++;
        });
        countRef.current!.textContent = `${String(docked).padStart(2, '0')} / 09`;
        rearRenderer.render(rearScene, camera);
        frontRenderer.render(frontScene, camera);
        if (paperRenderer) {
          try {
            if (paperRenderer.render(camera)) stage.classList.add('webgl-papers');
            else paperFallback();
          }
          catch { paperFallback(); }
        }
      }
      if (idle || cards.some(card => Math.abs(card.hover - Number(card.hovered)) > 0.01)) wake();
    };
    function wake() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); }
    const observer = new ResizeObserver(() => { layout(); wake(); });
    observer.observe(stage);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; previousTime = 0; dirty = true; wake(); });
    intersection.observe(section);
    const visibility = () => { previousTime = 0; dirty = true; wake(); };
    const handlers = cards.map(card => {
      const enter = () => { card.hovered = true; dirty = true; wake(); };
      const leave = () => { card.hovered = false; dirty = true; wake(); };
      card.element.addEventListener('pointerenter', enter);
      card.element.addEventListener('pointerleave', leave);
      card.element.addEventListener('focusin', enter);
      card.element.addEventListener('focusout', leave);
      return { enter, leave };
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('portfolio-motion', onScroll);
    document.addEventListener('visibilitychange', visibility);
    layout();
    wake();
    void import('./PaperRenderer').then(module => {
      if (disposed) return null;
      return module.PaperRenderer.create([rearRef.current!, frontRef.current!], projects, paperFallback);
    }).then(engine => {
      if (!engine) return;
      if (disposed) { engine.dispose(); return; }
      paperRenderer = engine;
      stage.dataset.paperRenderer = 'webgl';
      layout();
      wake();
    }).catch(() => { if (!disposed) paperFallback(); });
    return () => {
      disposed = true;
      paperRenderer?.dispose();
      stage.classList.remove('webgl-papers');
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('portfolio-motion', onScroll);
      document.removeEventListener('visibilitychange', visibility);
      cards.forEach((card, index) => {
        card.element.removeEventListener('pointerenter', handlers[index].enter);
        card.element.removeEventListener('pointerleave', handlers[index].leave);
        card.element.removeEventListener('focusin', handlers[index].enter);
        card.element.removeEventListener('focusout', handlers[index].leave);
        card.object.removeFromParent();
      });
      rearRenderer.domElement.remove();
      frontRenderer.domElement.remove();
    };
  }, [cards, onFail]);

  return <section className="scroll-experience" ref={sectionRef} aria-label="Interactive portfolio. Scroll to collect projects, or use the project index below.">
    <div className="hero-stage" ref={stageRef}>
      <div className="hero-grain" />
      <div className="hero-intro"><span className="eyebrow">INDEPENDENT MIND. CONNECTED IDEAS.</span><h1>Abubkr <span>Abbas.</span></h1><p>Full-Stack Developer &amp; Creative Technologist</p></div>
      <div className="scene-layer rear-scene" ref={rearRef} />
      <img className="hero-character" src="/assets/portfolio/character.png" width="1672" height="941" alt="Stylized portrait of Abubkr, smiling with his eyes closed" fetchPriority="high" />
      <div className="hero-aside"><span className="small-cross">+</span><p>Designing the idea.<br />Building what comes next.</p><span className="micro">BASED IN THE UAE · BUILDING WITH NILESOFT</span></div>
      <div className="glass-sheet" ref={glassRef}>
        <div className="glass-rim" aria-hidden="true" /><span className="drag-indicator" aria-hidden="true" />
        <div className="glass-heading"><div><span className="eyebrow">A LITTLE ORDER TO THE IDEAS</span><h2>Selected work<span>.</span></h2></div><span className="project-count" ref={countRef}>00 / 09</span></div>
        <div className="grid-slots" ref={slotsRef} aria-hidden="true">{projects.map(project => <div className="grid-slot" key={project.id} />)}</div>
        <p className="glass-footnote">Live work, interactive demos &amp; honest explorations. Select a project to see its story.</p>
      </div>
      <div className="scene-layer front-scene" ref={frontRef} />
      <div className="hero-bottom"><span className="micro">IDEAS IN ORBIT, WORK IN FOCUS.</span><a href="#projects" onClick={event => { event.preventDefault(); const section = sectionRef.current!; window.scrollTo({ top: section.offsetTop + (section.offsetHeight - stageRef.current!.clientHeight) * 0.80, behavior: 'smooth' }); }} className="scroll-cue">Scroll to bring it together <span>↓</span></a><span className="micro">01 — EXPLORE</span></div>
    </div>
    {cards.map((card, index) => createPortal(<PaperCard project={projects[index]} onOpen={onOpen} />, card.element, projects[index].id))}
  </section>;
}
