import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Neon glow overlay - behind content */}
      {isTransitioning && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            animation: "neonGlowFade 0.4s ease-in-out",
            background: "radial-gradient(circle at center, rgba(57, 225, 227, 0.1) 0%, transparent 70%)",
          }}
        />
      )}
      
      {/* Page content with fade animation */}
      <div
        key={location.pathname}
        style={{
          animation: "pageEnter 0.7s ease-in-out",
        }}
        className="relative z-10"
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
