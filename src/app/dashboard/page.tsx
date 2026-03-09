import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const businesses = await prisma.business.findMany({
    where: {
      ownerUserId: userId
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Businesses</h1>
            <p className="mt-2 text-gray-600">
              Manage the businesses tied to your account.
            </p>
          </div>

          <Link
            href="/dashboard/businesses/new"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            New Business
          </Link>
        </div>

        {businesses.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-gray-600">You have not created any businesses yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/dashboard/businesses/${business.id}`}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {business.name}
                </h2>
                <p className="mt-2 text-gray-600">
                  {business.industry} · {business.city}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
