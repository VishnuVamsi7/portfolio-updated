'use client';

import { useState } from 'react';
import Image from 'next/image';
import SectionBackground from './effects/SectionBackground';
import SectionReveal, { StaggerReveal, StaggerItem } from './effects/SectionReveal';

function BadgeImage({ image, alt }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-primary shadow-glow-sm">
        <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={image}
      alt={alt}
      width={112}
      height={112}
      className="h-full w-full object-contain drop-shadow-lg"
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}

export default function Badges() {
  const badges = [
    {
      name: "Oracle Cloud Infrastructure Generative AI",
      provider: "Oracle",
      description: "GEN AI Specialist",
      year: "2025",
      image: "/badges/oracle-genai.png",
      url: "https://catalog-education.oracle.com/pls/certview/sharebadge?id=924C992773FB370EE45B0CAF84B72B5F3D2E13DDC7DFF5D1DE3359E20C107D14"
    },
    {
      name: "OCI Kubernetes Engine Specialist",
      provider: "Oracle",
      description: "Cloud Infrastructure",
      image: "/badges/oracle-k8s.png",
      url: "https://mylearn.oracle.com/ou/learning-path/become-an-oci-kubernetes-engine-specialist/134984"
    },
    {
      name: "C++ Programming",
      provider: "HPE Data Science Institute",
      description: "University of Houston",
      image: "/badges/cpp.png",
      url: "https://secure.hpedsi.uh.edu/training/badges/badge.php?hash=919669199cef1d7a9986aab392225d43b4205755"
    },
    {
      name: "Excel for Applied Data Science",
      provider: "HPE Data Science Institute",
      description: "University of Houston",
      image: "/badges/excel-ds.png",
      url: "https://secure.hpedsi.uh.edu/training/badges/badge.php?hash=9acd9c16735a2b2646de5cde62f55c01b7db1741"
    },
    {
      name: "Excel & Power BI",
      provider: "HPE Data Science Institute",
      description: "University of Houston",
      image: "/badges/excel-powerbi.png",
      url: "https://secure.hpedsi.uh.edu/training/badges/badge.php?hash=b733a6479bd6bf1cd1e8cdd286b949d2fbc383a1"
    },
    {
      name: "GPU Programming",
      provider: "HPE Data Science Institute",
      description: "University of Houston",
      image: "/badges/gpu-programming.png",
      url: "https://secure.hpedsi.uh.edu/training/badges/badge.php?hash=c0d942d092289c637cd08de2c24298a4933ead06"
    }
  ];

  return (
    <section id="badges" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="dots" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mb-16 text-center">
          <StaggerItem><span className="section-label">Digital Credentials</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Professional <span className="text-gradient">Badges</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-ink-secondary">Verified achievements and certifications</p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
            {badges.map((badge, index) => {
              const BadgeContent = (
                <>
                  <div className="relative mb-4 flex h-28 w-28 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <BadgeImage image={badge.image} alt={badge.name} />
                  </div>

                  <h3 className="line-clamp-2 text-sm font-bold text-ink-primary transition-colors group-hover:text-accent-bright">
                    {badge.name}
                  </h3>
                  <p className="mb-1 text-xs text-ink-secondary">{badge.provider}</p>
                  {badge.description && (
                    <p className="mb-2 text-xs text-ink-muted">{badge.description}</p>
                  )}
                  {badge.year && (
                    <span className="inline-block rounded-full border border-accent/30 bg-accent-muted px-2 py-1 text-xs font-semibold text-accent-bright">
                      {badge.year}
                    </span>
                  )}
                </>
              );

              return (
                <SectionReveal key={index} delay={index * 0.05}>
                  <div className="glass glass-hover group flex flex-col items-center rounded-2xl p-6 text-center transition-transform hover:scale-105">
                    {badge.url ? (
                      <a
                        href={badge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full flex-col items-center text-center"
                      >
                        {BadgeContent}
                        <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent-bright transition-all group-hover:gap-2">
                          View Badge
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </a>
                    ) : (
                      BadgeContent
                    )}
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
