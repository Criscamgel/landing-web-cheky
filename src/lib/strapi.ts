import { defaultLandingPage } from '@/data/defaultLanding'
import { getEnv } from '@/lib/runtimeEnv'
import type { LandingPageData, StrapiMedia } from '@/types/landing'

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

/** URL absoluta de un asset del CMS (relativo `/uploads/...` o ya absoluto). */
export function resolveStrapiMediaUrl(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined
  if (media.url.startsWith('http')) return media.url
  const base = getStrapiUrl()
  return base ? `${base}${media.url}` : media.url
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

  // Nivel 2 (componentes con sub-componentes / media)
  params.append('populate[navbar][populate]', '*')
  params.append('populate[hero][populate]', '*')
  params.append('populate[howItWorks][populate]', '*')
  params.append('populate[benefits][populate]', '*')
  params.append('populate[contact][populate][highlights]', '*')
  params.append('populate[contact][populate][formFields]', '*')
  params.append('populate[footer][populate]', '*')
  // resultado: features + dashboardScreenshot (media). `populate[media]=*` devuelve 400 en Strapi 5.
  params.append('populate[resultado][populate]', '*')

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

function normalizeStrapiMedia(raw: unknown): StrapiMedia | null | undefined {
  if (raw == null) return null
  if (typeof raw !== 'object') return undefined

  const record = raw as Record<string, unknown>

  if (typeof record.url === 'string') {
    return {
      url: record.url,
      alternativeText:
        typeof record.alternativeText === 'string' ? record.alternativeText : undefined,
      width: typeof record.width === 'number' ? record.width : undefined,
      height: typeof record.height === 'number' ? record.height : undefined,
    }
  }

  const nested = record.data as Record<string, unknown> | undefined
  const attrs = nested?.attributes as Record<string, unknown> | undefined
  if (attrs && typeof attrs.url === 'string') {
    return {
      url: attrs.url,
      alternativeText:
        typeof attrs.alternativeText === 'string' ? attrs.alternativeText : undefined,
      width: typeof attrs.width === 'number' ? attrs.width : undefined,
      height: typeof attrs.height === 'number' ? attrs.height : undefined,
    }
  }

  return undefined
}

/**
 * Normaliza campos de Strapi que difieren del modelo del frontend.
 * - Strapi usa `planId` (porque `id` es reservado) → el frontend espera `id`.
 * - Strapi usa `formFields` (porque `fields` es reservado) → el frontend espera `fields`.
 * - Normaliza `fieldId` → `id` en campos de contacto.
 * - `resultPreview` → `resultado` (legacy).
 * - Media plana o anidada (v4/v5).
 */
function normalizeStrapiFields(data: LandingPageData): LandingPageData {
  const raw = data as unknown as Record<string, unknown>
  if (!data.resultado && raw.resultPreview) {
    data.resultado = raw.resultPreview as LandingPageData['resultado']
  }

  if (data.resultado) {
    const screenshot = normalizeStrapiMedia(data.resultado.dashboardScreenshot)
    if (screenshot !== undefined) {
      data.resultado = { ...data.resultado, dashboardScreenshot: screenshot }
    }
  }

  if (data.hero) {
    const mockup = normalizeStrapiMedia(data.hero.dashboardMockupImage)
    if (mockup !== undefined) {
      data.hero = { ...data.hero, dashboardMockupImage: mockup }
    }
  }

  if (data.pricing?.plans) {
    data.pricing.plans = data.pricing.plans.map((plan) => {
      if ('planId' in (plan as object) && !plan.id) {
        return { ...plan, id: (plan as unknown as { planId: string }).planId }
      }
      return plan
    })
  }

  // Strapi usa `formFields` porque `fields` es palabra reservada
  const contact = data.contact
  if (contact && 'formFields' in (contact as object) && !contact.fields) {
    const contactRaw = contact as unknown as { formFields: typeof contact.fields }
    contact.fields = contactRaw.formFields
  }

  if (data.contact?.fields) {
    data.contact.fields = data.contact.fields.map((field) => {
      if ('fieldId' in (field as object) && !field.id) {
        return { ...field, id: (field as unknown as { fieldId: string }).fieldId }
      }
      return field
    })
  }

  return data
}
