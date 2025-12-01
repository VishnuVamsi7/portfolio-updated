'use client';

import { useState } from 'react';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (url, title, fileType) => {
    setModalTitle(title);
    // For PPTX files, use Google Docs Viewer
    if (fileType === 'pptx' || fileType === 'ppt') {
      const fullUrl = window.location.origin + url;
      const encodedUrl = encodeURIComponent(fullUrl);
      setModalContent(`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`);
    } else {
      // For PDF files, use direct path
      setModalContent(url);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle('');
  };

  const projects = [
    {
      title: "Comparative Analysis of TensorFlow Serving and TorchServe on Azure",
      subtitle: "Scalable Model Deployment Framework Comparison",
      goal: "To evaluate and compare the performance of two leading model serving frameworks, TensorFlow Serving and TorchServe, in a cloud-based production environment. To determine which framework offers superior scalability, efficiency, and ease of deployment for different types of deep learning models (CNN for image classification and RNN for text sentiment analysis). To benchmark key performance metrics including latency, throughput, and reliability under varying load conditions (light, medium, and heavy) to guide framework selection for real-world applications.",
      outcome: "Successfully deployed identical CNN (Fashion MNIST) and RNN (IMDB) models using both TensorFlow Serving and TorchServe on Azure Machine Learning managed online endpoints. Conducted rigorous load testing using a custom multithreaded Python generator to simulate real-world traffic patterns at rates of ~5, ~20, and ~50 requests per second. Demonstrated that TorchServe offered slightly lower latency for computer vision tasks (CNN), while TensorFlow Serving provided significantly faster inference and better efficiency for natural language processing tasks (RNN) under heavy loads. Achieved robust throughput and a 100% success rate for both frameworks across all tested load scenarios, proving their viability for scalable production deployment. Identified and documented deployment challenges and solutions, providing a practical reference for selecting the appropriate serving stack based on model type and ecosystem.",
      tags: ["AI", "ML"],
      github: "#",
      presentation: "/resume/COSC_6339_Project_Presentation_R4.pdf",
      report: "/resume/COSC_6339_Project_Final_Report_R4.pdf"
    },
    {
      title: "AI-Powered Portfolio Personal Assistant (Groq + Custom RAG)",
      subtitle: "AI-Powered Portfolio Personal Assistant (Groq + Custom RAG)",
      goal: "Create a highly personalized AI assistant integrated directly into my portfolio website—one that understands my background, skills, projects, and achievements with structured accuracy, and answers questions naturally using conversational memory and dynamic reasoning.",
      outcome: "Delivered a fast, context-aware AI assistant that answers questions about my background with high accuracy. Eliminated the need for heavy vector databases like FAISS, making the assistant lightweight and Render-friendly. Integrated conversational memory improves relevance and creates a human-like dialogue experience. Recruiters and visitors can instantly ask questions like: \"Summarize your ML experience.\" \"What projects showcase your end-to-end engineering skills?\" \"What research have you done?\" Response generation improved by ~40–50% speed using Groq inference compared to traditional inference endpoints. Transformed the static portfolio into an interactive AI product that demonstrates my engineering, prompt design, and full-stack LLM deployment skills.",
      tags: ["AI"],
      github: "#"
    },
    {
      title: "Energy Provider Churn Analysis",
      subtitle: "Energy Provider Churn Analysis Report",
      goal: "To identify customers at high risk of churn and uncover the underlying behavioral, pricing, and contract-related factors driving their decisions using historical energy usage and contract data.",
      outcome: "Built a Random Forest model achieving 90% accuracy and uncovered key churn predictors like tenure, usage, and pricing margins. Derived actionable insights that support bundling strategies, fair pricing, and targeted retention plans—especially for high-margin and short-tenure customers.",
      tags: ["ML", "Data"],
      github: "https://github.com/VishnuVamsi7/Energy-Provider-Churn-Analysis"
    },
    {
      title: "ImageCraft – Text-to-Image",
      subtitle: "ImageCraft – Text-to-Image using Transformers",
      goal: "To build a custom Python-based UNet_SD model that generates high-quality images from textual prompts by integrating transformer-based attention with a modified UNet architecture, and fine-tune it using pre-trained Stable Diffusion weights for task-specific performance.",
      outcome: "Successfully implemented transformer blocks, ResBlocks, and cross-attention into the UNet_SD backbone. Fine-tuned the model with Stable Diffusion to significantly improve image generation quality, achieving enhanced FID scores and delivering a flexible pipeline for creative Text2Image synthesis.",
      tags: ["AI"],
      github: "https://github.com/VishnuVamsi7/IMageCraft-Text-to-Image-using-Transformers"
    },
    {
      title: "Video Keyword Extraction",
      subtitle: "Video Keyword Extraction",
      goal: "To automate the extraction and transcription of spoken content from video files using OpenAI's Whisper AI, enabling efficient keyword and topic identification for educational and content analysis purposes.",
      outcome: "Successfully built a Python-based pipeline in Google Colab that extracts audio using MoviePy and performs high-accuracy transcription with Whisper AI. The project enables timestamped transcription of educational videos, offering insights into spoken content (e.g., JavaScript learning resources) and laying the groundwork for future enhancements like NLP-based keyword extraction and multilingual support.",
      tags: ["AI", "Data"],
      github: "https://github.com/VishnuVamsi7/video_keyword_extraction"
    },
    {
      title: "Pink Slime Journalism Analysis",
      subtitle: "Pink Slime Journalism Analysis",
      goal: "To identify and analyze linguistic and stylistic patterns that differentiate misleading \"pink slime\" journalism from legitimate news articles using Natural Language Processing (NLP), clustering algorithms, and dimensionality reduction techniques.",
      outcome: "Successfully built an end-to-end pipeline that processed and clustered over 27,000 articles, revealing key differences in readability, sentiment, and structure. The project uncovered that pink slime content is marked by oversimplified language, direct voice, and exaggerated sentiment, while legitimate journalism shows complex structure and neutrality. These insights support future development of automated misinformation detection tools.",
      tags: ["AI", "ML", "Data"],
      github: "https://github.com/VishnuVamsi7/Pink-slime"
    },
    {
      title: "Utility Performance Analysis",
      subtitle: "Data-Driven Analysis of Utility Performance",
      goal: "To uncover operational inefficiencies and competitive advantages in the U.S. oil and gas utility sector by performing segmentation analysis, ownership performance benchmarking, and predictive modeling for revenue and demand across regions.",
      outcome: "Successfully identified high-profit segments (e.g., Commercial), regional leaders (e.g., Texas and California), and ownership patterns (e.g., dominance of investor-owned utilities). Built accurate forecasting models with an R² of 0.99 for Texas revenue and 0.80 for demand, providing a data-backed foundation for strategic utility decisions and regional optimization.",
      tags: ["ML", "Data"],
      github: "https://github.com/VishnuVamsi7/Data-Driven-Analysis-of-Utility-Performance-in-the-Oil-and-Gas-Sector"
    },
    {
      title: "Night Objects Detection",
      subtitle: "Night Objects Detection Using TensorFlow",
      goal: "To develop a deep learning-based system capable of accurately detecting objects in low-light or nighttime environments using a custom-trained YOLOv5 model, enhancing safety for surveillance and autonomous vehicles.",
      outcome: "Successfully demonstrated a YOLOv5 model trained on night-specific data, achieving robust performance in detecting pedestrians, vehicles, and infrastructure. The system shows strong potential for smart surveillance and autonomous navigation applications.",
      tags: ["AI", "ML"],
      github: "https://github.com/VishnuVamsi7/Night-Objects---Detection-Using-TensorFlow"
    }
  ];

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
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {project.github && project.github !== "#" && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/link"
                  >
                    <span>View on GitHub</span>
                    <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}
                {project.presentation && (
                  <button
                    onClick={() => {
                      const fileType = project.presentation.split('.').pop().toLowerCase();
                      openModal(project.presentation, `${project.title} - Presentation`, fileType);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/link"
                  >
                    <span>View Presentation</span>
                    <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
                {project.report && (
                  <button
                    onClick={() => {
                      const fileType = project.report.split('.').pop().toLowerCase();
                      openModal(project.report, `${project.title} - Report`, fileType);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/link"
                  >
                    <span>View Report</span>
                    <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Preview Modal */}
      {isModalOpen && modalContent && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="relative h-[90vh] w-[90vw] max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-4 z-10 flex items-center justify-between">
              <h3 className="text-lg font-semibold truncate pr-4">{modalTitle}</h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 flex-shrink-0"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Document Display */}
            <div className="h-full pt-16">
              <iframe
                src={modalContent}
                className="w-full h-full border-0"
                title={modalTitle}
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

