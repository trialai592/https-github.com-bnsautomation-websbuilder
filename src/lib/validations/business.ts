import { z } from "zod";

export const businessStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
export const businessToneSchema = z.enum([
  "professional",
  "friendly",
  "luxury",
  "modern",
]);

export const businessSlugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case");

export const createBusinessSchema = z.object({
  ownerId: z.string().cuid(),
  name: z.string().min(1).max(120),
  slug: businessSlugSchema.optional(),
  description: z.string().max(500).optional().nullable(),
});

export const businessSchema = z.object({
  name: z.string().min(1).max(120),
  industry: z.string().min(1).max(120),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional().nullable(),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional().nullable(),
  tone: businessToneSchema.default("professional"),
  services: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
      }),
    )
    .min(1),
});

export const updateBusinessSchema = z
  .object({
    name: z.string().min(1).max(120),
    slug: businessSlugSchema,
    description: z.string().max(500).nullable(),
    status: businessStatusSchema,
    publishedUrl: z.string().url().nullable(),
  })
  .partial();

export const listBusinessesQuerySchema = z.object({
  ownerId: z.string().cuid().optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
