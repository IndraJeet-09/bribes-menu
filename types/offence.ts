export type Category =
  | "traffic"
  | "vehicle"
  | "documents"
  | "government"
  | "tax"
  | "business"
  | "police"
  | "municipal";

export interface ReportedAmount {
  min: number;
  max: number;
  typical: number;
  currency: "INR";
}

export interface Offence {
  id: string;
  slug: string;
  title: string;
  category: Category;
  description: string;
  humorousQuote: string;
  aliases: string[];
  keywords: string[];
  reportedAmount: ReportedAmount;
  reports: number;
  confidence: "low" | "medium" | "high";
  location?: string[];
  lastUpdated: string;
  tipsOrContext?: string;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  iconName: string;
  description: string;
}
