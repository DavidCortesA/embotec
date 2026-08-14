import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import Faq, { type FaqItem } from '@/components/ui/Faq';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { images, pageImages, serviceImages } from '@/data/images';
import { services } from '@/data/services';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
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

  const sectors = t.raw('sectors') as string[];
  const faq = t.raw('faq') as FaqItem[];

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
          faqSchema(faq),
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        image={pageImages.services}
        meta={`0${services.length} — ${t('eyebrow')}`}
      />

      {/* Texto de posicionamiento: el cuerpo largo va arriba, no escondido al pie */}
      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <RevealText
              as="h2"
              className="display max-w-[14ch] text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
            >
              {t('intro.title')}
            </RevealText>
            <Reveal delay={0.1} className="mt-8 flex flex-col gap-6">
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t('intro.first')}
              </p>
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t('intro.second')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ParallaxImage
              src={images.workshop}
              strength={13}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/5] w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Los cuatro servicios */}
      <section className="on-dark bg-embotec-night py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal
                  as="li"
                  key={service.slug}
                  delay={(index % 2) * 0.1}
                  className={index % 2 === 1 ? 'sm:mt-20' : undefined}
                >
                  <Link href={service.href} className="group block">
                    <figure className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-embotec-white/10">
                      <Image
                        src={serviceImages[service.key]}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 46vw, 100vw"
                        className="object-cover grayscale-[45%] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-embotec-night via-embotec-night/25 to-transparent"
                      />
                      <span className="tech-label absolute top-5 left-5 text-embotec-white/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="absolute right-5 bottom-5 grid h-12 w-12 place-items-center rounded-full bg-embotec-white/10 text-embotec-orange backdrop-blur-md transition-colors group-hover:bg-embotec-orange group-hover:text-embotec-dark">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                    </figure>

                    <h2 className="display mt-7 text-3xl text-embotec-white transition-colors group-hover:text-embotec-orange sm:text-4xl">
                      {t(`items.${service.key}.title`)}
                    </h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-embotec-light/80">
                      {t(`items.${service.key}.summary`)}
                    </p>
                    <span className="tech-label mt-6 inline-flex items-center gap-2 text-embotec-orange">
                      {t('cta')}
                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Sectores + cobertura: señales de a quién servimos y dónde */}
      <section className="bg-embotec-bg py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20">
          <div>
            <p className="tech-label flex items-center gap-3 text-embotec-orange-dark">
              <span aria-hidden className="h-px w-10 bg-embotec-orange-dark" />
              {t('sectionLabels.sectors')}
            </p>
            <ul className="mt-8 flex flex-col">
              {sectors.map((sector, index) => (
                <Reveal
                  as="li"
                  key={sector}
                  delay={index * 0.05}
                  className="flex items-baseline gap-5 border-t border-embotec-dark/15 py-5 last:border-b"
                >
                  <span className="tech-label text-embotec-gray">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="display text-2xl text-embotec-dark sm:text-3xl">
                    {sector}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.12} className="lg:pt-14">
            <h2 className="display text-2xl text-embotec-dark sm:text-3xl">
              {t('coverage.title')}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-embotec-gray">
              {t('coverage.description')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ: también se publica como FAQPage en los datos estructurados */}
      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Faq title={t('sectionLabels.faq')} items={faq} />
        </div>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
