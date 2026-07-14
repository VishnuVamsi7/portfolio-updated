import SectionBackground from './effects/SectionBackground';
import SectionReveal, { StaggerReveal, StaggerItem } from './effects/SectionReveal';

export default function Training() {
  const certifications = [
    {
      title: "Oracle Cloud Infrastructure Generative AI",
      provider: "Oracle",
      category: "AI/Cloud",
      url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=924C992773FB370EE45B0CAF84B72B5F3D2E13DDC7DFF5D1DE3359E20C107D14",
      year: "2025"
    },
    {
      title: "OCI Kubernetes Engine Specialist",
      provider: "Oracle",
      category: "Cloud/DevOps",
      url: "https://drive.google.com/file/d/1vfwdtApeBbuBDXGIz6kQlRlnM9carL4l/view?pli=1"
    },
    {
      title: "Excel Skills Virtual Experience Program",
      provider: "JPmorgan Chase & Co.",
      category: "Programming",
      url: "https://drive.google.com/file/d/1Ku-XlpDOvuloEWTM1Qm2uxwfD_qAHMy4/view"
    },
    {
      title: "Analyzing Marketing Campaigns with pandas",
      provider: "DataCamp",
      category: "Data Science",
      url: "https://drive.google.com/file/d/1T__i5CDCgMj0wfqXLmF8GxEp_hfwfMU1/view"
    },
    {
      title: "Data Manipulation in SQL",
      provider: "DataCamp",
      category: "Data Analytics",
      url: "https://drive.google.com/file/d/1JVmgIZ1m9MF54SNoaKlayC6FzFPm0NWQ/view"
    }
  ];

  return (
    <section id="training" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="radial" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Professional Development</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Training & <span className="text-gradient">Certifications</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-ink-secondary">Continuous learning and skill development</p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <SectionReveal key={index} delay={index * 0.05}>
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass glass-hover group relative block rounded-2xl p-6 transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute -right-3 -top-3 flex h-14 w-14 rotate-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow-sm transition-transform duration-300 group-hover:rotate-0">
                    <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>

                  <div className="mt-2">
                    <h3 className="font-display line-clamp-2 text-xl font-bold text-ink-primary transition-colors group-hover:text-accent-bright">
                      {cert.title}
                    </h3>
                    <div className="mb-3 mt-2 flex items-center gap-2 text-sm text-ink-secondary">
                      <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="line-clamp-1 font-medium">{cert.provider}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-glow-sm">
                        {cert.category}
                      </span>
                      {cert.year && (
                        <span className="text-xs font-medium text-ink-muted">{cert.year}</span>
                      )}
                    </div>
                    <div className="mt-3 border-t border-line-subtle pt-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent-bright transition-all group-hover:gap-2">
                        View Certificate
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
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
