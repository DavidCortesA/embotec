import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Valida el segmento `[locale]` de la URL y estrecha su tipo. El segmento
 * actúa como catch-all, así que un valor desconocido debe dar 404.
 */
export function resolveLocale(locale: string): Locale {
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

/**
 * Igual que `resolveLocale`, pero cae al idioma por defecto en vez de dar
 * 404. Para rutas de metadata (imágenes OG), donde Next recolecta datos con
 * parámetros que todavía no corresponden a una URL real.
 */
export function safeLocale(locale: string | undefined): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
