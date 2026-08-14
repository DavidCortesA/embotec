import { BadgeCheck, ClipboardCheck, Disc3, Timer } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import ParallaxImage from '@/components/ui/ParallaxImage';
import Reveal from '@/components/ui/Reveal';
import RevealText from '@/components/ui/RevealText';
import { images } from '@/data/images';

const ITEMS = [
  { key: 'specialists', icon: Disc3 },
  { key: 'documented', icon: ClipboardCheck },
  { key: 'response', icon: Timer },
  { key: 'warranty', icon: BadgeCheck },
] as const;

/**
 * Columna izquierda fija y lista que desfila a su lado: el argumento se queda
 * a la vista mientras el lector recorre las pruebas que lo sostienen.
 */
export default async function WhyUs() {
  const t = await getTranslations('Home.why');

  return (
    <section className="on-dark bg-embotec-dark py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--navbar-height)+32px)] lg:self-start">
          <Reveal>
            <p className="tech-label flex items-center gap-3 text-embotec-orange">
              <span aria-hidden className="h-px w-10 bg-embotec-orange" />
              {t('eyebrow')}
            </p>
          </Reveal>

          <RevealText
            as="h2"
            className="display mt-6 max-w-[12ch] text-[clamp(2.25rem,5.5vw,4.5rem)] text-embotec-white"
          >
            {t('title')}
          </RevealText>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-embotec-light">
              {t('description')}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <ParallaxImage
              src={images.why}
              strength={14}
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="mt-10 hidden aspect-[16/11] w-full rounded-2xl lg:block"
            />
          </Reveal>
        </div>

        <ul className="flex flex-col">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                as="li"
                key={item.key}
                delay={0.06}
                from="right"
                className="group border-t border-embotec-white/15 py-8 first:border-t-0 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-6">
                  <span className="tech-label pt-2 text-embotec-orange/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1">
                    <h3 className="display flex items-center gap-3 text-2xl text-embotec-white sm:text-3xl">
                      <Icon
                        className="h-5 w-5 shrink-0 text-embotec-orange"
                        aria-hidden
                      />
                      {t(`items.${item.key}.title`)}
                    </h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-embotec-light/80">
                      {t(`items.${item.key}.description`)}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
