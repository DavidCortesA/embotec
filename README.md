# EMBOTEC

Sitio web de EMBOTEC: taller especializado en embobinado y reparación de motores eléctricos, mantenimiento industrial y diagnóstico eléctrico. Construido con Next.js (App Router) y contenido bilingüe (español / inglés) vía `next-intl`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **next-intl** para i18n (rutas, mensajes y detección de idioma)
- **framer-motion** + **Lenis** para las animaciones de scroll (parallax, scroll pinning, scroll suave)
- Gestor de paquetes: **pnpm**

## Requisitos

- Node.js 20+
- pnpm (`packageManager` fijado en `pnpm@11.18.0`)

## Puesta en marcha

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige automáticamente a `/es` o `/en` según el idioma detectado.

Otros scripts:

```bash
pnpm build   # build de producción
pnpm start   # sirve el build de producción
pnpm lint    # eslint
```

## Estructura del proyecto

```
app/[locale]/            Páginas (App Router), una por sección: home, nosotros,
                          servicios, servicios/[slug], proyectos, contacto
components/
  home/                   Secciones exclusivas del home (Header/hero, Ticker,
                          ServicesPreview, ProcessScroll, WhyUs)
  layout/                 Navbar, Footer, menú móvil, selector de idioma
  ui/                     Piezas reutilizables entre páginas (PageHero, CtaBand,
                          Faq, ParallaxImage, Reveal/RevealText)
  motion/                 Scroll suave (Lenis) y el hook de scroll pinning
  seo/                    JSON-LD (datos estructurados)
data/
  company.ts              Datos de contacto y cifras de la empresa (⚠️ provisionales,
                          ver el TODO al inicio del archivo)
  services.ts              Catálogo de servicios (slug, ícono, cantidad de bullets)
  images.ts                Fuente de todas las fotos del sitio (hoy son de stock;
                          los TODO marcan cuáles esperan foto real del cliente)
  navigation.ts            Enlaces del menú principal
messages/
  es.json / en.json        Todo el copy del sitio, por namespace (Home, About,
                          Services, Projects, Contact, Footer, etc.)
i18n/
  routing.ts               Locales soportados y el mapa de rutas traducidas
                          (p. ej. `/nosotros` ↔ `/about-us`)
  navigation.ts / request.ts  Wrappers de next-intl (Link, redirect, config de request)
proxy.ts                   Middleware: detecta idioma y reescribe rutas traducidas
```

## Editar contenido

- **Textos:** todos viven en `messages/es.json` y `messages/en.json`, organizados por namespace y con la misma forma en los dos archivos. Cualquier texto visible en el sitio sale de ahí, no de los componentes.
- **Imágenes:** todas se definen en `data/images.ts`. Para reemplazar una foto de stock por una real basta con cambiar el valor por una ruta local (p. ej. `/images/taller-01.jpg`); los componentes ya usan `next/image` y no dependen de que la fuente sea remota. Revisa los comentarios `TODO (EMBOTEC)` en ese archivo para ver qué fotos están pendientes de reemplazo.
- **Servicios:** agregar uno nuevo requiere tres pasos — entrada en `data/services.ts`, ruta traducida en `i18n/routing.ts` (`pathnames`) y textos en `Services.items.<key>` dentro de los dos `messages/*.json`. La página de detalle (`app/[locale]/servicios/[slug]/page.tsx`) es una sola plantilla compartida por todos los servicios.
- **Datos de la empresa** (teléfono, correo, cifras): `data/company.ts`. Están marcados como provisionales hasta confirmar los datos reales.

## Internacionalización

- Locales: `es` (por defecto) y `en`, con prefijo de idioma siempre presente en la URL (`/es/...`, `/en/...`).
- Las rutas internas están en español (coinciden con las carpetas de `app/[locale]`); `i18n/routing.ts` define cómo se ven en inglés y `proxy.ts` hace la reescritura.
- El idioma se detecta por cookie (`NEXT_LOCALE`) y luego por `Accept-Language`.

## Notas

- `AGENTS.md` documenta que esta versión de Next.js tiene cambios importantes respecto a la documentación de entrenamiento de los modelos de IA; ese archivo lo regenera `next dev` automáticamente y debe quedar commiteado.
- Varias secciones del sitio tienen bloques de código comentados (no borrados) a pedido del cliente, a la espera de contenido pendiente (fotos, listado de marcas para el ticker, textos del servicio de "Ventas"). Búscalos por `TODO (EMBOTEC)` o los comentarios en español que explican el motivo.
