import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"
import { z } from "zod"

const updateSiteSchema = z.object({
  siteConfig: z.object({
    businessName: z.string(),
    slug: z.string(),
    themeKey: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string()
    }),
    pages: z.object({
      home: z.object({
        sections: z.array(
          z.object({
            id: z.string(),
            type: z.enum([
              "hero",
              "services",
              "benefits",
              "testimonials",
              "faq",
              "contactCta",
              "footer"
            ]),
            data: z.record(z.string(), z.unknown())
          })
        )
      })
    })
  })
})

type RouteContext = {
  params: Promise<{
    siteId: string
  }>
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { siteId } = await params
    const body = await req.json()
    const parsed = updateSiteSchema.parse(body)

    const existingSite = await prisma.site.findUnique({
      where: { id: siteId }
    })

    if (!existingSite) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        siteConfigJson: parsed.siteConfig as unknown as Prisma.InputJsonValue
      }
    })

    return NextResponse.json({
      success: true,
      site: updatedSite
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update site config" },
      { status: 500 }
    )
  }
}
