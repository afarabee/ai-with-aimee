import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const targetHash = hash || window.location.hash;
    const navHeight = 80;

    if (targetHash) {
      // Wait for page to fully render before scrolling to hash target
      const timer = setTimeout(() => {
        const el = document.getElementById(targetHash.substring(1));
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetTop = rect.top + window.scrollY - navHeight;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
