'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Hero from './Hero';
import LandingIntro from './intro/LandingIntro';
import ClientErrorBoundary from './ui/ClientErrorBoundary';
import DeferredSection from './performance/DeferredSection';

const About = dynamic(() => import('./About'), { ssr: false });
const Skills = dynamic(() => import('./Skills'), { ssr: false });
const JDMatcher = dynamic(() => import('./JDMatcher'), { ssr: false });
const ProjectsSection = dynamic(() => import('./ProjectsSection'), { ssr: false });
const WorkExperience = dynamic(() => import('./WorkExperience'), { ssr: false });
const Training = dynamic(() => import('./Training'), { ssr: false });
const Badges = dynamic(() => import('./Badges'), { ssr: false });
const Achievements = dynamic(() => import('./Achievements'), { ssr: false });
const Contact = dynamic(() => import('./Contact'), { ssr: false });
const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });

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
  const [introExiting, setIntroExiting] = useState(false);

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
    setIntroExiting(false);
    setIntroActive(false);
  }, []);

  const showCover = introActive !== false;

  return (
    <>
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
          <LandingIntro
            onExitStart={() => setIntroExiting(true)}
            onComplete={handleIntroComplete}
          />
        </ClientErrorBoundary>
      )}

      {/* Mount under the intro so the slide-up exit reveals it; hide only while deciding */}
      <div
        className="relative z-10"
        style={{
          visibility: introActive === false || introExiting ? 'visible' : 'hidden',
        }}
        aria-hidden={introActive !== false}
        inert={introActive !== false ? '' : undefined}
      >
        <Hero />
        <DeferredSection id="about" enabled={introActive === false} minHeight={1450}>
          <About />
        </DeferredSection>
        <DeferredSection id="skills" enabled={introActive === false} minHeight={1450}>
          <Skills />
        </DeferredSection>
        <DeferredSection id="jd-match" enabled={introActive === false} minHeight={900}>
          <JDMatcher onOpenProject={handleOpenProject} />
        </DeferredSection>
        <DeferredSection id="projects" enabled={introActive === false} minHeight={1800}>
          <ProjectsSection />
        </DeferredSection>
        <DeferredSection id="experience" enabled={introActive === false} minHeight={1100}>
          <WorkExperience />
        </DeferredSection>
        <DeferredSection id="training" enabled={introActive === false} minHeight={900}>
          <Training />
        </DeferredSection>
        <DeferredSection id="badges" enabled={introActive === false} minHeight={700}>
          <Badges />
        </DeferredSection>
        <DeferredSection id="achievements" enabled={introActive === false} minHeight={700}>
          <Achievements />
        </DeferredSection>
        <DeferredSection id="contact" enabled={introActive === false} minHeight={700}>
          <Contact />
        </DeferredSection>
        <DeferredSection id="chatbot" enabled={introActive === false} minHeight={600}>
          <Chatbot />
        </DeferredSection>
      </div>
    </>
  );
}
