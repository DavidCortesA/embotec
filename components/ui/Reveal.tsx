'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  children: React.ReactNode;
  /** Retraso en segundos, para escalonar varios elementos */
  delay?: number;
  /** Dirección desde la que entra el contenido */
  from?: 'bottom' | 'left' | 'right';
  className?: string;
  /** Etiqueta a renderizar (por defecto div) */
  as?: 'div' | 'li' | 'section';
};

const OFFSET = 24;

/**
 * Animación de entrada básica al hacer scroll, usada en las páginas
 * internas. Si el usuario pidió movimiento reducido, el contenido
 * simplemente aparece sin desplazamiento (WCAG 2.3.3).
 */
export default function Reveal({
  children,
  delay = 0,
  from = 'bottom',
  className,
  as = 'div',
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];

  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        y: from === 'bottom' ? OFFSET : 0,
        x: from === 'left' ? -OFFSET : from === 'right' ? OFFSET : 0,
      };

  return (
    <Component
      // El fallback de <noscript> en el layout lo hace visible sin JS.
      data-reveal
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.55,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </Component>
  );
}
