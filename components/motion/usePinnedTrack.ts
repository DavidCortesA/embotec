'use client';

import { useCallback, useRef, useState } from 'react';
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * Ventana extra al final del recorrido. El muelle va un pelín por detrás del
 * scroll y este margen le da tiempo a asentarse antes de que el pin se suelte;
 * sin él, el último panel todavía se está colocando cuando la sección empieza
 * a subir.
 */
const TAIL = 35;

/** Persigue al scroll en vez de copiarlo cuadro a cuadro: da el deslizamiento */
const GLIDE = {
  stiffness: 110,
  damping: 26,
  mass: 0.6,
  restDelta: 0.0005,
};

/**
 * Scroll pinning al estilo del ejemplo de motion.dev: un contenedor de varias
 * ventanas de alto cuyo hijo se queda fijo mientras dura ese tramo, de modo que
 * el scroll vertical se traduce en desplazamiento lateral de paneles a pantalla
 * completa.
 *
 * Toda la geometría va en unidades de ventana, con la misma cifra en las dos
 * dimensiones: `n-1` transiciones son `(n-1)00vh` de scroll y `(n-1)00vw` de
 * desplazamiento. Por eso no hay que medir nada y no puede desincronizarse.
 */
export function usePinnedTrack(count: number) {
  const panels = Math.max(1, count);
  const travel = (panels - 1) * 100;
  /** Progreso al que el recorrido ya está completo (el resto es la cola) */
  const trackEnd = travel / (travel + TAIL);

  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    // El pin empieza cuando el contenedor toca el borde superior y termina
    // cuando su final alcanza el inferior.
    offset: ['start start', 'end end'],
  });
  const glide = useSpring(scrollYProgress, GLIDE);

  const x = useTransform(glide, [0, trackEnd], ['0vw', `-${travel}vw`]);
  const progress = useTransform(glide, [0, trackEnd], [0, 1]);

  useMotionValueEvent(progress, 'change', (value) => {
    const clamped = Math.min(1, Math.max(0, value));
    setActive(Math.round(clamped * (panels - 1)));
  });

  /**
   * Lleva la página al punto de scroll en el que un panel queda centrado.
   *
   * Hace falta para el teclado: si un enlace de un panel que está fuera de
   * pantalla recibe el foco, el navegador intenta traerlo a la vista sin saber
   * que su posición la dicta el scroll, y acaba en un sitio arbitrario. Con
   * esto, tabular avanza el pin panel a panel.
   */
  const focusPanel = useCallback(
    (index: number) => {
      const pin = pinRef.current;
      if (!pin || panels < 2) return;

      const top = window.scrollY + pin.getBoundingClientRect().top;
      const distance = pin.offsetHeight - window.innerHeight;

      window.scrollTo({
        top: top + distance * trackEnd * (index / (panels - 1)),
        behavior: 'auto',
      });
    },
    [panels, trackEnd]
  );

  return {
    /** Va en el contenedor alto, el que define cuánto dura el pin */
    pinRef,
    /** Alto del contenedor: ventana + recorrido + cola */
    height: `${100 + travel + TAIL}svh`,
    /** Desplazamiento lateral del riel */
    x,
    /** 0 → 1 a lo largo del recorrido, para barras y contadores */
    progress,
    /** Índice del panel a la vista */
    active,
    focusPanel,
  };
}
