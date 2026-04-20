import { SectionHeading } from '@/components/ui/SectionHeading'
import type { HowItWorksContent } from '@/types/landing'

type Props = { content: HowItWorksContent }

export function HowItWorksSection({ content }: Props) {
  return (
    <section id="como-funciona" className="py-16 px-5 section-alt">
      <div className="max-w-4xl mx-auto">
        <SectionHeading overline={content.overline} title={content.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-[#e0e0e0]" />

          {content.steps.map((step) => (
            <div key={step.step} className="card-base rounded-xl p-6 text-center relative">
              <div className="w-8 h-8 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-4 text-[11px] font-bold text-primary relative z-10 bg-white">
                {step.step}
              </div>
              <h3 className="text-sm font-semibold text-[#111] mb-2">{step.title}</h3>
              <p className="text-xs text-[#888] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
