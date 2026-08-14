type Props = {
  /** `dark` para fondos claros, `light` para fondos azul marino */
  tone?: 'dark' | 'light';
  className?: string;
};

/**
 * Ícono EMBOTEC: el engrane (mantenimiento y confiabilidad) rodeando la
 * bobina naranja (los embobinados eléctricos), dentro de la forma circular
 * que expresa continuidad. Decorativo: el nombre accesible lo da el texto
 * del logotipo, por eso va con aria-hidden.
 */
export default function LogoMark({ tone = 'dark', className }: Props) {
  const structure = tone === 'light' ? '#ffffff' : 'var(--color-embotec-dark)';

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      focusable="false"
    >
      {/* Dientes del engrane */}
      <circle
        cx="24"
        cy="24"
        r="20.5"
        fill="none"
        stroke={structure}
        strokeWidth="5"
        strokeDasharray="4.6 5.1"
      />
      {/* Aro interior: circularidad y servicio 360° */}
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="none"
        stroke={structure}
        strokeWidth="2.4"
      />
      {/* Curva de movimiento y energía */}
      <path
        d="M9.5 31.5A16.2 16.2 0 0 0 20 39.4"
        fill="none"
        stroke="var(--color-embotec-orange)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Bobina minimalista */}
      <path
        d="M17.6 19h12.8M15.8 24h16.4M17.6 29h12.8"
        fill="none"
        stroke="var(--color-embotec-orange)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
