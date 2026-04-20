import { IconCheck } from '@/components/icons/UiIcons'
import { Button } from '@/components/ui/Button'
import type { PricingPlan } from '@/types/landing'

type Props = { plan: PricingPlan }

export function PricingCard({ plan }: Props) {
  const isPopular = plan.variant === 'popular'

  const shell = isPopular
    ? 'popular-card rounded-2xl p-6 flex flex-col relative md:-translate-y-3'
    : 'card-base rounded-2xl p-6 flex flex-col'

  const divider = isPopular ? 'border-t border-primary-100 mb-5' : 'border-t border-[#e7e7e7] mb-5'

  return (
    <div className={shell}>
      {plan.badge ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-[0.12em] px-4 py-1 rounded-full">
            {plan.badge}
          </span>
        </div>
      ) : null}

      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#888] mb-1">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold text-[#111]">{plan.price}</span>
          <span className="text-sm text-[#999]">{plan.period}</span>
        </div>
        <p className="text-xs text-[#999] leading-relaxed">{plan.description}</p>
      </div>

      <div className={divider} />

      <ul className="flex-1 space-y-3 mb-6">
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5">
            <IconCheck className="mt-0.5 shrink-0" />
            <span className="text-xs text-[#666] leading-relaxed">{f.text}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.ctaVariant}
        className="w-full text-xs font-semibold py-2.5 rounded-lg"
      >
        {plan.ctaLabel}
      </Button>
    </div>
  )
}
