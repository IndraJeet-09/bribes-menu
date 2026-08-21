import { z } from "zod";

export const moderationSchema = z
  .object({
    reportId: z.string().uuid("reportId must be a valid UUID."),
    action: z.enum(["approve", "reject"], {
      message: "Action must be either 'approve' or 'reject'.",
    }),
  })
  .strict();

export type ModerationInput = z.infer<typeof moderationSchema>;
