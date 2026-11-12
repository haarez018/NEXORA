import { describe,it,expect } from "vitest";
import { authorizeMembership,hasPermission } from "@/server/permissions";
const membership={userId:"buyer",organizationId:"org-a",role:"BUYER",status:"ACTIVE"};
describe("organization authorization",()=>{
 it("allows only role-specific permissions",()=>{expect(hasPermission("BUYER","demand:manage")).toBe(true);expect(hasPermission("BUYER","offer:manage")).toBe(false);expect(hasPermission("SUPPLIER","offer:manage")).toBe(true);expect(hasPermission("SUPPLIER","organization:manage")).toBe(false);expect(hasPermission("ORG_ADMIN","organization:manage")).toBe(true);expect(hasPermission("ORG_ADMIN","demand:manage")).toBe(false);});
 it("fails closed for absent or unknown roles",()=>{expect(authorizeMembership(null,"buyer","org-a","workspace:read")).toBe(false);expect(hasPermission("SUPER_ADMIN","organization:manage")).toBe(false);expect(hasPermission("__proto__","workspace:read")).toBe(false);});
 it("rejects cross-organization and different-user access",()=>{expect(authorizeMembership(membership,"buyer","org-b","workspace:read")).toBe(false);expect(authorizeMembership(membership,"attacker","org-a","workspace:read")).toBe(false);});
 it("rejects revoked membership immediately",()=>{expect(authorizeMembership({...membership,status:"REVOKED"},"buyer","org-a","workspace:read")).toBe(false);});
 it("accepts a matching active membership",()=>{expect(authorizeMembership(membership,"buyer","org-a","demand:manage")).toBe(true);});
});
