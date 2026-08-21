import { z } from "zod";

export const moderationSchema = z
  .object({
    reportId: z
      .string({ required_error: "reportId is required." })
      .uuid({ message: "reportId must be a valid UUID." }),
    action: z.enum(["approve", "reject"], {
      errorMap: () => ({ message: "Action must be either 'approve' or 'reject'." }),
    }),
  })
  .strict();

export type ModerationInput = z.infer<typeof moderationSchema>;
