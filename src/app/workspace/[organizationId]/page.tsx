import Link from "next/link";
import { redirect } from "next/navigation";
import { requireMembership } from "@/server/authorization";
import { AppError } from "@/server/errors";
import { Panel, Badge } from "@/components/ui";
import { hasPermission } from "@/server/permissions";
export const dynamic="force-dynamic";
export default async function OrganizationPage({params}:{params:Promise<{organizationId:string}>}){
 const {organizationId}=await params;
 let access;
 try{access=await requireMembership(organizationId,"workspace:read");}catch(error){if(error instanceof AppError&&error.status===401)redirect("/login");if(error instanceof AppError&&error.status===403)return <Panel><h1>Access denied</h1><p>No active membership for this organization.</p></Panel>;throw error;}
 const {membership}=access;
 return <><div className="page-heading"><div><p className="eyebrow">PROTECTED ORGANIZATION</p><h1>{membership.organization.name}</h1><p className="page-description">Identity and membership verified against PostgreSQL.</p></div><Badge tone="cyan">{membership.role}</Badge></div><Panel><h2>Your authorized areas</h2><p className="muted">Phase 1 enforces access. Commerce workflows remain planned.</p><div className="workspace-actions">{[{permission:"demand:manage" as const,slug:"buying",name:"Buyer foundation"},{permission:"offer:manage" as const,slug:"supplying",name:"Supplier foundation"},{permission:"organization:manage" as const,slug:"administration",name:"Organization administration"}].filter(a=>hasPermission(membership.role,a.permission)).map(a=><Link className="button" key={a.slug} href={"/workspace/"+organizationId+"/"+a.slug}>{a.name}</Link>)}</div></Panel></>;
}
