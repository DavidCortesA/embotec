'use client';

import { useSyncExternalStore } from 'react';

/**
 * Interruptor único del movimiento del sitio.
 *
 * DECISIÓN DEL CLIENTE (14-08-2026): el sitio anima siempre, aunque el sistema
 * operativo pida movimiento reducido. Se tomó a sabiendas de que incumple WCAG
 * 2.3.3 (Animation from Interactions) y de que el pin, el parallax y el scroll
 * suave pueden provocar malestar a personas con trastornos vestibulares.
 *
 * Para volver a respetar la preferencia basta poner esto en `true`: toda la
 * maquinaria de abajo sigue intacta y cada componente ya tiene su variante sin
 * movimiento (cuadrículas estáticas en lugar de pin, apariciones sin
 * desplazamiento, Lenis desactivado). Habría que restaurar además el bloque
 * `@media (prefers-reduced-motion: reduce)` de `app/globals.css`.
 */
const RESPECT_REDUCED_MOTION = false;

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const getSnapshot = () =>
  RESPECT_REDUCED_MOTION && window.matchMedia(QUERY).matches;

/**
 * En el servidor (y durante la hidratación) asumimos que no hay preferencia:
 * es lo único que el HTML puede saber.
 */
const getServerSnapshot = () => false;

/**
 * Sustituto del `useReducedMotion` de framer-motion, que lee `matchMedia`
 * dentro de `useState` y por tanto devuelve un valor distinto al del servidor
 * en el primer render del cliente (error de hidratación).
 *
 * Con `useSyncExternalStore` el primer render usa el valor del servidor y React
 * vuelve a renderizar justo después de hidratar. Además reacciona si el usuario
 * cambia la preferencia del sistema sin recargar.
 */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
