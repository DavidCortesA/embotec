import type { Metadata } from 'next';
import { Check, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import { company } from '@/data/company';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, ORGANIZATION_ID } from '@/lib/schema';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Contact' });

  return buildPageMetadata({
    locale,
    href: '/contacto',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

const CHECKLIST = ['1', '2', '3', '4'] as const;

export default async function ContactPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('Contact');
  const tNav = await getTranslations('Navbar');

  const channels = [
    {
      key: 'email',
      icon: Mail,
      value: company.email,
      href: `mailto:${company.email}`,
    },
    {
      key: 'phone',
      icon: Phone,
      value: company.phone,
      href: company.phoneHref,
    },
    { key: 'location', icon: MapPin, value: t('locationValue'), href: null },
    { key: 'hours', icon: Clock, value: t('hoursValue'), href: null },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: tNav('home'), href: '/' },
              { name: tNav('contact'), href: '/contacto' },
            ],
            locale
          ),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: t('metaTitle'),
            description: t('metaDescription'),
            url: absoluteUrl('/contacto', locale),
            inLanguage: locale,
            about: { '@id': ORGANIZATION_ID },
            mainEntity: {
              '@type': 'Organization',
              '@id': ORGANIZATION_ID,
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'sales',
                email: company.email,
                telephone: company.phone,
                availableLanguage: ['es', 'en'],
              },
            },
          },
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => {
            const Icon = channel.icon;

            const content = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-embotec-dark text-embotec-orange">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-5 block text-sm font-medium text-embotec-gray">
                  {t(channel.key)}
                </span>
                <span className="mt-1 block font-heading text-base font-bold text-embotec-dark">
                  {channel.value}
                </span>
              </>
            );

            return (
              <Reveal
                as="li"
                key={channel.key}
                delay={index * 0.07}
                className="rounded-3xl border border-embotec-light bg-embotec-white p-6"
              >
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="block transition-opacity hover:opacity-75"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Reveal className="rounded-3xl border border-embotec-light bg-embotec-bg p-8">
            <h2 className="text-xl font-extrabold tracking-tight text-embotec-dark sm:text-2xl">
              {t('whatToSend.title')}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {CHECKLIST.map((id) => (
                <li key={id} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-embotec-blue text-embotec-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-base leading-relaxed text-embotec-dark">
                    {t(`whatToSend.items.${id}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.1}
            className="on-dark flex flex-col justify-between rounded-3xl bg-embotec-dark p-8"
          >
            <div>
              <span aria-hidden className="block h-1 w-10 bg-embotec-orange" />
              <h2 className="mt-5 text-xl font-extrabold tracking-tight text-embotec-white">
                {t('urgency.title')}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-embotec-light">
                {t('urgency.description')}
              </p>
            </div>
            <a
              href={company.phoneHref}
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-embotec-orange px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {company.phone}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
