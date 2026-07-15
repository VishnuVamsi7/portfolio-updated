'use client';

import { useCallback, useEffect, useState } from 'react';
import { NOTEBOOK_PROJECTS } from '../../lib/notebookProjects';
import ProjectExplorer from './ide/ProjectExplorer';
import NotebookWorkspace from './ide/NotebookWorkspace';

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
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-line-subtle bg-[#18191f] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </div>
          <span className="font-mono text-xs text-ink-muted">project workspace</span>
        </div>
        <span className="hidden font-mono text-[10px] text-ink-muted sm:inline">
          skills · approach · build · impact
        </span>
      </div>

      {/* Auto-growing pane so full write-ups (including impact) are never clipped */}
      <div className="grid rounded-b-xl border border-line-subtle bg-[#0d0e12] shadow-glass md:grid-cols-[230px_1fr]">
        <div className="border-b border-line-subtle md:border-b-0 md:border-r">
          <div className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
            <ProjectExplorer selectedId={selectedId} onSelect={selectProject} />
          </div>
        </div>
        <NotebookWorkspace selectedId={selectedId} />
      </div>
    </div>
  );
}
