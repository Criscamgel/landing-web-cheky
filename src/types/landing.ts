/** Tipos del contenido de la landing — alineados con un Single Type en Strapi (ej. `landing-page`). */

export interface NavLink {
  label: string
  href: string
}

export interface NavbarContent {
  brandName: string
  links: NavLink[]
  loginLabel: string
  loginHref: string
}

export interface HeroContent {
  badge: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export interface StatItem {
  value: string
  label: string
}

export interface StepItem {
  step: string
  title: string
  description: string
}

export interface HowItWorksContent {
  overline: string
  title: string
  steps: StepItem[]
}

export type PricingPlanVariant = 'default' | 'popular' | 'enterprise'

export type PricingCtaVariant = 'primary' | 'inverted' | 'outlined'

export interface PricingFeature {
  text: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: PricingFeature[]
  ctaLabel: string
  ctaVariant: PricingCtaVariant
  variant: PricingPlanVariant
  badge?: string
}

export interface PricingSectionContent {
  overline: string
  title: string
  subtitle: string
  plans: PricingPlan[]
}

export type BenefitIconKey = 'zap' | 'shield-check' | 'users' | 'lock'

export interface BenefitItem {
  icon: BenefitIconKey
  iconTone: 'primary' | 'secondary'
  title: string
  description: string
}

export interface BenefitsSectionContent {
  overline: string
  title: string
  items: BenefitItem[]
}

export type ContactFieldType = 'text' | 'email' | 'select'

export interface ContactSelectOption {
  label: string
  value: string
}

export interface ContactField {
  id: string
  label: string
  placeholder: string
  type: ContactFieldType
  options?: ContactSelectOption[]
}

export type ContactHighlightIcon = 'phone' | 'file' | 'shield'

export interface ContactHighlight {
  title: string
  subtitle: string
  icon: ContactHighlightIcon
}

export interface ContactSectionContent {
  overline: string
  title: string
  description: string
  highlights: ContactHighlight[]
  fields: ContactField[]
  submitLabel: string
}

export type SocialIconKey = 'twitter' | 'linkedin'

export interface SocialLink {
  name: string
  href: string
  icon: SocialIconKey
}

export interface FooterContent {
  brandName: string
  copyright: string
  socials: SocialLink[]
}

export interface SeoMeta {
  title: string
  description?: string
}

export interface LandingPageData {
  seo: SeoMeta
  navbar: NavbarContent
  hero: HeroContent
  stats: StatItem[]
  howItWorks: HowItWorksContent
  pricing: PricingSectionContent
  benefits: BenefitsSectionContent
  contact: ContactSectionContent
  footer: FooterContent
}
