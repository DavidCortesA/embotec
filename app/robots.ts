import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

/**
 * Rastreadores de los buscadores generativos (ChatGPT, Claude, Perplexity,
 * Gemini, Copilot…). Se listan explícitamente y en `allow` porque queremos que
 * el taller sea citable desde esas respuestas: si un día se quisiera lo
 * contrario, basta mover el bloque a `disallow`.
 *
 * Nota: `Google-Extended` y `Applebot-Extended` no rastrean; solo autorizan el
 * uso del contenido ya rastreado para entrenar/citar en sus productos de IA.
 */
const AI_USER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'Bingbot',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: AI_USER_AGENTS,
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
