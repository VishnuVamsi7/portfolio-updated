'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [showChatPrompt, setShowChatPrompt] = useState(false);

  useEffect(() => {
    // Show chat prompt after 3 seconds
    const timer = setTimeout(() => {
      setShowChatPrompt(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const downloadResume = () => {
    // Placeholder for resume download
    alert('Resume download functionality will be implemented here.');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 py-16 text-center z-10">
        <div className="mb-6 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-300 uppercase tracking-wider bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
            Student
          </span>
        </div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="block">Sai Vishnu Vamsi</span>
          <span className="block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Senagasetty
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Graduate student in Computer Science passionate about solving real-world problems using
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400"> AI, Data Science, and Software Engineering</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-blue-400">AI</span>
            <span className="text-gray-400 text-2xl">|</span>
          </div>
          <button
            onClick={downloadResume}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              DOWNLOAD RESUME
              <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 blur transition-opacity -z-10"></div>
          </button>
        </div>

        {/* Engaging Chatbot Prompt - Animated and Interactive */}
        <div 
          className={`relative mx-auto max-w-md transition-all duration-1000 ${
            showChatPrompt ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="relative bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full chatbot-notification border-2 border-white"></div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-200 transition-colors">
                  Have questions? 🤖
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  I'm here to help! Ask me anything about my work, projects, or experience.
                </p>
                <p className="text-blue-300 text-xs flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Click the chat icon to start
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400/20">
              <p className="text-xs text-blue-200/80 text-center">
                ⚠️ Initial response may take 3–4 minutes. Thank you for your patience!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


