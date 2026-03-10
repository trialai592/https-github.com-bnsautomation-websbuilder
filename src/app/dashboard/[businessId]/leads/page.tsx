import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import LeadsTable from "@/components/dashboard/leads-table"

type LeadsPageProps = {
  params: Promise<{
    businessId: string
  }>
}

type LeadRecord = {
  id: string
  name: string
  email: string | null
  phone: string | null
  serviceInterest: string | null
  message: string | null
  status: string
  createdAt: Date
}

export default async function LeadsPage({ params }: LeadsPageProps) {
  const { businessId } = await params

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: {
      leads: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  if (!business) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{business.name} Leads</h1>
          <p className="mt-2 text-gray-600">
            Review and manage incoming website leads.
          </p>
        </div>

        <LeadsTable
          leads={business.leads.map((lead: LeadRecord) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            serviceInterest: lead.serviceInterest,
            message: lead.message,
            status: lead.status as "new" | "contacted" | "qualified" | "closed",
            createdAt: lead.createdAt
          }))}
        />
      </div>
    </main>
  )
}
