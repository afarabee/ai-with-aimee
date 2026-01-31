import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // React Router provides hash, but we still defensively read from window.
    const targetHash = hash || window.location.hash;

    const navHeight = 80;
    let cancelled = false;
    const timers: number[] = [];

    const scrollToIdWithRetries = (id: string) => {
      const attempts = [0, 80, 160, 260, 380, 520];

      attempts.forEach((delay, idx) => {
        const t = window.setTimeout(() => {
          if (cancelled) return;
          const el = document.getElementById(id);
          if (!el) return;

          // Use bounding rect to avoid stale offsetTop during layout shifts.
          const rect = el.getBoundingClientRect();
          const targetTop = rect.top + window.scrollY - navHeight;

          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: idx === 0 ? "smooth" : "auto",
          });
        }, delay);
        timers.push(t);
      });
    };

    if (targetHash) {
      // If there's a hash, scroll to that element (with retries to handle layout/animation settling)
      scrollToIdWithRetries(targetHash.substring(1));
    } else {
      // No hash, scroll to top as usual
      window.scrollTo(0, 0);
    }

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
