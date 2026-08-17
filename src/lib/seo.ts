import { getStrapiUrl } from '@/lib/strapi'
import type { SeoMeta, StrapiMedia } from '@/types/landing'

export const DEFAULT_SITE_URL = 'https://cheky.co'

export function resolveStrapiMediaUrl(
  media?: StrapiMedia | null,
  fallback = '',
): string {
  if (!media?.url) return fallback
  if (media.url.startsWith('http')) return media.url
  const base = getStrapiUrl() || ''
  return `${base}${media.url}`
}

export function normalizeSeoMeta(seo: SeoMeta): Required<
  Pick<SeoMeta, 'title' | 'description' | 'canonicalUrl' | 'robots' | 'ogTitle' | 'ogDescription' | 'twitterCard'>
> & {
  ogImageUrl: string
} {
  const description = seo.description?.trim() || ''
  const ogTitle = seo.ogTitle?.trim() || seo.title
  const ogDescription = seo.ogDescription?.trim() || description
  const canonicalUrl = (seo.canonicalUrl?.trim() || DEFAULT_SITE_URL).replace(/\/$/, '')
  const ogImageUrl =
    resolveStrapiMediaUrl(seo.ogImage, `${canonicalUrl}/favicon-96x96.png`)

  return {
    title: seo.title,
    description,
    canonicalUrl,
    robots: seo.robots || 'index, follow',
    ogTitle,
    ogDescription,
    twitterCard: seo.twitterCard || 'summary_large_image',
    ogImageUrl,
  }
}

export function buildOrganizationJsonLd(canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cheky',
    url: canonicalUrl,
    logo: `${canonicalUrl}/favicon-96x96.png`,
    description:
      'Verificación de identidad y scoring crediticio para empresas en Colombia.',
    areaServed: {
      '@type': 'Country',
      name: 'Colombia',
    },
  }
}

export function buildWebSiteJsonLd(canonicalUrl: string, title: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    url: canonicalUrl,
    inLanguage: 'es-CO',
  }
}
