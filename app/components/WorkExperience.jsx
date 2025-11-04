export default function WorkExperience() {
  const experiences = [
    {
      title: "ML Engineer",
      company: "AI/ML Research Intern",
      location: "",
      period: "January 2025 - Present",
      type: "Full-time",
      highlights: [
        "Proposed AI integration strategies to align product roadmap with mobility innovation goals.",
        "Partnered with cross-functional teams to accelerate timelines by 10% through automation and ML-driven feature planning.",
        "Contributed to the development of the core Flutter-based app, improving cross-platform performance and reducing UI/UX issues by 25%.",
        "Engineered an ML-based voice-to-ride-booking pipeline using speech-to-text transcription and NLP, enabling hands-free ride scheduling in the driver app."
      ],
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Instructional Assistant",
      company: "University of Houston",
      location: "Houston, TX",
      period: "September 2024 - Present",
      type: "Part-time",
      highlights: [
        "Modernized university websites with HTML/CSS and AI-assisted workflows, improving content update efficiency by 75%.",
        "Built bio pages, galleries, and multimedia sections using hand-coded solutions, removing reliance on third-party plugins.",
        "Created flyers and visuals with AI-enhanced Adobe tools, streamlining design workflows and accelerating delivery by 25%.",
        "Created customized visual themes and interactive components tailored to department needs, enhancing user engagement.",
        "Introduced AI capabilities to cross-functional teams, accelerating workflows and improving collaboration across communications and marketing."
      ],
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "NLP Research Assistant",
      company: "University of Houston",
      location: "Houston, TX",
      period: "January 2024 - July 2024",
      type: "Research",
      highlights: [
        "Investigated rising misinformation in \"pink slime\" journalism by analyzing 600k+ news article sentences across multiple categories to detect deceptive patterns in textual style and structure.",
        "Built an NLP pipeline using Python, NLTK, SpaCy, and TextBlob to extract stylistic features, applied TF-IDF vectorization and dimensionality reduction.",
        "Produced a clean, labeled dataset of 27K sentences, uncovered up to 8 distinct clusters in categories like Politics and Business. Pink slime articles exhibited 3× sentiment exaggeration, lower linguistic diversity.",
        "Discovered that pink slime journalism favors overly positive tone, minimal sentence depth, and active voice dominance. Visualizations (t-SNE, heatmaps, boxplots) revealed stark readability and stylistic contrasts — laying the groundwork for misinformation detection tools and future classification models."
      ],
      color: "from-green-500 to-teal-600"
    }
  ];

  return (
    <section id="experience" className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Professional Journey
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-gray-600 text-lg">Building impactful solutions through AI and software engineering</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Timeline & Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-lg text-gray-600 font-semibold">{exp.company}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2">
                          {exp.type}
                        </span>
                        <p className="text-sm text-gray-600 font-medium">{exp.period}</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-2 mt-4">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li key={hIndex} className="flex items-start gap-3 text-gray-700">
                          <span className="text-blue-600 mt-1.5 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

