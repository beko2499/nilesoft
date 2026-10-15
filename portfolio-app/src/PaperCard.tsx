import type { Project } from './projects';

export const paperSegments = 12;
export const paperWidth = 280;

export function PaperCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const stripWidth = paperWidth / paperSegments;
  return <button className="project-surface paper-button" onClick={() => onOpen(project)} aria-label={`Explore ${project.name}, ${project.status}`} tabIndex={-1}>
    {Array.from({ length: paperSegments }, (_, segment) => <span className="paper-strip" key={segment} aria-hidden="true" style={{ width: stripWidth + 0.45, left: segment * stripWidth }}>
      <span className="paper-face paper-front"><span className="paper-print" style={{ left: -segment * stripWidth }}>
        <span className="browser-bar"><i /><i /><i /><span>{project.category}</span></span>
        <img src={project.image} alt="" width="560" height="350" draggable="false" />
        <span className="card-caption"><span><strong>{project.name}</strong><span>{project.status}</span></span><span>↗</span></span>
      </span></span>
      <span className="paper-face paper-back"><span className="paper-reverse" style={{ left: -(paperSegments - 1 - segment) * stripWidth }}>
        <span className="paper-back-mark">AB<span> / NILESOFT</span></span><strong>{project.name}</strong><span>{project.category}</span><span className="paper-back-rule" />
      </span></span>
    </span>)}
  </button>;
}
