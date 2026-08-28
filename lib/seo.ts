import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type AppPathname, type Locale } from '@/i18n/routing';

export const siteName = 'EMBOTEC';

/**
 * Dominio de producción. De aquí salen los canonical, los hreflang, el
 * sitemap, el robots.txt y las URLs de las imágenes OG, así que tiene que ser
 * el host real y con una sola forma (con www o sin www, no las dos).
 *
 * Se puede sobrescribir con NEXT_PUBLIC_SITE_URL (sin slash final) para
 * entornos de prueba. Si algún día el sitio se sirve sin www, hay que cambiar
 * este valor y dejar el otro host redirigiendo con 301 al bueno.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.embo-tec.com'
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
 * Tarjeta social del sitio: la pieza de marca que entregó el cliente
 * (logotipo, claim, servicios y datos de contacto), así que se usa igual en
 * todas las páginas en vez de generar una por ruta.
 *
 * El archivo que se publica es la versión optimizada para redes: 1200 px de
 * ancho —lo que recomiendan Facebook, LinkedIn y X— y JPEG de calidad alta,
 * 280 KB en vez de los 2 MB del original. El PNG original se conserva como
 * fuente en `assets/og/` (fuera de `public/`, para no publicar 2 MB que nadie
 * pide).
 *
 * La franja de logos de marca de arriba la monta
 * `assets/og/build-opengraph-image.py`, que hay que volver a correr si cambian
 * las marcas o el arte.
 *
 * Las medidas tienen que coincidir con el archivo real: si se sustituye por
 * otro de distinto tamaño, hay que actualizarlas aquí para que las redes no
 * reserven un hueco equivocado al mostrar la vista previa.
 */
const OG_IMAGE = {
  path: '/og/opengraph-image.jpg',
  width: 1200,
  height: 800,
} as const;

export function socialImage() {
  return {
    url: `${siteUrl}${OG_IMAGE.path}`,
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
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
 * y Twitter Card. La imagen OG la aporta el `opengraph-image.tsx` de cada ruta.
 */
export function buildPageMetadata({
  locale,
  href,
  title,
  description,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${siteName}`;
  const image = socialImage();

  return {
    // La portada vive en el mismo segmento que declara `title.template`, y
    // Next no aplica la plantilla a su propio segmento: sin `absolute` el
    // título del home saldría sin la marca, a diferencia del resto.
    title: href === '/' ? { absolute: fullTitle } : title,
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
