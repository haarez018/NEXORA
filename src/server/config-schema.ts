import { z } from "zod";
const optional = z.preprocess(v => v === "" ? undefined : v, z.string().optional());
export const environmentSchema = z.object({
  APP_MODE: z.enum(["demo", "operational"]).default("demo"),
  APP_BASE_URL: z.preprocess(v => v === "" ? undefined : v, z.url().default("http://localhost:3000")),
  DATABASE_URL: optional,
  AUTH_SESSION_SECRET: optional,
  PAYMENTS_MODE: z.preprocess(v => v === "" ? undefined : v, z.literal("disabled").default("disabled")),
  AI_PROVIDER: z.preprocess(v => v === "" ? undefined : v, z.literal("disabled").default("disabled")),
  LOG_LEVEL: z.preprocess(v => v === "" ? undefined : v, z.enum(["info", "warn", "error"]).default("info")),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
}).superRefine((env, ctx) => {
  if (env.DATABASE_URL && !/^postgres(ql)?:\/\//.test(env.DATABASE_URL)) ctx.addIssue({ code: "custom", path: ["DATABASE_URL"], message: "PostgreSQL URL required" });
  if (env.APP_MODE === "operational") {
    if (!env.DATABASE_URL) ctx.addIssue({ code: "custom", path: ["DATABASE_URL"], message: "Required in operational mode" });
    if (!env.AUTH_SESSION_SECRET || env.AUTH_SESSION_SECRET.length < 32) ctx.addIssue({ code: "custom", path: ["AUTH_SESSION_SECRET"], message: "At least 32 random characters required" });
    if (env.NODE_ENV === "production" && !env.APP_BASE_URL.startsWith("https://") && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(env.APP_BASE_URL))
      ctx.addIssue({ code: "custom", path: ["APP_BASE_URL"], message: "HTTPS required outside local development" });
  }
  let url: URL;
  try { url = new URL(env.APP_BASE_URL); } catch { ctx.addIssue({ code: "custom", path: ["APP_BASE_URL"], message: "Valid origin required" }); return; }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") ctx.addIssue({ code: "custom", path: ["APP_BASE_URL"], message: "Use a bare trusted origin" });
});
export type Environment = z.infer<typeof environmentSchema>;
export function parseEnvironment(input: Record<string, string | undefined>): Environment {
  const parsed = environmentSchema.safeParse(input);
  if (!parsed.success) throw new Error("Invalid server configuration: " + parsed.error.issues.map(i => i.path.join(".")).join(", "));
  return parsed.data;
}
