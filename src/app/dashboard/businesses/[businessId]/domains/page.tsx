import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import DomainSettingsForm from "@/components/dashboard/domain-settings-form"

type Props = {
  params: Promise<{ businessId: string }>
}

export default async function DomainsPage({ params }: Props) {
  const { userId } = await auth()
  const { businessId } = await params

  if (!userId) notFound()

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerUserId: userId
    }
  })

  if (!business) notFound()

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Domains</h1>
        <p className="mt-2 text-gray-600">
          Connect a custom domain for {business.name}.
        </p>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <DomainSettingsForm
            businessId={business.id}
            subdomain={business.subdomain ?? ""}
            customDomain={business.customDomain ?? ""}
            appDomain={process.env.NEXT_PUBLIC_APP_DOMAIN ?? "yourapp.com"}
          />
        </div>
      </div>
    </main>
  )
}
