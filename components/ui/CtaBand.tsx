import { ArrowRight, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';
import { company } from '@/data/company';
import { Link } from '@/i18n/navigation';

type Props = {
  title: string;
  description: string;
};

/** Banda de cierre reutilizada al final de las páginas. */
export default async function CtaBand({ title, description }: Props) {
  const t = await getTranslations('Common');

  return (
    <section className="on-dark bg-embotec-dark py-16 sm:py-20">
      <Reveal className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span aria-hidden className="block h-1 w-12 bg-embotec-orange" />
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-embotec-white text-balance sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-embotec-light">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
          >
            {t('quoteCta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/40 px-6 py-3 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
