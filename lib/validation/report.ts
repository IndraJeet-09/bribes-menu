import { z } from "zod";
import { INDIAN_STATES } from "@/types/report";
import { sanitizeString } from "@/lib/security/sanitize";

const OFFICIAL_ROLES = [
  "Traffic Police",
  "Police",
  "RTO Official",
  "Municipal Official",
  "Tax Official",
  "Government Office Staff",
  "Agent/Middleman",
  "Other",
  "Not sure",
] as const;

const PAYMENT_MODES = [
  "cash",
  "upi",
  "bank_transfer",
  "agent",
  "other",
  "not_paid",
] as const;

export const reportSubmissionSchema = z
  .object({
    serviceId: z.string().uuid("serviceId must be a valid UUID."),

    amount: z
      .number({ message: "amount is required and must be a number." })
      .finite("amount must be a finite number.")
      .positive("amount must be greater than 0.")
      .max(1_000_000, "amount cannot exceed ₹10,00,000."),

    paid: z.boolean({ message: "paid status is required." }),

    paymentMode: z.enum(PAYMENT_MODES, {
      errorMap: () => ({ message: "Invalid payment mode." }),
    }),

    city: z
      .string()
      .min(2, "city name must be at least 2 characters.")
      .max(100, "city name cannot exceed 100 characters.")
      .transform((val) => sanitizeString(val)),

    state: z.enum(INDIAN_STATES, {
      errorMap: () => ({ message: "Invalid Indian state or union territory." }),
    }),

    incidentMonth: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "incidentMonth must be in YYYY-MM format (e.g. 2026-08).")
      .refine(
        (val) => {
          const [yearStr, monthStr] = val.split("-");
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);

          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;

          // Reject dates older than 10 years
          if (year < currentYear - 10) return false;

          // Reject dates more than 1 month into the future
          const maxFutureMonths = currentYear * 12 + currentMonth + 1;
          const targetMonths = year * 12 + month;

          return targetMonths <= maxFutureMonths;
        },
        { message: "incidentMonth cannot be older than 10 years or in the distant future." }
      ),

    officialRole: z.enum(OFFICIAL_ROLES).optional().nullable(),

    description: z
      .string()
      .min(10, "description must be at least 10 characters if provided.")
      .max(500, "description cannot exceed 500 characters.")
      .optional()
      .nullable(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.paid && data.paymentMode !== "not_paid") {
        return false;
      }
      if (data.paid && data.paymentMode === "not_paid") {
        return false;
      }
      return true;
    },
    {
      message: "If paid is false, paymentMode must be 'not_paid'. If paid is true, paymentMode cannot be 'not_paid'.",
      path: ["paymentMode"],
    }
  );

export type ReportSubmissionValidatedInput = z.infer<typeof reportSubmissionSchema>;
