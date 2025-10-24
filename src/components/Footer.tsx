import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background neon-border-cyan border-t-2 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-6">
          <NavLink to="/" className="font-rainbow text-2xl neon-text-pink hover:opacity-80 transition-opacity">
            Aimee Farabee
          </NavLink>
          <p className="neon-text-cyan/70 mt-2 mb-4">Product Manager • AI Enthusiast • Lifelong Learner</p>
        </div>
        
        <nav className="flex justify-center gap-6 mb-6 text-sm">
          <NavLink 
            to="/" 
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            Home
          </NavLink>
          <a 
            href="/#about"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            About
          </a>
          <NavLink 
            to="/projects"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            Projects
          </NavLink>
          <NavLink 
            to="/blog"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            Blog
          </NavLink>
          <a 
            href="/#contact"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            Contact
          </a>
        </nav>

        <div className="flex justify-center gap-4 mb-6 text-sm">
          <a 
            href="https://www.linkedin.com/in/aimeefarabee/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/afarabee" 
            target="_blank" 
            rel="noopener noreferrer"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            GitHub
          </a>
          <a 
            href="mailto:genai-aims@gmail.com"
            className="neon-text-cyan hover:neon-text-pink transition-colors focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
          >
            Email
          </a>
        </div>

        <p className="neon-text-cyan/50 text-sm text-center">© 2025 Aimee Farabee. Built with passion and curiosity.</p>
      </div>
    </footer>
  );
};

export default Footer;
