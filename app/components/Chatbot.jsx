'use client';

import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. Ask me anything about Sai Vishnu Vamsi Senagasetty, his projects, skills, or background!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Call Render server directly, just like the old HTML site
    const endpoint = 'https://chatbot-rag-mun6.onrender.com/receive';

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`Attempt ${attempt + 1}: Sending request to ${endpoint}`);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: currentInput })
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status} from ${endpoint}`);
        }

        const data = await response.json();
        const reply = data.response || data.error || "No response received.";
        
        const botResponse = {
          role: 'assistant',
          content: reply
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
        return;
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed:`, error);
        
        // Check if it's a network error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('Network error - is the Next.js server running?');
        }
        
        if (attempt === maxRetries) {
          console.error('Error sending message after retries:', error);
          let errorMessage = "Failed to connect to server after retries.";
          
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = "Network error: Could not reach the API. Please make sure the Next.js server is running and try again.";
          } else if (error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = "Failed to connect to server. This chatbot may take 3-4 minutes to respond initially. Please try again.";
          }
          
          const botResponse = {
            role: 'assistant',
            content: errorMessage
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-6 right-6 z-50 focus:outline-none"
          aria-label="Open chatbot"
        >
          {/* Pulse ring animation */}
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>
          
          {/* Main button */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 animate-pulse-glow">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            <svg className="relative w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <span className="font-semibold">Ask me anything! 🤖</span>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Enhanced Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-slide-up">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  Ask Me Anything
                  <span className="text-xl">🤖</span>
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  May take 3-4 minutes initially
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200 hover:rotate-90"
              aria-label="Close chatbot"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-t from-gray-50 to-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


