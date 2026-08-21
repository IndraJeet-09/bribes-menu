import { db } from "./index";
import { categories, services } from "./schema";
import { CATEGORIES_SEED } from "../../data/categories";
import { SERVICES_SEED } from "../../data/services";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Categories
  for (const cat of CATEGORIES_SEED) {
    await db
      .insert(categories)
      .values({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: { name: cat.name },
      });
  }
  console.log(`✅ Seeded ${CATEGORIES_SEED.length} categories.`);

  // 2. Seed Services
  for (const srv of SERVICES_SEED) {
    await db
      .insert(services)
      .values({
        id: srv.id,
        categoryId: srv.categoryId,
        name: srv.name,
        slug: srv.slug,
        aliases: srv.aliases,
        active: srv.active,
      })
      .onConflictDoUpdate({
        target: services.slug,
        set: {
          name: srv.name,
          aliases: srv.aliases,
          active: srv.active,
        },
      });
  }
  console.log(`✅ Seeded ${SERVICES_SEED.length} reportable services.`);
  console.log("🎉 Database seeding complete!");
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
