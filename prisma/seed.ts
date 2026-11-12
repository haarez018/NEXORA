import { scriptDatabase } from "../scripts/database";
import { DEMO_ORG_ID, demoSuppliers, demoOffers, demoCoalitions, demoAgreements, demoActivity } from "../src/modules/core/demo-data";
const db=scriptDatabase();
async function main(){
 const url=new URL(process.env.DATABASE_URL!);
 if(!["localhost","127.0.0.1","postgres"].includes(url.hostname))throw new Error("Demo seeding is restricted to a local development database.");
 await db.$transaction(async tx=>{
  await tx.organization.upsert({where:{id:DEMO_ORG_ID},create:{id:DEMO_ORG_ID,name:"NEXORA Demonstration",slug:"nexora-demonstration",isDemo:true},update:{}});
  const org=await tx.organization.findUniqueOrThrow({where:{id:DEMO_ORG_ID}});
  if(!org.isDemo)throw new Error("Refusing to seed a non-demo organization.");
  for(let i=1;i<=3;i++){
   const buyerId="demo-buyer-"+i;
   await tx.user.upsert({where:{id:buyerId},create:{id:buyerId,name:["Alex Morgan","Sam Rivera","Taylor Chen"][i-1],email:"buyer"+i+"@fixtures.nexora.invalid"},update:{}});
   await tx.organizationMembership.upsert({where:{organizationId_userId:{organizationId:DEMO_ORG_ID,userId:buyerId}},create:{organizationId:DEMO_ORG_ID,userId:buyerId,role:"BUYER"},update:{}});
   const offer=demoOffers[i-1];
   await tx.buyerDemand.upsert({where:{id:"demo-demand-"+i},create:{id:"demo-demand-"+i,organizationId:DEMO_ORG_ID,buyerId,title:offer.title,specification:{source:"synthetic-fixture-v1"},destination:"Demo distribution center",quantity:[60,40,100][i-1],maxTotalMinor:BigInt(demoAgreements[i-1].totalMinor),currency:"USD",deadline:new Date(offer.deadline),status:"ACTIVE"},update:{}});
  }
  for(const [i,s] of demoSuppliers.entries()){
   const ownerId="demo-supplier-user-"+(i+1);
   await tx.user.upsert({where:{id:ownerId},create:{id:ownerId,name:s.name+" representative",email:"supplier"+(i+1)+"@fixtures.nexora.invalid"},update:{}});
   await tx.organizationMembership.upsert({where:{organizationId_userId:{organizationId:DEMO_ORG_ID,userId:ownerId}},create:{organizationId:DEMO_ORG_ID,userId:ownerId,role:"SUPPLIER"},update:{}});
   await tx.supplier.upsert({where:{id:s.id},create:{id:s.id,organizationId:DEMO_ORG_ID,ownerId,name:s.name,category:s.category,status:"ACTIVE"},update:{}});
   const o=demoOffers[i];
   await tx.supplierOffer.upsert({where:{id:o.id},create:{id:o.id,organizationId:DEMO_ORG_ID,supplierId:s.id,title:o.title,capacity:o.quantity,unitPriceMinor:BigInt(o.unitPriceMinor),currency:"USD",expiresAt:new Date(o.deadline),status:"ACTIVE"},update:{}});
   const c=demoCoalitions[i];
   await tx.coalition.upsert({where:{id:c.id},create:{id:c.id,organizationId:DEMO_ORG_ID,name:c.name,currency:"USD",status:c.status==="Active"?"ACTIVE":"DRAFT"},update:{}});
   for(let n=0;n<c.buyers;n++){
    const demandId="demo-demand-"+(n+1);
    // Memberships are invitations; no synthetic buyer consent is implied.
    await tx.coalitionMembership.upsert({where:{coalitionId_demandId:{coalitionId:c.id,demandId}},create:{organizationId:DEMO_ORG_ID,coalitionId:c.id,demandId,demandVersion:1,status:"INVITED"},update:{}});
   }
   await tx.negotiation.upsert({where:{id:"demo-negotiation-"+i},create:{id:"demo-negotiation-"+i,organizationId:DEMO_ORG_ID,coalitionId:c.id,status:"DRAFT",round:i+1,maxRounds:5,expiresAt:new Date(o.deadline)},update:{}});
   const a=demoAgreements[i];
   await tx.agreement.upsert({where:{id:a.id},create:{id:a.id,organizationId:DEMO_ORG_ID,supplierId:s.id,negotiationId:"demo-negotiation-"+i,title:a.title,terms:{source:"synthetic-fixture-v1",binding:false},totalMinor:BigInt(a.totalMinor),currency:"USD",status:a.status},update:{}});
   const milestoneId="demo-milestone-"+i;
   await tx.milestone.upsert({where:{id:milestoneId},create:{id:milestoneId,organizationId:DEMO_ORG_ID,agreementId:a.id,title:"Delivery evidence review",sequence:1,rubric:{required:["delivery_receipt","quantity_match"],source:"fixture"},dueAt:new Date(o.deadline)},update:{}});
   await tx.payment.upsert({where:{id:"demo-payment-"+i},create:{id:"demo-payment-"+i,organizationId:DEMO_ORG_ID,agreementId:a.id,buyerId:"demo-buyer-"+(i+1),supplierId:s.id,agreementVersion:1,amountMinor:BigInt(a.totalMinor),currency:"USD",mode:"SIMULATED",status:"CREATED"},update:{}});
   if(i===1)await tx.riskSignal.upsert({where:{id:"demo-risk-1"},create:{id:"demo-risk-1",organizationId:DEMO_ORG_ID,supplierId:s.id,code:"SYNTHETIC_BANK_CHANGE",severity:"MEDIUM",explanation:s.detail,source:"synthetic-fixture-v1",observedAt:new Date("2026-11-12T04:54:00Z")},update:{}});
   await tx.simulation.upsert({where:{id:"demo-simulation-"+i},create:{id:"demo-simulation-"+i,organizationId:DEMO_ORG_ID,name:["Coordinated workspace","Supplier relationship anomaly","Delayed fulfillment"][i],seed:4201+i,status:"DRAFT",configuration:{source:"synthetic-fixture-v1",executable:false}},update:{}});
  }
  for(const [i,a]of demoActivity.entries())await tx.auditEvent.upsert({where:{id:"demo-event-"+i},create:{id:"demo-event-"+i,organizationId:DEMO_ORG_ID,action:"SYNTHETIC_FIXTURE_EVENT",targetType:"Demo",targetId:DEMO_ORG_ID,requestId:"fixture-v1-"+i,metadata:{title:a.title,detail:a.detail,synthetic:true},createdAt:new Date("2026-11-12T"+a.time+":00+05:30")},update:{}});
 });
 console.info("Idempotent synthetic seed complete. No passwords, sessions, evidence claims, disputes or provider outcomes were created.");
}
main().catch(()=>{console.error("Seed failed. Check local DATABASE_URL and applied migrations. Transaction rolled back; no credentials logged.");process.exitCode=1;}).finally(()=>db.$disconnect());
