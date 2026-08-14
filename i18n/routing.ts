import { defineRouting } from 'next-intl/routing';

/**
 * Rutas internas (las carpetas reales dentro de `app/[locale]`) mapeadas a su
 * URL pública en cada idioma. Las internas están en español para coincidir con
 * el árbol de carpetas; el proxy reescribe la URL en inglés a la interna.
 *
 * Para agregar una página:
 * 1. crea la carpeta en `app/[locale]/...`
 * 2. agrega su entrada aquí
 * 3. usa el `Link` de `@/i18n/navigation` con la ruta interna como href
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    sameSite: 'lax',
    path: '/',
  },
  pathnames: {
    '/': '/',
    '/nosotros': {
      es: '/nosotros',
      en: '/about-us',
    },
    '/servicios': {
      es: '/servicios',
      en: '/services',
    },
    // Cada servicio resuelve en app/[locale]/servicios/[slug]
    '/servicios/embobinado-de-motores': {
      es: '/servicios/embobinado-de-motores',
      en: '/services/electric-motor-rewinding',
    },
    '/servicios/mantenimiento-industrial': {
      es: '/servicios/mantenimiento-industrial',
      en: '/services/industrial-maintenance',
    },
    '/servicios/reparacion-de-motores': {
      es: '/servicios/reparacion-de-motores',
      en: '/services/motor-repair',
    },
    '/servicios/diagnostico-electrico': {
      es: '/servicios/diagnostico-electrico',
      en: '/services/electrical-diagnostics',
    },
    '/proyectos': {
      es: '/proyectos',
      en: '/projects',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
