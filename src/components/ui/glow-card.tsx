import React, { useRef, useState, useEffect } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowHue?: number;
  glowColor?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  [key: string]: any; // Allow any additional props
}

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '',
  glowHue = 180, // default cyan
  glowColor,
  as: Component = 'div',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const defaultGlowColor = glowColor || '#00ffff';
  
  const glowStyle = isHovered
    ? {
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 255, 0.15), transparent 40%)`,
      }
    : {};

  return (
    <Component
      ref={cardRef}
      className={`relative rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isHovered ? 'scale-[1.03]' : 'scale-100'
      } ${className}`}
      style={{
        background: 'rgba(15, 11, 29, 0.5)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
        boxShadow: isHovered
          ? '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2)'
          : '0 0 15px rgba(0, 255, 255, 0.2)',
      }}
      {...props}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          ...glowStyle,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </Component>
  );
};

export default GlowCard;
