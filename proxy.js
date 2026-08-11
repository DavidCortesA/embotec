// proxy.ts (raíz del proyecto, junto a la carpeta app/)
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["es", "en"];
const defaultLocale = "es";
const COOKIE_NAME = "NEXT_LOCALE";

function getLocale(request) {
  // 1. Si hay cookie válida, mandamos con ella.
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Si no, negociamos con el Accept-Language.
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // ¿La ruta ya trae un locale?
  const pathnameLocale = locales.find(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // La ruta ya viene con locale: sincronizamos la cookie si cambió.
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE_NAME)?.value !== pathnameLocale) {
      response.cookies.set(COOKIE_NAME, pathnameLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 año
        sameSite: "lax",
      });
    }
    return response;
  }

  // Sin locale en la ruta: detectamos y redirigimos.
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};