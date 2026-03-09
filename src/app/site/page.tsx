import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import { renderSection } from "@/lib/render/section-registry"
import { SiteConfig } from "@/types/site-config"

export default async function TenantSitePage() {
  const headersList = await headers()
  const forwardedHost = headersList.get("x-forwarded-host")
  const hostHeader = forwardedHost ?? headersList.get("host") ?? ""
  const hostname = hostHeader.split(":")[0].toLowerCase()

  const appHost = (process.env.NEXT_PUBLIC_APP_URL ?? "")
    .replace(/^https?:\/\//, "")
    .split(":")[0]
    .toLowerCase()

  async function findBusiness(where: Prisma.BusinessWhereInput) {
    return prisma.business.findFirst({
      where,
      include: {
        services: true,
        sites: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    })
  }

  let business = null as Awaited<ReturnType<typeof findBusiness>>

  if (hostname && hostname !== appHost && hostname !== "localhost" && hostname !== "127.0.0.1") {
    business = await findBusiness({ customDomain: hostname })

    if (!business) {
      const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? process.env.ROOT_DOMAIN ?? "")
        .replace(/^https?:\/\//, "")
        .toLowerCase()

      let subdomain = ""
      if (rootDomain && hostname.endsWith(`.${rootDomain}`)) {
        subdomain = hostname.slice(0, -(`.${rootDomain}`.length))
      } else if (hostname.endsWith(".localhost")) {
        subdomain = hostname.replace(".localhost", "")
      }

      if (subdomain) {
        business = await findBusiness({
          OR: [{ subdomain }, { slug: subdomain }]
        })
      }
    }
  }

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
