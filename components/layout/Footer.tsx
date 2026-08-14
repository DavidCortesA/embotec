import { Mail, MapPin, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Logo from '@/components/brand/Logo';
import { company } from '@/data/company';
import { navItems } from '@/data/navigation';
import { services } from '@/data/services';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const tNav = await getTranslations('Navbar');
  const tServices = await getTranslations('Services');
  const tContact = await getTranslations('Contact');

  // Se evalúa al generar el sitio; se actualiza en cada build.
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-embotec-black">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <Logo tone="light" tagline={tNav('brandTagline')} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-embotec-light">
            {t('tagline')}
          </p>
        </div>

        <nav aria-label={t('footerNavigation')}>
          <h2 className="font-heading text-xs font-bold tracking-[0.16em] text-embotec-orange uppercase">
            {t('navigationTitle')}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-block py-1 text-sm text-embotec-light transition-colors hover:text-embotec-white"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="inline-block py-1 text-sm text-embotec-light transition-colors hover:text-embotec-white"
              >
                {tNav('contact')}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-xs font-bold tracking-[0.16em] text-embotec-orange uppercase">
            {t('servicesTitle')}
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={service.href}
                  className="inline-block py-1 text-sm text-embotec-light transition-colors hover:text-embotec-white"
                >
                  {tServices(`items.${service.key}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-xs font-bold tracking-[0.16em] text-embotec-orange uppercase">
            {t('contactTitle')}
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-embotec-light">
            <li>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 py-1 transition-colors hover:text-embotec-white"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {company.email}
              </a>
            </li>
            <li>
              <a
                href={company.phoneHref}
                className="inline-flex items-center gap-2 py-1 transition-colors hover:text-embotec-white"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {tContact('locationValue')}
            </li>
          </ul>

          <h2 className="mt-8 font-heading text-xs font-bold tracking-[0.16em] text-embotec-orange uppercase">
            {t('languageTitle')}
          </h2>
          <div className="mt-4 max-w-[220px]">
            <LanguageSwitcher variant="full" layoutId="language-indicator-footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-embotec-white/10">
        <p className="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-embotec-light">
          © {year} EMBOTEC. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
