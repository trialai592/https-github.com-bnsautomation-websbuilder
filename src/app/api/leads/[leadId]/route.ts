import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "closed"])
})

type RouteContext = {
  params: Promise<{
    leadId: string
  }>
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { leadId } = await params
    const body = await req.json()
    const data = updateLeadSchema.parse(body)

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: data.status
      }
    })

    return NextResponse.json({
      success: true,
      lead: updatedLead
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    )
  }
}
