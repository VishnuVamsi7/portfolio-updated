# Portfolio - Sai Vishnu Vamsi Senagasetty

A modern portfolio website built with Next.js 14 (App Router) and Tailwind CSS, featuring:

- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- 🤖 Interactive chatbot
- 📊 Project showcase with filtering
- 🎓 Education & Training sections
- 📝 Publications display
- 📧 Contact information

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Hero Section**: Introduction with resume download and chatbot access
- **About Section**: Personal background, skills, and expertise
- **Projects**: 6 featured projects with AI/ML/Data filtering
- **Training & Certifications**: Professional development achievements
- **Publications**: Research papers and publications
- **Contact**: Email, LinkedIn, Phone, and Location
- **Chatbot**: Interactive AI assistant (ready for API integration)

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- JavaScript/JSX

## Project Structure

```
app/
  components/
    Navbar.jsx       # Navigation bar
    Footer.jsx       # Footer component
    Hero.jsx         # Hero section
    About.jsx        # About section
    Projects.jsx     # Projects showcase
    Training.jsx     # Training & certifications
    Achievements.jsx # Publications
    Contact.jsx      # Contact information
    Chatbot.jsx      # Chatbot component
  layout.js          # Root layout
  page.js            # Home page
  globals.css        # Global styles
```

## Customization

To customize the chatbot, update `app/components/Chatbot.jsx` and integrate with your preferred AI service (OpenAI, Anthropic, etc.).

To add/update projects, edit the `projects` array in `app/components/Projects.jsx`.

## License

© 2025 Sai Vishnu Vamsi Senagasetty. All rights reserved.