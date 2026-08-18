"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import RevealText from "@/components/ui/RevealText";
import { serviceImages } from "@/data/images";
import { services } from "@/data/services";
import { Link } from "@/i18n/navigation";

/**
 * Los servicios con scroll pinning: la sección se queda fija y cada servicio
 * pasa a pantalla completa mientras bajas. Misma mecánica que "Cómo trabajamos"
 * (ver `usePinnedTrack`).
 *
 * A diferencia del proceso, aquí cada panel lleva un enlace, así que el pin
 * avanza también al tabular (`focusPanel`) y ningún enlace queda accesible solo
 * con el ratón.
 */
export default function ServicesPreview() {
  return <StaticServices />;
}

function ServicesIntro() {
  const t = useTranslations("Home.services");

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <p className="tech-label flex items-center gap-3 text-embotec-orange">
        <span aria-hidden className="h-px w-10 bg-embotec-orange" />
        {t("eyebrow")}
      </p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
        <RevealText
          as="h2"
          className="display max-w-[14ch] text-[clamp(2.25rem,6vw,5rem)] text-embotec-white"
        >
          {t("title")}
        </RevealText>
        {/* Pedido del cliente: eliminar el texto "Del embobinado de un motor
            quemado al plan de mantenimiento de toda tu planta." */}
        {/* <p className="text-lg leading-relaxed text-embotec-light lg:pb-3">
          {t("description")}
        </p> */}
      </div>
    </div>
  );
}

/** Movimiento reducido: los mismos servicios, en rejilla y sin pin. */
function StaticServices() {
  const t = useTranslations("Services");

  return (
    <section className="on-dark bg-embotec-night py-24 sm:py-32">
      <ServicesIntro />

      <ul className="mx-auto mt-16 grid w-full max-w-7xl gap-x-8 gap-y-14 px-6 sm:grid-cols-2">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <Reveal
              as="li"
              key={service.slug}
              delay={(index % 2) * 0.1}
              className={index % 2 === 1 ? "sm:mt-20" : undefined}
            >
              <Link href={service.href} className="group block">
                <figure className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-embotec-white/10">
                  <Image
                    src={serviceImages[service.key]}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 46vw, 100vw"
                    className="object-cover grayscale-[45%] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-embotec-night via-embotec-night/25 to-transparent"
                  />
                  <span className="tech-label absolute top-5 left-5 text-embotec-white/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-5 bottom-5 grid h-12 w-12 place-items-center rounded-full bg-embotec-white/10 text-embotec-orange backdrop-blur-md transition-colors group-hover:bg-embotec-orange group-hover:text-embotec-dark">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                </figure>

                <h3 className="display mt-7 text-3xl text-embotec-white transition-colors group-hover:text-embotec-orange sm:text-4xl">
                  {t(`items.${service.key}.title`)}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed text-embotec-light/80">
                  {t(`items.${service.key}.summary`)}
                </p>
                <span className="tech-label mt-6 inline-flex items-center gap-2 text-embotec-orange">
                  {t("cta")}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
