import { CATEGORIES_SEED } from "./categories";

export interface ServiceSeed {
  id: string; // Fixed UUID for seed predictability
  categoryId: string;
  name: string;
  slug: string;
  aliases: string[];
  active: boolean;
}

const getCatId = (slug: string) => {
  const found = CATEGORIES_SEED.find((c) => c.slug === slug);
  if (!found) throw new Error(`Category ${slug} not found`);
  return found.id;
};

export const SERVICES_SEED: ServiceSeed[] = [
  {
    id: "20000000-0000-4000-a000-000000000001",
    categoryId: getCatId("traffic"),
    name: "Driving without a helmet",
    slug: "driving-without-a-helmet",
    aliases: ["no helmet", "helmet", "bike helmet", "without helmet"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000002",
    categoryId: getCatId("traffic"),
    name: "Driving without a seatbelt",
    slug: "driving-without-a-seatbelt",
    aliases: ["no seatbelt", "seat belt", "without seatbelt"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000003",
    categoryId: getCatId("traffic"),
    name: "Triple riding on a motorcycle",
    slug: "triple-riding-on-a-motorcycle",
    aliases: ["triple riding", "three people bike", "tripling"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000004",
    categoryId: getCatId("traffic"),
    name: "Jumping a red light",
    slug: "jumping-a-red-light",
    aliases: ["red light", "signal jump", "traffic signal"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000005",
    categoryId: getCatId("traffic"),
    name: "Driving on the wrong side",
    slug: "driving-on-the-wrong-side",
    aliases: ["wrong side", "wrong way", "opposite direction"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000006",
    categoryId: getCatId("vehicle"),
    name: "Driving without a valid licence",
    slug: "driving-without-a-valid-licence",
    aliases: ["no licence", "without licence", "dl", "license"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000007",
    categoryId: getCatId("vehicle"),
    name: "Driving without vehicle insurance",
    slug: "driving-without-vehicle-insurance",
    aliases: ["no insurance", "insurance", "vehicle insurance"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000008",
    categoryId: getCatId("vehicle"),
    name: "Driving without a valid PUC",
    slug: "driving-without-a-valid-puc",
    aliases: ["puc", "pollution certificate", "no puc"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000009",
    categoryId: getCatId("traffic"),
    name: "Overspeeding",
    slug: "overspeeding",
    aliases: ["speed", "overspeed", "speeding"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000010",
    categoryId: getCatId("traffic"),
    name: "Using a mobile phone while driving",
    slug: "using-a-mobile-phone-while-driving",
    aliases: ["phone while driving", "using phone", "mobile driving"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000011",
    categoryId: getCatId("traffic"),
    name: "Illegal parking",
    slug: "illegal-parking",
    aliases: ["wrong parking", "no parking", "towing"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000012",
    categoryId: getCatId("vehicle"),
    name: "Unauthorised vehicle modification",
    slug: "unauthorised-vehicle-modification",
    aliases: ["modified bike", "exhaust", "loud exhaust"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000013",
    categoryId: getCatId("documents"),
    name: "Driving licence processing",
    slug: "driving-licence-processing",
    aliases: ["licence office", "rto", "rto agent"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000014",
    categoryId: getCatId("documents"),
    name: "Vehicle registration issue",
    slug: "vehicle-registration-issue",
    aliases: ["rc", "vehicle registration", "rto"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000015",
    categoryId: getCatId("police"),
    name: "Police verification",
    slug: "police-verification",
    aliases: ["passport verification", "address verification"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000016",
    categoryId: getCatId("government"),
    name: "Government certificate/document processing",
    slug: "government-certificate-document-processing",
    aliases: ["certificate", "government document"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000017",
    categoryId: getCatId("documents"),
    name: "Property/document registration",
    slug: "property-document-registration",
    aliases: ["property", "registry", "land registration"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000018",
    categoryId: getCatId("tax"),
    name: "Late tax filing",
    slug: "late-tax-filing",
    aliases: ["income tax", "itr", "late itr"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000019",
    categoryId: getCatId("tax"),
    name: "Tax notice / tax issue",
    slug: "tax-notice-tax-issue",
    aliases: ["income tax notice", "tax notice", "itr notice"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000020",
    categoryId: getCatId("tax"),
    name: "GST compliance issue",
    slug: "gst-compliance-issue",
    aliases: ["gst", "gst issue", "gst notice"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000021",
    categoryId: getCatId("business"),
    name: "Business/trade licence issue",
    slug: "business-trade-licence-issue",
    aliases: ["business licence", "trade licence", "shop licence"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000022",
    categoryId: getCatId("municipal"),
    name: "Municipal/business inspection",
    slug: "municipal-business-inspection",
    aliases: ["municipal", "inspection", "shop inspection"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000023",
    categoryId: getCatId("police"),
    name: "Noise-related violation",
    slug: "noise-related-violation",
    aliases: ["noise", "loud music", "noise complaint"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000024",
    categoryId: getCatId("municipal"),
    name: "Unauthorised construction issue",
    slug: "unauthorised-construction-issue",
    aliases: ["construction", "building", "illegal construction"],
    active: true,
  },
  {
    id: "20000000-0000-4000-a000-000000000025",
    categoryId: getCatId("municipal"),
    name: "Public-space encroachment issue",
    slug: "public-space-encroachment-issue",
    aliases: ["encroachment", "public space", "footpath"],
    active: true,
  },
];
