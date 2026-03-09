import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import { renderSection } from "@/lib/render/section-registry"
import { SiteConfig } from "@/types/site-config"

type SitePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
      sites: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  })

  if (!business || business.sites.length === 0) {
    notFound()
  }

  const site = business.sites[0]
  const siteConfig = site.siteConfigJson as unknown as SiteConfig

  const hydratedSections = siteConfig.pages.home.sections.map((section) => {
    if (section.type === "contactCta") {
      return {
        ...section,
        data: {
          ...section.data,
          businessId: business.id,
          sourcePage: `/site/${business.slug}`,
          serviceOptions: business.services.map((service) => service.name)
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
