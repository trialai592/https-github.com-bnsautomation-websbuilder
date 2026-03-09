import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateSitePlan } from "@/lib/ai/generate-site-plan";
import { generateCopy } from "@/lib/ai/generate-copy";
import { buildSiteConfig } from "@/lib/ai/build-site-config";

type BusinessRecord = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  city: string;
  state?: string | null;
  tone: string;
  description?: string | null;
  services: { name: string; description?: string | null }[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const businessId = body.businessId as string | undefined;

    if (!businessId) {
      return NextResponse.json({ error: "businessId is required" }, { status: 400 });
    }

    const db = prisma as unknown as {
      business?: {
        findUnique: (args: unknown) => Promise<BusinessRecord | null>;
      };
      site?: {
        create: (args: unknown) => Promise<unknown>;
      };
      emailTemplate?: {
        create: (args: unknown) => Promise<unknown>;
      };
    };

    if (!db.business || !db.site || !db.emailTemplate) {
      return NextResponse.json(
        { error: "Business/Site/EmailTemplate Prisma models are not available in the current schema" },
        { status: 501 },
      );
    }

    const business = await db.business.findUnique({
      where: { id: businessId },
      include: {
        services: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const plannerResult = await generateSitePlan({
      name: business.name,
      industry: business.industry,
      city: business.city,
      state: business.state,
      tone: business.tone,
      description: business.description,
      services: business.services,
    });

    const copyResult = await generateCopy({
      name: business.name,
      industry: business.industry,
      city: business.city,
      state: business.state,
      tone: business.tone,
      services: business.services,
      plannerResult,
    });

    const siteConfig = buildSiteConfig({
      businessName: business.name,
      slug: business.slug,
      plannerResult,
      copyResult,
    });

    const site = await db.site.create({
      data: {
        businessId: business.id,
        status: "draft",
        siteConfigJson: siteConfig,
      },
    });

    await db.emailTemplate.create({
      data: {
        businessId: business.id,
        templateType: "lead_autoresponder",
        subject: `Thanks for contacting {{businessName}}`,
        body: `Hi {{leadName}},

Thanks for reaching out to {{businessName}}. We received your inquiry${
      business.industry ? ` about {{serviceInterest}}` : ""
    } and our team will follow up with you shortly.

If you'd like, you can reply to this email with any extra details that may help us prepare.

Best,
{{businessName}}`,
      },
    });

    return NextResponse.json({
      success: true,
      site,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate site" },
      { status: 500 },
    );
  }
}
