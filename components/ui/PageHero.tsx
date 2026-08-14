import Reveal from './Reveal';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

/**
 * Encabezado compartido por las páginas internas. El padding superior
 * reserva el espacio del navbar flotante (`--navbar-height` en globals.css).
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <section className="relative overflow-hidden border-b border-embotec-light bg-embotec-bg pt-[calc(var(--navbar-height)+40px)] pb-16 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-embotec-white to-transparent"
      />
      <Reveal className="relative mx-auto w-full max-w-6xl px-6">
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-embotec-blue uppercase">
          <span aria-hidden className="h-px w-8 bg-embotec-orange-dark" />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-embotec-dark text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-embotec-gray">
          {description}
        </p>
        {children}
      </Reveal>
    </section>
  );
}
