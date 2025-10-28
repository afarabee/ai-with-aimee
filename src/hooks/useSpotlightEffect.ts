import { useEffect } from 'react';

export const useSpotlightEffect = () => {
  useEffect(() => {
    // Only run on non-touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const buttons = document.querySelectorAll<HTMLElement>('.btn-hero');

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      
      // Calculate mouse position relative to button as percentages
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Update CSS variables
      target.style.setProperty('--spot-x', `${x}%`);
      target.style.setProperty('--spot-y', `${y}%`);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      // Reset to center on leave
      target.style.setProperty('--spot-x', '50%');
      target.style.setProperty('--spot-y', '50%');
    };

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseleave', handleMouseLeave);
    });

    // Cleanup on unmount
    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
};
