import { BenefitIcon } from '@/components/icons/BenefitIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { BenefitsSectionContent } from '@/types/landing'

type Props = { content: BenefitsSectionContent }

export function BenefitsSection({ content }: Props) {
  return (
    <section id="beneficios" className="py-16 px-5 section-alt">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          overline={content.overline}
          overlineClassName="text-secondary"
          title={content.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {content.items.map((item) => {
            const stroke = item.iconTone === 'primary' ? '#157634' : '#79573F'
            const box =
              item.iconTone === 'primary'
                ? 'bg-primary-50'
                : 'bg-secondary-50'

            return (
              <div key={item.title} className="card-base rounded-xl p-5">
                <div
                  className={`w-9 h-9 rounded-lg ${box} flex items-center justify-center mb-3`}
                >
                  <BenefitIcon name={item.icon} stroke={stroke} />
                </div>
                <h3 className="text-sm font-semibold text-[#111] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#888] leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
