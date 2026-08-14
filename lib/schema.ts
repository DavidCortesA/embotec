import type { AppPathname, Locale } from '@/i18n/routing';
import { absoluteUrl, siteName, siteUrl } from './seo';

/**
 * Constructores de datos estructurados (schema.org). Se serializan con
 * el componente `<JsonLd />`.
 */

export type JsonLdData = Record<string, unknown>;

/** Se referencia con `@id` desde los demás nodos para no duplicar la empresa */
export const ORGANIZATION_ID = `${siteUrl}/#organization`;

export function organizationSchema(description: string): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: siteName,
    url: siteUrl,
    description,
    // TODO: agregar logo, sameAs (redes sociales) y address cuando estén.
  };
}

export function websiteSchema(locale: Locale, description: string): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    url: absoluteUrl('/', locale),
    inLanguage: locale,
    description,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function serviceSchema({
  name,
  description,
  href,
  locale,
}: {
  name: string;
  description: string;
  href: AppPathname;
  locale: Locale;
}): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(href, locale),
    inLanguage: locale,
    serviceType: name,
    provider: { '@id': ORGANIZATION_ID },
    // TODO (EMBOTEC): acotar a estado/ciudad cuando se confirme la ubicación
    // real del taller; el país es lo único que hoy podemos afirmar.
    areaServed: { '@type': 'Country', name: 'México' },
  };
}

/**
 * Preguntas frecuentes. Google las usa para resultados enriquecidos y los
 * motores generativos las citan casi literalmente, así que el texto debe ser
 * el mismo que ve el usuario en la página (lo es: ambos salen de `messages`).
 */
export function faqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: ReadonlyArray<{ name: string; href: AppPathname }>,
  locale: Locale
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href, locale),
    })),
  };
}
