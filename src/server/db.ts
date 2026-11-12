import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getOperationalEnvironment } from "./env";
const globalDb = globalThis as unknown as { nexoraDb?: PrismaClient };
export function getDb() {
  if (!globalDb.nexoraDb) globalDb.nexoraDb = new PrismaClient({ adapter: new PrismaPg({ connectionString: getOperationalEnvironment().DATABASE_URL, connectionTimeoutMillis: 3000, max: 10 }) });
  return globalDb.nexoraDb;
}
