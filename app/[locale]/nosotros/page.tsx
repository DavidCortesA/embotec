import type { Metadata } from 'next';
import { Gauge, Recycle, ShieldCheck, Timer } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import { company } from '@/data/company';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'About' });

  return buildPageMetadata({
    locale,
    href: '/nosotros',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

const VALUES = [
  { key: 'measure', icon: Gauge },
  { key: 'reliability', icon: ShieldCheck },
  { key: 'commitment', icon: Recycle },
  { key: 'continuity', icon: Timer },
] as const;

export default async function AboutPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('About');
  const tNav = await getTranslations('Navbar');
  const tCta = await getTranslations('Home.cta');

  const stats = [
    { key: 'years', value: company.yearsInBusiness },
    { key: 'motors', value: company.motorsServiced },
    { key: 'clients', value: company.plantsServed },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(
          [
            { name: tNav('home'), href: '/' },
            { name: tNav('about'), href: '/nosotros' },
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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-embotec-dark text-balance sm:text-3xl">
              {t('story.title')}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <p className="text-lg leading-relaxed text-embotec-gray">
              {t('story.paragraphs.first')}
            </p>
            <p className="text-lg leading-relaxed text-embotec-gray">
              {t('story.paragraphs.second')}
            </p>
          </Reveal>
        </div>

        <dl className="mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.key}
              delay={index * 0.08}
              className="rounded-3xl border border-embotec-light bg-embotec-bg p-6"
            >
              <dt className="text-sm font-medium text-embotec-gray">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="mt-2 font-heading text-4xl font-extrabold text-embotec-dark">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      <section className="bg-embotec-bg py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-embotec-dark sm:text-3xl">
              {t('values.title')}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <Reveal
                  as="li"
                  key={value.key}
                  delay={index * 0.08}
                  className="rounded-3xl border border-embotec-light bg-embotec-white p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-embotec-dark text-embotec-orange">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-heading text-base font-bold text-embotec-dark">
                    {t(`values.items.${value.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-embotec-gray">
                    {t(`values.items.${value.key}.description`)}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
