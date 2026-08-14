import ParallaxImage from './ParallaxImage';
import Reveal from './Reveal';
import RevealText from './RevealText';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  /** Foto a sangre del fondo. Ver `data/images.ts` */
  image: string;
  /**
   * Solo para la foto del hero de cada página: es la única imagen que aporta
   * información propia, el resto del sitio son ilustrativas.
   */
  imageAlt?: string;
  /** Dato de contexto en la esquina (mono), p. ej. "04 servicios" */
  meta?: string;
  children?: React.ReactNode;
};

/**
 * Encabezado compartido por las páginas interiores: foto a sangre en parallax,
 * velo que garantiza el contraste del texto (WCAG 1.4.3) y titular que se
 * revela palabra por palabra.
 *
 * El padding superior reserva el espacio del navbar flotante
 * (`--navbar-height` en globals.css). Es `on-dark` para que el anillo de foco
 * cambie a blanco.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = '',
  meta,
  children,
}: Props) {
  return (
    <section className="on-dark relative isolate flex min-h-[68svh] flex-col justify-end overflow-hidden bg-embotec-night pt-[calc(var(--navbar-height)+72px)] pb-16 sm:pb-20">
      <div className="absolute inset-0 -z-20">
        <ParallaxImage
          src={image}
          alt={imageAlt}
          strength={10}
          priority
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-embotec-night via-embotec-night/85 to-embotec-night/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-embotec-night/80 via-transparent to-embotec-night"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <Reveal>
          <p className="tech-label flex items-center gap-3 text-embotec-orange">
            <span aria-hidden className="h-px w-10 bg-embotec-orange" />
            {eyebrow}
          </p>
        </Reveal>

        <RevealText
          as="h1"
          delay={0.08}
          className="display mt-7 max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.5rem)] text-embotec-white"
        >
          {title}
        </RevealText>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal delay={0.14}>
            <p className="max-w-2xl text-lg leading-relaxed text-embotec-light">
              {description}
            </p>
          </Reveal>

          {meta && (
            <Reveal delay={0.2}>
              <p className="tech-label text-embotec-light/60">{meta}</p>
            </Reveal>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
