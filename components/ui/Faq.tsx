import { Plus } from 'lucide-react';
import Reveal from './Reveal';
import RevealText from './RevealText';

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title: string;
  items: readonly FaqItem[];
  /** Sobre fondo oscuro se invierte la paleta */
  tone?: 'light' | 'dark';
};

/**
 * Preguntas frecuentes con `<details>`/`<summary>` nativos: se abren sin
 * JavaScript, el teclado y los lectores de pantalla ya saben manejarlos, y el
 * navegador puede encontrar el texto de una respuesta cerrada al buscar en la
 * página.
 *
 * El contenido también se publica como datos estructurados `FAQPage` desde la
 * página que lo usa, que es lo que leen buscadores y motores generativos.
 */
export default function Faq({ title, items, tone = 'light' }: Props) {
  const isDark = tone === 'dark';

  return (
    <div>
      <RevealText
        as="h2"
        className={`display max-w-[14ch] text-[clamp(2rem,4.5vw,3.5rem)] ${
          isDark ? 'text-embotec-white' : 'text-embotec-dark'
        }`}
      >
        {title}
      </RevealText>

      <div className="mt-12">
        {items.map((item, index) => (
          <Reveal
            key={item.question}
            delay={index * 0.05}
            className={`border-t ${
              isDark ? 'border-embotec-white/15' : 'border-embotec-dark/15'
            } last:border-b`}
          >
            <details className="group">
              <summary
                className={`flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-heading text-lg font-bold transition-colors ${
                  isDark
                    ? 'text-embotec-white hover:text-embotec-orange'
                    : 'text-embotec-dark hover:text-embotec-orange-dark'
                }`}
              >
                {item.question}
                <Plus
                  aria-hidden
                  className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45 ${
                    isDark ? 'text-embotec-orange' : 'text-embotec-orange-dark'
                  }`}
                />
              </summary>
              <p
                className={`max-w-3xl pb-7 text-base leading-relaxed ${
                  isDark ? 'text-embotec-light/80' : 'text-embotec-gray'
                }`}
              >
                {item.answer}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
