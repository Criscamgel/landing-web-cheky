import { PublicPlansPricingSlider } from '@/components/sections/PublicPlansPricingSlider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PricingSectionContent } from '@/types/landing'

type Props = {
  content: PricingSectionContent
}

export function PricingSection({ content }: Props) {
  return (
    <section id="precios" className="bg-white px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          overline={content.overline}
          title={content.title}
          subtitle={content.subtitle}
        />

        <PublicPlansPricingSlider />
      </div>
    </section>
  )
}
