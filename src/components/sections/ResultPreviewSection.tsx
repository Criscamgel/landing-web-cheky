import type { ResultPreviewContent } from '@/types/landing'
import { defaultLandingPage } from '@/data/defaultLanding'
import { getStrapiUrl } from '@/lib/strapi'

type Props = {
  content?: ResultPreviewContent
}

const defaults = defaultLandingPage.resultado!

/**
 * Sección visual informativa: preview del dashboard con resultado de check.
 * Contenido editable desde Strapi → landing-page → resultado.
 */
export function ResultPreviewSection({ content }: Props) {
  const overline = content?.overline?.trim() || defaults.overline
  const title = content?.title?.trim() || defaults.title
  const description = content?.description?.trim() || defaults.description
  const features =
    content?.features?.length && content.features.some((f) => f.text?.trim())
      ? content.features.filter((f) => f.text?.trim())
      : defaults.features ?? []

  const strapiBase = getStrapiUrl() || ''
  const cmsImg = content?.dashboardScreenshot
  const imageSrc = cmsImg?.url
    ? cmsImg.url.startsWith('http')
      ? cmsImg.url
      : `${strapiBase}${cmsImg.url}`
    : '/result-preview-mockup.png'
  const imageAlt =
    content?.dashboardScreenshotAlt?.trim() ||
    cmsImg?.alternativeText ||
    defaults.dashboardScreenshotAlt ||
    'Vista del dashboard de Cheky con gráficas de análisis y resultado de un check'

  return (
    <section className="py-16 md:py-20 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mb-3 block">
              {overline}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111] mb-4">
              {title}
            </h2>
            <p className="text-sm text-[#666] leading-relaxed mb-6 max-w-md">
              {description}
            </p>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <span className="text-sm text-[#444]">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.1)] border border-gray-100 bg-surface-50">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.result-placeholder')) {
                    const placeholder = document.createElement('div')
                    placeholder.className =
                      'result-placeholder flex items-center justify-center w-full h-full bg-gradient-to-br from-surface-50 to-primary-50'
                    placeholder.innerHTML = `
                      <div class="text-center px-6">
                        <p class="text-4xl mb-3">📈</p>
                        <p class="text-sm text-[#888] font-medium">Dashboard & Results Preview</p>
                        <p class="text-xs text-[#aaa] mt-1">Sube la imagen desde Strapi CMS → Result Preview Section</p>
                      </div>
                    `
                    parent.appendChild(placeholder)
                  }
                }}
              />
            </div>
            <div className="absolute -z-10 -top-6 -left-6 w-40 h-40 bg-primary-100 rounded-full blur-[60px] opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
