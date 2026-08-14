import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type AppPathname, type Locale } from '@/i18n/routing';

export const siteName = 'EMBOTEC';

/**
 * Dominio de producción. Configúralo en `.env` como NEXT_PUBLIC_SITE_URL
 * (sin slash final) para que los canonical y hreflang apunten al host real.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://embotec.mx'
).replace(/\/$/, '');

/** Formato que espera Open Graph para og:locale */
const OG_LOCALES: Record<Locale, string> = {
  es: 'es_MX',
  en: 'en_US',
};

/** URL absoluta de una ruta interna en un idioma concreto */
export function absoluteUrl(href: AppPathname, locale: Locale) {
  return `${siteUrl}${getPathname({ href, locale })}`;
}

/**
 * Tarjeta social generada por `app/[locale]/opengraph-image.tsx`. Next solo
 * la hereda automáticamente en las páginas del mismo segmento, así que las
 * páginas anidadas la declaran de forma explícita.
 */
function openGraphImage(locale: Locale) {
  return {
    url: `${absoluteUrl('/', locale)}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: 'EMBOTEC — Embobinados y mantenimiento industrial',
  };
}

/**
 * Canonical autorreferencial + hreflang de todos los idiomas.
 * `x-default` apunta al idioma por defecto, como pide Google.
 */
export function getAlternates(
  href: AppPathname,
  locale: Locale
): Metadata['alternates'] {
  const languages: Record<string, string> = {};

  for (const available of routing.locales) {
    languages[available] = absoluteUrl(href, available);
  }
  languages['x-default'] = absoluteUrl(href, routing.defaultLocale);

  return {
    canonical: absoluteUrl(href, locale),
    languages,
  };
}

type PageMetadataOptions = {
  locale: Locale;
  /** Ruta interna de la página (la misma que se usa en los `Link`) */
  href: AppPathname;
  /** Sin la marca: el layout le añade "| EMBOTEC" con `title.template` */
  title: string;
  description: string;
};

/**
 * Metadata por página: título, descripción, canonical, hreflang, Open Graph
 * y Twitter Card. La imagen OG la aporta `app/[locale]/opengraph-image.tsx`.
 */
export function buildPageMetadata({
  locale,
  href,
  title,
  description,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const image = openGraphImage(locale);

  return {
    title,
    description,
    alternates: getAlternates(href, locale),
    openGraph: {
      type: 'website',
      siteName,
      url: absoluteUrl(href, locale),
      title: fullTitle,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((available) => available !== locale)
        .map((available) => OG_LOCALES[available]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}
