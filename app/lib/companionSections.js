/**
 * Single source of truth for the companion avatar + narrative scroll timeline.
 * `side` = fallback avatar position when a section has no <CompanionAnchor>.
 * `dialogue` = default TTS line (overridable at runtime via useCompanion().setSectionDialogue —
 * pipe your FastAPI/LangChain/Groq output through that).
 */
export const COMPANION_SECTIONS = [
  { id: 'hero', label: 'Intro', side: 'center', timeline: true, dialogue: "Hi — I'm Vishnu's AI companion. Scroll to explore his work." },
  { id: 'about', label: 'About', side: 'right', timeline: true, dialogue: 'This is Vishnu: an AI engineer who ships production ML, not just demos.' },
  { id: 'skills', label: 'Skills', side: 'left', timeline: true, dialogue: 'Python, PyTorch, RAG pipelines — the full production toolbox.' },
  { id: 'jd-match', label: 'JD Match', side: 'right', timeline: true, dialogue: "Paste a job description and I'll score the fit instantly." },
  { id: 'projects', label: 'Projects', side: 'left', timeline: true, dialogue: 'Eight real builds. Open a book to dive into any of them.' },
  { id: 'experience', label: 'Experience', side: 'right', timeline: true, dialogue: 'Real-world impact across research and industry.' },
  { id: 'training', label: 'Training', side: 'left', timeline: true, dialogue: 'Always learning — courses and certifications.' },
  { id: 'badges', label: 'Badges', side: 'right', timeline: true, dialogue: 'Verified credentials from Oracle and more.' },
  { id: 'achievements', label: 'Research', side: 'left', timeline: true, dialogue: 'Published research and academic contributions.' },
  { id: 'contact', label: 'Contact', side: 'left', timeline: true, dialogue: "Like what you see? Let's talk." },
];

export const TIMELINE_SECTIONS = COMPANION_SECTIONS.filter((s) => s.timeline);
