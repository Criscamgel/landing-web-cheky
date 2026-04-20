import { IconArrowRight } from '@/components/icons/UiIcons'
import { Button } from '@/components/ui/Button'
import type { HeroContent } from '@/types/landing'

type Props = { content: HeroContent }

export function HeroSection({ content }: Props) {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 px-5 bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-100 bg-primary-50/60 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          <span className="text-[10px] font-medium text-primary-700 uppercase tracking-[0.16em]">
            {content.badge}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight mb-5 text-[#111]">
          {content.titleLine1}
          <br className="hidden sm:block" />
          {content.titleLine2}
        </h1>

        <p className="text-[15px] md:text-base text-[#666] max-w-xl mx-auto leading-relaxed mb-9">
          {content.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href={content.primaryCta.href}
            variant="primary"
            className="text-sm font-semibold px-7 py-3 rounded-lg inline-flex items-center gap-2"
          >
            {content.primaryCta.label}
            <IconArrowRight />
          </Button>
          <Button
            href={content.secondaryCta.href}
            variant="inverted"
            className="text-sm font-medium px-7 py-3 rounded-lg inline-flex items-center gap-2"
          >
            {content.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
