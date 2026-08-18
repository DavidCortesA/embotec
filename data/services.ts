import { Disc3, Gauge, Cog, Wrench, type LucideIcon } from 'lucide-react';
import type { AppPathname } from '@/i18n/routing';

export type Service = {
  /** Segmento interno de la URL: app/[locale]/servicios/[slug] */
  slug: string;
  /** Ruta interna; sus traducciones viven en `routing.pathnames` */
  href: AppPathname;
  /** Clave en messages -> `Services.items.<key>` */
  key: string;
  icon: LucideIcon;
  /** Número de viñetas en `Services.items.<key>.bullets` */
  bulletCount: number;
};

export const services: readonly Service[] = [
  {
    slug: 'embobinado-de-motores',
    href: '/servicios/embobinado-de-motores',
    key: 'rewinding',
    icon: Disc3,
    bulletCount: 4,
  },
  {
    slug: 'mantenimiento-industrial',
    href: '/servicios/mantenimiento-industrial',
    key: 'maintenance',
    icon: Wrench,
    bulletCount: 4,
  },
  {
    slug: 'reparacion-de-motores',
    href: '/servicios/reparacion-de-motores',
    key: 'repair',
    icon: Cog,
    bulletCount: 4,
  },
  {
    slug: 'diagnostico-electrico',
    href: '/servicios/diagnostico-electrico',
    key: 'diagnostics',
    icon: Gauge,
    bulletCount: 4,
  },
  // TODO (EMBOTEC): pedido del cliente — agregar servicio de "Ventas".
  // Falta el texto (el cliente menciona que viene en el documento de misión y
  // visión, con el detalle de los servicios). Cuando llegue, agregar aquí la
  // entrada (slug, href en `i18n/routing.ts`, ícono) y sus textos en
  // `Services.items.sales` dentro de messages/es.json y messages/en.json,
  // siguiendo el mismo formato que los demás servicios.
  // {
  //   slug: 'ventas',
  //   href: '/servicios/ventas',
  //   key: 'sales',
  //   icon: ShoppingCart,
  //   bulletCount: 4,
  // },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
