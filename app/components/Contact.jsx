export default function Contact() {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
      value: 'saivishnuvamsis07@gmail.com',
      link: 'mailto:saivishnuvamsis07@gmail.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      label: 'LinkedIn',
      value: 'LinkedIn Profile',
      link: 'https://www.linkedin.com/in/vishnu-senagasetty/',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: 'Phone',
      value: '+1 346 901 8158',
      link: 'tel:+13469018158',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Location',
      value: 'Houston, Texas',
      link: null,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="contact" className="relative py-24 bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-600 uppercase tracking-wider bg-blue-100 rounded-full mb-4">
            Get In Touch
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Contact <span className="text-gradient">Information</span>
          </h2>
          <p className="text-gray-600 text-lg">Feel free to reach out for further information or discussions!</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {contactInfo.map((contact, index) => (
              <a
                key={index}
                href={contact.link || undefined}
                target={contact.link?.startsWith('http') ? '_blank' : undefined}
                rel={contact.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`group block bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up ${!contact.link ? 'cursor-default' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${contact.color} rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                    {contact.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {contact.label}
                    </p>
                    <p className={`text-lg font-bold ${contact.link ? 'text-blue-600 group-hover:text-blue-700' : 'text-gray-900'} transition-colors`}>
                      {contact.value}
                    </p>
                  </div>
                  {contact.link && (
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


