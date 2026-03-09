import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db/prisma"
import { z } from "zod"

const updateEmailTemplateSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1)
})

type RouteContext = {
  params: Promise<{
    templateId: string
  }>
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth()
    const { templateId } = await params

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateEmailTemplateSchema.parse(body)

    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id: templateId,
        business: {
          ownerUserId: userId
        }
      }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Email template not found" },
        { status: 404 }
      )
    }

    const updatedTemplate = await prisma.emailTemplate.update({
      where: { id: templateId },
      data: {
        subject: data.subject,
        body: data.body
      }
    })

    return NextResponse.json({
      success: true,
      template: updatedTemplate
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update email template" },
      { status: 500 }
    )
  }
}
