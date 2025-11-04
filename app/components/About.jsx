export default function About() {

  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            About
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Learn More <span className="text-gradient">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main About Content */}
          <div className="grid md:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👋</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Sai Vishnu Vamsi Senagasetty</h3>
                    <p className="text-lg text-gray-600 font-medium">AI, Data Science & Software Engineer</p>
                  </div>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    I'm a Computer Science grad student, AI enthusiast, and active trader on a mission to blend 
                    artificial intelligence with real-world finance—and turn data into smart profits 💸.
                  </p>
                  <p className="text-lg">
                    By day, I engineer scalable solutions using AI, ML, and software design. By night, I'm deep into 
                    the markets—tracking stock patterns, building signal engines, and developing LLM-powered pipelines 
                    that don't just predict, but explain every move 📈🤖.
                  </p>
                </div>
              </div>
            </div>

            {/* Background Info */}
            <div className="md:col-span-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Education
                </h4>
                <div className="space-y-6">
                  {/* Master's Degree */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-bold text-lg">Master of Science in Computer Science</p>
                        <p className="text-indigo-100">University of Houston</p>
                        <p className="text-sm text-indigo-200 mt-1">August 2023 - May 2025</p>
                        <p className="text-sm text-white/90 mt-2">
                          <span className="font-semibold">Relevant Coursework:</span> Machine Learning, Deep Learning, Big Data Analytics, Cloud Computing, AI Systems
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bachelor's Degree */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-bold text-lg">Bachelor of Technology in Computer Science</p>
                        <p className="text-indigo-100">SRM University, AP</p>
                        <p className="text-sm text-indigo-200 mt-1">June 2019 - May 2023</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 pt-2">
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-indigo-100">Location</p>
                      <p className="text-white">Houston, Texas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


