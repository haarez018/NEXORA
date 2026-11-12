import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { scriptDatabase } from "./database";
const db=scriptDatabase();
async function main(){
 const input=z.object({PROVISION_EMAIL:z.email(),PROVISION_NAME:z.string().min(2).max(100),PROVISION_PASSWORD:z.string().min(12).max(128),PROVISION_ROLE:z.enum(["BUYER","SUPPLIER","ORG_ADMIN"]),PROVISION_ORG_SLUG:z.string().regex(/^[a-z0-9-]{3,60}$/),PROVISION_ORG_NAME:z.string().min(2).max(100)}).safeParse(process.env);
 if(!input.success)throw new Error("Set valid PROVISION_EMAIL, PROVISION_NAME, PROVISION_PASSWORD, PROVISION_ROLE, PROVISION_ORG_SLUG and PROVISION_ORG_NAME. No credentials are printed.");
 const p=input.data;const userId=randomUUID();const password=await hashPassword(p.PROVISION_PASSWORD);
 await db.$transaction(async tx=>{
  const organization=await tx.organization.upsert({where:{slug:p.PROVISION_ORG_SLUG},create:{name:p.PROVISION_ORG_NAME,slug:p.PROVISION_ORG_SLUG},update:{}});
  if(organization.isDemo)throw new Error("Do not provision login accounts into the public fixture organization.");
  await tx.user.create({data:{id:userId,email:p.PROVISION_EMAIL.toLowerCase(),name:p.PROVISION_NAME}});
  await tx.account.create({data:{id:randomUUID(),userId,providerId:"credential",accountId:userId,password}});
  await tx.organizationMembership.create({data:{organizationId:organization.id,userId,role:p.PROVISION_ROLE}});
  await tx.auditEvent.create({data:{organizationId:organization.id,actorId:null,action:"USER_PROVISIONED_BY_OPERATOR",targetType:"User",targetId:userId,requestId:randomUUID(),metadata:{role:p.PROVISION_ROLE,source:"trusted-local-cli"}}});
 });
 console.info("Account and membership created. Credentials were not logged. Existing emails are never overwritten.");
}
main().catch(()=>{console.error("Provisioning failed. Check required environment values, unique email, migrations and database connectivity. No existing account was overwritten.");process.exitCode=1;}).finally(()=>db.$disconnect());
