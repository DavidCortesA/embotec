'use client';

import { Fragment } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  /** En la portada anima al cargar; en el resto, al entrar en pantalla */
  trigger?: 'mount' | 'view';
  /** Segundos antes de arrancar */
  delay?: number;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Titular que aparece palabra por palabra desde debajo de su propia línea:
 * cada palabra vive en una caja con `overflow-hidden` y sube desde fuera, así
 * que el texto se "revela" en lugar de desvanecerse.
 *
 * Cada palabra sigue siendo texto real dentro de un único elemento de
 * encabezado, de modo que los lectores de pantalla leen la frase completa.
 */
export default function RevealText({
  children,
  className,
  as = 'h2',
  trigger = 'view',
  delay = 0,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];
  const words = children.split(' ');

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: delay,
        staggerChildren: prefersReducedMotion ? 0 : 0.055,
      },
    },
  };

  /*
   * `show` normaliza SIEMPRE `y` y `opacity`, aunque la variante de movimiento
   * reducido solo anime una de las dos.
   *
   * El servidor renderiza con `prefersReducedMotion === false` (no puede saber
   * la preferencia), así que el HTML sale con `transform: translateY(110%)`.
   * Si al hidratar la preferencia resulta ser `true` y `show` no mencionara
   * `y`, motion no tendría nada que devolver a cero: la palabra se quedaría
   * desplazada fuera de su caja `overflow-hidden` y el titular no se vería.
   */
  const word: Variants = prefersReducedMotion
    ? {
        hidden: { y: '0%', opacity: 0 },
        show: { y: '0%', opacity: 1, transition: { duration: 0.2 } },
      }
    : {
        // 130% y no 100%: la caja se agranda con el padding de abajo para
        // dejar sitio a los acentos, y con 100% la palabra asomaría por él.
        hidden: { y: '130%', opacity: 1 },
        show: { y: '0%', opacity: 1, transition: { duration: 0.85, ease: EASE } },
      };

  const animation =
    trigger === 'mount'
      ? { animate: 'show' as const }
      : {
          whileInView: 'show' as const,
          viewport: { once: true, margin: '-12%' },
        };

  return (
    <Component initial="hidden" variants={container} className={className} {...animation}>
      {words.map((value, index) => (
        <Fragment key={`${value}-${index}`}>
          <span
            // El titular va en caja alta con `line-height: 0.92`, así que la
            // caja de línea es más baja que los glifos: sin este margen
            // negativo el recorte se comería los acentos (Ó, Á) por arriba.
            className="inline-flex overflow-hidden pt-[0.16em] -mt-[0.16em] pb-[0.08em] -mb-[0.08em]"
          >
            <motion.span variants={word} data-reveal className="inline-block">
              {value}
            </motion.span>
          </span>
          {/* Espacio real entre palabras: sin él los lectores de pantalla
              leen la frase sin separaciones. */}
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Component>
  );
}
