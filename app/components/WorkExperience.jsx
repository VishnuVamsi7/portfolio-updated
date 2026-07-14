import SectionBackground from './effects/SectionBackground';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';
import ClientErrorBoundary from './ui/ClientErrorBoundary';
import GitChangelog from './experience/GitChangelog';
import { GIT_RELEASES } from '../lib/gitChangelogData';

export default function WorkExperience() {
  return (
    <section id="experience" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="radial" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Release History</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Work <span className="text-gradient">Experience</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-ink-secondary">
              {GIT_RELEASES.length} roles across engineering, research, and strategy — click any release to view diff stats
            </p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <ClientErrorBoundary name="GitChangelog">
          <GitChangelog />
        </ClientErrorBoundary>
      </div>
    </section>
  );
}
