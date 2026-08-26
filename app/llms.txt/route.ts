import { getTranslations } from 'next-intl/server';
import { company, contacts } from '@/data/company';
import { services } from '@/data/services';
import { routing, type Locale } from '@/i18n/routing';
import { absoluteUrl, siteName } from '@/lib/seo';

/**
 * `/llms.txt`: ficha del sitio en texto plano para los buscadores generativos.
 * No sustituye al sitemap (ese es para los rastreadores clásicos): aquí va el
 * resumen que queremos que citen —qué hacemos, dónde, con quién hablar— y el
 * índice de páginas de cada idioma, sin HTML ni JavaScript de por medio.
 *
 * Todo sale de `messages` y `data/`, así que se actualiza solo al cambiar los
 * textos. El proxy de idioma no toca las rutas con extensión (ver `proxy.ts`).
 */
export const dynamic = 'force-static';

async function localeBlock(locale: Locale) {
  const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
  const tServices = await getTranslations({ locale, namespace: 'Services' });
  const tNav = await getTranslations({ locale, namespace: 'Navbar' });
  const tHome = await getTranslations({ locale, namespace: 'Home' });

  const pages: Array<{ label: string; href: Parameters<typeof absoluteUrl>[0] }> = [
    { label: tNav('home'), href: '/' },
    { label: tNav('services'), href: '/servicios' },
    { label: tNav('about'), href: '/nosotros' },
    { label: tNav('projects'), href: '/proyectos' },
    { label: tNav('contact'), href: '/contacto' },
  ];

  return [
    `## ${locale === 'es' ? 'Español' : 'English'} (${absoluteUrl('/', locale)})`,
    '',
    `${tHome('answer.answer')}`,
    '',
    `### ${tServices('eyebrow')}`,
    '',
    ...services.map(
      (service) =>
        `- [${tServices(`items.${service.key}.title`)}](${absoluteUrl(
          service.href,
          locale
        )}): ${tServices(`items.${service.key}.summary`)} ${tServices(
          `items.${service.key}.answer.answer`
        )}`
    ),
    '',
    '### ' + (locale === 'es' ? 'Páginas' : 'Pages'),
    '',
    ...pages.map((page) => `- [${page.label}](${absoluteUrl(page.href, locale)})`),
    '',
    `> ${tMeta('organizationDescription')}`,
    '',
  ].join('\n');
}

export async function GET() {
  const blocks = await Promise.all(routing.locales.map(localeBlock));

  const body = [
    `# ${siteName}`,
    '',
    '## Contacto / Contact',
    '',
    `- ${company.address.full}`,
    `- ${company.phone} · ${company.email}`,
    ...contacts.map(
      (contact) => `- ${contact.name}: ${contact.phone} · ${contact.email}`
    ),
    '',
    ...blocks,
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
