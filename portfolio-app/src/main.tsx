import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroScene } from './HeroScene';
import { projects, type Project } from './projects';
import './portfolio.css';
import './paper.css';

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current!;
    if (!project) return;
    const trigger = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; trigger?.focus({ preventScroll: true }); };
  }, [project]);
  return <dialog ref={dialogRef} className="project-dialog" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="detail-title">
    {project && <div className="dialog-content"><button className="dialog-close" onClick={onClose} aria-label="Close project details" autoFocus>×</button><img className="detail-image" src={project.image} alt={`${project.name} interface preview`} /><div className="detail-copy"><p className="eyebrow">{project.category} / {project.status}</p><h2 id="detail-title">{project.name}</h2><p>{project.description}</p><ul className="scope-list">{project.scope.map(item => <li key={item}>{item}</li>)}</ul>{project.url ? <a className="primary-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.status === 'Interactive demo' ? 'Explore the demo' : 'Visit the website'} <span>↗</span></a> : <p className="project-disclosure">{project.status === 'In development' ? 'This project is still being built. A public product link is not available yet.' : 'A design exploration, not a live client project.'}</p>}</div></div>}
  </dialog>;
}

function App() {
  const media = useRef(window.matchMedia('(prefers-reduced-motion: reduce)'));
  const [staticMode, setStaticMode] = useState(media.current.matches || !CSS.supports('transform-style', 'preserve-3d'));
  const [paused, setPaused] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const fail = useCallback(() => setStaticMode(true), []);
  useEffect(() => {
    const change = () => setStaticMode(media.current.matches);
    media.current.addEventListener('change', change);
    return () => media.current.removeEventListener('change', change);
  }, []);
  useEffect(() => { window.dispatchEvent(new Event('portfolio-motion')); }, [paused, project]);
  const goWork = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (staticMode) return;
    const section = document.querySelector<HTMLElement>('.scroll-experience');
    const stage = document.querySelector<HTMLElement>('.hero-stage');
    if (section && stage) { event.preventDefault(); window.scrollTo({ top: section.offsetTop + (section.offsetHeight - stage.clientHeight) * 0.8, behavior: 'smooth' }); }
  };
  return <>
    <a className="skip-link" href="#projects">Skip animation · browse projects</a>
    <header className="portfolio-nav"><a className="personal-brand" href="#top" aria-label="Abubkr Abbas home"><span className="ab-mark">AB</span><span>Abubkr Abbas</span></a><nav aria-label="Portfolio"><a href="#projects" onClick={goWork}>Work</a><a href="#about">About</a><a href="#contact">Contact <span>↗</span></a></nav><a className="studio-link" href="/" aria-label="Back to NILESOFT"><img src="/assets/brand-v2/nilesoft-mark.svg" alt="" width="25" height="25" /><span>NILESOFT</span></a></header>
    <main id="top">
      {staticMode ? <section className="static-hero"><div><p className="eyebrow">DESIGN. CODE. EVERYTHING BETWEEN.</p><h1>Abubkr <span>Abbas.</span></h1><p>Full-Stack Developer &amp; Creative Technologist</p><a className="primary-link" href="#projects">Explore my work <span>↓</span></a></div><img src="/assets/portfolio/character.png" alt="Stylized portrait of Abubkr" width="1672" height="941" /></section> : <HeroScene paused={paused || Boolean(project)} onOpen={setProject} onFail={fail} />}
      <section id="projects" className={`project-index content-width ${staticMode ? 'expanded-index' : ''}`}><div className="section-heading"><div><p className="eyebrow">THE PROJECT INDEX</p><h2>Different ideas.<br /><span>Same attention to detail.</span></h2></div><p>From working websites to ideas in progress.<br />Every project is labelled for what it is.</p></div><div className="index-grid">{projects.map((item, index) => <button key={item.id} onClick={() => setProject(item)} className="index-item">{staticMode && <img src={item.image} alt={`${item.name} preview`} loading="lazy" width="560" height="350" />}<span className="index-number">0{index + 1}</span><span className="index-title">{item.name}<small>{item.category} · {item.status}</small></span><span aria-hidden="true">↗</span></button>)}</div></section>
      <section id="about" className="about-section content-width"><p className="eyebrow">THE PERSON BEHIND THE PIXELS</p><div className="about-columns"><h2>A designer’s eye.<br />A developer’s mind.<br /><em>A builder at heart.</em></h2><div><p className="about-lead">Hi, I’m Abubkr. I connect design, development, and thoughtful automation to turn ideas into things people can use.</p><p>Through NILESOFT, I work across websites, mobile experiences, business systems, and AI-assisted workflows. I like understanding the problem just as much as shaping the interface — and building what sits behind it.</p><p>This is my personal space for the work, the experiments, and everything I’m learning along the way.</p><a className="text-link" href="/about.html">Meet NILESOFT <span>↗</span></a></div></div><div className="capabilities"><span>01 / UI &amp; UX DESIGN</span><span>02 / FULL-STACK DEVELOPMENT</span><span>03 / SYSTEMS &amp; ANALYSIS</span><span>04 / AI &amp; AUTOMATION</span></div></section>
      <section id="contact" className="contact-section"><div className="content-width"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let’s make<br /><em>it happen.</em><span className="contact-arrow">↗</span></h2><div className="contact-links"><a href="https://wa.me/971504494638" target="_blank" rel="noopener noreferrer">Talk on WhatsApp ↗</a><a href="mailto:abubkr249@icloud.com">abubkr249@icloud.com ↗</a><a href="https://www.instagram.com/abubkr_abbas/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div></div></section>
    </main>
    <footer className="portfolio-footer"><span>© {new Date().getFullYear()} Abubkr Abbas</span><span>Designed with intention. Built with care.</span><a href="/">Part of NILESOFT ↗</a></footer>
    <div className="motion-controls"><button onClick={() => { setStaticMode(value => !value); window.scrollTo({ top: 0 }); }} aria-pressed={staticMode}>{staticMode ? 'Explore in motion' : 'Simple view'}</button>{!staticMode && <button aria-pressed={paused} onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume ambient motion' : 'Pause ambient motion'}>{paused ? '▶' : 'Ⅱ'}</button>}</div>
    <ProjectDialog project={project} onClose={() => setProject(null)} />
  </>;
}

createRoot(document.getElementById('portfolio-root')!).render(<App />);
