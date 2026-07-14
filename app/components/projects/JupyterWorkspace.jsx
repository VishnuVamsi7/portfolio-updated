'use client';

import { useCallback, useEffect, useState } from 'react';
import { NOTEBOOK_PROJECTS } from '../../lib/notebookProjects';
import ProjectExplorer from './ide/ProjectExplorer';
import NotebookWorkspace from './ide/NotebookWorkspace';

const WORKSPACE_HEIGHT = 620;

export default function JupyterWorkspace() {
  const [selectedId, setSelectedId] = useState(NOTEBOOK_PROJECTS[0].id);

  const selectProject = useCallback((id) => {
    if (NOTEBOOK_PROJECTS.some((p) => p.id === id)) {
      setSelectedId(id);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const projectId = e.detail?.projectId;
      if (projectId) selectProject(projectId);
    };
    window.addEventListener('open-project-notebook', handler);
    return () => window.removeEventListener('open-project-notebook', handler);
  }, [selectProject]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* IDE title bar */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-line-subtle bg-[#18191f] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </div>
          <span className="font-mono text-xs text-ink-muted">workspace — portfolio IDE</span>
        </div>
        <span className="hidden font-mono text-[10px] text-ink-muted sm:inline">
          ~/portfolio/notebooks
        </span>
      </div>

      {/* Split pane */}
      <div
        className="grid overflow-hidden rounded-b-xl border border-line-subtle bg-[#0d0e12] shadow-glass md:grid-cols-[220px_1fr]"
        style={{ height: WORKSPACE_HEIGHT }}
      >
        <ProjectExplorer selectedId={selectedId} onSelect={selectProject} />
        <NotebookWorkspace selectedId={selectedId} />
      </div>
    </div>
  );
}
