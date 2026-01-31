import { useState, useEffect } from 'react';

interface CursorGlowProps {
  primaryColor?: string;
  secondaryColor?: string;
  size?: number;
  primaryOpacity?: number;
  secondaryOpacity?: number;
}

const CursorGlow = ({
  primaryColor = '#f50ca0',
  secondaryColor = '#00ffff',
  size = 500,
  primaryOpacity = 0.15,
  secondaryOpacity = 0.1,
}: CursorGlowProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  // Convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryRgba = hexToRgba(primaryColor, primaryOpacity);
  const secondaryRgba = hexToRgba(secondaryColor, secondaryOpacity);

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        zIndex: 5,
        opacity: isVisible ? 1 : 0,
        background: `
          radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${primaryRgba}, transparent 40%),
          radial-gradient(${size * 0.8}px circle at ${position.x}px ${position.y}px, ${secondaryRgba}, transparent 50%)
        `,
      }}
    />
  );
};

export default CursorGlow;
