import { beforeEach,describe,it,expect,vi } from "vitest";
const mocks=vi.hoisted(()=>({session:vi.fn(),membership:vi.fn()}));
vi.mock("next/headers",()=>({headers:async()=>new Headers({"x-role":"ORG_ADMIN"})}));
vi.mock("@/server/auth",()=>({getAuth:()=>({api:{getSession:mocks.session}})}));
vi.mock("@/server/db",()=>({getDb:()=>({organizationMembership:{findUnique:mocks.membership}})}));
import { requireMembership } from "@/server/authorization";
describe("server session and membership boundary",()=>{
 beforeEach(()=>{vi.clearAllMocks();mocks.session.mockResolvedValue({user:{id:"user-1"}});});
 it("rejects missing authenticated session before querying membership",async()=>{mocks.session.mockResolvedValue(null);await expect(requireMembership("org","workspace:read")).rejects.toMatchObject({status:401});expect(mocks.membership).not.toHaveBeenCalled();});
 it("ignores forged role headers",async()=>{mocks.membership.mockResolvedValue({userId:"user-1",organizationId:"org",role:"BUYER",status:"ACTIVE"});await expect(requireMembership("org","organization:manage")).rejects.toMatchObject({status:403});});
 it("reads the exact user and organization from the database",async()=>{mocks.membership.mockResolvedValue({userId:"user-1",organizationId:"org",role:"SUPPLIER",status:"ACTIVE"});await expect(requireMembership("org","offer:manage")).resolves.toBeDefined();expect(mocks.membership).toHaveBeenCalledWith({where:{organizationId_userId:{organizationId:"org",userId:"user-1"}},include:{organization:true}});});
 it("denies a revoked persisted membership",async()=>{mocks.membership.mockResolvedValue({userId:"user-1",organizationId:"org",role:"ORG_ADMIN",status:"REVOKED"});await expect(requireMembership("org","organization:manage")).rejects.toMatchObject({status:403});});
});
