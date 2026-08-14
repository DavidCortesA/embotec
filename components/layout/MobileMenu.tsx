'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { navItems } from '@/data/navigation';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import { EASE_OUT_EXPO } from './navbarMotion';

type Props = {
  isOpen: boolean;
  isActive: (href: AppPathname) => boolean;
  onNavigate: () => void;
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT_EXPO } },
};

export default function MobileMenu({ isOpen, isActive, onNavigate }: Props) {
  const t = useTranslations('Navbar');
  const tServices = useTranslations('Services');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Al cerrar el menú, colapsa el acordeón de servicios.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) setOpenAccordion(null);
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.34, ease: EASE_OUT_EXPO },
            opacity: { duration: 0.2 },
          }}
          className="overflow-hidden lg:hidden"
        >
          <div className="mt-3 max-h-[70vh] overflow-y-auto border-t border-embotec-light px-1 pt-3 pb-1">
            <motion.ul
              initial="hidden"
              animate="show"
              variants={listVariants}
              className="flex flex-col gap-0.5"
            >
              {navItems.map((item) => {
                const active = isActive(item.href);

                if (!item.children) {
                  return (
                    <motion.li key={item.key} variants={rowVariants}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center justify-between rounded-xl px-3 py-3 font-heading text-[15px] font-semibold transition-colors ${
                          active
                            ? 'bg-embotec-blue/10 text-embotec-blue'
                            : 'text-embotec-dark hover:bg-embotec-bg'
                        }`}
                      >
                        {t(item.key)}
                        <ArrowRight
                          className="h-4 w-4 text-embotec-gray"
                          aria-hidden
                        />
                      </Link>
                    </motion.li>
                  );
                }

                const isExpanded = openAccordion === item.key;

                return (
                  <motion.li key={item.key} variants={rowVariants}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAccordion(isExpanded ? null : item.key)
                      }
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-submenu-${item.key}`}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-3 font-heading text-[15px] font-semibold transition-colors ${
                        active || isExpanded
                          ? 'bg-embotec-blue/10 text-embotec-blue'
                          : 'text-embotec-dark hover:bg-embotec-bg'
                      }`}
                    >
                      {t(item.key)}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                        className="flex"
                      >
                        <ChevronDown
                          className="h-4 w-4 text-embotec-gray"
                          aria-hidden
                        />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="submenu"
                          id={`mobile-submenu-${item.key}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.28, ease: EASE_OUT_EXPO },
                            opacity: { duration: 0.18 },
                          }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-embotec-light pl-3">
                            {item.children.map((service) => {
                              const Icon = service.icon;

                              return (
                                <li key={service.slug}>
                                  <Link
                                    href={service.href}
                                    onClick={onNavigate}
                                    aria-current={
                                      isActive(service.href) ? 'page' : undefined
                                    }
                                    className={`flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors ${
                                      isActive(service.href)
                                        ? 'bg-embotec-bg'
                                        : 'hover:bg-embotec-bg'
                                    }`}
                                  >
                                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-embotec-dark text-embotec-orange">
                                      <Icon
                                        className="h-4 w-4"
                                        aria-hidden
                                      />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-sm font-semibold text-embotec-dark">
                                        {tServices(
                                          `items.${service.key}.title`
                                        )}
                                      </span>
                                      <span className="mt-0.5 block text-xs leading-relaxed text-embotec-gray">
                                        {tServices(
                                          `items.${service.key}.summary`
                                        )}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                            <li>
                              <Link
                                href={item.href}
                                onClick={onNavigate}
                                className="flex items-center justify-between rounded-xl px-2.5 py-2.5 text-sm font-semibold text-embotec-blue transition-colors hover:bg-embotec-bg"
                              >
                                {t('allServices')}
                                <ArrowRight className="h-4 w-4" aria-hidden />
                              </Link>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                delay: 0.18,
                ease: EASE_OUT_EXPO,
              }}
              className="mt-4 flex flex-col gap-2.5 px-1 pb-2"
            >
              <LanguageSwitcher
                variant="full"
                layoutId="language-indicator-mobile"
              />
              <Link
                href="/contacto"
                onClick={onNavigate}
                className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-embotec-orange px-5 py-3.5 font-heading text-sm font-bold text-embotec-dark transition-colors hover:bg-embotec-orange-dark hover:text-embotec-white"
              >
                {t('contact')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
