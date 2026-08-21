import "dotenv/config";
import { db } from "../lib/db";
import { initialEstimates, reports, services } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { SERVICES_SEED } from "../data/services";
import { RESEARCH_SEED_REPORTS, validateResearchSeed } from "../data/research/normalized/seed-reports";
import { INITIAL_ESTIMATES_SEED } from "../data/research/normalized/seed-estimates";

async function seedResearch() {
  console.log("🌱 Seeding research observations and initial estimates...");

  validateResearchSeed();

  await db.transaction(async (tx) => {
    const serviceRows = await tx.select().from(services);

    const serviceIdBySlug = new Map(serviceRows.map((s) => [s.slug, s.id]));

    // Safety check: every service referenced by the research dataset must exist.
    for (const service of SERVICES_SEED) {
      if (!serviceIdBySlug.has(service.slug)) {
        throw new Error(`Service not found in database: ${service.slug}`);
      }
    }

    let insertedReports = 0;
    let skippedReports = 0;

    for (const report of RESEARCH_SEED_REPORTS) {
      const serviceId = serviceIdBySlug.get(report.serviceSlug)!;

      const existing = await tx
        .select({ id: reports.id })
        .from(reports)
        .where(eq(reports.sourceRecordId, report.sourceRecordId))
        .limit(1);

      if (existing.length > 0) {
        skippedReports++;
        continue;
      }

      await tx.insert(reports).values({
        serviceId,
        amount: report.amount.toFixed(2),
        currency: report.currency,
        paid: report.paid,
        paymentMode: report.paymentMode,
        city: report.city,
        state: report.state,
        incidentMonth: report.incidentMonth,
        officialRole: report.officialRole,
        description: report.description,
        status: "approved",
        source: report.source,
        sourceType: report.sourceType,
        sourceName: report.sourceName,
        sourceUrl: report.sourceUrl,
        sourceDate: report.sourceDate,
        evidenceConfidence: report.evidenceConfidence,
        amountType: report.amountType,
        demandedAmount:
          report.demandedAmount !== undefined
            ? report.demandedAmount.toFixed(2)
            : undefined,
        sourceRecordId: report.sourceRecordId,
      });

      insertedReports++;
    }

    let insertedEstimates = 0;
    let updatedEstimates = 0;

    for (const estimate of INITIAL_ESTIMATES_SEED) {
      const serviceId = serviceIdBySlug.get(estimate.serviceSlug)!;

      const existing = await tx
        .select({ id: initialEstimates.id })
        .from(initialEstimates)
        .where(eq(initialEstimates.serviceId, serviceId))
        .limit(1);

      const values = {
        serviceId,
        amount: estimate.amount.toFixed(2),
        minAmount: estimate.minAmount.toFixed(2),
        maxAmount: estimate.maxAmount.toFixed(2),
        methodology: estimate.methodology,
        confidence: estimate.confidence,
        observationCount: estimate.observationCount.toString(),
      };

      if (existing.length === 0) {
        await tx.insert(initialEstimates).values(values);
        insertedEstimates++;
      } else {
        await tx
          .update(initialEstimates)
          .set({
            amount: values.amount,
            minAmount: values.minAmount,
            maxAmount: values.maxAmount,
            methodology: values.methodology,
            confidence: values.confidence,
            observationCount: values.observationCount,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(initialEstimates.serviceId, serviceId));

        updatedEstimates++;
      }
    }

    console.log(`✅ Research reports inserted: ${insertedReports}`);
    console.log(`↪️ Research reports already present: ${skippedReports}`);
    console.log(`✅ Initial estimates inserted: ${insertedEstimates}`);
    console.log(`🔄 Initial estimates updated: ${updatedEstimates}`);
  });

  console.log("🎉 Research seed complete.");
}

seedResearch()
  .catch((error) => {
    console.error("❌ Research seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
