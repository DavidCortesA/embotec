import type { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { routing, type AppPathname } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/seo';

type Entry = {
  href: AppPathname;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
};

/**
 * Una entrada por página y por idioma, cada una con los `hreflang` de sus
 * traducciones. Al agregar una ruta a `routing.pathnames`, añádela aquí.
 */
const entries: readonly Entry[] = [
  { href: '/', priority: 1, changeFrequency: 'monthly' },
  { href: '/servicios', priority: 0.9, changeFrequency: 'monthly' },
  ...services.map(
    (service): Entry => ({
      href: service.href,
      priority: 0.8,
      changeFrequency: 'yearly',
    })
  ),
  { href: '/nosotros', priority: 0.7, changeFrequency: 'yearly' },
  { href: '/proyectos', priority: 0.7, changeFrequency: 'monthly' },
  { href: '/contacto', priority: 0.6, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return entries.flatMap(({ href, priority, changeFrequency }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, absoluteUrl(href, locale)])
    );

    return routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      priority,
      changeFrequency,
      alternates: { languages },
    }));
  });
}
