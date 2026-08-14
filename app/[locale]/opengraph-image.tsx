import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { safeLocale } from '@/lib/locale';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'EMBOTEC — Embobinados y mantenimiento industrial';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

/** Tarjeta social con los colores de marca; sirve para Open Graph y Twitter. */
export default async function OpenGraphImage({ params }: Props) {
  const locale = safeLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'Navbar' });
  const tHome = await getTranslations({ locale, namespace: 'Home' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #0e2f52 0%, #0a2540 60%, #061829 100%)',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              border: '6px dashed #ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 7,
                borderRadius: 4,
                background: '#f28c28',
              }}
            />
            <div
              style={{
                width: 52,
                height: 7,
                borderRadius: 4,
                background: '#f28c28',
              }}
            />
            <div
              style={{
                width: 44,
                height: 7,
                borderRadius: 4,
                background: '#f28c28',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            <span style={{ color: '#ffffff' }}>EMBO</span>
            <span style={{ color: '#f28c28' }}>TEC</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 96, height: 8, background: '#f28c28' }} />
          <div
            style={{
              marginTop: 28,
              fontSize: 62,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {tHome('hero.title')}
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: '#e9eef3' }}>
            {t('brandTagline')}
          </div>
        </div>
      </div>
    ),
    size
  );
}
