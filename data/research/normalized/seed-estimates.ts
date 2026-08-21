import { SERVICES_SEED } from "../../services";
import { RESEARCH_SEED_REPORTS } from "./seed-reports";

export type InitialEstimateSeed = {
  serviceSlug: string;
  amount: number;
  minAmount: number;
  maxAmount: number;
  methodology: "single_observation" | "median_of_observations" | "editorial_estimate";
  confidence: "high" | "medium" | "low";
  observationCount: number;
};

/**
 * Initial launch estimates.
 *
 * These are intentionally separate from reports. A report is an observation;
 * an estimate is the value shown by the UI.
 *
 * For the first launch we use the strongest available comparable observation
 * for each service. As approved crowdsourced reports accumulate, these values
 * should be recalculated from the approved observation set.
 */
const confidenceByService: Record<string, "high" | "medium" | "low"> = {
  "helmet-violation": "high",
  "traffic-challan": "high",
  "vehicle-document-issue": "high",
  "parking-towing": "low",
  "commercial-vehicle-violation": "low",
  "accident-vehicle-release": "high",
  "driving-licence-processing": "high",
  "driving-licence-renewal": "high",
  "vehicle-registration": "medium",
  "vehicle-fitness-processing": "high",
  "passport-verification": "high",
  "police-verification": "low",
  "fir-complaint": "high",
  "police-investigation": "high",
  "property-registration": "high",
  "property-records": "medium",
  "building-permission": "high",
  "building-noc": "high",
  "property-transfer": "low",
  "municipal-inspection": "high",
  "gst-registration": "high",
  "gst-assessment": "high",
  "income-tax-assessment": "high",
  "business-licence": "medium",
  "electricity-connection": "high",
  "income-certificate": "high",
  "government-certificate": "high",
  "panchayat-approval": "high",
};

const reportByService = new Map(
  RESEARCH_SEED_REPORTS.map((report) => [report.serviceSlug, report])
);

export const INITIAL_ESTIMATES_SEED: InitialEstimateSeed[] = SERVICES_SEED.map((service) => {
  const report = reportByService.get(service.slug);

  if (!report) {
    throw new Error(`No initial estimate source for ${service.slug}`);
  }

  return {
    serviceSlug: service.slug,
    amount: report.amount,
    minAmount: report.amount,
    maxAmount: report.amount,
    methodology: "single_observation",
    confidence: confidenceByService[service.slug] ?? "low",
    observationCount: 1,
  };
});
