import { BadgeCheck, ClipboardCheck, Disc3, Timer } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';

const ITEMS = [
  { key: 'specialists', icon: Disc3 },
  { key: 'documented', icon: ClipboardCheck },
  { key: 'response', icon: Timer },
  { key: 'warranty', icon: BadgeCheck },
] as const;

export default async function WhyUs() {
  const t = await getTranslations('Home.why');

  return (
    <section className="bg-embotec-bg py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-embotec-blue uppercase">
            <span aria-hidden className="h-px w-8 bg-embotec-orange-dark" />
            {t('eyebrow')}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-embotec-dark text-balance sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-embotec-gray">
            {t('description')}
          </p>
        </Reveal>

        <ul className="grid gap-6 sm:grid-cols-2">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                as="li"
                key={item.key}
                delay={index * 0.08}
                from="right"
                className="rounded-3xl border border-embotec-light bg-embotec-white p-6"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-embotec-blue/10 text-embotec-blue">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-base font-bold text-embotec-dark">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-embotec-gray">
                  {t(`items.${item.key}.description`)}
                </p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
