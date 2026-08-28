'use client';

import { useReducedMotion } from '@/lib/useReducedMotion';

type Props = {
  src: string;
  /** Primer fotograma, para que no se vea un hueco negro antes de cargar */
  poster: string;
  /** Qué se ve en el clip: sirve de pie de foto y de nombre accesible */
  label: string;
  /**
   * Clips cortos de taller: arrancan solos, en silencio y en bucle. Los clips
   * largos se quedan en el póster hasta que el usuario le da play, para no
   * gastarle datos a nadie.
   */
  autoLoop?: boolean;
};

/**
 * Clip vertical del taller (9:16, grabado con teléfono).
 *
 * Siempre lleva `controls`: es lo que permite parar un bucle que dura más de
 * cinco segundos (WCAG 2.2.2) y lo que deja subir el volumen de los que
 * arrancan en silencio.
 *
 * El pie de foto está pensado para secciones oscuras (`bg-embotec-night`).
 */
export default function VideoBlock({
  src,
  poster,
  label,
  autoLoop = false,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const auto = autoLoop && !prefersReducedMotion;

  return (
    <figure className="w-full max-w-[18rem]">
      <video
        // React monta `muted` como propiedad del nodo, no como atributo, así
        // que el HTML del servidor llega sin él y el navegador bloquearía la
        // reproducción automática antes de hidratar. Con el ref queda puesto
        // desde el primer momento.
        ref={(element) => {
          if (element) element.muted = auto;
        }}
        src={src}
        poster={poster}
        aria-label={label}
        controls
        playsInline
        preload={auto ? 'auto' : 'metadata'}
        autoPlay={auto}
        muted={auto}
        loop={auto}
        className="aspect-[9/16] w-full rounded-2xl bg-embotec-dark object-cover"
      />
      <figcaption className="mt-4 text-sm leading-snug text-embotec-light/80">
        {label}
      </figcaption>
    </figure>
  );
}
