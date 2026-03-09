import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

type BusinessDashboardPageProps = {
  params: Promise<{
    businessId: string
  }>
}

export default async function BusinessDashboardPage({
  params
}: BusinessDashboardPageProps) {
  const { userId } = await auth()
  const { businessId } = await params

  if (!userId) {
    notFound()
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerUserId: userId
    },
    include: {
      leads: true,
      emailTemplates: true,
      sites: {
        orderBy: {
          createdAt: "desc"
        },
        take: 1
      }
    }
  })

  if (!business) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
          <p className="mt-2 text-gray-600">Manage leads, emails, and website activity.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">Total Leads</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {business.leads.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">Email Templates</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {business.emailTemplates.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-gray-500">Site Status</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {business.sites[0]?.status ?? "draft"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Link
            href={`/dashboard/businesses/${business.id}/leads`}
            className="rounded-xl border bg-white p-5 font-medium text-gray-900 shadow-sm"
          >
            View Leads
          </Link>

          <Link
            href={`/dashboard/businesses/${business.id}/emails`}
            className="rounded-xl border bg-white p-5 font-medium text-gray-900 shadow-sm"
          >
            Edit Email Templates
          </Link>

          <Link
            href={`/dashboard/businesses/${business.id}/site`}
            className="rounded-xl border bg-white p-5 font-medium text-gray-900 shadow-sm"
          >
            Edit Website
          </Link>

          <Link
            href={`/site/${business.slug}`}
            className="rounded-xl border bg-white p-5 font-medium text-gray-900 shadow-sm"
          >
            View Live Site
          </Link>
        </div>
      </div>
    </main>
  )
}
