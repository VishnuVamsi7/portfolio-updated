export default function Skills() {
  const skillCategories = [
    {
      name: "Programming",
      icon: "💻",
      skills: ["Python", "R", "SQL", "C++", "Bash", "HTML/CSS", "JavaScript", "Flutter", "CUDA"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Analytics / ML",
      icon: "📊",
      skills: [
        "Machine Learning", "Predictive Analytics", "Time-Series Modeling", "Statistics", 
        "Data Visualization", "Text Processing", "Topic Modeling", "LLM Integration", 
        "Model Tuning", "Prompt Engineering", "GPU Computing", "CI/CD", "Workflow Orchestration", 
        "ETL Pipelines", "Web Scraping", "Model Deployment"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "AI/ML Frameworks",
      icon: "🤖",
      skills: ["TensorFlow", "PyTorch", "Scikit-learn", "ONNX", "LangChain", "RAG", "Sentence Transformers", "FAISS"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      name: "Tools",
      icon: "🛠️",
      skills: [
        "Apache Airflow", "Docker", "Docker Compose", "Kubernetes", "Git", "GitHub", 
        "GitHub Actions", "Databricks", "Spark", "Hadoop", "Azure ML", "Palantir Foundry", 
        "Groq API", "Power BI", "Tableau", "Excel", "CMS", "Jupyter", "Google Colab", 
        "VS Code", "Linux"
      ],
      color: "from-green-500 to-teal-500"
    },
    {
      name: "Soft Skills",
      icon: "🤝",
      skills: ["Agile/Scrum", "Problem Solving", "Communication", "Team Collaboration", "Documentation"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const getSkillIcon = (skillName) => {
    const icons = {
      "Python": "🐍", "R": "📈", "SQL": "🗄️", "C++": "⚙️", "Bash": "💻", 
      "HTML/CSS": "🌐", "JavaScript": "⚡", "Flutter": "📱", "CUDA": "🔥",
      "Machine Learning": "🧠", "TensorFlow": "🔥", "PyTorch": "⚡", 
      "Docker": "🐳", "Kubernetes": "☸️", "Git": "📦", "GitHub": "🐙"
    };
    return icons[skillName] || "•";
  };

  return (
    <section id="skills" className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Technical Expertise
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Skills & <span className="text-gradient">Technologies</span>
          </h2>
          <p className="text-gray-600 text-lg">A comprehensive overview of my technical capabilities</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.name}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${categoryIndex * 0.1}s` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill}
                      className="group flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:scale-105 cursor-default"
                    >
                      <span className="text-lg">{getSkillIcon(skill)}</span>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

