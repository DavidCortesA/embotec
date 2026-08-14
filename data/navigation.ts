import type { AppPathname } from '@/i18n/routing';
import { services, type Service } from './services';

export type NavItem = {
  /** Clave en messages -> `Navbar.<key>` */
  key: string;
  href: AppPathname;
  /** Si existe, el item se muestra como menú desplegable */
  children?: readonly Service[];
};

export const navItems: readonly NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/nosotros' },
  { key: 'services', href: '/servicios', children: services },
  { key: 'projects', href: '/proyectos' },
];
