'use client';

import { motion, useScroll, useSpring, useTransform, wrap } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Porcentaje de cinta que avanza por cada píxel de scroll. Con 0.022, unos
 * 1.150 px de página completan un ciclo entero de la lista.
 */
const SPEED = 0.022;

/** Copias de la lista en el riel; `wrap` cicla sobre una de ellas */
const COPIES = 4;
const STEP = 100 / COPIES;

/**
 * Cinta de especialidades cuya posición la fija el scroll: avanza al bajar,
 * retrocede al subir y se queda quieta si tú te quedas quieto. No se
 * autodesplaza, así que no es "contenido en movimiento" en el sentido de WCAG
 * 2.2.2 y no necesita un botón de pausa.
 *
 * La lista se repite cuatro veces para que el bucle sea invisible; solo el
 * primer bloque es legible por lectores de pantalla, el resto es decorativo.
 */
export default function Ticker() {
  const t = useTranslations('Home');
  const prefersReducedMotion = useReducedMotion();
  // TODO (EMBOTEC): pedido del cliente — la cinta debe listar todas las
  // Marcas atendidas en vez de las frases de servicios. Falta que el cliente
  // pase el listado de marcas; en cuanto llegue, reemplazar `Home.ticker` en
  // messages/es.json y messages/en.json por esa lista.
  const items = t.raw('ticker') as string[];

  const { scrollY } = useScroll();
  // El muelle es lo que convierte el salto del scroll en deslizamiento.
  const glide = useSpring(scrollY, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
    restDelta: 0.5,
  });
  // `wrap` mantiene el desplazamiento dentro de una copia: al pasar de -25%
  // vuelve a 0% con la cinta en la misma posición aparente.
  const x = useTransform(glide, (value) => `${wrap(-STEP, 0, -value * SPEED)}%`);

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="display px-6 text-[clamp(1.5rem,3.4vw,2.75rem)]">
            {item}
          </span>
          <span aria-hidden className="text-lg">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <section className="relative overflow-hidden bg-embotec-night py-4">
      <div className="-mx-[2%] w-[104%] -rotate-[1.4deg] border-y border-embotec-orange-dark/40 bg-embotec-orange py-3 text-embotec-dark">
        <motion.div
          style={{
            x: prefersReducedMotion ? 0 : x,
            willChange: 'transform',
          }}
          className="flex w-max flex-nowrap"
        >
          {row}
          <span aria-hidden className="flex">
            {row}
            {row}
            {row}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
