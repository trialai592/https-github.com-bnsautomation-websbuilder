import { z } from "zod"

export const leadSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().optional(),
  serviceInterest: z.string().optional(),
  sourcePage: z.string().optional()
})

export type LeadInput = z.infer<typeof leadSchema>
