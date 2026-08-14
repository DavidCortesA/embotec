import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Montserrat } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { routing } from '@/i18n/routing';
import { siteName, siteUrl } from '@/lib/seo';
import '../globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a2540',
};

/**
 * Metadata base heredada por todas las páginas. Cada página define su
 * propio título, descripción, canonical y hreflang con `buildPageMetadata`.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: `%s | ${siteName}`,
    },
    description: t('description'),
    applicationName: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    formatDetection: {
      telephone: true,
      address: false,
      email: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Habilita el renderizado estático de las páginas de este segmento.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Common' });

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-embotec-white text-embotec-black">
        {/*
          Las animaciones de entrada renderizan con opacity:0 en el HTML.
          Sin JavaScript nunca se animarían, así que forzamos el estado final
          y convertimos el carrusel de proceso en un scroll horizontal nativo.
        */}
        <noscript>
          <style>{`
            [data-reveal]{opacity:1!important;transform:none!important}
            [data-hscroll]{position:static!important;height:auto!important;overflow-x:auto!important}
          `}</style>
        </noscript>
        <NextIntlClientProvider>
          {/* WCAG 2.4.1: permite saltarse el navbar con el teclado */}
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-embotec-dark focus:px-5 focus:py-3 focus:font-heading focus:text-sm focus:font-bold focus:text-embotec-white"
          >
            {t('skipToContent')}
          </a>
          <Navbar />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
