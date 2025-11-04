import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import WorkExperience from './components/WorkExperience';
import Training from './components/Training';
import Badges from './components/Badges';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <WorkExperience />
      <Training />
      <Badges />
      <Achievements />
      <Contact />
      <div id="chatbot">
        <Chatbot />
      </div>
    </>
  );
}

