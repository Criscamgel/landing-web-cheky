import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/icons/UiIcons'
import { usePublicPlansCatalogQuery } from '@/hooks/usePublicPlansCatalogQuery'
import type { PublicPlanDto } from '@/types/publicPlan'

/** <768: 1 tarjeta, paso 1 · 768–1023: 2 tarjetas, paso 2 · ≥1024: 3 tarjetas, paso 1 */
function readSliderMetrics(width: number): { visible: number; step: number } {
  if (width < 768) return { visible: 1, step: 1 }
  if (width < 1024) return { visible: 2, step: 2 }
  return { visible: 3, step: 1 }
}

function usePricingSliderMetrics() {
  const [metrics, setMetrics] = useState(() =>
    typeof window !== 'undefined'
      ? readSliderMetrics(window.innerWidth)
      : { visible: 3, step: 1 },
  )

  useEffect(() => {
    const onResize = () => setMetrics(readSliderMetrics(window.innerWidth))
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return metrics
}

const TEASERS = [
  'Para comenzar a verificar compradores de forma esporádica.',
  'Para equipos que verifican compradores a diario.',
  'Para operaciones de alto volumen con necesidades específicas.',
] as const

function formatCap(n: number): string {
  return n.toLocaleString('es-CO', { maximumFractionDigits: 0 })
}

function buildTeaser(sorted: PublicPlanDto[], index: number): string {
  if (sorted.length === 1) return TEASERS[1]
  if (index === 0) return TEASERS[0]
  if (index === sorted.length - 1) return TEASERS[2]
  return TEASERS[1]
}

function planFeatures(p: PublicPlanDto): string[] {
  return [
    `Hasta ${formatCap(p.maxUsers)} usuarios con rol usuario`,
    `Hasta ${formatCap(p.maxChecks)} checks por mes calendario`,
    `Membresía por ${p.durationMonths} ${p.durationMonths === 1 ? 'mes' : 'meses'}`,
  ]
}

type CatalogSlide = PublicPlanDto & {
  teaser: string
  features: string[]
  globalIndex: number
}

function ChevronLeftIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

type Props = {
  loginHref: string
}

export function PublicPlansPricingSlider({ loginHref }: Props) {
  const { data: rawPlans, isLoading, isError, refetch } = usePublicPlansCatalogQuery()
  const [start, setStart] = useState(0)
  const { visible, step } = usePricingSliderMetrics()

  const slides: CatalogSlide[] = useMemo(() => {
    const sorted = [...(rawPlans ?? [])].sort(
      (a, b) => a.monthlyPrice - b.monthlyPrice,
    )
    return sorted.map((p, i) => ({
      ...p,
      teaser: buildTeaser(sorted, i),
      features: planFeatures(p),
      globalIndex: i,
    }))
  }, [rawPlans])

  const maxStart = Math.max(0, slides.length - visible)

  useEffect(() => {
    setStart((s) => Math.min(s, maxStart))
  }, [maxStart, visible])

  const safeStart = Math.min(start, maxStart)
  const windowSlides = slides.slice(safeStart, safeStart + visible)
  const popularGlobalIndex =
    slides.length > 0 ? Math.floor((slides.length - 1) / 2) : -1

  const showArrows = slides.length > visible

  const gridColsClass =
    visible === 1 ? 'grid-cols-1' : visible === 2 ? 'grid-cols-2' : 'grid-cols-3'

  if (isLoading) {
    return (
      <div className="grid min-h-64 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className="card-base animate-pulse rounded-2xl p-6"
            aria-hidden
          >
            <div className="mb-4 h-4 w-24 rounded bg-[#e8e8e8]" />
            <div className="mb-2 h-10 w-32 rounded bg-[#e8e8e8]" />
            <div className="mb-6 h-12 w-full rounded bg-[#f4f4f4]" />
            <div className="mb-3 h-3 w-full rounded bg-[#f0f0f0]" />
            <div className="mb-3 h-3 w-full rounded bg-[#f0f0f0]" />
            <div className="mt-8 h-11 w-full rounded-lg bg-[#e8e8e8]" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-[#e7e7e7] bg-[#fafafa] px-6 py-10 text-center text-sm text-[#666]">
        <p>No se pudieron cargar los planes desde el servidor.</p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-primary underline-offset-2 hover:underline"
          onClick={() => void refetch()}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-[#666]">
        No hay planes disponibles en el catálogo por el momento.
      </p>
    )
  }

  return (
    <div className="relative min-w-0">
      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Planes anteriores"
            disabled={safeStart <= 0}
            onClick={() => setStart((s) => Math.max(0, s - step))}
            className="absolute left-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#333] shadow-md transition-colors hover:bg-[#f7f7f7] disabled:pointer-events-none disabled:opacity-40 lg:flex"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Planes siguientes"
            disabled={safeStart >= maxStart}
            onClick={() => setStart((s) => Math.min(maxStart, s + step))}
            className="absolute right-0 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#333] shadow-md transition-colors hover:bg-[#f7f7f7] disabled:pointer-events-none disabled:opacity-40 lg:flex"
          >
            <ChevronRightIcon />
          </button>
        </>
      ) : null}

      <div
        className={showArrows ? 'px-1 lg:px-12' : undefined}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Planes disponibles"
      >
        <div className="w-full pb-2">
          <div className={`mx-auto grid w-full gap-4 ${gridColsClass}`}>
            {windowSlides.map((plan) => {
              const isPopular = plan.globalIndex === popularGlobalIndex
              const isEnterprise =
                slides.length > 1 && plan.globalIndex === slides.length - 1
              const shell = isPopular
                ? 'popular-card relative flex min-h-[22rem] flex-col rounded-2xl p-6 md:-translate-y-1'
                : 'card-base flex min-h-[22rem] flex-col rounded-2xl p-6'
              const divider = isPopular
                ? 'mb-5 border-t border-primary-100'
                : 'mb-5 border-t border-[#e7e7e7]'
              const ctaVariant = isPopular ? 'primary' : isEnterprise ? 'outlined' : 'outlined'

              return (
                <article key={plan.id} className={shell}>
                  {isPopular ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                        Popular
                      </span>
                    </div>
                  ) : null}

                  <div className="mb-5">
                    <h3 className="mb-1 text-sm font-semibold text-[#888]">{plan.name}</h3>
                    <div className="mb-2 flex flex-wrap items-baseline gap-1">
                      <span className="text-3xl font-bold text-[#111]">
                        $
                        {plan.monthlyPrice.toLocaleString('es-CO', {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                      <span className="text-sm text-[#999]">/mes</span>
                      {plan.currency && plan.currency !== 'COP' ? (
                        <span className="w-full text-xs text-[#999]">{plan.currency}</span>
                      ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-[#999]">{plan.teaser}</p>
                  </div>

                  <div className={divider} />

                  <ul className="mb-6 flex-1 space-y-3">
                    {plan.features.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <IconCheck className="mt-0.5 shrink-0" />
                        <span className="text-xs leading-relaxed text-[#666]">{line}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={loginHref}
                    variant={ctaVariant}
                    className="mt-auto flex h-12 w-full items-center justify-center rounded-xl px-4 text-center text-sm font-semibold leading-none md:h-14 md:text-base"
                  >
                    Adquirir
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      {showArrows ? (
        <div className="mt-4 flex justify-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Planes anteriores"
            disabled={safeStart <= 0}
            onClick={() => setStart((s) => Math.max(0, s - step))}
            className="flex size-10 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#333] shadow disabled:opacity-40"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Planes siguientes"
            disabled={safeStart >= maxStart}
            onClick={() => setStart((s) => Math.min(maxStart, s + step))}
            className="flex size-10 items-center justify-center rounded-full border border-[#e0e0e0] bg-white text-[#333] shadow disabled:opacity-40"
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}
    </div>
  )
}
