import { ArrowRight, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { company } from '@/data/company';
import { images } from '@/data/images';
import { Link } from '@/i18n/navigation';

type Props = {
  title: string;
  description: string;
};

/** Banda de cierre reutilizada al final de las páginas. */
export default async function CtaBand({ title, description }: Props) {
  const t = await getTranslations('Common');

  return (
    <section className="on-dark relative isolate overflow-hidden bg-embotec-night py-24 sm:py-32">
      <div className="absolute inset-0 -z-20">
        <ParallaxImage
          src={images.cta}
          strength={10}
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
      {/* El velo es lo que garantiza el contraste del texto sobre la foto */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-embotec-night/85"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Reveal>
            <span aria-hidden className="block h-1 w-14 bg-embotec-orange" />
          </Reveal>
          <RevealText
            as="h2"
            className="display mt-8 text-[clamp(2.25rem,5.5vw,4.5rem)] text-embotec-white"
          >
            {title}
          </RevealText>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-embotec-light">
              {description}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="flex flex-wrap gap-3 lg:pb-2">
          <Link
            href="/contacto"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
          >
            {t('quoteCta')}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/35 px-7 py-3.5 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {company.phone}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
