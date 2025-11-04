'use client';

export default function Navbar() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Sai Vishnu Vamsi
          </h1>
          <ul className="hidden md:flex space-x-2">
            {[
              { name: 'About', id: 'about' },
              { name: 'Skills', id: 'skills' },
              { name: 'Projects', id: 'projects' },
              { name: 'Experience', id: 'experience' },
              { name: 'Training', id: 'training' },
              { name: 'Achievements', id: 'achievements' },
              { name: 'Contact', id: 'contact' }
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium text-sm"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          {/* Mobile menu button placeholder */}
          <button className="md:hidden p-2 text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

