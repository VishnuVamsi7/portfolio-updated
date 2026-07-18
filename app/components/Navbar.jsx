'use client';

import { useEffect, useState } from 'react';
import { scrollToSection, smoothScrollTo } from '../lib/smoothScroll';

const navItems = [
  { name: 'About', id: 'about' },
  { name: 'Skills', id: 'skills' },
  { name: 'JD Match', id: 'jd-match' },
  { name: 'Projects', id: 'projects' },
  { name: 'Experience', id: 'experience' },
  { name: 'Training', id: 'training' },
  { name: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState('about');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-line-subtle">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => smoothScrollTo(0)}
            className="min-h-11 cursor-pointer font-display text-xl font-bold text-gradient"
            data-cursor="pointer"
          >
            Sai Vishnu Vamsi
          </button>

          <ul className="relative hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => goTo(item.id)}
                  className={`relative min-h-11 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeId === item.id ? 'text-accent-bright' : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                  data-cursor="pointer"
                >
                  {item.name}
                  {activeId === item.id && (
                    <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent shadow-glow-sm" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink-secondary transition-colors duration-200 hover:text-accent lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
          <div className="overflow-hidden border-t border-line-subtle lg:hidden">
            <ul className="container mx-auto space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goTo(item.id)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                      activeId === item.id ? 'glass-glow bg-accent-muted text-accent-bright' : 'text-ink-secondary'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
      )}
    </nav>
  );
}
