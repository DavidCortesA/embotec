'use client';

import { useTranslations } from 'next-intl';
import LogoMark from '@/components/brand/LogoMark';

/**
 * Pantalla de carga del sitio. La usan los `loading.tsx` de las rutas que
 * pueden tardar en resolverse; casi todas las páginas se sirven
 * prerenderizadas, así que en condiciones normales apenas se ve.
 *
 * Va en el cliente a propósito: los archivos `loading.tsx` no reciben
 * `params.locale`, y pedir las traducciones en el servidor obligaría a resolver
 * el idioma desde los headers, lo que volvería DINÁMICAS todas las páginas del
 * segmento. Desde el cliente el idioma sale del proveedor de `next-intl` que ya
 * montó el layout y todo sigue estático.
 *
 * `role="status"` con `aria-live="polite"` para que un lector de pantalla
 * anuncie la carga (WCAG 4.1.3).
 */
export default function LoadingScreen() {
  const t = useTranslations('Common');

  return (
    <div
      role="status"
      aria-live="polite"
      className="on-dark flex min-h-[70svh] flex-col items-center justify-center gap-8 bg-embotec-night px-6 py-24"
    >
      <LogoMark tone="light" className="h-16 w-16 animate-pulse" />

      <p className="tech-label text-embotec-light/70">{t('loading')}</p>

      {/* Barra indeterminada: decorativa, el estado lo comunica el texto */}
      <span
        aria-hidden
        className="block h-[3px] w-40 overflow-hidden rounded-full bg-embotec-white/15"
      >
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-embotec-orange" />
      </span>
    </div>
  );
}
