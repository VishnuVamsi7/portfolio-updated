import SectionBackground from './effects/SectionBackground';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';
import CompanionAnchor from './three/CompanionAnchor';
import ClientErrorBoundary from './ui/ClientErrorBoundary';
import NeuralSkillGraph from './skills/NeuralSkillGraph';

export default function Skills() {
  return (
    <section id="skills" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="grid" />
      <CompanionAnchor id="skills" className="absolute left-[5%] top-24 hidden xl:block" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Technical Expertise</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">Skills & <span className="text-gradient">Technologies</span></h2>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto max-w-3xl text-lg text-ink-secondary">
              Python, TensorFlow, PyTorch, RAG, LLM integration, Groq API, LangChain, Docker, Kubernetes,
              Azure ML, NLP, and model deployment — explore the live neural network below.
            </p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <ClientErrorBoundary name="NeuralSkillGraph">
          <NeuralSkillGraph />
        </ClientErrorBoundary>
      </div>
    </section>
  );
}
