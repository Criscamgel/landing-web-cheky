import { Footer } from '@/components/layout/Footer'
import { SeoHead } from '@/components/seo/SeoHead'
import { Navbar } from '@/components/layout/Navbar'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { ResultPreviewSection } from '@/components/sections/ResultPreviewSection'
import { StatsBar } from '@/components/sections/StatsBar'
import type { LandingPageData } from '@/types/landing'

type Props = { data: LandingPageData }

export function LandingPage({ data }: Props) {
  return (
    <>
      <SeoHead seo={data.seo} />
      <Navbar content={data.navbar} />
      <main className="overflow-x-hidden">
        <HeroSection content={data.hero} />
        <StatsBar items={data.stats} />
        <HowItWorksSection content={data.howItWorks} />
        <ResultPreviewSection content={data.resultado ?? data.resultPreview} />
        <BenefitsSection content={data.benefits} />
        <PricingSection content={data.pricing} />
        <ContactSection content={data.contact} />
      </main>
      <Footer content={data.footer} />
    </>
  )
}
