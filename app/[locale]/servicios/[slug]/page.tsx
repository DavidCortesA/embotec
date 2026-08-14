import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import PageHero from '@/components/ui/PageHero';
import Reveal from '@/components/ui/Reveal';
import { getService, services } from '@/data/services';
import { Link } from '@/i18n/navigation';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema, serviceSchema } from '@/lib/schema';
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
  const bullets = Array.from({ length: service.bulletCount }, (_, index) =>
    t(`items.${service.key}.bullets.${index + 1}`)
  );

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
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t(`items.${service.key}.title`)}
        description={t(`items.${service.key}.description`)}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contacto"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-embotec-orange px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
          >
            {tCommon('quoteCta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/servicios"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-embotec-dark/20 px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:border-embotec-dark/50 hover:bg-embotec-white"
          >
            {tCommon('backToServices')}
          </Link>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <h2 className="text-2xl font-extrabold tracking-tight text-embotec-dark sm:text-3xl">
            {t('includes')}
          </h2>
        </Reveal>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {bullets.map((bullet, index) => (
            <Reveal
              as="li"
              key={bullet}
              delay={index * 0.06}
              className="flex items-start gap-3 rounded-2xl border border-embotec-light bg-embotec-bg p-5"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-embotec-blue text-embotec-white">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="text-base leading-relaxed text-embotec-dark">
                {bullet}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-embotec-bg py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-tight text-embotec-dark sm:text-3xl">
              {t('otherServices')}
            </h2>
          </Reveal>

          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((item, index) => {
              const Icon = item.icon;

              return (
                <Reveal as="li" key={item.slug} delay={index * 0.07}>
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-3xl border border-embotec-light bg-embotec-white p-6 transition-colors hover:border-embotec-blue/40"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-embotec-dark text-embotec-orange transition-colors group-hover:bg-embotec-blue group-hover:text-embotec-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 font-heading text-base font-bold text-embotec-dark">
                      {t(`items.${item.key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-embotec-gray">
                      {t(`items.${item.key}.summary`)}
                    </p>
                  </Link>
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
