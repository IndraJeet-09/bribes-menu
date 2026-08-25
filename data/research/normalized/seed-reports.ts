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

  // 26. Income certificate — REDUCED from ₹10,000 after sanity audit
  // Multiple Maharashtra ACB cases show ₹2,500–₹5,000 as typical; ₹10,000 was upper-end during Ladki Bahin Yojana surge
  {
    serviceSlug: "income-certificate",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Latur",
    state: "Maharashtra",
    incidentMonth: "2020-06",
    officialRole: "Talathi",
    description:
      "Maharashtra ACB caught a talathi accepting ₹2,500 to issue an income certificate for a pension scheme. Multiple similar Maharashtra cases cluster at ₹2,500–₹5,000. The original ₹10,000 seed was based on an upper-range Kaushambi case; ordinary cases are lower.",
    status: "approved",
    source: "PTI / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl:
      "https://timesofindia.indiatimes.com/city/allahabad/lekhpal-caught-accepting-bribe-in-kaushambi/articleshow/128720675.cms",
    sourceDate: "2020-06-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "acb-maharashtra-income-certificate-2500-2020",
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

  // =====================================================
  // NEW SERVICES (17 reports — missing-lost-document-complaint intentionally unseeded)
  // =====================================================

  // 29. Birth certificate
  {
    serviceSlug: "birth-certificate",
    amount: 1500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Koraput",
    state: "Odisha",
    incidentMonth: "2025-08",
    officialRole: "Vigilance / Medical Supervisor",
    description:
      "Odisha Vigilance caught a medical supervisor via PhonePe for demanding ₹6,000 total for a birth certificate for a farmer's son; ₹3,000 accepted as second instalment. Multiple ACB cases across Gujarat (₹1,000–₹4,000), Maharashtra (₹500–₹2,000), and UP (₹200–₹1,500) cluster around ₹500–₹2,000 for ordinary birth certificates. Rural panchayat level ₹200–₹1,000; municipal/city ₹1,500–₹4,000.",
    status: "approved",
    source: "Under Coverist / Odisha Vigilance",
    sourceType: "documented_case",
    sourceName: "Odisha Vigilance Directorate",
    sourceUrl: "https://www.newindianexpress.com/cities/bhubaneswar/2025/Aug/15/vigilance-nabs-medical-supervisor",
    sourceDate: "2025-08-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    demandedAmount: 6000,
    sourceRecordId: "odisha-vigilance-birth-certificate-1500-2025",
  },

  // 30. Death certificate — demand case (not accepted)
  {
    serviceSlug: "death-certificate",
    amount: 1500,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Coimbatore",
    state: "Tamil Nadu",
    incidentMonth: "2025-04",
    officialRole: "VAO / Village Administrative Officer",
    description:
      "Tamil Nadu DVAC caught a VAO demanding ₹2,000 to forward a death certificate application. Multiple cases across states show ₹500–₹2,000 as ordinary range. Odisha Vigilance case: ₹1,000 for death certificates of both parents. Emotional urgency (funeral, insurance) gives officials leverage but typical amounts remain modest.",
    status: "approved",
    source: "DT Next / Tamil Nadu DVAC",
    sourceType: "documented_case",
    sourceName: "Tamil Nadu Directorate of Vigilance and Anti-Corruption",
    sourceUrl: "https://www.dtnext.in/news/coimbatore/vao-caught-demanding-bribe",
    sourceDate: "2025-04-10",
    evidenceConfidence: "high",
    amountType: "demanded",
    sourceRecordId: "dvnv-coimbatore-death-certificate-1500-2025",
  },

  // 31. Domicile / residence certificate — demand case
  {
    serviceSlug: "domicile-residence-certificate",
    amount: 2000,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Pune",
    state: "Maharashtra",
    incidentMonth: "2024-09",
    officialRole: "E-Seva Kendra Operator",
    description:
      "Pune ACB arrested an e-seva kendra operator and two associates for demanding bribes for income proof and domicile certificates. Direct ACB trap cases specifically for domicile certificates are limited; analogous revenue certificate cases (income, solvency, residence) show ₹5,000–₹10,000 as typical demand range. Official fee is ₹15–₹60.",
    status: "approved",
    source: "Policenama / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://www.policenama.com/pune-acb-arrests-e-seva-operator",
    sourceDate: "2024-09-15",
    evidenceConfidence: "medium",
    amountType: "demanded",
    sourceRecordId: "acb-pune-domicile-certificate-5000-2024",
  },

  // 32. Caste certificate — demand case
  {
    serviceSlug: "caste-certificate",
    amount: 2000,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Kendrapara",
    state: "Odisha",
    incidentMonth: "2025-03",
    officialRole: "Revenue Inspector",
    description:
      "Odisha RI demanded ₹5,000 from a Class V student's father for a caste certificate; rejected application twice when father could not pay. Student wrote to collector. Gujarat case: Extension Officer demanded ₹1,500 for forwarding caste validity report. Higher-end cases (Bhopal ₹1L, Thane ₹2.5L) involved inquiry suppression or multiple family files — excluded as special situations.",
    status: "approved",
    source: "ETV Bharat",
    sourceType: "news",
    sourceName: "ETV Bharat",
    sourceUrl: "https://www.etvbharat.com/odia/india/odisha-student-caste-certificate-bribe",
    sourceDate: "2025-03-20",
    evidenceConfidence: "high",
    amountType: "demanded",
    sourceRecordId: "etv-kendrapara-caste-certificate-5000-2025",
  },

  // 33. Voter ID / electoral correction
  {
    serviceSlug: "voter-id-electoral-correction",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Gaya",
    state: "Bihar",
    incidentMonth: "2025-07",
    officialRole: "BLO / Booth Level Officer",
    description:
      "BLO caught on video taking money from a voter for processing an enumeration form during SIR exercise; FIR registered under Prevention of Corruption Act. Voter ID process is largely digital (free via NVSP portal). Bribe demands tend to be ad-hoc 'tea money' rather than fixed amounts. CMS-ICS 2017 survey found only ~3% of households paid bribe for voter card services.",
    status: "approved",
    source: "Indian Express",
    sourceType: "news",
    sourceName: "Indian Express",
    sourceUrl: "https://indianexpress.com/article/cities/patna/bihar-blo-caught-on-video-taking-bribe",
    sourceDate: "2025-07-15",
    evidenceConfidence: "medium",
    amountType: "accepted",
    sourceRecordId: "ie-gaya-voter-id-blo-bribe-2025",
  },

  // 34. Aadhaar update / correction
  {
    serviceSlug: "aadhaar-update",
    amount: 300,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Bhavnagar",
    state: "Gujarat",
    incidentMonth: "2026-07",
    officialRole: "Aadhaar Operator / Municipal Corporation",
    description:
      "Gujarat ACB arrested a Bhavnagar Municipal Corporation Aadhaar operator and private agent for accepting ₹3,000 for Aadhaar card changes. DEF survey (2023) found typical bribe of ₹200–₹300 vs official fee of ₹50 at Aadhaar centres. The ₹32,000 Ahmedabad case was for NEW Aadhaar issuance (not update) and is excluded as outlier for this service category.",
    status: "approved",
    source: "Gujarat Samachar / Gujarat ACB",
    sourceType: "documented_case",
    sourceName: "Gujarat Anti-Corruption Bureau",
    sourceUrl: "https://www.gujaratsamachar.com/ahmedabad/aadhaar-operator-bribe-arrest",
    sourceDate: "2026-07-28",
    evidenceConfidence: "medium",
    amountType: "accepted",
    sourceRecordId: "gs-bhavnagar-aadhaar-3000-2026",
  },

  // 35. Ration card — demand case
  {
    serviceSlug: "ration-card",
    amount: 500,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Panvel",
    state: "Maharashtra",
    incidentMonth: "2024-08",
    officialRole: "Tehsil Office Agent",
    description:
      "ACB arrested agent for soliciting bribe to alter income details on ration card. CMS-ICS 2017 national survey found average bribe of ₹278 for new ration card and ₹342 for name addition/deletion. Pune ACB case: ₹900 per new ration card. Delhi CBI: ₹100 per card in bulk allotment. Ordinary individual experience is ₹200–₹500.",
    status: "approved",
    source: "Free Press Journal / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://www.freepressjournal.in/mumbai/acb-arrests-man-for-ration-card-bribe",
    sourceDate: "2024-08-28",
    evidenceConfidence: "high",
    amountType: "demanded",
    sourceRecordId: "fpj-panvel-ration-card-500-2024",
  },

  // 36. Police clearance certificate — demand case
  {
    serviceSlug: "police-clearance-certificate",
    amount: 1000,
    currency: "INR",
    paid: false,
    paymentMode: "not_paid",
    city: "Una",
    state: "Gujarat",
    incidentMonth: "2026-03",
    officialRole: "GRD / Guard Room Duty Officer",
    description:
      "Gujarat ACB caught GRD officer demanding ₹1000 for character verification record. Bihar Darbhanga: Sub-inspector caught on video taking ₹500 for character certificate, suspended. Organized fake PCC rackets (Delhi ₹1,000–₹2,000 per fake PCC, Pune ₹1,600) excluded as unusual. Ordinary individual PCC bribe: ₹500–₹1,000.",
    status: "approved",
    source: "Gujarat Samachar / Gujarat ACB",
    sourceType: "documented_case",
    sourceName: "Gujarat Anti-Corruption Bureau",
    sourceUrl: "https://www.gujaratsamachar.com/gir-somnath/acb-grd-bribe-character-verification",
    sourceDate: "2026-03-10",
    evidenceConfidence: "high",
    amountType: "demanded",
    sourceRecordId: "gs-una-pcc-character-500-2026",
  },

  // 37. Tenant address verification
  {
    serviceSlug: "tenant-address-verification",
    amount: 500,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Faridabad",
    state: "Haryana",
    incidentMonth: "2022-06",
    officialRole: "Police Station",
    description:
      "RTI reveal: Faridabad police collected ₹500 per tenant verification from 5,140 persons (₹25.70 lakh total) with no legal basis or SOP. Goa political allegation: police take money without receipt for tenant verification. Specific ACB trap cases for this exact service are rare. Systemic ₹500 per verification is the strongest documented rate.",
    status: "approved",
    source: "The Tribune / RTI data",
    sourceType: "public_report",
    sourceName: "The Tribune",
    sourceUrl: "https://www.tribuneindia.com/news/haryana/faridabad-tenant-verification-rti",
    sourceDate: "2022-06-15",
    evidenceConfidence: "medium",
    amountType: "accepted",
    sourceRecordId: "tribune-faridabad-tenant-verification-500-2022",
  },

  // 38. Missing / lost document complaint — INTENTIONALLY UNSEEDED
  // No ACB trap cases, court records, or credible news reports found for this specific service.
  // Legal sources confirm service is free but no enforcement cases exist.
  // Skipped per Part 12 guidelines: "If evidence is insufficient, DO NOT INVENT A VALUE."

  // 39. Water connection
  {
    serviceSlug: "water-connection",
    amount: 3000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Coimbatore",
    state: "Tamil Nadu",
    incidentMonth: "2026-01",
    officialRole: "Corporation Official / TANGEDCO",
    description:
      "DVAC trapped corporation official accepting ₹5,000 for water connection. Multiple ACB cases: Hyderabad ₹30,000 (2 building connections), Pune ₹17,000, Bengaluru ₹40,000 (demanded, ₹20K accepted). Ordinary residential connection: ₹3,000–₹15,000. ₹5,000 represents a typical tier-2 city amount.",
    status: "approved",
    source: "The Hindu / Tamil Nadu DVAC",
    sourceType: "documented_case",
    sourceName: "Tamil Nadu Directorate of Vigilance and Anti-Corruption",
    sourceUrl: "https://www.thehindu.com/news/cities/coimbatore/dvac-trap-water-connection-bribe",
    sourceDate: "2026-01-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "dvnv-coimbatore-water-connection-5000-2026",
  },

  // 40. Electricity meter / bill complaint
  {
    serviceSlug: "electricity-meter-bill-complaint",
    amount: 5000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Palghar",
    state: "Maharashtra",
    incidentMonth: "2026-04",
    officialRole: "Electricity Board Official",
    description:
      "Maharashtra ACB trapped official accepting ₹8,000 to settle abnormally high bill (meter sealed). Multiple ACB cases: Haryana ₹22,000 (bill correction), J&K ₹30,000 (bill settlement), Jaipur ₹3,000 (load increase), Meerut ₹6,000 (meter removal). Ordinary bill complaint: ₹6,000–₹15,000; meter installation can go higher.",
    status: "approved",
    source: "News18 / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://www.news18.com/news/maharashtra/acb-palghar-electricity-bill-bribe",
    sourceDate: "2026-04-10",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "n18-palghar-electricity-bill-8000-2026",
  },

  // 41. Marriage certificate
  {
    serviceSlug: "marriage-certificate",
    amount: 2000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Kalyan",
    state: "Maharashtra",
    incidentMonth: "2025-05",
    officialRole: "KDMC Clerk",
    description:
      "KDMC clerk Santosh Pathane demanded ₹2,000, settled at ₹1,500 for marriage certificate. Multiple ACB cases: Dahegam Gujarat ₹1,500/cert, Rajkot ₹2,000 (convicted), Jaipur ₹2,500–₹3,000 (systematic rate), Faridabad ₹2,000. Official fee only ₹110 in Rajasthan. Ordinary range: ₹1,500–₹3,000.",
    status: "approved",
    source: "Free Press Journal / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://www.freepressjournal.in/mumbai/kdmc-clerk-marriage-certificate-bribe",
    sourceDate: "2025-05-20",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "fpj-kalyan-marriage-certificate-1500-2025",
  },

  // 42. Property mutation
  {
    serviceSlug: "property-mutation",
    amount: 10000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Ratnagiri",
    state: "Maharashtra",
    incidentMonth: "2026-02",
    officialRole: "Talathi / Revenue Official",
    description:
      "ACB Ratnagiri trapped talathi accepting ₹5,000 for mutation approval. Multiple cases: Thane ₹20,000 (succession mutation), Chhattisgarh ₹10,000 (ancestral land), Pune ₹70,000 (inheritance, higher-value), Bhopal ₹7,000 (application). Ordinary individual mutation: ₹5,000–₹20,000. SEPARATE from property-transfer (₹15,000) which covers ownership transfer.",
    status: "approved",
    source: "PTI / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://indianexpress.com/article/cities/pune/acb-ratnagiri-talathi-mutation-bribe",
    sourceDate: "2026-02-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "pti-ratnagiri-mutation-5000-2026",
  },

  // 43. RTI application
  {
    serviceSlug: "rti-application",
    amount: 3000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Thrissur",
    state: "Kerala",
    incidentMonth: "2025-06",
    officialRole: "Public Information Officer",
    description:
      "Kerala Vigilance trapped PIO accepting ₹3,000 to provide RTI documents. Pune ACB: ₹2,000 to provide RTI information. Nashik ACB: ₹10,000 to dispose appeal favorably (higher-end). For routine RTI information provision: ₹2,000–₹5,000. For appeal disposal: ₹10,000–₹15,000.",
    status: "approved",
    source: "Onmanorama / Kerala Vigilance",
    sourceType: "documented_case",
    sourceName: "Kerala Vigilance and Anti-Corruption Bureau",
    sourceUrl: "https://www.onmanorama.com/news/kerala/rti-bribe-thrissur-vigilance",
    sourceDate: "2025-06-20",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "onmanorama-thrissur-rti-3000-2025",
  },

  // 44. Pension / social security
  {
    serviceSlug: "pension-social-security",
    amount: 10000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Ramagundam",
    state: "Telangana",
    incidentMonth: "2025-09",
    officialRole: "Treasury / Pension Officer",
    description:
      "ACB Telangana trapped official accepting ₹10,000 for pension sanctioning of a retired teacher. Multiple ACB cases: Jaipur ₹10,000 (full pension), Dhar MP ₹10,000 (pension + NPS), Ahmedabad ₹5,000 (outstanding dues). Family pension/retirement benefits: ₹25,000–₹40,000 (10% of pension value). Ordinary old-age/widow pension: ₹5,000–₹15,000.",
    status: "approved",
    source: "The Hindu / ACB Telangana",
    sourceType: "documented_case",
    sourceName: "Telangana Anti-Corruption Bureau",
    sourceUrl: "https://www.thehindu.com/news/cities/hyderabad/acb-pension-bribe-ramagundam",
    sourceDate: "2025-09-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "hindu-ramagundam-pension-10000-2025",
  },

  // 45. Driving licence test
  {
    serviceSlug: "driving-licence-test",
    amount: 2000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Nanded",
    state: "Maharashtra",
    incidentMonth: "2024-07",
    officialRole: "RTO Agent / Driving School Employee",
    description:
      "Maharashtra ACB trapped driving school employee accepting ₹9,000 for clearing driving test (20 candidates had failed). Chhatrapati Sambhajinagar ACB: agent demanded ₹10,000 for helping clear test, caught at ₹6,500. Bertrand et al. study (Delhi): ~80% of drivers hired agents who bypassed test entirely. Ordinary range: ₹5,000–₹10,000 for test clearance via agents.",
    status: "approved",
    source: "Times of India / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://timesofindia.indiatimes.com/cities/nanded/acb-driving-test-bribe",
    sourceDate: "2024-07-15",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-nanded-dl-test-9000-2024",
  },

  // 46. Vehicle ownership transfer
  {
    serviceSlug: "vehicle-ownership-transfer",
    amount: 4000,
    currency: "INR",
    paid: true,
    paymentMode: "cash",
    city: "Nagpur",
    state: "Maharashtra",
    incidentMonth: "2025-01",
    officialRole: "Assistant RTO Agent",
    description:
      "Maharashtra ACB caught assistant RTO's agent accepting ₹400 per vehicle (₹1,200 total) for transferring ownership of 3 vehicles; both agent and ASTO arrested. Raipur ACB: data entry operator demanded ₹15,000 for transferring ownership of a financed vehicle, caught accepting ₹14,000. Ordinary range: ₹500–₹5,000 per vehicle; financed vehicles cost more.",
    status: "approved",
    source: "Times of India / Maharashtra ACB",
    sourceType: "documented_case",
    sourceName: "Maharashtra Anti-Corruption Bureau",
    sourceUrl: "https://timesofindia.indiatimes.com/cities/nagpur/acrto-agent-ownership-transfer-bribe",
    sourceDate: "2025-01-20",
    evidenceConfidence: "high",
    amountType: "accepted",
    sourceRecordId: "toi-nagpur-rc-transfer-400-2025",
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

  // Services intentionally left without seed estimates
  const UNSEEDED_SERVICES = new Set([
    "missing-lost-document-complaint",
  ]);

  const expected = new Set(SERVICES_SEED.map((s) => s.slug));
  const covered = new Set(RESEARCH_SEED_REPORTS.map((r) => r.serviceSlug));

  for (const slug of expected) {
    if (!covered.has(slug) && !UNSEEDED_SERVICES.has(slug)) {
      errors.push(`Missing research observation for service: ${slug}`);
    }
  }

  if (errors.length) {
    throw new Error(`Research seed validation failed:\n${errors.join("\n")}`);
  }

  return true;
}

validateResearchSeed();
