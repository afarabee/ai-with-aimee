import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrolled / pageHeight) * 100;
      
      setIsVisible(scrollPercentage >= 30);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 z-[1000] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        backgroundColor: 'hsl(var(--background))',
        border: '2px solid #39e1e3',
        boxShadow: '0 0 12px rgba(57, 225, 227, 0.6), inset 0 0 8px rgba(57, 225, 227, 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid #f446a0';
        e.currentTarget.style.boxShadow = '0 0 16px rgba(244, 70, 160, 0.7), inset 0 0 10px rgba(244, 70, 160, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '2px solid #39e1e3';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(57, 225, 227, 0.6), inset 0 0 8px rgba(57, 225, 227, 0.2)';
      }}
      aria-label="Back to top"
    >
      <ChevronUp 
        size={24} 
        className="neon-text-cyan transition-all duration-300 hover:neon-text-pink"
        style={{
          filter: 'drop-shadow(0 0 6px rgba(57, 225, 227, 0.8))',
        }}
      />
    </button>
  );
};

export default BackToTop;
