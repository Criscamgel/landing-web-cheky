import { PricingCard } from '@/components/sections/PricingCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PricingSectionContent } from '@/types/landing'

type Props = { content: PricingSectionContent }

export function PricingSection({ content }: Props) {
  return (
    <section id="precios" className="py-16 px-5 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          overline={content.overline}
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
