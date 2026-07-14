'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import ProjectsSection from './ProjectsSection';
import JDMatcher from './JDMatcher';
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

export default function HomePage() {
  const handleOpenProject = useCallback((projectId) => {
    window.dispatchEvent(
      new CustomEvent('open-project-notebook', { detail: { projectId } })
    );
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <CompanionProvider>
      <div className="relative z-10">
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
