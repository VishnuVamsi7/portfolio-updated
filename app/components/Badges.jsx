'use client';

import { useState } from 'react';

// Badge Image Component with Fallback
function BadgeImage({ image, alt }) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      className="w-full h-full object-contain drop-shadow-lg"
      onError={() => setImageError(true)}
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
    <section id="badges" className="relative py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Digital Credentials
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Professional <span className="text-gradient">Badges</span>
          </h2>
          <p className="text-gray-600 text-lg">Verified achievements and certifications</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => {
              const BadgeContent = (
                <>
                  {/* Badge Image */}
                  <div className="w-28 h-28 mb-4 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 relative">
                    <BadgeImage image={badge.image} alt={badge.name} />
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{badge.provider}</p>
                  {badge.description && (
                    <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                  )}
                  {badge.year && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {badge.year}
                    </span>
                  )}
                </>
              );

              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up flex flex-col items-center text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {badge.url ? (
                    <a
                      href={badge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center w-full"
                    >
                      {BadgeContent}
                      <span className="mt-3 text-xs text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Badge
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    BadgeContent
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

