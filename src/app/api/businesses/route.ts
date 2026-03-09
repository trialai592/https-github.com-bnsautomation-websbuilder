import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/slugify";
import {
  businessSchema,
  listBusinessesQuerySchema,
} from "@/lib/validations/business";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const query = listBusinessesQuerySchema.parse({
      ownerId: request.nextUrl.searchParams.get("ownerId") ?? undefined,
    });

    const db = prisma as unknown as {
      business?: {
        findMany: (args: unknown) => Promise<unknown[]>;
      };
    };

    if (!db.business) {
      return NextResponse.json(
        { error: "Business Prisma model is not available in the current schema" },
        { status: 501 },
      );
    }

    const businesses = await db.business.findMany({
      where: query.ownerId ? { ownerUserId: query.ownerId } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ownerUserId: true,
        name: true,
        industry: true,
        city: true,
        state: true,
        phone: true,
        email: true,
        tone: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: businesses });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const data = businessSchema.parse(body);

    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const business = await prisma.business.create({
      data: {
        ownerUserId: userId,
        name: data.name,
        industry: data.industry,
        city: data.city,
        state: data.state,
        email: data.email,
        phone: data.phone,
        tone: data.tone,
        slug,
        services: {
          create: data.services.map((service) => ({
            name: service.name,
          })),
        },
      },
    });

    return NextResponse.json(business);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.issues },
        { status: 400 },
      );
    }

    if (isPrismaUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "A business with this slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message === "SLUG_TAKEN" || error.message.includes("Unique constraint");
}
