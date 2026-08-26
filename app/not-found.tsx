import Link from 'next/link';
import { routing } from '@/i18n/routing';
import './globals.css';

/**
 * 404 global: solo aparece en las URLs que el proxy de idioma no toca (las que
 * traen extensión, p. ej. `/algo.txt`). Se renderiza FUERA del layout de
 * `[locale]`, así que tiene que traer su propio `<html>`/`<body>`; el 404 con
 * navbar y pie es `app/[locale]/not-found.tsx`.
 *
 * Es bilingüe a propósito: aquí no hay forma de saber el idioma del visitante.
 */
export default function GlobalNotFound() {
  return (
    <html lang={routing.defaultLocale}>
      <body className="flex min-h-screen items-center bg-embotec-night text-embotec-white">
        <main className="mx-auto w-full max-w-2xl px-6 py-24">
          <p className="tech-label text-embotec-orange">Error 404</p>
          <h1 className="display mt-6 text-[clamp(2.25rem,6vw,4rem)]">
            Página no encontrada
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-embotec-light">
            La dirección que abriste no existe en este sitio. Page not found.
          </p>
          {/* `next/link` a secas, no el de `@/i18n/navigation`: esta página se
              renderiza fuera del proveedor de idioma. */}
          <p className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${routing.defaultLocale}`}
              className="inline-flex min-h-11 items-center rounded-full bg-embotec-orange px-7 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-white"
            >
              Ir al inicio
            </Link>
            <Link
              href="/en"
              className="inline-flex min-h-11 items-center rounded-full border border-embotec-white/35 px-7 py-3.5 font-heading text-sm font-bold text-embotec-white transition-colors hover:bg-embotec-white/10"
            >
              Go to homepage
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
