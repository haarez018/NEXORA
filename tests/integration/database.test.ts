import { afterAll,describe,it,expect } from "vitest";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
config({path:".env.local",quiet:true});
const url=process.env.TEST_DATABASE_URL;
const db=url?new PrismaClient({adapter:new PrismaPg({connectionString:url,connectionTimeoutMillis:3000})}):null;
const rollback = new Error("ROLLBACK_TEST_ONLY");
afterAll(async()=>{await db?.$disconnect();});
describe.skipIf(!db)("PostgreSQL constraints (requires migrated TEST_DATABASE_URL)",()=>{
 it("enforces integer money positivity at the database boundary",async()=>{
  await expect(db!.$transaction(async tx=>{
   const organization=await tx.organization.create({data:{name:"Test",slug:"test-"+randomUUID()}});
   const buyer=await tx.user.create({data:{name:"Test",email:randomUUID()+"@test.invalid"}});
   await expect(tx.buyerDemand.create({data:{organizationId:organization.id,buyerId:buyer.id,title:"Invalid negative budget",specification:{},destination:"Test",quantity:1,maxTotalMinor:-1n,currency:"USD",deadline:new Date()}})).rejects.toThrow();
   throw rollback;
  })).rejects.toThrow(rollback);
 });
 it("rejects cross-organization supplier relations",async()=>{
  await expect(db!.$transaction(async tx=>{
   const a=await tx.organization.create({data:{name:"A",slug:"test-"+randomUUID()}});
   const b=await tx.organization.create({data:{name:"B",slug:"test-"+randomUUID()}});
   const owner=await tx.user.create({data:{name:"Owner",email:randomUUID()+"@test.invalid"}});
   const supplier=await tx.supplier.create({data:{organizationId:a.id,ownerId:owner.id,name:"Test supplier",category:"Test"}});
   await expect(tx.supplierOffer.create({data:{organizationId:b.id,supplierId:supplier.id,title:"Invalid relation",capacity:1,unitPriceMinor:100n,currency:"USD",expiresAt:new Date()}})).rejects.toThrow();
   throw rollback;
  })).rejects.toThrow(rollback);
 });
 it("enforces unique organization membership",async()=>{
  await expect(db!.$transaction(async tx=>{
   const org=await tx.organization.create({data:{name:"Test",slug:"test-"+randomUUID()}});
   const user=await tx.user.create({data:{name:"Test",email:randomUUID()+"@test.invalid"}});
   await tx.organizationMembership.create({data:{organizationId:org.id,userId:user.id,role:"BUYER"}});
   await expect(tx.organizationMembership.create({data:{organizationId:org.id,userId:user.id,role:"ORG_ADMIN"}})).rejects.toThrow();
   throw rollback;
  })).rejects.toThrow(rollback);
 });
});
