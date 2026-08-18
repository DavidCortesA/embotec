import type { Metadata } from 'next';
import { Gauge, Recycle, ShieldCheck, Timer } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
// Pedido del cliente: se elimina la banda de cifras (años de experiencia,
// motores atendidos, plantas atendidas), así que `company` queda sin uso.
// import { company } from '@/data/company';
import { images, pageImages } from '@/data/images';
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

  // Pedido del cliente: eliminar "Años de experiencia", "Motores atendidos"
  // y "Plantas atendidas" — ver sección de cifras comentada más abajo.
  // const stats = [
  //   { key: 'years', value: company.yearsInBusiness },
  //   { key: 'motors', value: company.motorsServiced },
  //   { key: 'clients', value: company.plantsServed },
  // ];

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
        image={pageImages.about}
        // Pedido del cliente: se elimina "Años de experiencia" de aquí también.
        // meta={`${company.yearsInBusiness} — ${t('stats.years')}`}
      />

      {/* Relato: texto a la izquierda, foto que sube más despacio a la derecha */}
      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <RevealText
              as="h2"
              className="display max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
            >
              {t('story.title')}
            </RevealText>

            <Reveal delay={0.1} className="mt-8 flex flex-col gap-6">
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t('story.paragraphs.first')}
              </p>
              <p className="text-lg leading-relaxed text-embotec-gray">
                {t('story.paragraphs.second')}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ParallaxImage
              src={images.workshop}
              strength={14}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/5] w-full rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Pedido del cliente: se elimina la banda de cifras (años de
          experiencia, motores atendidos, plantas atendidas). */}
      {/* <section className="on-dark bg-embotec-night py-20 sm:py-24">
        <dl className="mx-auto grid w-full max-w-7xl gap-12 px-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <Reveal key={stat.key} as="div" delay={index * 0.08}>
              <dt className="tech-label text-embotec-orange">
                {t(`stats.${stat.key}`)}
              </dt>
              <dd className="display mt-4 text-[clamp(3rem,7vw,5.5rem)] text-embotec-white">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section> */}

      {/* Valores */}
      <section className="bg-embotec-bg py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <RevealText
            as="h2"
            className="display max-w-[14ch] text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
          >
            {t('values.title')}
          </RevealText>

          <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <Reveal
                  as="li"
                  key={value.key}
                  delay={index * 0.08}
                  className="border-t border-embotec-dark/15 pt-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="tech-label text-embotec-orange-dark">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon
                      className="h-5 w-5 text-embotec-dark"
                      aria-hidden
                    />
                  </div>
                  <h3 className="display mt-5 text-2xl text-embotec-dark">
                    {t(`values.items.${value.key}.title`)}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-embotec-gray">
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
