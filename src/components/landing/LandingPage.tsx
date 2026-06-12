import { useEffect } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { BenefitsSection } from '@/components/sections/BenefitsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { StatsBar } from '@/components/sections/StatsBar'
import { AppointmentSection } from '@/components/sections/AppointmentSection'
import type { LandingPageData } from '@/types/landing'

type Props = { data: LandingPageData }

export function LandingPage({ data }: Props) {
  useEffect(() => {
    document.title = data.seo.title
    const meta = document.querySelector('meta[name="description"]')
    if (data.seo.description) {
      if (meta) meta.setAttribute('content', data.seo.description)
      else {
        const m = document.createElement('meta')
        m.name = 'description'
        m.content = data.seo.description
        document.head.appendChild(m)
      }
    }
  }, [data.seo])

  return (
    <>
      <Navbar content={data.navbar} />
      <main className="overflow-x-hidden">
        <HeroSection content={data.hero} />
        <StatsBar items={data.stats} />
        <HowItWorksSection content={data.howItWorks} />
        <BenefitsSection content={data.benefits} />
        <PricingSection content={data.pricing} />
        <AppointmentSection />
        <ContactSection content={data.contact} />
      </main>
      <Footer content={data.footer} />
    </>
  )
}
