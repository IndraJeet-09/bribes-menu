import { SERVICES_SEED } from "../../services";

/**
 * Research-backed seed observations.
 *
 * IMPORTANT:
 * - These are reported incidents, NOT official fines or government rates.
 * - Each observation is kept separate from the estimate derived from it.
 * - `sourceRecordId` must remain stable and unique.
 * - Amounts are INR.
 *
 * The service IDs below intentionally reference SERVICES_SEED so a service
 * cannot silently drift if the UUIDs are changed in services.ts.
 */

export type SeedReport = {
  serviceSlug: string;
  amount: number;
  currency: "INR";
  paid: boolean;
  paymentMode:
  | "cash"
  | "upi"
  | "bank_transfer"
  | "agent"
  | "other"
  | "not_paid";
  city: string;
  state: string;
  incidentMonth: string;
  officialRole?: string;
  description?: string;
  status: "approved";
  source: string;
  sourceType:
  | "documented_case"
  | "historical"
  | "news"
  | "public_report"
  | "crowdsourced";
  sourceName: string;
  sourceUrl: string;
  sourceDate: string;
  evidenceConfidence: "high" | "medium" | "low";
  amountType: "demanded" | "paid" | "accepted" | "reported";
  demandedAmount?: number;
  sourceRecordId: string;
};

const servicesBySlug = new Set(SERVICES_SEED.map((s) => s.slug));

export const RESEARCH_SEED_REPORTS: SeedReport[] = [
  // 01. Helmet violation
  {
    serviceSlug: "helmet-violation",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Gurugram",
    state: "Haryana",
    incidentMonth: "2025-09",
    officialRole: "Traffic Police",
    description:
      "Traffic personnel were reported accepting ₹500 cash from Japanese tourists stopped over a helmet violation; the officers were subsequently suspended and a home guard dismissed. This is a documented high-value roadside incident but may not represent the typical range.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/gurgaon/cops-suspended-home-guard-sacked-for-seeking-bribe-from-japanese-tourists-in-gurgaon/articleshow/123643212.cms",
    sourceDate: "2025-09-02",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-helmet-gurugram-2025-09-02",
  },

  // 02. Traffic challan avoidance
  {
    serviceSlug: "traffic-challan",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Chandigarh",
    state: "Chandigarh",
    incidentMonth: "2025-07",
    officialRole: "Traffic Police",
    description:
      "A traffic constable was filmed accepting ₹500 from a motorist instead of issuing a challan; the constable was suspended and an inquiry ordered.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/chandigarh/traffic-constable-suspended-after-viral-video-shows-him-taking-bribe/articleshow/123004856.cms",
    sourceDate: "2025-07-31",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-traffic-challan-chandigarh-2025-07-31",
  },

  // 03. Vehicle document issue
  {
    serviceSlug: "vehicle-document-issue",
    amount: 800,
    currency: "INR",
    paid: true,
    paymentMode: "upi",
    city: "Ahmedabad",
    state: "Gujarat",
    incidentMonth: "2025-10",
    officialRole: "RTO Clerk",
    description:
      "An RTO junior clerk was reported accepting ₹800 through a QR code for verification/approval connected with a duplicate RC book after the official fee had already been paid.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/ahmedabad/rto-clerk-caught-taking-bribe-of-800-using-qr-code/articleshow/124535778.cms",
    sourceDate: "2025-10-14",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-rto-duplicate-rc-ahmedabad-2025-10-14",
  },

  // 04. Illegal parking / towing
  {
    serviceSlug: "parking-towing",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Thane",
    state: "Maharashtra",
    incidentMonth: "2025-01",
    officialRole: "Towing/Traffic Personnel",
    description:
      "A 2025 public report described a no-parking towing situation where ₹500 was paid instead of the reported legal towing fine of ₹700. Weak evidence — single public report.",
    status: "approved",
    source: "Reddit public report",
    sourceType: "public_report",
    sourceName: "Reddit r/thane",
    sourceUrl: "https://www.reddit.com/r/thane/comments/1hy1a7y/",
    sourceDate: "2025-01-10",
    evidenceConfidence: "low",
    amountType: "reported",
    sourceRecordId: "reddit-thane-parking-towing-2025-01",
  },

  // 05. Commercial vehicle / no-entry violation
  {
    serviceSlug: "commercial-vehicle-violation",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Chandigarh",
    state: "Chandigarh",
    incidentMonth: "2025-07",
    officialRole: "Traffic Police",
    description:
      "A traffic constable filmed accepting ₹500 from a motorist instead of issuing a challan — related to traffic violation settlement. Retained as a low-confidence proxy for commercial vehicle bribe context given limited dedicated evidence.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/chandigarh/traffic-constable-suspended-after-viral-video-shows-him-taking-bribe/articleshow/123004856.cms",
    sourceDate: "2025-07-31",
    evidenceConfidence: "low",
    amountType: "accepted",
    sourceRecordId: "toi-chandigarh-traffic-bribe-500-2025-07-31",
  },

  // 06. Accident vehicle release
  {
    serviceSlug: "accident-vehicle-release",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Chennai",
    state: "Tamil Nadu",
    incidentMonth: "2025-02",
    officialRole: "Traffic Police",
    description:
      "Two traffic investigation personnel were arrested after a DVAC trap in a case involving an alleged ₹5,000 payment for returning a driving licence and vehicle registration documents seized after an accident.",
    status: "approved",
    source: "DT Next",
    sourceType: "news",
    sourceName: "DT Next",
    sourceUrl:
      "https://www.dtnext.in/news/chennai/chennai-cops-caught-red-handed-taking-bribe-823676",
    sourceDate: "2025-02-20",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "dtnext-chennai-accident-doc-return-2025-02-20",
  },

  // 07. Driving licence processing
  {
    serviceSlug: "driving-licence-processing",
    amount: 2500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Mohali",
    state: "Punjab",
    incidentMonth: "2025-04",
    officialRole: "Private RTO Agent",
    description:
      "A Punjab Vigilance Bureau operation reported an agent accepting ₹2,500 as part of an alleged ₹5,000 bribe to facilitate a driving licence and clearance of the test.",
    status: "approved",
    source: "Indian Express",
    sourceType: "news",
    sourceName: "The Indian Express",
    sourceUrl:
      "https://indianexpress.com/article/cities/chandigarh/surprise-inspections-rta-offices-driving-test-centres-punjab-vb-9931177/",
    sourceDate: "2025-04-08",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 5000,
    sourceRecordId: "ie-punjab-rta-licence-mohali-2500-2025-04",
  },

  // 08. Driving licence renewal
  {
    serviceSlug: "driving-licence-renewal",
    amount: 3500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Mumbai",
    state: "Maharashtra",
    incidentMonth: "2026-06",
    officialRole: "RTO Agent",
    description:
      "Maharashtra ACB arrested two RTO agents for allegedly accepting ₹3,500 as a bribe to renew a driving licence. The agents were caught red-handed outside RTO premises after the ACB laid a trap based on a complaint.",
    status: "approved",
    source: "UNI",
    sourceType: "news",
    sourceName: "United News of India",
    sourceUrl:
      "https://www.uniindia.com/two-rto-agents-nabbed-accepting-bribe-to-renew-driving-licence/west/news/3878933.html",
    sourceDate: "2026-06-16",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "uni-mumbai-dl-renewal-3500-2026-06-16",
  },

  // 09. Vehicle registration
  {
    serviceSlug: "vehicle-registration",
    amount: 1500,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Karur",
    state: "Tamil Nadu",
    incidentMonth: "2025-12",
    officialRole: "Motor Vehicle Inspector",
    description:
      "Dealers in Karur alleged that ₹1,500 was being demanded for approval of each motorcycle registration and ₹2,000 for a car after the state introduced dealer-assisted digital registration.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/trichy/karur-rto-continues-manual-inspections-despite-relaxed-regn-norms/articleshow/126107383.cms",
    sourceDate: "2025-12-22",
    evidenceConfidence: "medium",
    amountType: "demanded",
    sourceRecordId: "toi-karur-registration-bike-1500-2025-12-22",
  },

  // 10. Vehicle fitness / document processing
  {
    serviceSlug: "vehicle-fitness-processing",
    amount: 2250,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Gandhidham",
    state: "Gujarat",
    incidentMonth: "2026-06",
    officialRole: "Vehicle Fitness Testing Station Staff",
    description:
      "Gujarat ACB reportedly caught a private fitness-testing-station employee accepting ₹2,250 in addition to prescribed fees for a commercial vehicle fitness/re-test.",
    status: "approved",
    source: "DeshGujarat",
    sourceType: "news",
    sourceName: "DeshGujarat",
    sourceUrl:
      "https://deshgujarat.com/2026/06/05/acb-gujarat-nabs-vehicle-fitness-testing-station-staffer-in-decoy-bribe-trap/",
    sourceDate: "2026-06-05",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "deshgujarat-gandhidham-fitness-2250-2026-06-05",
  },

  // 11. Passport verification
  {
    serviceSlug: "passport-verification",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Kochi",
    state: "Kerala",
    incidentMonth: "2025-03",
    officialRole: "Civil Police Officer",
    description:
      "Kerala VACB caught a police officer accepting ₹500 during passport verification; VACB also reported seeing demands ranging from ₹500 to ₹1,000 in the matter.",
    status: "approved",
    source: "The New Indian Express",
    sourceType: "news",
    sourceName: "The New Indian Express",
    sourceUrl:
      "https://www.newindianexpress.com/cities/kochi/2025/Mar/15/kerala-cop-caught-red-handed-while-taking-bribe-for-passport-verification",
    sourceDate: "2025-03-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "nie-kochi-passport-verification-500-2025-03-15",
  },

  // 12. Police verification
  {
    serviceSlug: "police-verification",
    amount: 2000,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    incidentMonth: "2026-08",
    officialRole: "Police",
    description:
      "A video prompted an inquiry after a policeman was purportedly heard seeking ₹2,000–₹4,000 to process address verification for a passport. Authorities said the video appeared old and initiated an inquiry.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/noida/probe-after-cop-seen-seeking-bribe-for-address-verification-for-passport/articleshow/133266719.cms",
    sourceDate: "2026-08-15",
    evidenceConfidence: "low",
    amountType: "demanded",
    sourceRecordId: "toi-ghaziabad-address-verification-2000-2026-08-15",
  },

  // 13. FIR / complaint handling
  {
    serviceSlug: "fir-complaint",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Batala",
    state: "Punjab",
    incidentMonth: "2025-01",
    officialRole: "Assistant Sub-Inspector",
    description:
      "Punjab Vigilance Bureau reported an ASI accepting ₹5,000 in connection with an investigation arising from an FIR filed by the complainant.",
    status: "approved",
    source: "Punjab Express",
    sourceType: "news",
    sourceName: "Bright Punjab Express",
    sourceUrl:
      "https://brightpunjabexpress.com/wp-content/uploads/2025/01/25-January-2025-E_Paper.pdf",
    sourceDate: "2025-01-25",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "bpe-batala-fir-5000-2025-01-25",
  },

  // 14. Investigation-related matter
  {
    serviceSlug: "police-investigation",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Delhi",
    state: "Delhi",
    incidentMonth: "2025-06",
    officialRole: "Assistant Sub-Inspector",
    description:
      "A Delhi Police vigilance case reported an ASI demanding ₹10,000 to remove family members' names from a complaint; ₹5,000 had already been paid and the officer was subsequently trapped.",
    status: "approved",
    source: "Prajajyothi",
    sourceType: "news",
    sourceName: "Prajajyothi",
    sourceUrl:
      "https://epaper.prajajyothinews.com/media/2025-06/ic-june-12-2025.pdf",
    sourceDate: "2025-06-12",
    evidenceConfidence: "high",
    amountType: "paid",
    demandedAmount: 10000,
    sourceRecordId: "prajajyothi-delhi-investigation-5000-2025-06-12",
  },

  // 15. Property registration
  {
    serviceSlug: "property-registration",
    amount: 1750,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Kochi",
    state: "Kerala",
    incidentMonth: "2025-03",
    officialRole: "Sub-Registrar Office Assistant",
    description:
      "Kerala VACB caught a sub-registrar office assistant accepting ₹1,750 in connection with property registration; the property was reported to be worth ₹55 lakh.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/kochi/govt-official-held-while-taking-bribe/articleshow/118690948.cms",
    sourceDate: "2025-03-03",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-kochi-property-registration-1750-2025-03-03",
  },

  // 16. Property records / e-Khata
  {
    serviceSlug: "property-records",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Bengaluru",
    state: "Karnataka",
    incidentMonth: "2015-01",
    officialRole: "Revenue / Land Records Official",
    description:
      "A Karnataka land-records evaluation reported that some farmers paid up to ₹5,000 to finalize mutation, with an average reported cost of ₹651. This is historical survey evidence rather than a single trap case.",
    status: "approved",
    source: "LBSNAA / Government study",
    sourceType: "historical",
    sourceName: "Lal Bahadur Shastri National Academy of Administration",
    sourceUrl:
      "https://www.lbsnaa.gov.in/storage/uploads/pdf_data/1740658864_27-Final_CoLR_Karnataka_Web.pdf",
    sourceDate: "2015-01-01",
    evidenceConfidence: "medium",
    amountType: "reported",
    sourceRecordId: "lbsnaa-karnataka-mutation-up-to-5000-historical",
  },

  // 17. Building permission
  {
    serviceSlug: "building-permission",
    amount: 100000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Baramati",
    state: "Maharashtra",
    incidentMonth: "2025-03",
    officialRole: "Town Planner",
    description:
      "Maharashtra ACB arrested a town planner after an alleged ₹2 lakh demand was negotiated to ₹1.75 lakh; ₹1 lakh was allegedly accepted as the first instalment for approving a residential project plan.",
    status: "approved",
    source: "Indian Express",
    sourceType: "news",
    sourceName: "The Indian Express",
    sourceUrl:
      "https://indianexpress.com/article/cities/pune/pune-acb-arrests-baramati-town-planner-rs-1-lakh-bribe-builder-9896287/lite/",
    sourceDate: "2025-03-20",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 200000,
    sourceRecordId: "ie-baramati-building-permission-100000-2025-03-20",
  },

  // 18. Building NOC
  {
    serviceSlug: "building-noc",
    amount: 36000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Ahmedabad",
    state: "Gujarat",
    incidentMonth: "2026-08",
    officialRole: "Fire Brigade CFO",
    description:
      "Ahmedabad ACB arrested a Fire Brigade Chief Fire Officer for allegedly accepting ₹36,000 (₹6,000 x 6 buildings) as bribe for issuing fire NOCs required for building permissions.",
    status: "approved",
    source: "India Today",
    sourceType: "news",
    sourceName: "India Today",
    sourceUrl:
      "https://www.indiatoday.in/cities/ahmedabad/story/ahmedabad-fire-brigade-cfo-amit-dongre-arrested-36000-bribe-fire-noc-case-2966313-2026-08-08",
    sourceDate: "2026-08-08",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "indiatoday-ahmedabad-fire-noc-36000-2026-08-08",
  },

  // 19. Property transfer / certificate
  {
    serviceSlug: "property-transfer",
    amount: 15000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Gurugram",
    state: "Haryana",
    incidentMonth: "2026-07",
    officialRole: "Patwari",
    description:
      "Haryana ACB caught a patwari accepting ₹15,000 bribe in a land mutation case. The patwari was demanding money to process the mutation/transfer of land records.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/gurgaon/patwari-caught-taking-rs-15000-bribe-in-land-mutation-case/articleshow/132247665.cms",
    sourceDate: "2026-07-07",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-gurgaon-mutation-patwari-15000-2026-07-07",
  },

  // 20. Municipal inspection
  {
    serviceSlug: "municipal-inspection",
    amount: 100000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Pimpri-Chinchwad",
    state: "Maharashtra",
    incidentMonth: "2025-05",
    officialRole: "Municipal Junior Engineer",
    description:
      "A PCMC junior engineer was reportedly caught accepting ₹1 lakh after conducting an inspection of a company following a complaint; the payment was allegedly to avoid further action.",
    status: "approved",
    source: "Punekar News",
    sourceType: "news",
    sourceName: "Punekar News",
    sourceUrl:
      "https://www.punekarnews.in/pune-pcmc-engineer-caught-red-handed-accepting-rs-1-lakh-bribe-acb-registers-case/",
    sourceDate: "2025-05-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "punekar-pcmc-inspection-100000-2025-05-15",
  },

  // 21. GST registration
  {
    serviceSlug: "gst-registration",
    amount: 15000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Ranipet",
    state: "Tamil Nadu",
    incidentMonth: "2026-04",
    officialRole: "GST Superintendent",
    description:
      "CBI arrested a GST Superintendent and Inspector in a bribery case. The Superintendent demanded ₹30,000, negotiated to ₹15,000, for facilitating clearance of GST registration. The Inspector concealed the trap amount in a toilet commode. Both arrested.",
    status: "approved",
    source: "CBI",
    sourceType: "documented_case",
    sourceName: "Central Bureau of Investigation",
    sourceUrl: "https://cbi.gov.in/press-detail/NzY4Mg%3D%3D",
    sourceDate: "2026-04-08",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 30000,
    sourceRecordId: "cbi-ranipet-gst-registration-15000-2026-04-08",
  },

  // 22. GST assessment / notice
  {
    serviceSlug: "gst-assessment",
    amount: 45000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Noida",
    state: "Uttar Pradesh",
    incidentMonth: "2025-05",
    officialRole: "GST Administrative Officer",
    description:
      "A GST administrative officer in Gautam Budh Nagar was reported accepting ₹45,000 in a tax-assessment matter after an alleged larger demand.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/lucknow/gst-officer-held-taking-rs-45k-bribe/articleshow/121276582.cms",
    sourceDate: "2025-05-26",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 50000,
    sourceRecordId: "toi-noida-gst-assessment-45000-2025-05-26",
  },

  // 23. Income-tax notice / assessment
  {
    serviceSlug: "income-tax-assessment",
    amount: 70000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    incidentMonth: "2025-07",
    officialRole: "Income Tax Inspector / Middleman",
    description:
      "CBI reported arresting an income-tax inspector and middleman after a ₹70,000 payment was allegedly accepted in connection with avoiding further income-tax action; the initial demand was reported as much higher.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/vijayawada/cbi-traps-i-t-dept-official-middleman-in-bribery-case/articleshow/122981032.cms",
    sourceDate: "2025-07-30",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 120000,
    sourceRecordId: "toi-vijayawada-income-tax-70000-2025-07-30",
  },

  // 24. Business / shop licence
  {
    serviceSlug: "business-licence",
    amount: 10000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Cheranmahadevi",
    state: "Tamil Nadu",
    incidentMonth: "2026-06",
    officialRole: "Village Administrative Officer / Broker",
    description:
      "A VAO and broker were reported arrested after allegedly demanding and accepting ₹10,000 to renew a finance business licence.",
    status: "approved",
    source: "TamilURL",
    sourceType: "news",
    sourceName: "TamilURL",
    sourceUrl:
      "https://tamilurl.com/tamilurl-news/2026-06-04-tirunelveli-vao-bribe-arrest/",
    sourceDate: "2026-06-04",
    evidenceConfidence: "medium",
    amountType: "accepted",
    sourceRecordId: "tamilurl-business-licence-10000-2026-06-04",
  },

  // 25. Electricity connection
  {
    serviceSlug: "electricity-connection",
    amount: 2000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Tenkasi",
    state: "Tamil Nadu",
    incidentMonth: "2026-08",
    officialRole: "TANGEDCO Official",
    description:
      "A TANGEDCO official was reported accepting ₹2,000 for a site inspection/favourable report after the applicant had already paid the prescribed new-connection fee.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/madurai/tangedco-official-arrested-for-taking-rs-2000-bribe/articleshow/133267047.cms",
    sourceDate: "2026-08-16",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-tenkasi-electricity-2000-2026-08-16",
  },

  // 26. Income certificate
  {
    serviceSlug: "income-certificate",
    amount: 10000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Kaushambi",
    state: "Uttar Pradesh",
    incidentMonth: "2026-02",
    officialRole: "Lekhpal",
    description:
      "A lekhpal was reported arrested after allegedly accepting ₹10,000 to expedite an income-certificate application.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/allahabad/lekhpal-caught-accepting-bribe-in-kaushambi/articleshow/128720675.cms",
    sourceDate: "2026-02-23",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-kaushambi-income-certificate-10000-2026-02-23",
  },

  // 27. Government certificate processing
  {
    serviceSlug: "government-certificate",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Barwani",
    state: "Madhya Pradesh",
    incidentMonth: "2026-03",
    officialRole: "Block Resource Coordinator / Sub-Engineer",
    description:
      "Lokayukta police in Madhya Pradesh reportedly caught officials accepting ₹5,000 in connection with issuing a completion certificate for a government-school redevelopment project.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/indore/brc-sub-engineer-booked-for-accepting-rs-5k-bribe/articleshow/129664907.cms",
    sourceDate: "2026-03-01",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-barwani-certificate-5000-2026",
  },

  // 28. Panchayat / local approval
  {
    serviceSlug: "panchayat-approval",
    amount: 100000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Nandigama",
    state: "Telangana",
    incidentMonth: "2026-01",
    officialRole: "Panchayat Raj Officials",
    description:
      "Telangana ACB reported three Panchayat Raj officials accepting an additional ₹1 lakh after allegedly demanding ₹2.5 lakh to process house-building permissions for four plots; ₹1.5 lakh had allegedly been accepted earlier.",
    status: "approved",
    source: "Times of India",
    sourceType: "news",
    sourceName: "Times of India",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/hyderabad/3-officials-of-panchayat-raj-department-held-in-over-2l-bribery-case/articleshow/126400797.cms",
    sourceDate: "2026-01-01",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 250000,
    sourceRecordId: "toi-nandigama-panchayat-building-100000-2026",
  },
];

export function validateResearchSeed() {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const report of RESEARCH_SEED_REPORTS) {
    if (!servicesBySlug.has(report.serviceSlug)) {
      errors.push(`Unknown service slug: ${report.serviceSlug}`);
    }

    if (ids.has(report.sourceRecordId)) {
      errors.push(`Duplicate sourceRecordId: ${report.sourceRecordId}`);
    }
    ids.add(report.sourceRecordId);

    if (!Number.isFinite(report.amount) || report.amount <= 0 || report.amount > 1_000_000) {
      errors.push(`Invalid amount for ${report.sourceRecordId}`);
    }

    if (!/^\d{4}-\d{2}$/.test(report.incidentMonth)) {
      errors.push(`Invalid incidentMonth for ${report.sourceRecordId}`);
    }

    if (!/^https?:\/\/\S+$/.test(report.sourceUrl)) {
      errors.push(`Invalid sourceUrl for ${report.sourceRecordId}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(report.sourceDate)) {
      errors.push(`Invalid sourceDate for ${report.sourceRecordId}`);
    }

    if (!report.paid && report.paymentMode !== "not_paid") {
      errors.push(`Unpaid report must use not_paid: ${report.sourceRecordId}`);
    }

    if (report.paid && report.paymentMode === "not_paid") {
      errors.push(`Paid report cannot use not_paid: ${report.sourceRecordId}`);
    }

    if (
      report.amountType === "demanded" &&
      report.paid
    ) {
      errors.push(`Demand-only report cannot be marked paid: ${report.sourceRecordId}`);
    }

    if (
      report.demandedAmount !== undefined &&
      (!Number.isFinite(report.demandedAmount) ||
        report.demandedAmount <= 0 ||
        report.demandedAmount > 1_000_000)
    ) {
      errors.push(`Invalid demandedAmount for ${report.sourceRecordId}`);
    }
  }

  const expected = new Set(SERVICES_SEED.map((s) => s.slug));
  const covered = new Set(RESEARCH_SEED_REPORTS.map((r) => r.serviceSlug));

  for (const slug of expected) {
    if (!covered.has(slug)) {
      errors.push(`Missing research observation for service: ${slug}`);
    }
  }

  if (errors.length) {
    throw new Error(`Research seed validation failed:\n${errors.join("\n")}`);
  }

  return true;
}

validateResearchSeed();
