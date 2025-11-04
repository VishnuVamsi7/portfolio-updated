'use client';

import { useState } from 'react';

export default function Projects() {
  const projects = [
    {
      title: "Energy Provider Churn Analysis",
      subtitle: "Energy Provider Churn Analysis Report",
      goal: "To identify customers at high risk of churn and uncover the underlying behavioral, pricing, and contract-related factors driving their decisions using historical energy usage and contract data.",
      outcome: "Built a Random Forest model achieving 90% accuracy and uncovered key churn predictors like tenure, usage, and pricing margins. Derived actionable insights that support bundling strategies, fair pricing, and targeted retention plans—especially for high-margin and short-tenure customers.",
      tags: ["ML", "Data"],
      github: "#"
    },
    {
      title: "ImageCraft – Text-to-Image",
      subtitle: "ImageCraft – Text-to-Image using Transformers",
      goal: "To build a custom Python-based UNet_SD model that generates high-quality images from textual prompts by integrating transformer-based attention with a modified UNet architecture, and fine-tune it using pre-trained Stable Diffusion weights for task-specific performance.",
      outcome: "Successfully implemented transformer blocks, ResBlocks, and cross-attention into the UNet_SD backbone. Fine-tuned the model with Stable Diffusion to significantly improve image generation quality, achieving enhanced FID scores and delivering a flexible pipeline for creative Text2Image synthesis.",
      tags: ["AI"],
      github: "#"
    },
    {
      title: "Video Keyword Extraction",
      subtitle: "Video Keyword Extraction",
      goal: "To automate the extraction and transcription of spoken content from video files using OpenAI's Whisper AI, enabling efficient keyword and topic identification for educational and content analysis purposes.",
      outcome: "Successfully built a Python-based pipeline in Google Colab that extracts audio using MoviePy and performs high-accuracy transcription with Whisper AI. The project enables timestamped transcription of educational videos, offering insights into spoken content (e.g., JavaScript learning resources) and laying the groundwork for future enhancements like NLP-based keyword extraction and multilingual support.",
      tags: ["AI", "Data"],
      github: "#"
    },
    {
      title: "Pink Slime Journalism Analysis",
      subtitle: "Pink Slime Journalism Analysis",
      goal: "To identify and analyze linguistic and stylistic patterns that differentiate misleading \"pink slime\" journalism from legitimate news articles using Natural Language Processing (NLP), clustering algorithms, and dimensionality reduction techniques.",
      outcome: "Successfully built an end-to-end pipeline that processed and clustered over 27,000 articles, revealing key differences in readability, sentiment, and structure. The project uncovered that pink slime content is marked by oversimplified language, direct voice, and exaggerated sentiment, while legitimate journalism shows complex structure and neutrality. These insights support future development of automated misinformation detection tools.",
      tags: ["AI", "ML", "Data"],
      github: "#"
    },
    {
      title: "Utility Performance Analysis",
      subtitle: "Data-Driven Analysis of Utility Performance",
      goal: "To uncover operational inefficiencies and competitive advantages in the U.S. oil and gas utility sector by performing segmentation analysis, ownership performance benchmarking, and predictive modeling for revenue and demand across regions.",
      outcome: "Successfully identified high-profit segments (e.g., Commercial), regional leaders (e.g., Texas and California), and ownership patterns (e.g., dominance of investor-owned utilities). Built accurate forecasting models with an R² of 0.99 for Texas revenue and 0.80 for demand, providing a data-backed foundation for strategic utility decisions and regional optimization.",
      tags: ["ML", "Data"],
      github: "#"
    },
    {
      title: "Night Objects Detection",
      subtitle: "Night Objects Detection Using TensorFlow",
      goal: "To develop a deep learning-based system capable of accurately detecting objects in low-light or nighttime environments using a custom-trained YOLOv5 model, enhancing safety for surveillance and autonomous vehicles.",
      outcome: "Successfully demonstrated a YOLOv5 model trained on night-specific data, achieving robust performance in detecting pedestrians, vehicles, and infrastructure. The system shows strong potential for smart surveillance and autonomous navigation applications.",
      tags: ["AI", "ML"],
      github: "#"
    }
  ];

  const [filter, setFilter] = useState('All');

  const categories = ['All', 'AI', 'ML', 'Data'];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(filter));

  return (
    <section id="projects" className="relative py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Portfolio
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore my work in AI, Machine Learning, and Data Science
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-12 gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 font-medium">{project.subtitle}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Project Details */}
              <div className="mb-6 space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <span>✅</span> Goal
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.goal}</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-blue-700 mb-1 flex items-center gap-2">
                    <span>🏁</span> Outcome
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{project.outcome}</p>
                </div>
              </div>
              
              {/* GitHub Link */}
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/link"
              >
                <span>View on GitHub</span>
                <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

