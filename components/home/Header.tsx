'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ParallaxImage from '@/components/ui/ParallaxImage';
import RevealText from '@/components/ui/RevealText';
import { company } from '@/data/company';
import { images } from '@/data/images';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/lib/useReducedMotion';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Portada a sangre: la foto queda detrás moviéndose más despacio que el texto
 * y el bloque de contenido se va apagando conforme la siguiente sección sube.
 * El doble degradado sobre la foto es lo que sostiene el contraste del texto
 * blanco (WCAG 1.4.3), no la foto en sí: puede cambiarse sin romperlo.
 */
export default function Header() {
  const t = useTranslations('Home.hero');
  const tCommon = useTranslations('Common');
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const stats = [
    { key: 'years', value: company.yearsInBusiness },
    { key: 'motors', value: company.motorsServiced },
    { key: 'response', value: t('responseValue') },
  ];

  return (
    <section
      ref={sectionRef}
      className="on-dark relative isolate flex min-h-[100svh] flex-col bg-embotec-night"
    >
      <div className="absolute inset-0 -z-20">
        <ParallaxImage
          src={images.hero}
          alt={t('imageAlt')}
          strength={10}
          priority
          sizes="100vw"
          className="h-full w-full"
        />
      </div>

      {/* Dos velos cruzados: uno da contraste al texto de la izquierda, el otro
          funde el borde inferior con la sección siguiente. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-embotec-night via-embotec-night/80 to-embotec-night/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-embotec-night/70 via-transparent to-embotec-night"
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
        className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pt-[calc(var(--navbar-height)+56px)] pb-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
          data-reveal
          className="tech-label flex items-center gap-3 text-embotec-orange"
        >
          <span
            aria-hidden
            className="relative flex h-1.5 w-1.5 items-center justify-center"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-embotec-orange opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-embotec-orange" />
          </span>
          {t('eyebrow')}
        </motion.p>

        <RevealText
          as="h1"
          trigger="mount"
          delay={0.15}
          className="display mt-8 max-w-[16ch] text-[clamp(2.75rem,8.5vw,7.5rem)] text-embotec-white"
        >
          {t('title')}
        </RevealText>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            data-reveal
            className="max-w-md text-lg leading-relaxed text-embotec-light"
          >
            {t('description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.82, ease: EASE }}
            data-reveal
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/contacto"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
            >
              {tCommon('quoteCta')}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/35 px-7 py-3.5 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
            >
              {tCommon('servicesCta')}
            </Link>
          </motion.div>
        </div>

        {/* Ficha de datos al pie del hero */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1, ease: EASE }}
          data-reveal
          className="mt-14 grid grid-cols-1 gap-px border-t border-embotec-white/15 pt-8 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.key} className="flex flex-col gap-1">
              <dt className="tech-label text-embotec-light/70">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="display text-4xl text-embotec-white sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.p
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          data-reveal
          className="tech-label mt-12 flex items-center gap-2 text-embotec-light/60"
        >
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.span>
          {t('scrollCue')}
        </motion.p>
      </motion.div>
    </section>
  );
}
