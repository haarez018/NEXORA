import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getDb } from "./db";
import { getOperationalEnvironment } from "./env";
function createAuth() {
  const env = getOperationalEnvironment();
  return betterAuth({
    appName: "NEXORA", baseURL: env.APP_BASE_URL, secret: env.AUTH_SESSION_SECRET,
    database: prismaAdapter(getDb(), { provider: "postgresql" }),
    trustedOrigins: [new URL(env.APP_BASE_URL).origin],
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
    session: { expiresIn: 60 * 60 * 24, updateAge: 60 * 60, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 30, customRules: { "/sign-in/email": { window: 60, max: 5 } } },
    advanced: { useSecureCookies: env.APP_BASE_URL.startsWith("https://") },
    telemetry: { enabled: false },
    logger: { disabled: true },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return instance ??= createAuth(); }
