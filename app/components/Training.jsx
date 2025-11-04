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
      title: "C++ Programming",
      provider: "HPE Data Science Institute, University of Houston",
      category: "Programming",
      url: "https://drive.google.com/file/d/1Ku-XlpDOvuloEWTM1Qm2uxwfD_qAHMy4/view"
    },
    {
      title: "Excel for Applied Data Science",
      provider: "HPE Data Science Institute, University of Houston",
      category: "Data Science",
      url: "https://drive.google.com/file/d/1T__i5CDCgMj0wfqXLmF8GxEp_hfwfMU1/view"
    },
    {
      title: "Excel & Power BI",
      provider: "HPE Data Science Institute, University of Houston",
      category: "Data Analytics",
      url: "https://drive.google.com/file/d/1JVmgIZ1m9MF54SNoaKlayC6FzFPm0NWQ/view"
    }
  ];

  return (
    <section id="training" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Professional Development
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Training & <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-gray-600 text-lg">Continuous learning and skill development</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-up block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Certificate Icon */}
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {cert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium line-clamp-1">{cert.provider}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-semibold shadow-md">
                      {cert.category}
                    </span>
                    {cert.year && (
                      <span className="text-xs text-gray-500 font-medium">{cert.year}</span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Certificate
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


