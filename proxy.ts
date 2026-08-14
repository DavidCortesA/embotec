import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Detecta el idioma (cookie NEXT_LOCALE -> Accept-Language -> defaultLocale),
 * redirige `/` a `/es` o `/en` y reescribe las rutas traducidas
 * (`/es/nosotros` -> `/es/about`) a las carpetas reales de `app/[locale]`.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // Todo menos assets internos, API y archivos con extensión.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
