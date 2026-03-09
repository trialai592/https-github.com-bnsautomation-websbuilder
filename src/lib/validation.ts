import { z } from "zod";

const cuidSchema = z.string().cuid();

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonValueSchema), z.record(z.string(), jsonValueSchema)]),
);

export const projectStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
export const componentTypeSchema = z.enum(["HERO", "FEATURES", "GALLERY", "TESTIMONIALS", "CTA", "FOOTER", "CUSTOM"]);
export const generationStatusSchema = z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]);
export const deployProviderSchema = z.enum(["VERCEL", "NETLIFY", "CUSTOM"]);
export const deploymentStatusSchema = z.enum(["QUEUED", "RUNNING", "SUCCEEDED", "FAILED"]);

export const userSchema = z.object({
  id: cuidSchema,
  email: z.string().email().max(320),
  name: z.string().min(1).max(100).nullable(),
  passwordHash: z.string().min(1).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const projectSchema = z.object({
  id: cuidSchema,
  ownerId: cuidSchema,
  name: z.string().min(1).max(120),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  description: z.string().max(500).nullable(),
  status: projectStatusSchema,
  publishedUrl: z.string().url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const pageSchema = z.object({
  id: cuidSchema,
  projectId: cuidSchema,
  title: z.string().min(1).max(120),
  path: z
    .string()
    .min(1)
    .max(255)
    .regex(/^\/[a-z0-9/-]*$/, "Path must start with / and use lowercase URL segments"),
  order: z.number().int().min(0),
  isHome: z.boolean(),
  seoTitle: z.string().max(120).nullable(),
  seoDesc: z.string().max(160).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const componentSchema = z.object({
  id: cuidSchema,
  pageId: cuidSchema,
  type: componentTypeSchema,
  order: z.number().int().min(0),
  content: jsonValueSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const aiGenerationSchema = z.object({
  id: cuidSchema,
  userId: cuidSchema,
  projectId: cuidSchema.nullable(),
  prompt: z.string().min(1).max(10000),
  model: z.string().max(120).nullable(),
  status: generationStatusSchema,
  result: jsonValueSchema.nullable(),
  error: z.string().max(10000).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const deploymentSchema = z.object({
  id: cuidSchema,
  projectId: cuidSchema,
  provider: deployProviderSchema,
  status: deploymentStatusSchema,
  targetUrl: z.string().url().nullable(),
  commitSha: z.string().max(64).nullable(),
  logs: z.string().nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserInputSchema = userSchema.pick({ email: true, name: true }).extend({
  password: z.string().min(8).max(128),
});
export const updateUserInputSchema = userSchema.pick({ name: true }).partial();

export const createProjectInputSchema = projectSchema.pick({
  ownerId: true,
  name: true,
  description: true,
}).extend({
  slug: projectSchema.shape.slug.optional(),
});
export const updateProjectInputSchema = projectSchema
  .pick({ name: true, slug: true, description: true, status: true, publishedUrl: true })
  .partial();

export const createPageInputSchema = pageSchema.pick({
  projectId: true,
  title: true,
  path: true,
  order: true,
  isHome: true,
  seoTitle: true,
  seoDesc: true,
});
export const updatePageInputSchema = pageSchema.pick({ title: true, path: true, order: true, isHome: true, seoTitle: true, seoDesc: true }).partial();

export const createComponentInputSchema = componentSchema.pick({
  pageId: true,
  type: true,
  order: true,
  content: true,
});
export const updateComponentInputSchema = componentSchema.pick({ type: true, order: true, content: true }).partial();

export const createAiGenerationInputSchema = aiGenerationSchema.pick({
  userId: true,
  projectId: true,
  prompt: true,
  model: true,
});
export const updateAiGenerationInputSchema = aiGenerationSchema.pick({ status: true, result: true, error: true }).partial();

export const createDeploymentInputSchema = deploymentSchema.pick({
  projectId: true,
  provider: true,
  targetUrl: true,
  commitSha: true,
  logs: true,
});
export const updateDeploymentInputSchema = deploymentSchema
  .pick({ status: true, targetUrl: true, commitSha: true, logs: true, startedAt: true, finishedAt: true })
  .partial();

export type User = z.infer<typeof userSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Page = z.infer<typeof pageSchema>;
export type Component = z.infer<typeof componentSchema>;
export type AiGeneration = z.infer<typeof aiGenerationSchema>;
export type Deployment = z.infer<typeof deploymentSchema>;
