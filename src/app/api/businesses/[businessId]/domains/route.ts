import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const schema = z.object({
  domain: z.string().min(3)
})

type RouteContext = {
  params: Promise<{
    businessId: string
  }>
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth()
    const { businessId } = await params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { domain } = schema.parse(body)

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerUserId: userId
      }
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const normalizedDomain = domain.trim().toLowerCase()

    const existing = await prisma.business.findFirst({
      where: {
        customDomain: normalizedDomain,
        NOT: { id: business.id }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "That domain is already in use" },
        { status: 400 }
      )
    }

    const updated = await prisma.business.update({
      where: { id: business.id },
      data: {
        customDomain: normalizedDomain,
        domainStatus: "pending_dns"
      }
    })

    return NextResponse.json({
      success: true,
      business: updated
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to connect domain" },
      { status: 500 }
    )
  }
}
