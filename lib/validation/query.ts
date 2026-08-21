import { z } from "zod";

export const reportQuerySchema = z.object({
  service: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().uuid().optional(),
});

export type ReportQueryParams = z.infer<typeof reportQuerySchema>;
