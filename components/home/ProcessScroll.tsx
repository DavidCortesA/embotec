'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useTranslations } from 'next-intl';

const STEPS = [
  'diagnosis',
  'quote',
  'rewinding',
  'testing',
  'delivery',
] as const;

/**
 * Proceso del taller con scroll horizontal: la sección es más alta que la
 * ventana y, mientras se mantiene fija, el scroll vertical se traduce en
 * desplazamiento a la derecha. La distancia se mide con ResizeObserver para
 * que el recorrido termine exactamente al final de la sección.
 *
 * Accesibilidad: es una lista ordenada sin elementos enfocables (nada queda
 * fuera de pantalla para el teclado) y con `prefers-reduced-motion` se
 * muestra como cuadrícula estática (WCAG 2.3.3).
 */
export default function ProcessScroll() {
  const t = useTranslations('Home.process');
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || prefersReducedMotion) return;

    // ResizeObserver emite una primera medición al observar, así que no hace
    // falta llamar a setState de forma sincrónica dentro del efecto.
    const observer = new ResizeObserver(() => {
      setDistance(Math.max(0, track.scrollWidth - section.clientWidth));
    });
    observer.observe(track);
    observer.observe(section);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const heading = (
    <div className="mx-auto w-full max-w-6xl px-6">
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-embotec-blue uppercase">
        <span aria-hidden className="h-px w-8 bg-embotec-orange-dark" />
        {t('eyebrow')}
      </p>
      <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-embotec-dark text-balance sm:text-4xl">
        {t('title')}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-embotec-gray">
        {t('description')}
      </p>
    </div>
  );

  const cards = STEPS.map((step, index) => (
    <li
      key={step}
      className="flex w-[78vw] shrink-0 flex-col rounded-3xl border border-embotec-light bg-embotec-white p-8 sm:w-[380px] lg:w-[420px]"
    >
      <span
        aria-hidden
        className="font-heading text-5xl font-extrabold text-embotec-orange-dark"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-5 font-heading text-xl font-bold text-embotec-dark">
        {t(`steps.${step}.title`)}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-embotec-gray">
        {t(`steps.${step}.description`)}
      </p>
    </li>
  ));

  // Movimiento reducido: misma información, sin desplazamiento horizontal.
  if (prefersReducedMotion) {
    return (
      <section className="bg-embotec-bg py-20 sm:py-24">
        {heading}
        <ol className="mx-auto mt-12 grid w-full max-w-6xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="flex flex-col rounded-3xl border border-embotec-light bg-embotec-white p-8"
            >
              <span
                aria-hidden
                className="font-heading text-5xl font-extrabold text-embotec-orange-dark"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-embotec-dark">
                {t(`steps.${step}.title`)}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-embotec-gray">
                {t(`steps.${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-embotec-bg"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div
        data-hscroll
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[var(--navbar-height)] pb-12"
      >
        {heading}

        {/* `w-max` deja que el ancho natural del riel defina el recorrido */}
        <motion.ol
          ref={trackRef}
          style={{ x }}
          className="mt-10 flex w-max gap-6 px-6"
        >
          {cards}
        </motion.ol>

        <div className="mx-auto mt-10 w-full max-w-6xl px-6">
          <div
            aria-hidden
            className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-embotec-light"
          >
            <motion.div
              className="h-full rounded-full bg-embotec-orange-dark"
              style={{ width: progress }}
            />
          </div>
          <p className="mt-3 text-sm text-embotec-gray">{t('hint')}</p>
        </div>
      </div>
    </section>
  );
}
