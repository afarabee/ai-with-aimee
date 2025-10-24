import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `nav-link transition-all duration-300 ${
      isActive 
        ? 'border-b-2 border-transparent' 
        : ''
    }`;
  };

  const navLinkStyle = (isActive: boolean) => ({
    textShadow: isActive 
      ? '0 0 8px rgba(244, 70, 160, 0.8)' 
      : undefined,
    borderBottomColor: isActive ? '#f446a0' : 'transparent',
    boxShadow: isActive ? '0 2px 8px rgba(244, 70, 160, 0.6)' : undefined,
  });

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 neon-border-cyan border-b-2">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <NavLink to="/" className="font-rainbow text-2xl neon-text-pink">
            Aimee Farabee
          </NavLink>
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              end
              className={navLinkClass}
              style={({ isActive }) => navLinkStyle(isActive)}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 10px rgba(184, 242, 227, 0.8)';
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.classList.contains('active');
                e.currentTarget.style.textShadow = isActive 
                  ? '0 0 8px rgba(244, 70, 160, 0.8)' 
                  : '';
              }}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about"
              className={navLinkClass}
              style={({ isActive }) => navLinkStyle(isActive)}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 10px rgba(184, 242, 227, 0.8)';
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.classList.contains('active');
                e.currentTarget.style.textShadow = isActive 
                  ? '0 0 8px rgba(244, 70, 160, 0.8)' 
                  : '';
              }}
            >
              About
            </NavLink>
            <NavLink 
              to="/projects"
              className={navLinkClass}
              style={({ isActive }) => navLinkStyle(isActive)}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 10px rgba(184, 242, 227, 0.8)';
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.classList.contains('active');
                e.currentTarget.style.textShadow = isActive 
                  ? '0 0 8px rgba(244, 70, 160, 0.8)' 
                  : '';
              }}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/blog"
              className={navLinkClass}
              style={({ isActive }) => navLinkStyle(isActive)}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 10px rgba(184, 242, 227, 0.8)';
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.classList.contains('active');
                e.currentTarget.style.textShadow = isActive 
                  ? '0 0 8px rgba(244, 70, 160, 0.8)' 
                  : '';
              }}
            >
              Blog
            </NavLink>
            <a 
              href="/#contact"
              className="nav-link transition-all duration-300"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    const navHeight = 80;
                    const elementPosition = element.offsetTop - navHeight;
                    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                  }
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = '0 0 10px rgba(184, 242, 227, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = '';
              }}
            >
              Contact
            </a>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden neon-text-cyan"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <NavLink 
              to="/" 
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 nav-link w-full text-left ${isActive ? 'border-l-2' : ''}`}
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 nav-link w-full text-left ${isActive ? 'border-l-2' : ''}`}
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              About
            </NavLink>
            <NavLink 
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 nav-link w-full text-left ${isActive ? 'border-l-2' : ''}`}
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              Projects
            </NavLink>
            <NavLink 
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block py-2 nav-link w-full text-left ${isActive ? 'border-l-2' : ''}`}
              style={({ isActive }) => navLinkStyle(isActive)}
            >
              Blog
            </NavLink>
            <a 
              href="/#contact"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  const element = document.getElementById('contact');
                  if (element) {
                    const navHeight = 80;
                    const elementPosition = element.offsetTop - navHeight;
                    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
                  }
                }
              }}
              className="block py-2 nav-link w-full text-left"
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
