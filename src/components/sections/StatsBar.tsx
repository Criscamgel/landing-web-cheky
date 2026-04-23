import type { StatItem } from '@/types/landing'

type Props = { items: StatItem[] }

export function StatsBar({ items }: Props) {
  const cols =
    items.length >= 4
      ? 'grid-cols-2 lg:grid-cols-4'
      : items.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : items.length === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1'

  return (
    <section className="px-5 pb-16 bg-white" aria-label="Indicadores">
      <div className={`max-w-4xl mx-auto grid gap-4 md:gap-5 ${cols}`}>
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-[#f6f6f6] border border-[#dcdcdc] rounded-xl px-5 py-5 md:py-6 text-center shadow-sm"
          >
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-[#111] tabular-nums">
              {item.value}
            </div>
            <div className="text-xs md:text-sm text-[#555] font-medium mt-1.5 leading-snug max-w-[14rem] mx-auto">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
