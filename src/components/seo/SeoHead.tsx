import { useEffect } from 'react'
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  normalizeSeoMeta,
} from '@/lib/seo'
import type { SeoMeta } from '@/types/landing'

type Props = { seo: SeoMeta }

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, payload: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(payload)
}

export function SeoHead({ seo }: Props) {
  useEffect(() => {
    const meta = normalizeSeoMeta(seo)

    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('name', 'robots', meta.robots)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'Cheky')
    upsertMeta('property', 'og:locale', 'es_CO')
    upsertMeta('property', 'og:url', meta.canonicalUrl)
    upsertMeta('property', 'og:title', meta.ogTitle)
    upsertMeta('property', 'og:description', meta.ogDescription)
    upsertMeta('property', 'og:image', meta.ogImageUrl)
    upsertMeta('name', 'twitter:card', meta.twitterCard)
    upsertMeta('name', 'twitter:title', meta.ogTitle)
    upsertMeta('name', 'twitter:description', meta.ogDescription)
    upsertMeta('name', 'twitter:image', meta.ogImageUrl)
    upsertLink('canonical', meta.canonicalUrl)
    upsertJsonLd('cheky-org-jsonld', buildOrganizationJsonLd(meta.canonicalUrl))
    upsertJsonLd('cheky-site-jsonld', buildWebSiteJsonLd(meta.canonicalUrl, meta.title))
  }, [seo])

  return null
}
