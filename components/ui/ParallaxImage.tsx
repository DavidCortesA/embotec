'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  src: string;
  /** Vacío = imagen decorativa: el texto de al lado ya cuenta lo que se ve */
  alt?: string;
  /** Cuánto se desplaza la foto respecto al contenedor, en % de su alto */
  strength?: number;
  /** Recorte cuando la foto no es del mismo formato que el hueco */
  objectPosition?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Velo oscuro encima, para que el texto blanco mantenga contraste */
  overlay?: 'none' | 'soft' | 'strong';
};

const OVERLAYS = {
  none: null,
  soft: 'bg-gradient-to-t from-embotec-night/85 via-embotec-night/25 to-transparent',
  strong: 'bg-gradient-to-r from-embotec-night via-embotec-night/85 to-embotec-night/45',
} as const;

/**
 * Foto a sangre que se mueve más despacio que la página. El contenedor recorta
 * y la imagen es más alta que él, así que el desplazamiento nunca descubre un
 * borde vacío.
 */
export default function ParallaxImage({
  src,
  alt = '',
  strength = 12,
  objectPosition = 'center',
  sizes = '100vw',
  priority = false,
  className,
  overlay = 'none',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // `start end` -> el momento en que el contenedor asoma por abajo;
  // `end start` -> cuando termina de salir por arriba.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const glide = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0005,
  });
  const y = useTransform(glide, [0, 1], [`-${strength}%`, `${strength}%`]);

  const veil = OVERLAYS[overlay];

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div
        // El sobredimensionado compensa exactamente el recorrido del parallax.
        style={{
          y: prefersReducedMotion ? 0 : y,
          height: `${100 + strength * 2}%`,
          top: `-${strength}%`,
        }}
        className="absolute inset-x-0"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>

      {veil && <div aria-hidden className={`absolute inset-0 ${veil}`} />}
    </div>
  );
}
