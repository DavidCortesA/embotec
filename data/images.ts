/**
 * Fotografía del sitio.
 *
 * TODO (EMBOTEC): las que siguen apuntando a Unsplash son fotos de archivo
 * elegidas por tono (taller a media luz, cobre, metal), no fotos reales del
 * taller. Para cambiarlas basta sustituir el valor por una ruta local, p. ej.
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
  why: '/images/servicios/reparacion-de-motores-bombas.jpg',
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

/**
 * Portada de cada servicio, con la misma clave que `data/services.ts`.
 * Las rutas locales son fotos del taller enviadas por el cliente.
 */
export const serviceImages: Record<string, string> = {
  rewinding: '/images/servicios/embobinado-de-motores.jpg',
  maintenance: '/images/servicios/mantenimiento-industrial.jpg',
  repair: '/images/servicios/reparacion-de-motores-bombas.jpg',
  diagnostics: '/images/proceso/pruebas-electricas-1.jpg',
  sales: '/images/servicios/venta-de-productos.jpg',
};

/** Una foto de galería. `label` la vuelve informativa (producto con nombre). */
export type GalleryItem = { src: string; label?: string };

/**
 * Galería de la página de detalle de un servicio. Solo las claves presentes
 * aquí muestran esa sección.
 *
 * `fit: 'cover'` es para fotos de taller, que llenan el marco. `fit: 'contain'`
 * es para fotos de catálogo sobre fondo blanco, que se muestran completas
 * dentro de una tarjeta y llevan el nombre del modelo debajo.
 *
 * `labelKey` apunta a `Services.sectionLabels.<clave>` en messages.
 */
export type ServiceGallery = {
  fit: 'cover' | 'contain';
  labelKey: string;
  /** Aviso opcional bajo la cuadrícula, en `Services.sectionLabels.<clave>` */
  noteKey?: string;
  items: readonly GalleryItem[];
};

export const serviceGalleries: Record<string, ServiceGallery> = {
  rewinding: {
    fit: 'cover',
    labelKey: 'gallery',
    items: [
      { src: '/images/servicios/embobinado-detalle-1.jpg' },
      { src: '/images/servicios/embobinado-detalle-2.jpg' },
      { src: '/images/servicios/embobinado-barnizado.jpg' },
      { src: '/images/servicios/embobinado-horneado-1.jpg' },
      { src: '/images/servicios/embobinado-horneado-2.jpg' },
    ],
  },
  // Fotos de producto del fabricante (bombasaltamira.com.mx). EMBOTEC las usa
  // como distribuidor autorizado; si Altamira manda un kit de medios propio,
  // basta sustituir los archivos de /public/images/productos.
  sales: {
    fit: 'contain',
    labelKey: 'catalog',
    noteKey: 'catalogNote',
    items: [
      {
        src: '/images/productos/altamira-multietapas-tx.jpg',
        label: 'Multietapas vertical Altamira TX',
      },
      {
        src: '/images/productos/altamira-centrifuga-flux.webp',
        label: 'Centrífuga horizontal Altamira FLUX',
      },
      {
        src: '/images/productos/altamira-multietapas-trx.jpg',
        label: 'Multietapas vertical Altamira TRX',
      },
      {
        src: '/images/productos/altamira-multietapas-job.jpg',
        label: 'Multietapas vertical Altamira JOB',
      },
      {
        src: '/images/productos/altamira-sumergible-kor.webp',
        label: 'Sumergible pozo profundo Altamira KOR',
      },
    ],
  },
};

/** Clip de taller de un servicio. `labelKey` vive en `Services.videos`. */
export type VideoItem = {
  src: string;
  poster: string;
  labelKey: string;
  /** Clips cortos: se reproducen solos, en silencio y en bucle */
  autoLoop?: boolean;
};

/**
 * Videos verticales de la página de detalle de un servicio. Solo las claves
 * presentes aquí muestran esa sección.
 */
export const serviceVideos: Record<string, readonly VideoItem[]> = {
  rewinding: [
    {
      src: '/videos/barnizado.mp4',
      poster: '/videos/barnizado.jpg',
      labelKey: 'varnishing',
      autoLoop: true,
    },
    {
      src: '/videos/embobinado-rotor.mp4',
      poster: '/videos/embobinado-rotor.jpg',
      labelKey: 'rotor',
      autoLoop: true,
    },
  ],
  // Dura poco más de un minuto: se queda en el póster hasta que le dan play.
  diagnostics: [
    {
      src: '/videos/pruebas-electricas.mp4',
      poster: '/videos/pruebas-electricas.jpg',
      labelKey: 'electricalTests',
    },
  ],
};

/**
 * Fotos de cada paso del proceso, con las claves de `ProcessScroll`.
 *
 * La primera de la lista es la principal; si hay una segunda se monta encima
 * como recorte. Un paso puede tener una sola foto sin que el layout cambie.
 */
export const processImages: Record<string, readonly string[]> = {
  collection: [
    '/images/proceso/recoleccion-1.jpg',
    '/images/proceso/recoleccion-2.jpg',
  ],
  diagnosis: [
    '/images/proceso/diagnostico-1.jpg',
    '/images/proceso/diagnostico-2.jpg',
  ],
  repair: [
    '/images/proceso/reparacion-1.jpg',
    '/images/proceso/reparacion-2.jpg',
  ],
  testing: ['/images/proceso/pruebas-electricas-1.jpg'],
  delivery: ['/images/proceso/entrega-1.jpg', '/images/proceso/entrega-2.jpg'],
};
