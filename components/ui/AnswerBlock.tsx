import { getTranslations } from 'next-intl/server';
import Reveal from '@/components/ui/Reveal';
import { company } from '@/data/company';

type Props = {
  /** La pregunta que trae el usuario, tal cual la buscaría */
  question: string;
  /** Respuesta directa, 2 o 3 frases. Va primero: nada de rodeos. */
  answer: string;
};

/**
 * Bloque de respuesta directa, inmediatamente debajo del encabezado de la
 * página: pregunta como <h2>, respuesta en un párrafo corto y la ficha de datos
 * duros (dónde estamos, qué cubrimos, en cuánto respondemos, a qué número).
 *
 * Está pensado para que tanto una persona con prisa como un buscador o un
 * asistente generativo encuentren la respuesta sin tener que recorrer la
 * página: el texto es el mismo que ve el usuario, no un resumen oculto.
 */
export default async function AnswerBlock({ question, answer }: Props) {
  const t = await getTranslations('Common.facts');

  type Fact = {
    /** Clave en `Common.facts` para la etiqueta */
    key: string;
    value: string;
    href: string | null;
    /** Sale del sitio (el mapa), así que necesita `rel`/`target` */
    external?: boolean;
  };

  const facts: readonly Fact[] = [
    {
      key: 'location',
      value: `${company.address.city}, ${company.address.state}`,
      href: company.address.mapsUrl,
      external: true,
    },
    { key: 'coverage', value: t('coverageValue'), href: null },
    { key: 'response', value: t('responseValue'), href: null },
    { key: 'phone', value: company.phone, href: company.phoneHref },
  ];

  return (
    <section className="border-b border-embotec-dark/10 bg-embotec-bg py-14 sm:py-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-embotec-dark sm:text-2xl">
            {question}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-embotec-gray">
            {answer}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 self-start">
          {facts.map((fact, index) => (
            <Reveal key={fact.key} delay={index * 0.05}>
              <dt className="tech-label text-embotec-orange-dark">
                {t(fact.key)}
              </dt>
              <dd className="mt-2 font-heading text-base font-bold text-embotec-dark">
                {fact.href ? (
                  <a
                    href={fact.href}
                    target={fact.external ? '_blank' : undefined}
                    rel={fact.external ? 'noopener noreferrer' : undefined}
                    className="transition-colors hover:text-embotec-orange-dark"
                  >
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
