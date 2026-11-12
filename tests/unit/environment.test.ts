import { describe,it,expect } from "vitest";
import { parseEnvironment } from "@/server/config-schema";
describe("server environment",()=>{
 it("supports explicit no-service demo defaults",()=>{expect(parseEnvironment({})).toMatchObject({APP_MODE:"demo",AI_PROVIDER:"disabled",PAYMENTS_MODE:"disabled"});});
 it("requires database and a long secret for operational mode",()=>{expect(()=>parseEnvironment({APP_MODE:"operational"})).toThrow("DATABASE_URL");expect(()=>parseEnvironment({APP_MODE:"operational",DATABASE_URL:"postgresql://local/db",AUTH_SESSION_SECRET:"short"})).toThrow("AUTH_SESSION_SECRET");});
 it("accepts complete local operational configuration",()=>{expect(parseEnvironment({APP_MODE:"operational",DATABASE_URL:"postgresql://local/db",AUTH_SESSION_SECRET:"x".repeat(40)}).APP_MODE).toBe("operational");});
 it("rejects payment and AI activation during Phase 1",()=>{for(const PAYMENTS_MODE of ["live","sandbox","simulated"])expect(()=>parseEnvironment({PAYMENTS_MODE})).toThrow();expect(()=>parseEnvironment({AI_PROVIDER:"openai"})).toThrow();});
 it("does not leak configuration values in errors",()=>{expect(()=>parseEnvironment({DATABASE_URL:"secret-sensitive-invalid-url"})).toThrow(/^Invalid server configuration: DATABASE_URL$/);});
 it("redacts malformed origin values",()=>{expect(()=>parseEnvironment({APP_BASE_URL:"sensitive-invalid-origin"})).toThrow(/^Invalid server configuration: APP_BASE_URL/);});
 it("requires a trusted bare origin and HTTPS remotely",()=>{expect(()=>parseEnvironment({APP_BASE_URL:"https://example.com/untrusted"})).toThrow();expect(()=>parseEnvironment({APP_MODE:"operational",NODE_ENV:"production",APP_BASE_URL:"http://example.com",DATABASE_URL:"postgresql://local/db",AUTH_SESSION_SECRET:"x".repeat(40)})).toThrow();});
});
