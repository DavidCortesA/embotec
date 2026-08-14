import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';
import { services } from '@/data/services';
import { Link } from '@/i18n/navigation';

export default async function ServicesPreview() {
  const t = await getTranslations('Home.services');
  const tServices = await getTranslations('Services');

  return (
    <section className="bg-embotec-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-embotec-blue uppercase">
            <span aria-hidden className="h-px w-8 bg-embotec-orange-dark" />
            {t('eyebrow')}
          </p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-embotec-dark text-balance sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-embotec-gray">
            {t('description')}
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Reveal as="li" key={service.slug} delay={index * 0.08}>
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-3xl border border-embotec-light bg-embotec-bg p-8 transition-colors hover:border-embotec-blue/40 hover:bg-embotec-white"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-embotec-dark text-embotec-orange transition-colors group-hover:bg-embotec-blue group-hover:text-embotec-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-bold text-embotec-dark">
                    {tServices(`items.${service.key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-embotec-gray">
                    {tServices(`items.${service.key}.summary`)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm font-bold text-embotec-blue">
                    {tServices('cta')}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
