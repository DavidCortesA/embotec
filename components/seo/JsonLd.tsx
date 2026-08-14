import type { JsonLdData } from '@/lib/schema';

type Props = {
  data: JsonLdData | JsonLdData[];
};

/**
 * Inyecta datos estructurados schema.org. El contenido siempre viene de
 * `lib/schema.ts` y de los archivos de traducción (nunca de input del
 * usuario), y se escapa `<` para que no pueda cerrar el <script>.
 *
 * Cada nodo va en su propio <script> en lugar de todos dentro de un array:
 * es igual de válido para los buscadores, pero deja un `@context` en la raíz
 * de cada bloque. Los lectores que asumen esa forma (extensiones de SEO,
 * validadores) fallan al encontrarse un array donde esperaban un objeto.
 */
export default function JsonLd({ data }: Props) {
  const nodes = Array.isArray(data) ? data : [data];

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(node).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
