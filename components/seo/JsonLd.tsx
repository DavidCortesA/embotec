import type { JsonLdData } from '@/lib/schema';

type Props = {
  data: JsonLdData | JsonLdData[];
};

/**
 * Inyecta datos estructurados schema.org. El contenido siempre viene de
 * `lib/schema.ts` y de los archivos de traducción (nunca de input del
 * usuario), y se escapa `<` para que no pueda cerrar el <script>.
 */
export default function JsonLd({ data }: Props) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
