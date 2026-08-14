'use client';

import { useEffect } from 'react';
import { useSpring, useTransform } from 'framer-motion';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Un único muelle conduce todo el navbar: `0` = expandido, `1` = compacto.
 * Antes cada `motion.*` animaba sus propias variantes con un spring propio, así
 * que las ~20 propiedades arrancaban a la vez pero asentaban en tiempos
 * distintos y el cambio se leía como un salto. Con un solo valor interpolado
 * todo se mueve en fase y el navbar "respira" en lugar de conmutar.
 */
const SHRINK_SPRING = {
  stiffness: 150,
  damping: 26,
  mass: 1,
  restDelta: 0.0005,
};

/**
 * Devuelve un objeto `style` por cada pieza del navbar. Todos comparten el
 * mismo MotionValue, por lo que no hay coste extra en repartirlos.
 */
export function useNavbarMotion(
  isCompact: boolean,
  prefersReducedMotion: boolean,
) {
  const shrink = useSpring(0, SHRINK_SPRING);

  useEffect(() => {
    const target = isCompact ? 1 : 0;
    // `jump` salta sin animar (WCAG 2.3.3).
    if (prefersReducedMotion) shrink.jump(target);
    else shrink.set(target);
  }, [isCompact, prefersReducedMotion, shrink]);

  // Separación del navbar respecto al borde superior de la ventana
  const headerPadding = useTransform(shrink, [0, 1], [20, 8]);

  // La "píldora" flotante con el fondo blur
  const shellMaxWidth = useTransform(shrink, [0, 1], [1200, 940]);
  const shellRadius = useTransform(shrink, [0, 1], [24, 999]);
  const shellPaddingX = useTransform(shrink, [0, 1], [18, 12]);
  const shellPaddingY = useTransform(shrink, [0, 1], [12, 7]);
  const shellBackground = useTransform(
    shrink,
    [0, 1],
    ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.85)'],
  );
  const shellBorder = useTransform(
    shrink,
    [0, 1],
    ['rgba(233, 238, 243, 0.9)', 'rgba(233, 238, 243, 1)'],
  );
  const shellShadow = useTransform(
    shrink,
    [0, 1],
    [
      '0 18px 40px -24px rgba(10, 37, 64, 0.25)',
      '0 14px 30px -18px rgba(10, 37, 64, 0.35)',
    ],
  );

  const logoSize = useTransform(shrink, [0, 1], [42, 34]);

  const brandSize = useTransform(shrink, [0, 1], [19, 16]);
  const brandTracking = useTransform(
    shrink,
    [0, 1],
    ['-0.01em', '-0.005em'],
  );

  // La bajada de marca desaparece antes de que el resto termine de encogerse,
  // para que no se lea texto aplastado a mitad de camino.
  const taglineOpacity = useTransform(shrink, [0, 0.45], [1, 0]);
  const taglineHeight = useTransform(shrink, [0, 1], [13, 0]);
  const taglineMarginTop = useTransform(shrink, [0, 1], [3, 0]);

  const navListGap = useTransform(shrink, [0, 1], [4, 0]);
  const navListSize = useTransform(shrink, [0, 1], [15, 14]);

  const navItemPaddingX = useTransform(shrink, [0, 1], [14, 11]);
  const navItemPaddingY = useTransform(shrink, [0, 1], [9, 6]);

  const ctaPaddingX = useTransform(shrink, [0, 1], [20, 16]);
  const ctaPaddingY = useTransform(shrink, [0, 1], [10, 7]);
  const ctaSize = useTransform(shrink, [0, 1], [14, 13]);

  return {
    header: { paddingTop: headerPadding, paddingBottom: headerPadding },
    shell: {
      maxWidth: shellMaxWidth,
      borderRadius: shellRadius,
      paddingLeft: shellPaddingX,
      paddingRight: shellPaddingX,
      paddingTop: shellPaddingY,
      paddingBottom: shellPaddingY,
      backgroundColor: shellBackground,
      borderColor: shellBorder,
      boxShadow: shellShadow,
    },
    logoMark: { width: logoSize, height: logoSize },
    brand: { fontSize: brandSize, letterSpacing: brandTracking },
    tagline: {
      opacity: taglineOpacity,
      height: taglineHeight,
      marginTop: taglineMarginTop,
      fontSize: 10,
    },
    navList: { columnGap: navListGap, fontSize: navListSize },
    navItem: {
      paddingLeft: navItemPaddingX,
      paddingRight: navItemPaddingX,
      paddingTop: navItemPaddingY,
      paddingBottom: navItemPaddingY,
    },
    cta: {
      paddingLeft: ctaPaddingX,
      paddingRight: ctaPaddingX,
      paddingTop: ctaPaddingY,
      paddingBottom: ctaPaddingY,
      fontSize: ctaSize,
    },
  };
}
