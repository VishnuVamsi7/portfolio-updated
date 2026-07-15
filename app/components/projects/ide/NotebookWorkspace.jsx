'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { getNotebookProject } from '../../../lib/notebookProjects';
import NotebookCell from '../notebook/NotebookCell';

export default function NotebookWorkspace({ selectedId }) {
  const project = getNotebookProject(selectedId);

  return (
    <div className="relative min-h-[28rem] bg-[#0d0e12]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line-subtle bg-[#12131a]/95 px-4 py-2 backdrop-blur">
        <div className="min-w-0 font-mono text-xs text-ink-muted">
          <span className="text-accent-bright/80">selected · </span>
          <span className="truncate text-ink-primary">{project.shortTitle}</span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-ink-muted sm:inline">
          {project.tags.join(' · ')}
        </span>
      </div>

      <div className="p-4 pb-10 md:p-6 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <NotebookCell project={project} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
