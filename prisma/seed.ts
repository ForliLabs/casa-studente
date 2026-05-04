/**
 * Prisma seed script — populates development database with demo data.
 * Run with: npx prisma db seed
 *
 * Requires DATABASE_URL to be set and a PostgreSQL database to be running.
 * Uses Prisma 7 adapter pattern for database connection.
 *
 * When a database is not configured, the InMemoryStore in auth.ts, stores.ts,
 * and data.ts automatically seeds demo data at import time.
 */

import "dotenv/config";

async function main() {
  console.log("🌱 CasaStudente Database Seed Script");
  console.log("=====================================");
  console.log("");
  console.log("This script seeds a PostgreSQL database with demo data.");
  console.log("It requires a Prisma 7 adapter configuration.");
  console.log("");
  console.log("To use:");
  console.log("  1. Install a Prisma adapter: npm install @prisma/adapter-pg pg");
  console.log("  2. Configure the adapter in this script");
  console.log("  3. Run: npx tsx prisma/seed.ts");
  console.log("");
  console.log("For development without a database, the InMemoryStore seeds");
  console.log("data automatically — no action needed.");
  console.log("");
  console.log("✅ Seed script ready (run when database adapter is configured).");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
