'use client';

import { NOTEBOOK_PROJECTS } from '../../../lib/notebookProjects';

export default function ProjectExplorer({ selectedId, onSelect }) {
  return (
    <aside className="flex h-full flex-col border-r border-line-subtle bg-[#0f1014]">
      <div className="border-b border-line-subtle px-3 py-2.5">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          Explorer
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2" aria-label="Project notebooks">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted/80">
          notebooks/ ({NOTEBOOK_PROJECTS.length})
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
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 shrink-0 opacity-70"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M3 2h7l3 3v9H3V2zm7 0v3h3" />
                  </svg>
                  <span className="truncate">{project.filename}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
