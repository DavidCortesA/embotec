import type { Transition, Variants } from 'framer-motion';

/**
 * Variantes compartidas del navbar. El `motion.header` es el único que declara
 * `animate={'expanded' | 'compact'}`; framer propaga esa etiqueta a todos los
 * hijos `motion.*` que declaren estas variantes.
 */

export const NAVBAR_SPRING: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Separación del navbar respecto al borde superior de la ventana */
export const headerVariants: Variants = {
  expanded: { paddingTop: 20, paddingBottom: 20 },
  compact: { paddingTop: 8, paddingBottom: 8 },
};

/** La "píldora" flotante con el fondo blur */
export const shellVariants: Variants = {
  expanded: {
    maxWidth: 1200,
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(233, 238, 243, 0.9)',
    boxShadow: '0 18px 40px -24px rgba(10, 37, 64, 0.25)',
  },
  compact: {
    maxWidth: 940,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(233, 238, 243, 1)',
    boxShadow: '0 14px 30px -18px rgba(10, 37, 64, 0.35)',
  },
};

export const logoMarkVariants: Variants = {
  expanded: { width: 42, height: 42 },
  compact: { width: 34, height: 34 },
};

export const brandVariants: Variants = {
  expanded: { fontSize: 19, letterSpacing: '-0.01em' },
  compact: { fontSize: 16, letterSpacing: '-0.005em' },
};

export const taglineVariants: Variants = {
  expanded: { opacity: 1, height: 13, fontSize: 10, marginTop: 3 },
  compact: { opacity: 0, height: 0, fontSize: 9, marginTop: 0 },
};

/** Contenedor de los links centrales */
export const navListVariants: Variants = {
  expanded: { columnGap: 4, fontSize: 15 },
  compact: { columnGap: 0, fontSize: 14 },
};

/** Cada link o botón del menú central */
export const navItemVariants: Variants = {
  expanded: { paddingLeft: 14, paddingRight: 14, paddingTop: 9, paddingBottom: 9 },
  compact: { paddingLeft: 11, paddingRight: 11, paddingTop: 6, paddingBottom: 6 },
};

/** Botón de contacto */
export const ctaVariants: Variants = {
  expanded: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  compact: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 7,
    paddingBottom: 7,
    fontSize: 13,
  },
};
