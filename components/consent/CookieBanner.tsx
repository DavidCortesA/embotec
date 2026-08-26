'use client';

import { useSyncExternalStore } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Cookie } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Clave en localStorage; cambiarla vuelve a preguntar a todo el mundo */
const STORAGE_KEY = 'embotec-cookie-consent';
/** Aviso interno: `localStorage` no notifica cambios en la misma pestaña */
const CONSENT_EVENT = 'embotec:cookie-consent';

type Consent = 'granted' | 'denied';
/**
 * `pending` es el valor del servidor: mientras el HTML se genera no hay forma
 * de saber qué respondió esta persona, así que el aviso no se pinta. Al hidratar
 * se lee `localStorage` y React vuelve a renderizar con el valor real.
 */
type Snapshot = Consent | 'unset' | 'pending';

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  // Otra pestaña del sitio respondiendo el aviso.
  window.addEventListener('storage', onChange);

  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): Snapshot {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : 'unset';
}

function getServerSnapshot(): Snapshot {
  return 'pending';
}

/**
 * Aviso de cookies y única puerta de entrada de la medición de audiencia: el
 * script de Vercel Analytics se monta SOLO si la persona acepta, así que
 * rechazar no es un botón decorativo. La preferencia se guarda en localStorage
 * (no hace falta cookie para recordarla) y no se vuelve a preguntar.
 *
 * Mientras no haya respuesta no se carga nada de medición. La cookie de idioma
 * (NEXT_LOCALE) sí es necesaria para que el sitio funcione y no depende de esto;
 * ambas cosas se explican en el aviso de privacidad.
 */
export default function CookieBanner() {
  const t = useTranslations('Cookies');
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function decide(value: Consent) {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <>
      {consent === 'granted' && <Analytics />}

      {consent === 'unset' && (
        <div
          role="region"
          aria-label={t('label')}
          // Por encima del grano de película (z-100) y del navbar (z-50).
          className="fixed inset-x-3 bottom-3 z-[110] mx-auto max-w-2xl rounded-2xl border border-embotec-dark/15 bg-embotec-white/95 p-5 shadow-[0_28px_60px_-24px_rgba(10,37,64,0.45)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-embotec-orange/20 text-embotec-orange-dark">
              <Cookie className="h-[18px] w-[18px]" aria-hidden />
            </span>

            <div className="min-w-0">
              <p className="font-heading text-base font-extrabold text-embotec-dark">
                {t('title')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-embotec-gray">
                {t('description')}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => decide('granted')}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-embotec-orange px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
                >
                  {t('accept')}
                </button>
                <button
                  type="button"
                  onClick={() => decide('denied')}
                  className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-embotec-dark/25 px-6 py-3 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-bg"
                >
                  {t('reject')}
                </button>
                <Link
                  href="/privacidad"
                  className="text-sm font-semibold text-embotec-blue underline underline-offset-4 transition-colors hover:text-embotec-orange-dark"
                >
                  {t('policy')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
