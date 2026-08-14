import LogoMark from './LogoMark';

type Props = {
  tone?: 'dark' | 'light';
  /** Muestra el descriptor "Embobinados y mantenimiento industrial" */
  tagline?: string;
  className?: string;
};

/**
 * Logotipo completo (ícono + nombre). El naranja de la marca sobre blanco
 * no alcanza 4.5:1, pero WCAG 1.4.3 exime el texto que forma parte de un
 * logotipo; fuera del logo la marca usa naranja solo como relleno o gráfico.
 */
export default function Logo({ tone = 'dark', tagline, className }: Props) {
  const nameColor =
    tone === 'light' ? 'text-embotec-white' : 'text-embotec-dark';
  const taglineColor =
    tone === 'light' ? 'text-embotec-light' : 'text-embotec-gray';

  return (
    <span className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark tone={tone} className="h-11 w-11 shrink-0" />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-heading text-xl font-extrabold tracking-tight ${nameColor}`}
        >
          EMBO<span className="text-embotec-orange">TEC</span>
        </span>
        {tagline && (
          <span
            className={`mt-1 text-[10px] font-medium tracking-wide uppercase ${taglineColor}`}
          >
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
}
