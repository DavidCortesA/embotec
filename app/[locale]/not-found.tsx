'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { services } from '@/data/services';
import { Link } from '@/i18n/navigation';

/**
 * 404 dentro de un idioma. Se renderiza dentro del layout de `[locale]`, así
 * que conserva navbar, pie y el idioma de la URL, y ofrece salidas útiles en
 * lugar de dejar al visitante en un callejón: inicio, servicios y contacto.
 *
 * Igual que `loading.tsx`, va en el cliente porque este archivo no recibe
 * `params.locale`: pedir las traducciones en el servidor haría dinámicas todas
 * las páginas del segmento (ver el comentario de `loading.tsx`).
 */
export default function LocaleNotFound() {
  const t = useTranslations('NotFound');
  const tNav = useTranslations('Navbar');
  const tServices = useTranslations('Services');

  return (
    <section className="on-dark flex min-h-[80svh] flex-col justify-center bg-embotec-night pt-[calc(var(--navbar-height)+64px)] pb-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="tech-label flex items-center gap-3 text-embotec-orange">
          <span aria-hidden className="h-px w-10 bg-embotec-orange" />
          {t('eyebrow')}
        </p>

        <RevealText
          as="h1"
          trigger="mount"
          delay={0.08}
          className="display mt-7 max-w-[18ch] text-[clamp(2.5rem,6.5vw,5rem)] text-embotec-white"
        >
          {t('title')}
        </RevealText>

        <Reveal delay={0.14}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-embotec-light">
            {t('description')}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
          >
            {t('homeCta')}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/35 px-7 py-3.5 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
          >
            {tNav('contact')}
          </Link>
        </Reveal>

        <div className="mt-16 border-t border-embotec-white/15 pt-8">
          <p className="tech-label text-embotec-light/60">{t('linksTitle')}</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className="font-heading text-base font-bold text-embotec-white transition-colors hover:text-embotec-orange"
                >
                  {tServices(`items.${service.key}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
