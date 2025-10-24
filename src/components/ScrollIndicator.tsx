import { ChevronDown } from 'lucide-react';

const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce-subtle opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300">
      <ChevronDown 
        size={32} 
        className="neon-text-cyan"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))',
        }}
      />
    </div>
  );
};

export default ScrollIndicator;
