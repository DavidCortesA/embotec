'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Scroll suave en todo el sitio. Lenis no reemplaza el scroll nativo: sigue
 * moviendo el scroll real de la ventana (con su barra, su posición y sus
 * anclas), solo lo interpola. Por eso `position: sticky`, `useScroll` de
 * framer-motion y el pin del proceso siguen funcionando igual.
 *
 * No renderiza nada; vive en el layout.
 */
export default function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // WCAG 2.3.3: si el usuario pidió menos movimiento, scroll nativo y ya.
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      // easeOutExpo: arranca rápido y frena largo, que es lo que se lee como
      // "inercia" sin llegar a sentirse pesado.
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Deja el scroll táctil nativo: en móvil la interpolación se pelea con
      // el rebote del sistema y se siente peor que sin ella.
      syncTouch: false,
      // Los enlaces #ancla también viajan con la misma inercia.
      anchors: { offset: -104 },
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
