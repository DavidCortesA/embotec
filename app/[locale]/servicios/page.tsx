import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import { services } from '@/data/services';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Services' });

  return buildPageMetadata({
    locale,
    href: '/servicios',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function ServicesPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('Services');
  const tNav = await getTranslations('Navbar');
  const tCta = await getTranslations('Home.cta');

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: tNav('home'), href: '/' },
              { name: tNav('services'), href: '/servicios' },
            ],
            locale
          ),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: t('title'),
            itemListElement: services.map((service, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: t(`items.${service.key}.title`),
              url: absoluteUrl(service.href, locale),
            })),
          },
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal as="li" key={service.slug} delay={index * 0.07}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-3xl border border-embotec-light bg-embotec-white p-8 transition-colors hover:border-embotec-blue/40 hover:bg-embotec-bg"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-embotec-dark text-embotec-orange transition-colors group-hover:bg-embotec-blue group-hover:text-embotec-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h2 className="mt-6 font-heading text-xl font-bold text-embotec-dark">
                    {t(`items.${service.key}.title`)}
                  </h2>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-embotec-gray">
                    {t(`items.${service.key}.summary`)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-embotec-blue">
                    {t('cta')}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
