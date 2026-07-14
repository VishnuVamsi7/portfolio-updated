import { animate } from 'framer-motion';

export function smoothScrollTo(targetY, duration = 0.85) {
  const start = window.scrollY;
  animate(start, targetY, {
    duration,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (v) => window.scrollTo(0, v),
  });
}

export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.scrollY - 72;
  smoothScrollTo(y);
}
