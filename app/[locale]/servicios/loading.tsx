/**
 * Pantalla de carga del árbol de servicios (índice y ficha de cada servicio).
 *
 * A propósito NO está en `app/[locale]/loading.tsx`: un `loading` en la raíz del
 * idioma también envolvería al atrapatodo `[...rest]`, y como ese envoltorio
 * hace que Next mande el shell (y con él el estatus 200) antes de resolver la
 * página, el 404 dejaría de responder 404 y se volvería un "soft 404" que los
 * buscadores indexan como página válida.
 */
export { default } from '@/components/ui/LoadingScreen';
