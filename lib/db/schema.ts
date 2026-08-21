import {
  pgTable,
  uuid,
  varchar,
  boolean,
  text,
  timestamp,
  numeric,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Postgres Enums
export const paymentModeEnum = pgEnum("payment_mode", [
  "cash",
  "upi",
  "bank_transfer",
  "agent",
  "other",
  "not_paid",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "approved",
  "rejected",
]);

// Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
});

// Services Table
export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  aliases: text("aliases").array().notNull().default(sql`'{}'::text[]`),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "string" })
    .defaultNow()
    .notNull(),
});

// Reports Table
export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    paid: boolean("paid").notNull(),
    paymentMode: paymentModeEnum("payment_mode").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    incidentMonth: varchar("incident_month", { length: 7 }).notNull(), // YYYY-MM
    officialRole: varchar("official_role", { length: 100 }),
    description: text("description"),
    status: reportStatusEnum("status").notNull().default("pending"),
    source: varchar("source", { length: 50 }).notNull().default("crowdsourced"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    amountRangeCheck: check(
      "amount_range_check",
      sql`${table.amount} > 0 AND ${table.amount} <= 1000000`
    ),
    paidModeCheck: check(
      "paid_mode_consistency_check",
      sql`(${table.paid} = true AND ${table.paymentMode} != 'not_paid') OR (${table.paid} = false AND ${table.paymentMode} = 'not_paid')`
    ),
  })
);

export type CategoryRow = typeof categories.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type ReportRow = typeof reports.$inferSelect;
