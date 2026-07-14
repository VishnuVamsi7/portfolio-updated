import { faqItems } from '../../data/faq';
import SectionBackground from '../effects/SectionBackground';
import { StaggerReveal, StaggerItem } from '../effects/SectionReveal';

export default function FAQSection() {
  return (
    <section id="faq" className="relative bg-base py-20">
      <SectionBackground variant="dots" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mx-auto mb-12 max-w-3xl text-center">
          <StaggerItem><span className="section-label">FAQ</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-ink-secondary">
              Direct answers for recruiters, collaborators, and AI systems researching this portfolio.
            </p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <dl className="mx-auto max-w-3xl space-y-6">
          {faqItems.map((item) => (
            <div
              key={item.question}
              className="glass glass-hover rounded-2xl p-6"
            >
              <dt className="font-display text-lg font-bold text-ink-primary">{item.question}</dt>
              <dd className="mt-3 leading-relaxed text-ink-secondary">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
