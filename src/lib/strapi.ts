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
 * Construye los query params de populate profundo para el Single Type landing-page.
 * Strapi 5 con `populate=*` solo baja 1 nivel; componentes anidados requieren populate explícito.
 */
function buildDeepPopulate(): string {
  const params = new URLSearchParams()

  // Nivel 1 (componentes directos sin sub-componentes)
  const topLevel = ['seo', 'stats', 'pricing']
  topLevel.forEach((field) => params.append(`populate[${field}]`, '*'))

  // Nivel 2 (componentes con sub-componentes)
  params.append('populate[navbar][populate]', '*')
  params.append('populate[hero][populate]', '*')
  params.append('populate[howItWorks][populate]', '*')
  params.append('populate[benefits][populate]', '*')
  params.append('populate[contact][populate][highlights]', '*')
  params.append('populate[contact][populate][formFields]', '*')
  params.append('populate[footer][populate]', '*')

  return params.toString()
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

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}?${buildDeepPopulate()}`
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

  return normalizeStrapiFields(parsed)
}

/**
 * Normaliza campos de Strapi que difieren del modelo del frontend.
 * - Strapi usa `planId` (porque `id` es reservado) → el frontend espera `id`.
 * - Strapi usa `formFields` (porque `fields` es reservado) → el frontend espera `fields`.
 * - Normaliza `fieldId` → `id` en campos de contacto.
 */
function normalizeStrapiFields(data: LandingPageData): LandingPageData {
  if (data.pricing?.plans) {
    data.pricing.plans = data.pricing.plans.map((plan) => {
      const raw = plan as Record<string, unknown>
      if ('planId' in raw && !('id' in raw)) {
        return { ...plan, id: raw.planId as string }
      }
      return plan
    })
  }

  // Strapi usa `formFields` porque `fields` es palabra reservada
  const contactRaw = data.contact as Record<string, unknown> | undefined
  if (contactRaw && 'formFields' in contactRaw && !('fields' in contactRaw)) {
    contactRaw.fields = contactRaw.formFields
    delete contactRaw.formFields
  }

  if (data.contact?.fields) {
    data.contact.fields = data.contact.fields.map((field) => {
      const raw = field as Record<string, unknown>
      if ('fieldId' in raw && !('id' in raw)) {
        return { ...field, id: raw.fieldId as string }
      }
      return field
    })
  }

  return data
}
