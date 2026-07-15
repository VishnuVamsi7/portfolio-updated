'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import ProjectsSection from './ProjectsSection';
import JDMatcher from './JDMatcher';
import LandingIntro from './intro/LandingIntro';
import { CompanionProvider } from './three/CompanionContext';
import ScrollTimeline from './effects/ScrollTimeline';
import ClientErrorBoundary from './ui/ClientErrorBoundary';

const WorkExperience = dynamic(() => import('./WorkExperience'), { ssr: true });
const Training = dynamic(() => import('./Training'), { ssr: true });
const Badges = dynamic(() => import('./Badges'), { ssr: true });
const Achievements = dynamic(() => import('./Achievements'), { ssr: true });
const Contact = dynamic(() => import('./Contact'), { ssr: true });
const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });
const CompanionAvatar = dynamic(() => import('./three/CompanionAvatar'), { ssr: false });

function shouldShowIntro() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem('introPlayed') !== 'true';
  } catch {
    return false;
  }
}

function clearIntroPending() {
  document.documentElement.classList.remove('intro-pending');
  document.getElementById('intro-boot-scrim')?.remove();
}

export default function HomePage() {
  // null = still deciding (keep cover). Never paint main hero first.
  const [introActive, setIntroActive] = useState(null);

  useLayoutEffect(() => {
    const show = shouldShowIntro();
    setIntroActive(show);
    if (!show) clearIntroPending();
  }, []);

  const handleOpenProject = useCallback((projectId) => {
    window.dispatchEvent(
      new CustomEvent('open-project-notebook', { detail: { projectId } }),
    );
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleIntroComplete = useCallback(() => {
    clearIntroPending();
    setIntroActive(false);
  }, []);

  const showCover = introActive !== false;

  return (
    <CompanionProvider>
      {/* Solid cover until we know intro is skipped, or until LandingIntro paints */}
      {introActive !== true && showCover && (
        <div
          className="fixed inset-0 z-[200] bg-base"
          style={{ backgroundColor: '#0A0B0E' }}
          aria-hidden="true"
        />
      )}

      {introActive === true && (
        <ClientErrorBoundary name="LandingIntro">
          <LandingIntro onComplete={handleIntroComplete} />
        </ClientErrorBoundary>
      )}

      {/* Mount under the intro so the slide-up exit reveals it; hide only while deciding */}
      <div
        className="relative z-10"
        style={{
          visibility: introActive === null ? 'hidden' : 'visible',
        }}
        aria-hidden={introActive !== false}
      >
        <Hero />
        <About />
        <Skills />
        <JDMatcher onOpenProject={handleOpenProject} />
        <ProjectsSection />
        <WorkExperience />
        <Training />
        <Badges />
        <Achievements />
        <Contact />
        <div id="chatbot">
          <Chatbot />
        </div>
        <ClientErrorBoundary name="CompanionAvatar">
          <CompanionAvatar />
        </ClientErrorBoundary>
        <ClientErrorBoundary name="ScrollTimeline">
          <ScrollTimeline />
        </ClientErrorBoundary>
      </div>
    </CompanionProvider>
  );
}
