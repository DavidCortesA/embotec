import type { Metadata } from 'next';
import { Check, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { company } from '@/data/company';
import { images, pageImages } from '@/data/images';
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
        image={pageImages.contact}
        meta={company.emergencyResponse}
      />

      {/* Canales: una rejilla de datos, sin tarjetas, al estilo de una ficha */}
      <section className="bg-embotec-white py-20 sm:py-24">
        <ul className="mx-auto grid w-full max-w-7xl gap-x-8 gap-y-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => {
            const Icon = channel.icon;

            const content = (
              <>
                <span className="tech-label flex items-center gap-2 text-embotec-orange-dark">
                  <Icon className="h-4 w-4" aria-hidden />
                  {t(channel.key)}
                </span>
                <span className="mt-4 block font-heading text-lg font-bold break-words text-embotec-dark">
                  {channel.value}
                </span>
              </>
            );

            return (
              <Reveal
                as="li"
                key={channel.key}
                delay={index * 0.07}
                className="border-t border-embotec-dark/15 pt-6"
              >
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="block transition-colors hover:text-embotec-orange-dark"
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
      </section>

      {/* Qué mandarnos, con la foto sosteniendo el bloque */}
      <section className="bg-embotec-bg py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <ParallaxImage
              src={images.workshop}
              strength={13}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/3] w-full rounded-2xl"
            />
          </Reveal>

          <div>
            <RevealText
              as="h2"
              className="display max-w-[16ch] text-[clamp(1.875rem,4vw,3rem)] text-embotec-dark"
            >
              {t('whatToSend.title')}
            </RevealText>

            <ul className="mt-8 flex flex-col">
              {CHECKLIST.map((id, index) => (
                <Reveal
                  as="li"
                  key={id}
                  delay={index * 0.06}
                  className="flex items-start gap-4 border-t border-embotec-dark/10 py-4"
                >
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-embotec-orange text-embotec-dark">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  <span className="text-base leading-relaxed text-embotec-dark">
                    {t(`whatToSend.items.${id}`)}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Urgencias: banda oscura de cierre con el teléfono */}
      <section className="on-dark relative isolate overflow-hidden bg-embotec-night py-24 sm:py-32">
        <div className="absolute inset-0 -z-20">
          <ParallaxImage
            src={images.cta}
            strength={10}
            sizes="100vw"
            className="h-full w-full"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-embotec-night/85" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span aria-hidden className="block h-1 w-14 bg-embotec-orange" />
            </Reveal>
            <RevealText
              as="h2"
              className="display mt-8 text-[clamp(2rem,5vw,4rem)] text-embotec-white"
            >
              {t('urgency.title')}
            </RevealText>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-embotec-light">
                {t('urgency.description')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="lg:pb-2">
            <a
              href={company.phoneHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
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
