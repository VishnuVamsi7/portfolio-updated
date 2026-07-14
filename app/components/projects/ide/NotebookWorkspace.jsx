'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { NOTEBOOK_PROJECTS, getNotebookProject } from '../../../lib/notebookProjects';
import NotebookCell from '../notebook/NotebookCell';

export default function NotebookWorkspace({ selectedId }) {
  const project = getNotebookProject(selectedId);

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#0d0e12]">
      <div className="flex items-center justify-between border-b border-line-subtle bg-surface-elevated/80 px-4 py-2">
        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted">
          <span className="text-accent-bright/80">notebooks/</span>
          <span className="text-ink-primary">{project.filename}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          Python 3.11 · JupyterLab
        </span>
      </div>

      <div className="h-[calc(100%-40px)] overflow-y-auto p-4 md:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <NotebookCell project={project} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
