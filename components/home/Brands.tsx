import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { brands } from '@/data/brands';
import { Link } from '@/i18n/navigation';

/**
 * Muro de marcas: rejilla de nombres a modo de logotipos tipográficos. No hay
 * archivos de logo (ni permiso de uso de cada marca), así que se dibujan con la
 * tipografía de cartel del sitio; el listado vive en `data/brands.ts`.
 */
export default async function Brands() {
  const t = await getTranslations('Home.brands');

  return (
    <section className="bg-embotec-white py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="tech-label flex items-center gap-3 text-embotec-orange-dark">
          <span aria-hidden className="h-px w-10 bg-embotec-orange-dark" />
          {t('eyebrow')}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
          <RevealText
            as="h2"
            className="display max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] text-embotec-dark"
          >
            {t('title')}
          </RevealText>

          <Reveal delay={0.1} className="lg:pb-2">
            <p className="text-lg leading-relaxed text-embotec-gray">
              {t('description')}
            </p>
            <Link
              href="/servicios/venta-de-productos"
              className="tech-label group mt-5 inline-flex items-center gap-2 text-embotec-orange-dark"
            >
              {t('cta')}
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden
              />
            </Link>
          </Reveal>
        </div>

        {/* Rejilla continua: el borde superior e izquierdo lo pone la lista y
            cada celda cierra por derecha y abajo, así no se duplican líneas. */}
        <ul className="mt-14 grid grid-cols-2 border-t border-l border-embotec-dark/12 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <Reveal
              as="li"
              key={brand}
              delay={(index % 4) * 0.05}
              className="flex min-h-28 items-center justify-center border-r border-b border-embotec-dark/12 px-5 py-9"
            >
              <span className="display text-center text-2xl text-embotec-gray transition-colors hover:text-embotec-orange-dark sm:text-3xl">
                {brand}
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.08}>
          <p className="mt-8 text-sm leading-relaxed text-embotec-gray">
            {t('note')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
