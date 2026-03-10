import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { renderSection } from "@/lib/render/section-registry"
import { SiteConfig } from "@/types/site-config"

type Props = {
  params: Promise<{
    subdomain: string
    slug?: string[]
  }>
}

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params

  const business = await prisma.business.findFirst({
    where: { subdomain },
    include: {
      services: true,
      sites: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  })

  if (!business || business.sites.length === 0) {
    notFound()
  }

  const siteConfig = business.sites[0].siteConfigJson as unknown as SiteConfig

  const hydratedSections = siteConfig.pages.home.sections.map((section) => {
    if (section.type === "contactCta") {
      return {
        ...section,
        data: {
          ...section.data,
          businessId: business.id,
          sourcePage: "/",
          serviceOptions: business.services.map((s: { name: string }) => s.name)
        }
      }
    }

    if (section.type === "footer") {
      return {
        ...section,
        data: {
          ...section.data,
          businessName: business.name,
          city: business.city,
          email: business.email
        }
      }
    }

    return section
  })

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {hydratedSections.map((section) => renderSection(section))}
    </main>
  )
}
