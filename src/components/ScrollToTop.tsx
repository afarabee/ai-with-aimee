import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash) {
      // If there's a hash, scroll to that element
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          const navHeight = 80;
          const elementPosition = element.offsetTop - navHeight;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
        }
      }, 0);
    } else {
      // No hash, scroll to top as usual
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
