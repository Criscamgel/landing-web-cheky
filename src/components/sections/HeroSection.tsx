import { Button } from '@/components/ui/Button'
import type { HeroContent } from '@/types/landing'
import { getStrapiUrl } from '@/lib/strapi'

type Props = { content: HeroContent }

export function HeroSection({ content }: Props) {
  const strapiBase = getStrapiUrl() || ''
  const cmsImg = content.dashboardMockupImage
  const imageSrc = cmsImg?.url
    ? (cmsImg.url.startsWith('http') ? cmsImg.url : `${strapiBase}${cmsImg.url}`)
    : '/hero-dashboard-mockup.png'
  const imageAlt = content.dashboardMockupAlt
    || cmsImg?.alternativeText
    || 'Vista previa del dashboard de Cheky mostrando un resultado de check con score de confiabilidad'
  return (
    <section className="relative pt-28 pb-16 md:pt-[7.5rem] md:pb-20 px-5 bg-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-none h-[500px] bg-primary-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ─── Left: Text Content ─── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-100 bg-primary-50/60 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
              <span className="text-[10px] font-medium text-primary-700 uppercase tracking-[0.16em]">
                {content.badge}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight mb-5 text-[#111]">
              {content.titleLine1}
              <br className="hidden sm:block" />
              {content.titleLine2}
            </h1>

            <p className="text-[15px] md:text-base text-[#666] max-w-md leading-relaxed mb-8">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <Button
                href={content.primaryCta.href}
                variant="primary"
                className="text-sm font-semibold px-7 py-3 rounded-lg inline-flex items-center justify-center"
              >
                {content.primaryCta.label}
              </Button>
              <Button
                href={content.secondaryCta.href}
                variant="outlined"
                className="text-sm font-semibold px-7 py-3 rounded-lg inline-flex items-center justify-center"
              >
                {content.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* ─── Right: Dashboard Mockup Image ─── */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 bg-surface-50">
              {/* Imagen del hero — gestionada desde Strapi CMS */}
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover object-top"
                loading="eager"
                onError={(e) => {
                  // Fallback si la imagen no existe aún
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.hero-placeholder')) {
                    const placeholder = document.createElement('div')
                    placeholder.className = 'hero-placeholder flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-50 to-surface-100'
                    placeholder.innerHTML = `
                      <div class="text-center px-6">
                        <p class="text-4xl mb-3">📊</p>
                        <p class="text-sm text-[#888] font-medium">Dashboard Preview</p>
                        <p class="text-xs text-[#aaa] mt-1">Sube la imagen desde Strapi CMS → Hero Section</p>
                      </div>
                    `
                    parent.appendChild(placeholder)
                  }
                }}
              />
            </div>
            {/* Decorative dot pattern */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle, #157634 1.5px, transparent 1.5px)',
              backgroundSize: '12px 12px'
            }} />
          </div>
        </div>
      </div>
    </section>
  )
}
