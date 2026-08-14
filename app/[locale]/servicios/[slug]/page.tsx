import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import Faq, { type FaqItem } from '@/components/ui/Faq';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { serviceImages } from '@/data/images';
import { getService, services } from '@/data/services';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const service = getService(slug);
  if (!service) return {};

  const t = await getTranslations({ locale, namespace: 'Services' });

  return buildPageMetadata({
    locale,
    href: service.href,
    title: t(`items.${service.key}.metaTitle`),
    description: t(`items.${service.key}.metaDescription`),
  });
}

/**
 * Plantilla única para los cuatro servicios: el orden de bloques es siempre el
 * mismo (intro larga → qué incluye → qué atendemos → sectores → dudas), así que
 * añadir un servicio nuevo es añadir sus textos en `messages` y su entrada en
 * `data/services.ts`, sin tocar esta página.
 */
export default async function ServiceDetailPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  setRequestLocale(locale);

  const service = getService(slug);
  if (!service) notFound();

  const t = await getTranslations('Services');
  const tNav = await getTranslations('Navbar');
  const tCommon = await getTranslations('Common');
  const tCta = await getTranslations('Home.cta');

  const others = services.filter((item) => item.slug !== service.slug);
  const position = services.findIndex((item) => item.slug === service.slug) + 1;

  const bullets = Array.from({ length: service.bulletCount }, (_, index) =>
    t(`items.${service.key}.bullets.${index + 1}`)
  );
  const applications = t.raw(
    `items.${service.key}.applications`
  ) as string[];
  const faq = t.raw(`items.${service.key}.faq`) as FaqItem[];
  const sectors = t.raw('sectors') as string[];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: t(`items.${service.key}.title`),
            description: t(`items.${service.key}.description`),
            href: service.href,
            locale,
          }),
          breadcrumbSchema(
            [
              { name: tNav('home'), href: '/' },
              { name: tNav('services'), href: '/servicios' },
              { name: t(`items.${service.key}.title`), href: service.href },
            ],
            locale
          ),
          faqSchema(faq),
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t(`items.${service.key}.title`)}
        description={t(`items.${service.key}.description`)}
        image={serviceImages[service.key]}
        meta={`${String(position).padStart(2, '0')} / ${String(
          services.length
        ).padStart(2, '0')}`}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
          >
            {tCommon('quoteCta')}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="/servicios"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-white/35 px-7 py-3.5 font-heading text-sm font-bold text-embotec-white transition-colors hover:border-embotec-white hover:bg-embotec-white/10"
          >
            {tCommon('backToServices')}
          </Link>
        </div>
      </PageHero>

      {/* En detalle: el texto largo del servicio */}
      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="tech-label flex items-center gap-3 text-embotec-orange-dark">
              <span aria-hidden className="h-px w-10 bg-embotec-orange-dark" />
              {t('sectionLabels.overview')}
            </p>
            <Reveal delay={0.08} className="mt-8 flex flex-col gap-6">
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t(`items.${service.key}.intro.first`)}
              </p>
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t(`items.${service.key}.intro.second`)}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ParallaxImage
              src={serviceImages[service.key]}
              strength={13}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/5] w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Qué incluye */}
      <section className="bg-embotec-bg py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <RevealText
            as="h2"
            className="display text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
          >
            {t('includes')}
          </RevealText>

          <ul className="mt-12 grid gap-x-8 sm:grid-cols-2">
            {bullets.map((bullet, index) => (
              <Reveal
                as="li"
                key={bullet}
                delay={index * 0.06}
                className="flex items-start gap-4 border-t border-embotec-dark/15 py-6"
              >
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-embotec-orange text-embotec-dark">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                <span className="text-base leading-relaxed text-embotec-dark">
                  {bullet}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Qué atendemos + sectores: la cola larga de búsquedas */}
      <section className="on-dark bg-embotec-night py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_minmax(0,22rem)] lg:gap-20">
          <div>
            <p className="tech-label flex items-center gap-3 text-embotec-orange">
              <span aria-hidden className="h-px w-10 bg-embotec-orange" />
              {t('sectionLabels.applications')}
            </p>
            <ul className="mt-8 flex flex-col">
              {applications.map((application, index) => (
                <Reveal
                  as="li"
                  key={application}
                  delay={index * 0.04}
                  className="flex items-baseline gap-5 border-t border-embotec-white/15 py-5 last:border-b"
                >
                  <span className="tech-label text-embotec-light/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="display text-xl text-embotec-white sm:text-2xl">
                    {application}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.12} className="lg:pt-14">
            <p className="tech-label text-embotec-orange">
              {t('sectionLabels.sectors')}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <li
                  key={sector}
                  className="rounded-full border border-embotec-white/20 px-4 py-2 text-sm text-embotec-light"
                >
                  {sector}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-embotec-light/80">
              {t('coverage.description')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Dudas frecuentes de este servicio */}
      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Faq title={t('sectionLabels.faq')} items={faq} />
        </div>
      </section>

      {/* Otros servicios */}
      <section className="bg-embotec-bg py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <RevealText
            as="h2"
            className="display text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
          >
            {t('otherServices')}
          </RevealText>

          <ul className="mt-12 grid gap-8 sm:grid-cols-3">
            {others.map((item, index) => (
              <Reveal as="li" key={item.slug} delay={index * 0.07}>
                <Link href={item.href} className="group block">
                  <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-embotec-dark">
                    <Image
                      src={serviceImages[item.key]}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 30vw, 100vw"
                      className="object-cover grayscale-[45%] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
                    />
                  </figure>
                  <h3 className="display mt-5 flex items-start gap-2 text-xl text-embotec-dark transition-colors group-hover:text-embotec-orange-dark">
                    {t(`items.${item.key}.title`)}
                    <ArrowUpRight
                      className="mt-1 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden
                    />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-embotec-gray">
                    {t(`items.${item.key}.summary`)}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
