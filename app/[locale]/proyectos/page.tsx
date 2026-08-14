import type { Metadata } from 'next';
import { Boxes } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Projects' });

  return buildPageMetadata({
    locale,
    href: '/proyectos',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

const CASES = ['1', '2', '3'] as const;
const FIELDS = ['equipment', 'scope', 'result'] as const;

export default async function ProjectsPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('Projects');
  const tNav = await getTranslations('Navbar');
  const tCta = await getTranslations('Home.cta');

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tNav('home'), href: '/' },
            { name: tNav('projects'), href: '/proyectos' },
          ],
          locale
        )}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <p className="max-w-2xl text-sm leading-relaxed text-embotec-gray">
            {t('disclaimer')}
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {CASES.map((id, index) => (
            <Reveal
              as="li"
              key={id}
              delay={index * 0.08}
              className="flex flex-col rounded-3xl border border-embotec-light bg-embotec-white p-8"
            >
              <span
                aria-hidden
                className="font-heading text-sm font-extrabold text-embotec-orange-dark"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-3 font-heading text-xl font-bold text-embotec-dark">
                {t(`cases.${id}.title`)}
              </h2>

              <dl className="mt-6 flex flex-col gap-4">
                {FIELDS.map((field) => (
                  <div key={field}>
                    <dt className="text-xs font-bold tracking-[0.14em] text-embotec-blue uppercase">
                      {t(`labels.${field}`)}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-embotec-gray">
                      {t(`cases.${id}.${field}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-dashed border-embotec-light bg-embotec-bg p-8 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-embotec-dark text-embotec-orange">
            <Boxes className="h-6 w-6" aria-hidden />
          </span>
          <p className="text-base leading-relaxed text-embotec-gray">
            {t('comingSoon')}
          </p>
        </Reveal>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
