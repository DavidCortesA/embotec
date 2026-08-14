import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Envoltorios de las APIs de navegación de Next que ya conocen el locale
 * activo y las rutas traducidas definidas en `routing.pathnames`.
 * Siempre se les pasa la ruta interna (`/about`) y ellos generan la
 * URL pública (`/es/nosotros` o `/en/about-us`).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
