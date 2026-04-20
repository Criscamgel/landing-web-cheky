import type { StatItem } from '@/types/landing'

type Props = { items: StatItem[] }

export function StatsBar({ items }: Props) {
  return (
    <section className="px-5 pb-16 bg-white" aria-label="Indicadores">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-[#fafafa] border border-[#e7e7e7] rounded-xl px-5 py-4"
          >
            <div className="text-xl md:text-2xl font-bold text-[#111]">{item.value}</div>
            <div className="text-[11px] text-[#999] mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
