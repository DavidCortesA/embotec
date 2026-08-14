import type { Metadata } from 'next';
import { Boxes } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { pageImages, processImages, serviceImages } from '@/data/images';
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

/**
 * TODO (EMBOTEC): al sustituir los casos por trabajos reales, cambiar también
 * estas fotos por las del propio taller.
 */
const CASES = [
  { id: '1', image: serviceImages.repair },
  { id: '2', image: processImages.testing },
  { id: '3', image: serviceImages.maintenance },
] as const;

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
        image={pageImages.projects}
        meta={`0${CASES.length} — ${t('eyebrow')}`}
      />

      <section className="bg-embotec-white py-24 sm:py-32">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Reveal>
            <p className="max-w-2xl border-l-2 border-embotec-orange pl-5 text-sm leading-relaxed text-embotec-gray">
              {t('disclaimer')}
            </p>
          </Reveal>

          {/* Cada caso ocupa una banda completa, alternando el lado de la foto */}
          <ol className="mt-20 flex flex-col gap-24 sm:gap-32">
            {CASES.map((item, index) => (
              <li
                key={item.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal
                  delay={0.08}
                  className={index % 2 === 1 ? 'lg:order-2' : undefined}
                >
                  <ParallaxImage
                    src={item.image}
                    strength={12}
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="aspect-[5/4] w-full rounded-2xl"
                  />
                </Reveal>

                <div className={index % 2 === 1 ? 'lg:order-1' : undefined}>
                  <span className="display block text-[clamp(3.5rem,8vw,7rem)] leading-none text-embotec-orange-dark/20">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <RevealText
                    as="h2"
                    className="display mt-4 text-[clamp(1.75rem,3.5vw,3rem)] text-embotec-dark"
                  >
                    {t(`cases.${item.id}.title`)}
                  </RevealText>

                  <dl className="mt-8 flex flex-col">
                    {FIELDS.map((field) => (
                      <Reveal
                        key={field}
                        delay={0.06}
                        className="border-t border-embotec-light py-4"
                      >
                        <dt className="tech-label text-embotec-orange-dark">
                          {t(`labels.${field}`)}
                        </dt>
                        <dd className="mt-2 text-base leading-relaxed text-embotec-gray">
                          {t(`cases.${item.id}.${field}`)}
                        </dd>
                      </Reveal>
                    ))}
                  </dl>
                </div>
              </li>
            ))}
          </ol>

          <Reveal className="mt-24 flex flex-col items-start gap-5 rounded-2xl border border-dashed border-embotec-light bg-embotec-bg p-8 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-embotec-dark text-embotec-orange">
              <Boxes className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-base leading-relaxed text-embotec-gray">
              {t('comingSoon')}
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
