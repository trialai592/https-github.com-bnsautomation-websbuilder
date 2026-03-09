import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import SiteEditorForm from "@/components/dashboard/site-editor-form"
import { SiteConfig } from "@/types/site-config"

type SiteEditorPageProps = {
  params: Promise<{
    businessId: string
  }>
}

export default async function SiteEditorPage({ params }: SiteEditorPageProps) {
  const { businessId } = await params

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Website Content
          </h1>
          <p className="mt-2 text-gray-600">
            Update the generated content for {business.name}.
          </p>
        </div>

        <SiteEditorForm
          siteId={site.id}
          initialSiteConfig={siteConfig}
        />
      </div>
    </main>
  )
}
