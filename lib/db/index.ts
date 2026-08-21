import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/fine_menu";

// Configure for Neon/serverless: small pool, longer connect timeout, no prefetch
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  prepare: false,
  onnotice: () => { },
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});

// Warm up the connection pool on module load to avoid cold-start latency
// This is a non-blocking fire-and-forget; failures will be handled per-request
if (typeof window === "undefined") {
  client
    .begin((sql) => sql`SELECT 1`)
    .catch(() => {
      // Ignore warmup errors; first real request will trigger connection
    });
}

export const db = drizzle(client, { schema });
