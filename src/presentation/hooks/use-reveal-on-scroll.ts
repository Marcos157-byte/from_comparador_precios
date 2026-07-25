import { useEffect, useRef, useState } from 'react';

// Compartido entre landing-page.tsx y home-page.tsx: revela una sección con fade +
// slight translate-y la primera vez que entra en el viewport (un solo trigger, no por
// elemento), respetando prefers-reduced-motion. El fade/translate en sí vive en las
// clases globales .scroll-reveal / .scroll-reveal-visible (src/index.css).
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
