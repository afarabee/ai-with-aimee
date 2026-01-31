import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const targetHash = hash || window.location.hash;
    const navHeight = 80;

    if (targetHash) {
      const elementId = targetHash.substring(1);
      
      // First scroll after initial render
      const timer1 = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetTop = rect.top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      }, 300);
      
      // Correction scroll after animations settle
      const timer2 = setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Only correct if we're more than 50px off
          if (Math.abs(rect.top - navHeight) > 50) {
            const targetTop = rect.top + window.scrollY - navHeight;
            window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
          }
        }
      }, 700);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
