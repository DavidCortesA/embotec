import Reveal from '@/components/ui/Reveal';

export type LegalSection = {
  title: string;
  /** Párrafos del apartado; cada uno se renderiza como <p> */
  body: string[];
};

type Props = {
  /** Fecha de la última revisión del documento */
  updated: string;
  sections: LegalSection[];
};

/**
 * Cuerpo de las páginas legales: una columna de lectura con cada apartado como
 * <h2> (el <h1> lo pone el encabezado de la página) para que el documento tenga
 * un esquema navegable tanto para lectores de pantalla como para los buscadores.
 */
export default function LegalContent({ updated, sections }: Props) {
  return (
    <section className="bg-embotec-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-6">
        <p className="tech-label text-embotec-gray">{updated}</p>

        <div className="mt-12 flex flex-col gap-12">
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={Math.min(index, 4) * 0.05}>
              <h2 className="font-heading text-xl font-extrabold text-embotec-dark sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-embotec-gray"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
