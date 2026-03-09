import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { leadSchema } from "@/lib/validations/lead"
import { generateLeadAutoresponder } from "@/lib/ai/generate-email"
import { sendEmail } from "@/lib/email/resend"
import { formatEmailHtml } from "@/lib/email/format-email-html"

function personalizeTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return values[key] ?? ""
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = leadSchema.parse(body)

    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
      include: {
        emailTemplates: true
      }
    })

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        businessId: data.businessId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        message: data.message || null,
        serviceInterest: data.serviceInterest || null,
        sourcePage: data.sourcePage || "/",
        status: "new"
      }
    })

    const savedTemplate = business.emailTemplates.find(
      (template) => template.templateType === "lead_autoresponder"
    )

    if (data.email) {
      let subject = ""
      let bodyText = ""

      if (savedTemplate) {
        subject = personalizeTemplate(savedTemplate.subject, {
          businessName: business.name,
          leadName: lead.name,
          city: business.city,
          serviceInterest: lead.serviceInterest ?? ""
        })

        bodyText = personalizeTemplate(savedTemplate.body, {
          businessName: business.name,
          leadName: lead.name,
          city: business.city,
          serviceInterest: lead.serviceInterest ?? "",
          message: lead.message ?? ""
        })
      } else {
        const generated = await generateLeadAutoresponder({
          businessName: business.name,
          industry: business.industry,
          city: business.city,
          tone: business.tone,
          leadName: data.name,
          serviceInterest: data.serviceInterest,
          message: data.message
        })

        subject = generated.subject
        bodyText = generated.body
      }

      await sendEmail({
        to: data.email,
        subject,
        html: formatEmailHtml(bodyText)
      })
    }

    await sendEmail({
      to: business.email,
      subject: `New lead for ${business.name}: ${lead.name}`,
      html: formatEmailHtml(`
You received a new website lead.

Name: ${lead.name}
Email: ${lead.email ?? "Not provided"}
Phone: ${lead.phone ?? "Not provided"}
Service Interest: ${lead.serviceInterest ?? "Not provided"}

Message:
${lead.message ?? "No message provided"}
      `)
    })

    return NextResponse.json({
      success: true,
      lead
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to capture lead" },
      { status: 500 }
    )
  }
}
