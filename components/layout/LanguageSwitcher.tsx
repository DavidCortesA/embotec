'use client';

import { useTransition } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

type Props = {
  /** `pill` para el navbar de escritorio, `full` para el menú móvil */
  variant?: 'pill' | 'full';
  /** Debe ser único por instancia: comparte el indicador animado con `layoutId` */
  layoutId?: string;
};

export default function LanguageSwitcher({
  variant = 'pill',
  layoutId = 'language-indicator',
}: Props) {
  const t = useTranslations('LanguageSwitcher');
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function selectLocale(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;
    // `pathname` es la ruta interna, así que el router genera la URL
    // traducida del otro idioma (p. ej. /es/nosotros -> /en/about-us).
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const isFull = variant === 'full';

  return (
    <div
      role="group"
      aria-label={t('label')}
      data-pending={isPending || undefined}
      className={`relative flex items-center rounded-full border border-embotec-light bg-embotec-bg p-0.5 transition-opacity data-[pending]:opacity-60 ${
        isFull ? 'w-full' : ''
      }`}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            onClick={() => selectLocale(locale)}
            aria-current={isActive ? 'true' : undefined}
            disabled={isPending}
            className={`relative rounded-full font-semibold transition-colors ${
              isFull ? 'flex-1 px-4 py-2.5 text-sm' : 'px-2.5 py-1.5 text-xs'
            } ${
              isActive
                ? 'text-embotec-dark'
                : 'text-embotec-gray hover:text-embotec-dark'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-embotec-white shadow-[0_2px_8px_-2px_rgba(10,37,64,0.25)]"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative z-10">
              {isFull ? t(`${locale}Long`) : t(locale)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
