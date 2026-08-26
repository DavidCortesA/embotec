import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import JsonLd from '@/components/seo/JsonLd';
import LegalContent, { type LegalSection } from '@/components/ui/LegalContent';
import PageHero from '@/components/ui/PageHero';
import { pageImages } from '@/data/images';
import { resolveLocale } from '@/lib/locale';
import { breadcrumbSchema } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Terms' });

  return buildPageMetadata({
    locale,
    href: '/terminos',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function TermsPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('Terms');
  const tNav = await getTranslations('Navbar');

  const sections = t.raw('sections') as LegalSection[];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(
            [
              { name: tNav('home'), href: '/' },
              { name: t('title'), href: '/terminos' },
            ],
            locale
          ),
        ]}
      />

      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        image={pageImages.projects}
      />

      <LegalContent updated={t('updated')} sections={sections} />
    </>
  );
}
