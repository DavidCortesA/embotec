/**
 * Fotografía del sitio.
 *
 * TODO (EMBOTEC): son fotos de archivo de Unsplash elegidas por tono
 * (taller a media luz, cobre, metal), no fotos reales del taller. Para
 * cambiarlas basta sustituir el valor por una ruta local, p. ej.
 * `'/images/taller-01.jpg'`: los componentes usan `next/image` y no dependen
 * de que la fuente sea remota. Cuando ya no quede ninguna URL de Unsplash,
 * el bloque `images.remotePatterns` de `next.config.ts` puede borrarse.
 *
 * Licencia Unsplash: uso comercial permitido, sin atribución obligatoria.
 */

/** Pide a Unsplash una versión recortada del tamaño justo que necesitamos. */
const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const images = {
  /** Portada a sangre: nave a media luz */
  hero: unsplash('photo-1720036236697-018370867320', 2000),
  /** Cierre de página */
  cta: unsplash('photo-1720036236657-cc7de2dc5b7a', 1800),
  /** Bloque "por qué EMBOTEC": chispas de amolado */
  why: unsplash('photo-1738162837369-a2beec3a1d47', 1400),
  /** Retrato de taller para el bloque de credenciales */
  workshop: unsplash('photo-1764115424737-25aca6f47835', 1200),
} as const;

/** Foto a sangre del encabezado de cada página interior */
export const pageImages = {
  about: unsplash('photo-1764115424737-25aca6f47835', 1800),
  services: unsplash('photo-1720036236694-d0a231c52563', 1800),
  projects: unsplash('photo-1524514587686-e2909d726e9b', 1800),
  contact: unsplash('photo-1512813759302-a44af29da3c1', 1800),
} as const;

/** Una imagen por servicio, con la misma clave que `data/services.ts` */
export const serviceImages: Record<string, string> = {
  // TODO (EMBOTEC): pedido del cliente — cambiar por una foto real de una
  // persona/manos haciendo el embobinado. Pendiente de que la envíen.
  rewinding: unsplash('photo-1707409464255-e78eb873298a', 1200),
  // TODO (EMBOTEC): pedido del cliente — cambiar por una foto con varios
  // equipos de planta. Pendiente de que la envíen.
  maintenance: unsplash('photo-1676018366904-c083ed678e60', 1200),
  repair: unsplash('photo-1772588063102-eed5af095b9e', 1200),
  diagnostics: unsplash('photo-1717386255777-ce60792a2a56', 1200),
};

/** Una imagen por paso del proceso, con las claves de `ProcessScroll` */
export const processImages: Record<string, string> = {
  diagnosis: unsplash('photo-1747999918007-e3442cabb23a', 900),
  quote: unsplash('photo-1578988247876-ce2647da8195', 900),
  rewinding: unsplash('photo-1563456020111-f02d832ae94c', 900),
  testing: unsplash('photo-1717386255893-59c0846cdef0', 900),
  delivery: unsplash('photo-1738162837642-df6ca5695438', 900),
};
