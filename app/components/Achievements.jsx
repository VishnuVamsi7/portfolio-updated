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
    <section id="achievements" className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Research & Publications
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Publications & <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-gray-600 text-lg">Contributions to research and academia</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {publications.map((pub, index) => (
              <a
                key={index}
                href={pub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Publication Icon */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors leading-tight">
                      {pub.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold">Venue:</span>
                        <span>{pub.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">Date:</span>
                        <span>{pub.date}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-sm text-purple-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Publication
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
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


