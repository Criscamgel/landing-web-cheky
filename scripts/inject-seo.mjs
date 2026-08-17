/**
 * Inyecta meta tags SEO en dist/index.html tras el build de Vite.
 * Así Google recibe title/description/OG en el HTML inicial (sin depender de React).
 *
 * Usa las mismas env que el build: VITE_STRAPI_URL, VITE_STRAPI_API_TOKEN.
 */
import fs from 'node:fs'
import path from 'node:path'

const INDEX_PATH = path.join('dist', 'index.html')
const SITE_URL = 'https://cheky.co'

const DEFAULTS = {
  title: 'Cheky | Verificación de identidad y scoring crediticio en Colombia',
  description:
    'Verifica identidad y confiabilidad de compradores con huella digital y scoring crediticio. Plataforma B2B para empresas en Colombia.',
  canonicalUrl: SITE_URL,
  robots: 'index, follow',
  ogTitle: 'Cheky — Verificación de identidad y prevención de fraude',
  ogDescription:
    'Score de confiabilidad en tiempo real para empresas. Verifica el patrón digital de cualquier comprador antes de cerrar una venta.',
  twitterCard: 'summary_large_image',
  ogImageUrl: `${SITE_URL}/favicon-96x96.png`,
}

function unwrapSeo(payload) {
  if (!payload || typeof payload !== 'object') return null
  if ('data' in payload) return unwrapSeo(payload.data)
  if ('attributes' in payload && payload.attributes) return unwrapSeo(payload.attributes)
  if ('seo' in payload && payload.seo) return payload.seo
  return null
}

function resolveMediaUrl(media, strapiBase) {
  const url = media?.url
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${strapiBase}${url}`
}

async function fetchSeoFromStrapi() {
  const base = (process.env.VITE_STRAPI_URL || '').replace(/\/$/, '')
  if (!base) {
    console.warn('[inject-seo] VITE_STRAPI_URL vacío — usando defaults')
    return DEFAULTS
  }

  const token = process.env.VITE_STRAPI_API_TOKEN || ''
  const params = new URLSearchParams()
  params.append('populate[seo][populate]', 'ogImage')

  const headers = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  try {
    const res = await fetch(`${base}/api/landing-page?${params}`, { headers })
    if (!res.ok) {
      console.warn(`[inject-seo] Strapi HTTP ${res.status} — usando defaults`)
      return DEFAULTS
    }

    const json = await res.json()
    const raw = unwrapSeo(json)
    if (!raw?.title) {
      console.warn('[inject-seo] SEO no encontrado en respuesta — usando defaults')
      return DEFAULTS
    }

    const canonicalUrl = (raw.canonicalUrl || SITE_URL).replace(/\/$/, '')
    const description = raw.description?.trim() || DEFAULTS.description
    const ogTitle = raw.ogTitle?.trim() || raw.title
    const ogDescription = raw.ogDescription?.trim() || description
    const ogImageUrl =
      resolveMediaUrl(raw.ogImage, base) || DEFAULTS.ogImageUrl

    return {
      title: raw.title,
      description,
      canonicalUrl,
      robots: raw.robots || DEFAULTS.robots,
      ogTitle,
      ogDescription,
      twitterCard: raw.twitterCard || DEFAULTS.twitterCard,
      ogImageUrl,
    }
  } catch (err) {
    console.warn('[inject-seo] Error al consultar Strapi — usando defaults:', err.message)
    return DEFAULTS
  }
}

function upsertTag(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html
}

function injectSeo(html, meta) {
  let out = html

  out = upsertTag(out, /<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)

  const tags = [
    `<meta name="description" content="${meta.description}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    `<link rel="canonical" href="${meta.canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Cheky" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:url" content="${meta.canonicalUrl}" />`,
    `<meta property="og:title" content="${meta.ogTitle}" />`,
    `<meta property="og:description" content="${meta.ogDescription}" />`,
    `<meta property="og:image" content="${meta.ogImageUrl}" />`,
    `<meta name="twitter:card" content="${meta.twitterCard}" />`,
    `<meta name="twitter:title" content="${meta.ogTitle}" />`,
    `<meta name="twitter:description" content="${meta.ogDescription}" />`,
    `<meta name="twitter:image" content="${meta.ogImageUrl}" />`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Cheky',
      url: meta.canonicalUrl,
      logo: `${meta.canonicalUrl}/favicon-96x96.png`,
      description: meta.description,
      areaServed: { '@type': 'Country', name: 'Colombia' },
    })}</script>`,
  ].join('\n    ')

  if (out.includes('<!-- cheky-seo -->')) {
    out = out.replace(
      /<!-- cheky-seo -->[\s\S]*?<!-- \/cheky-seo -->/,
      `<!-- cheky-seo -->\n    ${tags}\n    <!-- /cheky-seo -->`,
    )
  } else {
    out = out.replace('</head>', `    <!-- cheky-seo -->\n    ${tags}\n    <!-- /cheky-seo -->\n  </head>`)
  }

  return out
}

async function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.warn('[inject-seo] dist/index.html no existe — omitiendo')
    return
  }

  const meta = await fetchSeoFromStrapi()
  const html = fs.readFileSync(INDEX_PATH, 'utf8')
  fs.writeFileSync(INDEX_PATH, injectSeo(html, meta), 'utf8')
  console.log('[inject-seo] Meta tags inyectadas en dist/index.html')
  console.log(`[inject-seo] title: ${meta.title}`)
}

main().catch((err) => {
  console.error('[inject-seo] Fatal:', err)
  process.exit(1)
})
