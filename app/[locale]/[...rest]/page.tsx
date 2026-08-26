import { notFound } from 'next/navigation';

/**
 * Cualquier URL dentro de un idioma que no corresponda a una página real cae
 * aquí y se convierte en un 404 de verdad (con estatus 404, no una página
 * bonita con estatus 200), que es lo que se renderiza en
 * `app/[locale]/not-found.tsx`.
 *
 * Hace falta este atrapatodo porque el segmento `[locale]` ya casa con el
 * primer tramo de la URL: sin él, `/es/lo-que-sea` no encontraría ninguna ruta
 * y saltaría al 404 global, que se renderiza fuera del layout del idioma.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
