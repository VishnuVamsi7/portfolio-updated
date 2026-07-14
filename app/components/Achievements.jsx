import SectionBackground from './effects/SectionBackground';
import SectionReveal, { StaggerReveal, StaggerItem } from './effects/SectionReveal';

export default function Achievements() {
  const publications = [
    {
      title: "State of Health of Lithium-ion Batteries by Data-driven Technique with Optimized Gaussian Process Regression",
      venue: "ICAIA and ATCON-1",
      date: "May 2023",
      url: "https://ieeexplore.ieee.org/document/10169188"
    },
    {
      title: "Nighttime Object Detection: A Night-Patrolling Mechanism Using Deep Learning",
      venue: "IGI Global Book Chapter",
      date: "January 2023",
      url: "https://www.igi-global.com/gateway/chapter/318080"
    }
  ];

  return (
    <section id="achievements" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="radial" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Research & Publications</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Publications & <span className="text-gradient">Achievements</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-ink-secondary">Contributions to research and academia</p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <div className="mx-auto max-w-5xl">
          <div className="space-y-8">
            {publications.map((pub, index) => (
              <SectionReveal key={index} delay={index * 0.05}>
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover group block rounded-2xl p-8 transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-6">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-sm">
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display mb-4 text-2xl font-bold leading-tight text-ink-primary transition-colors group-hover:text-accent-bright">
                        {pub.title}
                      </h3>
                      <div className="mb-3 flex flex-wrap gap-6 text-ink-secondary">
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold text-ink-primary">Venue:</span>
                          <span>{pub.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-semibold text-ink-primary">Date:</span>
                          <span>{pub.date}</span>
                        </div>
                      </div>
                      <div className="border-t border-line-subtle pt-3">
                        <span className="flex items-center gap-1 text-sm font-semibold text-accent-bright transition-all group-hover:gap-2">
                          Read Publication
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
