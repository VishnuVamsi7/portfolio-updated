'use client';

import JupyterWorkspace from './projects/JupyterWorkspace';
import SectionBackground from './effects/SectionBackground';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';
import CompanionAnchor from './three/CompanionAnchor';
import ClientErrorBoundary from './ui/ClientErrorBoundary';

export default function Projects() {
  return (
    <section id="projects" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="radial" />
      <CompanionAnchor id="projects" className="absolute left-[5%] top-24 hidden xl:block" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Portfolio</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Featured <span className="text-gradient">Projects</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto max-w-2xl text-lg text-ink-secondary">
              Deep write-ups for each build — skills used, why the approach fits, and how the system was
              assembled end to end
            </p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <ClientErrorBoundary name="JupyterWorkspace">
          <JupyterWorkspace />
        </ClientErrorBoundary>
      </div>
    </section>
  );
}
