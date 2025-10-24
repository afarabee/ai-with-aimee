import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
}

const AboutBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.body.scrollHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create very subtle, slower floating particles
    const particles: Particle[] = [];
    const particleCount = 30; // Reduced for subtlety

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.05, // Much slower movement
        vy: (Math.random() - 0.5) * 0.05,
        opacity: Math.random() * 0.12 + 0.03, // Very subtle opacity
        size: Math.random() * 1.5 + 0.5,
      });
    }

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f0b1d');
      gradient.addColorStop(1, '#1f0d36');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with cyan glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 240, 255, ${particle.opacity})`;
        ctx.fill();

        // Add subtle glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(120, 240, 255, ${particle.opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ minHeight: '100vh' }}
    />
  );
};

export default AboutBackground;
