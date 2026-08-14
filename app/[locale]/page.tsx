import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/home/Header';
import ProcessScroll from '@/components/home/ProcessScroll';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhyUs from '@/components/home/WhyUs';
import JsonLd from '@/components/seo/JsonLd';
import CtaBand from '@/components/ui/CtaBand';
import { resolveLocale } from '@/lib/locale';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Home' });

  return buildPageMetadata({
    locale,
    href: '/',
    title: t('metaTitle'),
    description: t('metaDescription'),
  });
}

export default async function Home({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);

  const t = await getTranslations('Metadata');
  const tCta = await getTranslations('Home.cta');

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(t('organizationDescription')),
          websiteSchema(locale, t('description')),
        ]}
      />
      <Header />
      <ServicesPreview />
      <ProcessScroll />
      <WhyUs />
      <CtaBand title={tCta('title')} description={tCta('description')} />
    </>
  );
}
