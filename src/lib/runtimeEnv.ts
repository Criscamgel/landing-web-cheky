/**
 * Vite reemplaza import.meta.env.VITE_* solo en BUILD.
 * En producción (Docker/Dokploy), el contenedor puede inyectar variables al **runtime**;
 * `public/env.js` (generado en el arranque) rellena `window.__CHEKY_ENV__`.
 */

declare global {
  interface Window {
    __CHEKY_ENV__?: Record<string, string | undefined>
  }
}

function fromImport(key: string): string {
  const v = (import.meta.env as Record<string, string | undefined>)[key]
  return v != null && String(v).trim() !== '' ? String(v).trim() : ''
}

function fromWindow(key: string): string {
  if (typeof window === 'undefined') return ''
  const w = window.__CHEKY_ENV__
  if (!w) return ''
  const v = w[key]
  return v != null && String(v).trim() !== '' ? String(v).trim() : ''
}

/** Prioridad: build (Vite) → runtime (env.js en nginx) */
export function getEnv(key: string): string {
  return fromImport(key) || fromWindow(key)
}

/** Base API Nest: incluye `/api`. Sin barra final. */
export function getPublicApiBaseUrl(): string {
  return getEnv('VITE_API_URL').replace(/\/$/, '')
}

/** URL base de la webapp (solo origen); post-pago redirige a `/auth/login?...`. */
export function getWebAppBaseUrl(): string {
  return getEnv('VITE_WEB_APP_URL').replace(/\/$/, '')
}
