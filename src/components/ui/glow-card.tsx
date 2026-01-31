import React, { useRef, useState, useEffect } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowHue?: number;
  glowColor?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  [key: string]: any; // Allow any additional props
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 255, 255, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '',
  glowHue = 180, // default cyan
  glowColor = '#00ffff',
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

  const glowRgba = hexToRgba(glowColor, 0.15);
  const borderRgba = hexToRgba(glowColor, 0.3);
  const shadowHoverRgba = hexToRgba(glowColor, 0.4);
  const shadowDefaultRgba = hexToRgba(glowColor, 0.2);
  
  const glowStyle = isHovered
    ? {
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowRgba}, transparent 40%)`,
      }
    : {};

  return (
    <Component
      ref={cardRef}
      className={`relative rounded-2xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isHovered ? 'scale-[1.02]' : 'scale-100'
      } ${className}`}
      style={{
        background: 'rgba(26, 11, 46, 0.6)',
        border: `1px solid ${borderRgba}`,
        boxShadow: isHovered
          ? `0 0 30px ${shadowHoverRgba}, 0 0 60px ${shadowDefaultRgba}`
          : `0 0 15px ${shadowDefaultRgba}`,
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
