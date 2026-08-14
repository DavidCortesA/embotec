'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Logo from '@/components/brand/Logo';
import { navItems } from '@/data/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import { useReducedMotion } from '@/lib/useReducedMotion';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import { EASE_OUT_EXPO, useNavbarMotion } from './navbarMotion';

/** Píxeles de scroll antes de permitir que el navbar se encoja */
const SHRINK_THRESHOLD = 56;
/** Movimiento mínimo para considerar que hubo un cambio de dirección */
const DIRECTION_DELTA = 4;

export default function Navbar() {
  const t = useTranslations('Navbar');
  const tServices = useTranslations('Services');
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;

    // Cerca del top siempre grande.
    if (current < SHRINK_THRESHOLD) {
      setIsScrollingDown(false);
      return;
    }
    // Scroll hacia abajo -> pequeño. Scroll hacia arriba -> grande.
    if (delta > DIRECTION_DELTA) setIsScrollingDown(true);
    else if (delta < -DIRECTION_DELTA) setIsScrollingDown(false);
  });

  // El navbar solo se encoge si además no hay hover ni menús abiertos.
  const isCompact =
    isScrollingDown && !isHovered && !openDropdown && !isMobileOpen;
  const navbar = useNavbarMotion(isCompact, prefersReducedMotion);

  const closeMenus = useCallback(() => {
    setOpenDropdown(null);
    setIsMobileOpen(false);
  }, []);

  // Cierra los menús al cambiar de página (incluye atrás/adelante del
  // navegador). Se ajusta durante el render en vez de en un efecto para
  // evitar un render extra con el menú aún abierto.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (renderedPathname !== pathname) {
    setRenderedPathname(pathname);
    setOpenDropdown(null);
    setIsMobileOpen(false);
  }

  // Escape cierra el desplegable y el menú móvil.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeMenus]);

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    if (!isMobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileOpen]);

  const isActive = (href: AppPathname) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.header
      style={navbar.header}
      // El header ocupa todo el ancho pero no debe capturar clics: solo la píldora.
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-6"
    >
      <motion.nav
        style={navbar.shell}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        aria-label={t('mainNavigation')}
        className="pointer-events-auto w-full border border-embotec-light bg-embotec-white/70 backdrop-blur-xl backdrop-saturate-150"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo tone="dark"/>
          </Link>

          {/* Menú central (escritorio) */}
          <motion.ul
            style={navbar.navList}
            className="hidden items-center lg:flex"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              if (!item.children) {
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="block"
                    >
                      <motion.span
                        style={navbar.navItem}
                        className={`relative block rounded-full font-medium whitespace-nowrap transition-colors ${
                          active
                            ? 'text-embotec-blue'
                            : 'text-embotec-dark/80 hover:text-embotec-blue'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="navbar-active-pill"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 36,
                            }}
                            className="absolute inset-0 -z-10 rounded-full bg-embotec-blue/10"
                          />
                        )}
                        {t(item.key)}
                      </motion.span>
                    </Link>
                  </li>
                );
              }

              const isOpen = openDropdown === item.key;

              return (
                <li
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  // También se abre al tabular hacia el item y se cierra
                  // cuando el foco sale de él (o de su panel).
                  onFocus={() => setOpenDropdown(item.key)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  {/* El trigger es un link real: clic lleva a /servicios */}
                  <Link
                    href={item.href}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-current={active ? 'page' : undefined}
                    className="block"
                  >
                    <motion.span
                      style={navbar.navItem}
                      className={`relative flex items-center gap-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                        active || isOpen
                          ? 'text-embotec-blue'
                          : 'text-embotec-dark/80 hover:text-embotec-blue'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="navbar-active-pill"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 36,
                          }}
                          className="absolute inset-0 -z-10 rounded-full bg-embotec-blue/10"
                        />
                      )}
                      {t(item.key)}
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                        className="flex"
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      </motion.span>
                    </motion.span>
                  </Link>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                        style={{ x: '-50%' }}
                        className="absolute top-full left-1/2 pt-3"
                      >
                        <div className="w-[380px] rounded-2xl border border-embotec-light bg-embotec-white/90 p-2 shadow-[0_28px_60px_-28px_rgba(10,37,64,0.4)] backdrop-blur-xl">
                          <p className="px-3 pt-2 pb-2 text-[11px] font-semibold tracking-[0.14em] text-embotec-gray uppercase">
                            {t('servicesIntro')}
                          </p>

                          {item.children.map((service) => {
                            const Icon = service.icon;

                            return (
                              <Link
                                key={service.slug}
                                href={service.href}
                                onClick={closeMenus}
                                className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-embotec-bg"
                              >
                                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-embotec-blue/10 text-embotec-blue transition-colors group-hover:bg-embotec-orange/15 group-hover:text-embotec-orange">
                                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                                </span>
                                <span className="min-w-0">
                                  <span className="block font-heading text-sm font-semibold text-embotec-dark">
                                    {tServices(`items.${service.key}.title`)}
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-embotec-gray">
                                    {tServices(`items.${service.key}.summary`)}
                                  </span>
                                </span>
                              </Link>
                            );
                          })}

                          <Link
                            href={item.href}
                            onClick={closeMenus}
                            className="mt-1 flex items-center justify-between rounded-xl bg-embotec-bg px-3 py-2.5 text-sm font-semibold text-embotec-blue transition-colors hover:bg-embotec-light"
                          >
                            {t('allServices')}
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </motion.ul>

          {/* Idioma + CTA (escritorio) */}
          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <LanguageSwitcher layoutId="language-indicator-desktop" />
            <Link href="/contacto" className="block">
              <motion.span
                style={navbar.cta}
                whileHover={{ y: -1 }}
                // Naranja con texto azul marino: 6.3:1, mientras que el
                // blanco sobre naranja solo daría 2.4:1 (WCAG 1.4.3).
                className="flex items-center gap-1.5 rounded-full bg-embotec-orange font-heading font-bold whitespace-nowrap text-embotec-dark shadow-[0_10px_24px_-12px_rgba(242,140,40,0.9)] transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
              >
                {t('contact')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </motion.span>
            </Link>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? t('closeMenu') : t('openMenu')}
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border border-embotec-light bg-embotec-white/70 text-embotec-dark transition-colors hover:bg-embotec-bg lg:hidden"
          >
            <span className="relative block h-[14px] w-5">
              <motion.span
                initial={false}
                animate={
                  isMobileOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="absolute top-[1px] left-0 block h-[2px] w-5 rounded-full bg-current"
              />
              <motion.span
                initial={false}
                animate={
                  isMobileOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }
                }
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="absolute top-[11px] left-0 block h-[2px] w-5 rounded-full bg-current"
              />
            </span>
          </button>
        </div>

        {/* Menú móvil */}
        <MobileMenu
          isOpen={isMobileOpen}
          isActive={isActive}
          onNavigate={closeMenus}
        />
      </motion.nav>
    </motion.header>
  );
}
