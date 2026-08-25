import { SERVICES_SEED } from "@/data/services";
import { OFFENCES } from "@/data/offences";

/**
 * Maps OFFENCE slugs (from data/offences.ts) to SERVICE slugs (from data/services.ts).
 *
 * This bridge allows the frontend to use its existing OFFENCES editorial content
 * while fetching dynamic report statistics from the database via the API.
 *
 * OFFENCES without a direct SERVICE match are mapped to the closest available SERVICE.
 */
export const OFFENCE_TO_SERVICE_SLUG: Record<string, string> = {
  "driving-without-a-helmet": "helmet-violation",
  "driving-without-a-seatbelt": "traffic-challan",
  "triple-riding-on-a-motorcycle": "traffic-challan",
  "jumping-a-red-light": "traffic-challan",
  "driving-on-the-wrong-side": "traffic-challan",
  "driving-without-a-valid-licence": "driving-licence-processing",
  "driving-without-vehicle-insurance": "vehicle-document-issue",
  "driving-without-a-valid-puc": "vehicle-document-issue",
  "overspeeding": "traffic-challan",
  "using-a-mobile-phone-while-driving": "traffic-challan",
  "illegal-parking": "parking-towing",
  "unauthorised-vehicle-modification": "vehicle-document-issue",
  "driving-licence-processing": "driving-licence-processing",
  "vehicle-registration-issue": "vehicle-registration",
  "police-verification": "police-verification",
  "government-certificate-document-processing": "government-certificate",
  "property-document-registration": "property-registration",
  "late-tax-filing": "income-tax-assessment",
  "tax-notice-tax-issue": "income-tax-assessment",
  "gst-compliance-issue": "gst-registration",
  "business-trade-licence-issue": "business-licence",
  "municipal-business-inspection": "municipal-inspection",
  "noise-related-violation": "fir-complaint",
  "unauthorised-construction-issue": "building-permission",
  "public-space-encroachment-issue": "municipal-inspection",
  // New services (18 + missing-lost-document-complaint)
  "birth-certificate": "birth-certificate",
  "death-certificate": "death-certificate",
  "domicile-residence-certificate": "domicile-residence-certificate",
  "caste-certificate": "caste-certificate",
  "voter-id-electoral-correction": "voter-id-electoral-correction",
  "aadhaar-update": "aadhaar-update",
  "ration-card": "ration-card",
  "police-clearance-certificate": "police-clearance-certificate",
  "tenant-address-verification": "tenant-address-verification",
  "missing-lost-document-complaint": "missing-lost-document-complaint",
  "water-connection": "water-connection",
  "electricity-meter-bill-complaint": "electricity-meter-bill-complaint",
  "marriage-certificate": "marriage-certificate",
  "property-mutation": "property-mutation",
  "rti-application": "rti-application",
  "pension-social-security": "pension-social-security",
  "driving-licence-test": "driving-licence-test",
  "vehicle-ownership-transfer": "vehicle-ownership-transfer",
};

/**
 * Maps SERVICE slugs back to OFFENCE slugs (reverse mapping).
 */
export const SERVICE_SLUG_TO_OFFENCE: Record<string, string> = {};
for (const [offenceSlug, serviceSlug] of Object.entries(OFFENCE_TO_SERVICE_SLUG)) {
  if (!SERVICE_SLUG_TO_OFFENCE[serviceSlug]) {
    SERVICE_SLUG_TO_OFFENCE[serviceSlug] = offenceSlug;
  }
}

/**
 * Get the SERVICE slug for a given OFFENCE slug.
 */
export function getServiceSlugForOffence(offenceSlug: string): string | null {
  return OFFENCE_TO_SERVICE_SLUG[offenceSlug] ?? null;
}

/**
 * Get the OFFENCE slug for a given SERVICE slug.
 */
export function getOffenceSlugForService(serviceSlug: string): string | null {
  return SERVICE_SLUG_TO_OFFENCE[serviceSlug] ?? null;
}

/**
 * Get all unique SERVICE slugs needed for fetching DB stats.
 */
export function getAllServiceSlugs(): string[] {
  return [...new Set(Object.values(OFFENCE_TO_SERVICE_SLUG))];
}

/**
 * Get the SERVICE UUID for a given SERVICE slug.
 */
export function getServiceIdBySlug(slug: string): string | null {
  const service = SERVICES_SEED.find((s) => s.slug === slug);
  return service?.id ?? null;
}

/**
 * Get all OFFENCE slugs that map to a given SERVICE slug.
 */
export function getOffenceSlugsForService(serviceSlug: string): string[] {
  return Object.entries(OFFENCE_TO_SERVICE_SLUG)
    .filter(([, sSlug]) => sSlug === serviceSlug)
    .map(([oSlug]) => oSlug);
}
