import type { ComponentType } from "react"
import HeroSection from "@/components/site/sections/hero"
import ServicesSection from "@/components/site/sections/services"
import BenefitsSection from "@/components/site/sections/benefits"
import TestimonialsSection from "@/components/site/sections/testimonials"
import FAQSection from "@/components/site/sections/faq"
import ContactCTASection from "@/components/site/sections/contact-cta"
import FooterSection from "@/components/site/sections/footer"
import { SiteSection } from "@/types/site-config"

type SectionComponentProps = {
  data: Record<string, unknown>
}

const sectionRegistry: Record<
  SiteSection["type"],
  ComponentType<SectionComponentProps>
> = {
  hero: HeroSection as unknown as ComponentType<SectionComponentProps>,
  services: ServicesSection as unknown as ComponentType<SectionComponentProps>,
  benefits: BenefitsSection as unknown as ComponentType<SectionComponentProps>,
  testimonials: TestimonialsSection as unknown as ComponentType<SectionComponentProps>,
  faq: FAQSection as unknown as ComponentType<SectionComponentProps>,
  contactCta: ContactCTASection as unknown as ComponentType<SectionComponentProps>,
  footer: FooterSection as unknown as ComponentType<SectionComponentProps>
}

export function renderSection(section: SiteSection) {
  const Component = sectionRegistry[section.type]

  if (!Component) {
    return null
  }

  return <Component key={section.id} data={section.data} />
}
