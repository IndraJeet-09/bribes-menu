import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/fine_menu";

// Global singleton to prevent multiple clients in dev (HMR)
const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

const client = globalForDb.postgresClient ?? postgres(connectionString, {
  max: 3,
  idle_timeout: 30,
  connect_timeout: 60,
  prepare: false,
  onnotice: () => { },
  transform: {
    ...postgres.camel,
    undefined: null,
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

// Warm up the connection pool on module load to avoid cold-start latency
if (typeof window === "undefined") {
  client
    .begin((sql) => sql`SELECT 1`)
    .then(() => {
      console.log("Database connection warmed up successfully");
    })
    .catch((err) => {
      console.warn("Database warmup failed (will retry on first request):", err.message);
    });
}

export const db = drizzle(client, { schema });
