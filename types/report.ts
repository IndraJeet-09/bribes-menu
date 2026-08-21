export type PaymentMode =
  | "cash"
  | "upi"
  | "bank_transfer"
  | "agent"
  | "other"
  | "not_paid"
  | "unknown";

export type OfficialRole =
  | "Traffic Police"
  | "Police"
  | "RTO Official"
  | "Municipal Official"
  | "Tax Official"
  | "Government Office Staff"
  | "Agent/Middleman"
  | "Other"
  | "Not sure";

export type ReportStatus = "pending" | "approved" | "rejected";

export type SourceType =
  | "documented_case"
  | "historical"
  | "news"
  | "public_report"
  | "crowdsourced";

export type EvidenceConfidence = "high" | "medium" | "low";

export type AmountType = "demanded" | "paid" | "accepted" | "reported";

export type EstimationMethodology =
  | "single_observation"
  | "median_of_observations"
  | "editorial_estimate";

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

export interface CreateReportInput {
  serviceId: string;
  amount: number;
  paid: boolean;
  paymentMode: PaymentMode;
  city: string;
  state: IndianState;
  incidentMonth: string; // YYYY-MM
  officialRole?: OfficialRole;
  description?: string;
}

export interface ReportItem {
  id: string;
  serviceId: string;
  amount: number;
  currency: "INR";
  paid: boolean;
  paymentMode: PaymentMode;
  city: string;
  state: string;
  incidentMonth: string;
  officialRole?: string | null;
  description?: string | null;
  status: ReportStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStats {
  medianAmount: number;
  minAmount: number;
  maxAmount: number;
  reportCount: number;
  insufficientData?: boolean;
}

export interface ModerationActionInput {
  reportId: string;
  action: "approve" | "reject";
}

export interface SeedReport {
  id: string;
  sourceRecordId: string;
  serviceId: string;
  serviceSlug: string;
  amount: number;
  demandedAmount?: number;
  amountType: AmountType;
  currency: "INR";
  paid: boolean;
  paymentMode: PaymentMode;
  city: string;
  state: IndianState;
  incidentMonth?: string;
  officialRole?: string;
  description?: string;
  sourceType: SourceType;
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
  evidenceConfidence: EvidenceConfidence;
  notes?: string;
}

export interface ServiceInitialEstimate {
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  amount: number;
  minAmount: number;
  maxAmount: number;
  methodology: EstimationMethodology;
  confidence: EvidenceConfidence;
  observationCount: number;
}
