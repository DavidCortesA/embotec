'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePinnedTrack } from '@/components/motion/usePinnedTrack';
import RevealText from '@/components/ui/RevealText';
import { processImages } from '@/data/images';
import { useReducedMotion } from '@/lib/useReducedMotion';

const STEPS = [
  'diagnosis',
  'quote',
  'rewinding',
  'testing',
  'delivery',
] as const;

/**
 * Proceso del taller con scroll pinning (patrón de motion.dev): el contenedor
 * mide varias ventanas de alto y su hijo se queda fijo mientras dura ese
 * tramo, así que el scroll vertical se traduce en un desplazamiento lateral de
 * paneles a pantalla completa. Al terminar, el pin se suelta y la página sigue
 * bajando a la sección siguiente.
 *
 * Toda la geometría está en unidades de ventana: el recorrido lateral en `vw`
 * y el alto del contenedor en `svh`, con la misma cifra en ambos. Por eso no
 * hay que medir nada en JavaScript y no puede desincronizarse.
 *
 * Accesibilidad: es una lista ordenada sin elementos enfocables (nada queda
 * fuera de pantalla para el teclado) y con `prefers-reduced-motion` se muestra
 * como cuadrícula estática (WCAG 2.3.3).
 *
 * Los dos modos son componentes separados a propósito: así `useScroll` solo
 * existe cuando su `ref` llega a montarse.
 */
export default function ProcessScroll() {
  const prefersReducedMotion = useReducedMotion();

  return prefersReducedMotion ? <StaticProcess /> : <PinnedProcess />;
}

function PinnedProcess() {
  const t = useTranslations('Home.process');
  const { pinRef, height, x, progress, active } = usePinnedTrack(STEPS.length);

  return (
    <section className="bg-embotec-bg">
      {/* Entradilla: el titular se lee antes de que empiece el pin */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-14 sm:pt-32">
        <p className="tech-label flex items-center gap-3 text-embotec-orange-dark">
          <span aria-hidden className="h-px w-10 bg-embotec-orange-dark" />
          {t('eyebrow')}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-end">
          <RevealText
            as="h2"
            className="display max-w-[14ch] text-[clamp(2.25rem,5.5vw,4.5rem)] text-embotec-dark"
          >
            {t('title')}
          </RevealText>
          <p className="max-w-xl text-base leading-relaxed text-embotec-gray lg:pb-2">
            {t('description')}
          </p>
        </div>
      </div>

      <div
        ref={pinRef}
        // `data-hscroll`: sin JavaScript el layout se desarma en un scroll
        // horizontal nativo (ver el <noscript> del layout).
        data-hscroll
        className="relative"
        style={{ height }}
      >
        <div data-hscroll-inner className="sticky top-0 h-[100svh] overflow-hidden">
          {/* Barra de estado del pin */}
          <div className="absolute inset-x-0 top-0 z-10 pt-[var(--navbar-height)]">
            <div className="mx-auto flex w-full max-w-7xl items-center gap-5 px-6">
              <span className="tech-label text-embotec-dark">
                <span className="text-embotec-orange-dark">
                  {String(active + 1).padStart(2, '0')}
                </span>
                <span className="text-embotec-gray">
                  {' '}
                  / {String(STEPS.length).padStart(2, '0')}
                </span>
              </span>
              <div
                aria-hidden
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-embotec-light"
              >
                <motion.div
                  // scaleX es lo que anima el ejemplo de motion: no toca layout.
                  style={{ scaleX: progress }}
                  className="h-full origin-left rounded-full bg-embotec-orange-dark"
                />
              </div>
            </div>
          </div>

          <motion.ol
            style={{ x, willChange: 'transform' }}
            className="flex h-full w-max"
          >
            {STEPS.map((step, index) => (
              <ProcessPanel key={step} step={step} index={index} />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/** Un paso ocupando exactamente una ventana */
function ProcessPanel({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const t = useTranslations('Home.process');

  return (
    <li className="flex h-full w-screen shrink-0 items-center">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pt-[calc(var(--navbar-height)+32px)] pb-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <span className="display block text-[clamp(4rem,10vw,9rem)] leading-none text-embotec-orange-dark/25">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="display mt-4 text-[clamp(1.75rem,3.5vw,3rem)] text-embotec-dark">
            {t(`steps.${step}.title`)}
          </h3>
          <p className="mt-5 max-w-md text-base leading-relaxed text-embotec-gray sm:text-lg">
            {t(`steps.${step}.description`)}
          </p>
        </div>

        <figure className="relative order-1 aspect-[4/3] overflow-hidden rounded-2xl bg-embotec-dark lg:order-2 lg:aspect-[5/4]">
          <Image
            src={processImages[step]}
            // Decorativa: el título y la descripción del paso ya lo explican.
            alt=""
            fill
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </figure>
      </div>
    </li>
  );
}

/** Movimiento reducido: misma información, sin desplazamiento horizontal. */
function StaticProcess() {
  const t = useTranslations('Home.process');

  return (
    <section className="bg-embotec-bg py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="tech-label flex items-center gap-3 text-embotec-orange-dark">
          <span aria-hidden className="h-px w-10 bg-embotec-orange-dark" />
          {t('eyebrow')}
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-end">
          <RevealText
            as="h2"
            className="display max-w-[14ch] text-[clamp(2.25rem,5.5vw,4.5rem)] text-embotec-dark"
          >
            {t('title')}
          </RevealText>
          <p className="max-w-xl text-base leading-relaxed text-embotec-gray lg:pb-2">
            {t('description')}
          </p>
        </div>
      </div>

      <ol className="mx-auto mt-14 grid w-full max-w-7xl gap-x-8 gap-y-12 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex flex-col">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-embotec-dark">
              <Image
                src={processImages[step]}
                alt=""
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
            </figure>
            <span className="display mt-6 text-3xl text-embotec-orange-dark">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="display mt-2 text-2xl text-embotec-dark sm:text-3xl">
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
