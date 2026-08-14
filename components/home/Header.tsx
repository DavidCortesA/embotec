'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { company } from '@/data/company';
import { Link } from '@/i18n/navigation';

/**
 * Hero de la portada. La imagen de fondo vive en
 * `public/images/hero-workshop.svg`: para usar una foto de taller basta
 * apuntar la utilidad de background al archivo nuevo (JPG/WebP) más abajo.
 * El degradado azul marino encima garantiza 15:1 de contraste con el texto.
 */
export default function Header() {
  const t = useTranslations('Home.hero');
  const tCommon = useTranslations('Common');
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { key: 'years', value: company.yearsInBusiness },
    { key: 'motors', value: company.motorsServiced },
    { key: 'response', value: t('responseValue') },
  ];

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.09 },
    },
  };

  const item = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="on-dark relative isolate overflow-hidden bg-embotec-dark">
      {/* Imagen de fondo + velo para contraste (decorativos) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[url('/images/hero-workshop.svg')] bg-cover bg-center bg-no-repeat"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-embotec-dark via-embotec-dark/90 to-embotec-dark/50"
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="mx-auto w-full max-w-6xl px-6 pt-[calc(var(--navbar-height)+48px)] pb-20 sm:pb-28"
      >
        <motion.p
          variants={item} data-reveal
          className="flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-embotec-orange uppercase"
        >
          <span aria-hidden className="h-px w-8 bg-embotec-orange" />
          {t('eyebrow')}
        </motion.p>

        <motion.h1
          variants={item} data-reveal
          className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-embotec-white text-balance sm:text-5xl lg:text-6xl"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          variants={item} data-reveal
          className="mt-6 max-w-xl text-lg leading-relaxed text-embotec-light"
        >
          {t('description')}
        </motion.p>

        <motion.div variants={item} data-reveal className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
          >
            {tCommon('quoteCta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/servicios"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/40 px-6 py-3 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
          >
            {tCommon('servicesCta')}
          </Link>
        </motion.div>

        <motion.dl
          variants={item} data-reveal
          className="mt-16 grid max-w-2xl grid-cols-1 gap-6 border-t border-embotec-white/15 pt-8 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.key}>
              <dt className="text-sm text-embotec-light">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="mt-1 font-heading text-3xl font-extrabold text-embotec-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
