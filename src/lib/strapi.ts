import { defaultLandingPage } from '@/data/defaultLanding'
import { getEnv } from '@/lib/runtimeEnv'
import type { LandingPageData } from '@/types/landing'

function isLandingPageData(value: unknown): value is LandingPageData {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    typeof o.seo === 'object' &&
    o.seo !== null &&
    typeof (o.seo as { title?: unknown }).title === 'string' &&
    typeof o.navbar === 'object' &&
    typeof o.hero === 'object'
  )
}

/**
 * Extrae `LandingPageData` de respuestas típicas de Strapi (v4 `data.attributes` o v5/objeto plano).
 */
export function unwrapLandingPayload(payload: unknown): LandingPageData | null {
  if (isLandingPageData(payload)) return payload

  if (payload && typeof payload === 'object') {
    const root = payload as Record<string, unknown>

    if ('data' in root && root.data !== undefined) {
      return unwrapLandingPayload(root.data)
    }

    if ('attributes' in root && root.attributes && typeof root.attributes === 'object') {
      return unwrapLandingPayload(root.attributes)
    }
  }

  return null
}

export function getStrapiUrl(): string | undefined {
  const url = getEnv('VITE_STRAPI_URL')
  return url ? url.replace(/\/$/, '') : undefined
}

/**
 * GET al single type configurado en Strapi. Ajusta el path (`/api/landing-page`) al UID real.
 * Usa `VITE_STRAPI_API_TOKEN` opcional para endpoints protegidos.
 */
export async function fetchLandingFromStrapi(
  path = '/api/landing-page',
): Promise<LandingPageData> {
  const base = getStrapiUrl()
  if (!base) return defaultLandingPage

  const token = getEnv('VITE_STRAPI_API_TOKEN') || undefined
  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}?populate=*`
  const res = await fetch(url, { headers })

  if (!res.ok) {
    console.warn('[strapi] fetch failed, using default landing:', res.status)
    return defaultLandingPage
  }

  const json: unknown = await res.json()
  const parsed = unwrapLandingPayload(json)
  if (!parsed) {
    console.warn('[strapi] unexpected shape, using default landing')
    return defaultLandingPage
  }

  return parsed
}
