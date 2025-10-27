import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
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
        border: '2px solid hsl(var(--color-cyan))',
        boxShadow: '0 0 12px hsl(var(--color-cyan) / 0.6), inset 0 0 8px hsl(var(--color-cyan) / 0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid hsl(var(--color-pink))';
        e.currentTarget.style.boxShadow = '0 0 16px hsl(var(--color-pink) / 0.7), inset 0 0 10px hsl(var(--color-pink) / 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '2px solid hsl(var(--color-cyan))';
        e.currentTarget.style.boxShadow = '0 0 12px hsl(var(--color-cyan) / 0.6), inset 0 0 8px hsl(var(--color-cyan) / 0.2)';
      }}
      aria-label="Back to top"
    >
      <ChevronUp 
        size={24} 
        className="neon-text-cyan transition-all duration-300 hover:neon-text-pink"
        style={{
          filter: 'drop-shadow(0 0 6px hsl(var(--color-cyan) / 0.8))',
        }}
      />
    </button>
  );
};

export default BackToTop;
