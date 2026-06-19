import { useEffect, useState } from 'react'
import { getStrapiUrl } from '@/lib/strapi'
import { getEnv } from '@/lib/runtimeEnv'

export type SectionImageData = {
  url: string
  alt: string
}

/**
 * Obtiene la imagen de una sección desde Strapi (Single Type).
 * Si Strapi no está configurado o falla, retorna null y el componente usa el fallback estático.
 */
export function useSectionImage(
  apiPath: string,
  imageField: string,
  altField: string,
  defaultAlt: string,
) {
  const [imageData, setImageData] = useState<SectionImageData | null>(null)

  useEffect(() => {
    const strapiUrl = getStrapiUrl()
    if (!strapiUrl) return

    const token = getEnv('VITE_STRAPI_API_TOKEN') || undefined
    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const url = `${strapiUrl}${apiPath}?populate=${imageField}`

    fetch(url, { headers })
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((json: unknown) => {
        if (!json) return
        const data = unwrapStrapiData(json)
        if (!data) return

        const imgField = (data as Record<string, unknown>)[imageField]
        const altValue =
          ((data as Record<string, unknown>)[altField] as string) || defaultAlt

        const imgUrl = resolveImageUrl(imgField, strapiUrl)
        if (imgUrl) {
          setImageData({ url: imgUrl, alt: altValue })
        }
      })
      .catch(() => {
        // Silently fail — component will use fallback
      })
  }, [apiPath, imageField, altField, defaultAlt])

  return imageData
}

/** Extrae data de Strapi v4/v5 response wrapper. */
function unwrapStrapiData(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') return null
  const obj = payload as Record<string, unknown>

  // Strapi v5: { data: { id, ...fields } }
  if ('data' in obj && obj.data && typeof obj.data === 'object') {
    const data = obj.data as Record<string, unknown>
    // Strapi v4: { data: { attributes: {...} } }
    if ('attributes' in data && data.attributes && typeof data.attributes === 'object') {
      return data.attributes as Record<string, unknown>
    }
    return data
  }

  return obj
}

/** Resuelve la URL absoluta de un campo media de Strapi. */
function resolveImageUrl(field: unknown, strapiBase: string): string | null {
  if (!field || typeof field !== 'object') return null

  const media = field as Record<string, unknown>

  // Strapi v5: campo directo con url
  if (typeof media.url === 'string') {
    return media.url.startsWith('http') ? media.url : `${strapiBase}${media.url}`
  }

  // Strapi v4: { data: { attributes: { url } } }
  if ('data' in media && media.data && typeof media.data === 'object') {
    const inner = media.data as Record<string, unknown>
    if ('attributes' in inner && inner.attributes && typeof inner.attributes === 'object') {
      const attrs = inner.attributes as Record<string, unknown>
      if (typeof attrs.url === 'string') {
        return attrs.url.startsWith('http') ? attrs.url : `${strapiBase}${attrs.url}`
      }
    }
    // v5 flat
    if (typeof inner.url === 'string') {
      return inner.url.startsWith('http') ? inner.url : `${strapiBase}${inner.url}`
    }
  }

  return null
}
