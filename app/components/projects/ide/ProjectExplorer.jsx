'use client';

import { NOTEBOOK_PROJECTS } from '../../../lib/notebookProjects';

export default function ProjectExplorer({ selectedId, onSelect }) {
  return (
    <aside className="flex flex-col bg-[#0f1014]">
      <div className="border-b border-line-subtle px-3 py-2.5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          Projects
        </p>
      </div>
      <nav className="p-2" aria-label="Project list">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted/80">
          builds ({NOTEBOOK_PROJECTS.length})
        </p>
        <ul className="space-y-0.5">
          {NOTEBOOK_PROJECTS.map((project) => {
            const active = project.id === selectedId;
            return (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => onSelect(project.id)}
                  aria-current={active ? 'page' : undefined}
                  data-cursor="pointer"
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left font-mono text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'border border-accent/35 bg-accent/10 text-accent-bright'
                      : 'border border-transparent text-ink-secondary hover:bg-surface/80 hover:text-ink-primary'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      active ? 'bg-accent-bright' : 'bg-ink-muted/50'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{project.shortTitle}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
