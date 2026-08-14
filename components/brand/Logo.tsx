import Image from "next/image";

/** Tamaño intrínseco del PNG: se usa para que Next reserve el espacio correcto. */
const LOGO_WIDTH = 825;
const LOGO_HEIGHT = 201;

type Props = {
  tone?: "dark" | "light";
  /** Muestra el descriptor "Embobinados y mantenimiento industrial" */
  tagline?: string;
  className?: string;
};

/**
 * Logotipo completo (ícono + nombre). El naranja de la marca sobre blanco
 * no alcanza 4.5:1, pero WCAG 1.4.3 exime el texto que forma parte de un
 * logotipo; fuera del logo la marca usa naranja solo como relleno o gráfico.
 *
 * Sobre fondos claros se usa el PNG oficial (ya trae el tagline impreso).
 * Sobre fondos oscuros el azul marino del PNG se pierde, así que se compone
 * la versión vectorial con el nombre en blanco.
 */
export default function Logo({ tone = "dark", tagline, className }: Props) {
  const logoTone =
    tone === "light" ? "/images/embotec-logo-light.png" : "/images/embotec-logo.png";

  return (
    <Image
      src={logoTone}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      // El alto lo fija la clase; el ancho se deriva del aspect ratio.
      className={`h-12 w-auto ${className ?? ""}`}
      alt={tagline ? `EMBOTEC — ${tagline}` : "EMBOTEC"}
    />
  );
}
