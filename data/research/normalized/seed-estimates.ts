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
  // Original 22 active services
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
  "property-transfer": "high",
  "gst-registration": "high",
  "electricity-connection": "high",
  "income-certificate": "high",
  "government-certificate": "high",
  // Inactive services (kept for historical reference)
  "building-noc": "high",
  "municipal-inspection": "high",
  "gst-assessment": "high",
  "income-tax-assessment": "high",
  "business-licence": "medium",
  "panchayat-approval": "high",
  // New services (16 added)
  "birth-certificate": "high",
  "death-certificate": "high",
  "domicile-residence-certificate": "medium",
  "caste-certificate": "high",
  "voter-id-electoral-correction": "medium",
  "aadhaar-update": "medium",
  "ration-card": "high",
  "police-clearance-certificate": "high",
  "tenant-address-verification": "medium",
  "missing-lost-document-complaint": "low",
  "water-connection": "high",
  "electricity-meter-bill-complaint": "high",
  "marriage-certificate": "high",
  "property-mutation": "high",
  "rti-application": "high",
  "pension-social-security": "high",
  // New vehicle services (2 added)
  "driving-licence-test": "high",
  "vehicle-ownership-transfer": "high",
};

const reportByService = new Map(
  RESEARCH_SEED_REPORTS.map((report) => [report.serviceSlug, report])
);

/**
 * Services intentionally left without a seed estimate due to insufficient evidence.
 * These services will not have an initial estimate until crowdsourced data accumulates.
 */
const UNSEEDED_SERVICES = new Set([
  "missing-lost-document-complaint", // No ACB/CBI/Vigilance trap cases found for GD entry / lost document complaint
]);

export const INITIAL_ESTIMATES_SEED: InitialEstimateSeed[] = SERVICES_SEED
  .filter((service) => !UNSEEDED_SERVICES.has(service.slug))
  .map((service) => {
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
