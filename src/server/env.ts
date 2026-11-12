import "server-only";
import { parseEnvironment } from "./config-schema";
export function getEnvironment() { return parseEnvironment(process.env); }
export function getOperationalEnvironment() {
  const env = getEnvironment();
  if (env.APP_MODE !== "operational" || !env.DATABASE_URL || !env.AUTH_SESSION_SECRET) throw new Error("Operational services are not configured");
  return { ...env, DATABASE_URL: env.DATABASE_URL, AUTH_SESSION_SECRET: env.AUTH_SESSION_SECRET };
}
