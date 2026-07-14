import SectionBackground from './effects/SectionBackground';
import SectionReveal, { StaggerReveal, StaggerItem } from './effects/SectionReveal';
import CompanionAnchor from './three/CompanionAnchor';
import ClientErrorBoundary from './ui/ClientErrorBoundary';
import LiveInferenceBio from './about/LiveInferenceBio';
import NeuralPipeline from './about/NeuralPipeline';

export default function About() {
  return (
    <section id="about" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="radial" />
      <CompanionAnchor id="about" className="absolute right-[6%] top-24 hidden xl:block" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">About</span></StaggerItem>
          <StaggerItem><h2 className="section-title">Learn More <span className="text-gradient">About Me</span></h2></StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <div className="mx-auto max-w-3xl">
          <SectionReveal>
            <ClientErrorBoundary name="LiveInferenceBio">
              <LiveInferenceBio />
            </ClientErrorBoundary>
          </SectionReveal>
        </div>

        <div className="mx-auto mt-24 max-w-4xl">
          <SectionReveal>
            <div className="mb-12 text-center">
              <span className="section-label">Neural Pipeline</span>
              <h3 className="font-display mt-3 text-3xl font-bold text-ink-primary md:text-4xl">
                Education <span className="text-gradient">& Knowledge Graph</span>
              </h3>
            </div>
          </SectionReveal>
          <ClientErrorBoundary name="NeuralPipeline">
            <NeuralPipeline />
          </ClientErrorBoundary>
        </div>
      </div>
    </section>
  );
}
