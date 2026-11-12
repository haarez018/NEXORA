import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/server/authorization";
import { getDb } from "@/server/db";
import { getEnvironment } from "@/server/env";
import { AppError } from "@/server/errors";
import { Panel, Badge } from "@/components/ui";
import { SignOutButton } from "@/components/login-form";
export const dynamic="force-dynamic";
export default async function Workspace(){
 if(getEnvironment().APP_MODE!=="operational")redirect("/login");
 let session;try{session=await requireSession();}catch(error){if(error instanceof AppError&&error.status===401)redirect("/login");throw error;}
 const memberships=await getDb().organizationMembership.findMany({where:{userId:session.user.id,status:"ACTIVE"},include:{organization:true}});
 return <><div className="page-heading"><div><p className="eyebrow">AUTHENTICATED WORKSPACE</p><h1>Welcome, {session.user.name}.</h1><p className="page-description">Only active database memberships appear here.</p></div><SignOutButton/></div><div className="module-summary-grid">{memberships.map(m=><Panel key={m.id}><Badge tone="cyan">{m.role}</Badge><h2>{m.organization.name}</h2><p className="muted">{m.organization.isDemo?"Seeded demonstration organization":"Operational organization · no commerce execution yet"}</p><Link className="button" href={"/workspace/"+m.organizationId}>Open organization</Link></Panel>)}</div>{!memberships.length&&<Panel><h2>No active organization membership</h2><p className="muted">Ask the workspace operator to provision membership. Sign-in alone grants no organization access.</p></Panel>}</>;
}
