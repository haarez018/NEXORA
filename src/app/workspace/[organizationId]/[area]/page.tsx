import { notFound, redirect } from "next/navigation";
import { requireMembership } from "@/server/authorization";
import { AppError } from "@/server/errors";
import type { Permission } from "@/server/permissions";
import { Panel } from "@/components/ui";
export const dynamic="force-dynamic";
const areas:Record<string,{title:string;permission:Permission}>={buying:{title:"Buyer foundation",permission:"demand:manage"},supplying:{title:"Supplier foundation",permission:"offer:manage"},administration:{title:"Organization administration",permission:"organization:manage"}};
export default async function Area({params}:{params:Promise<{organizationId:string;area:string}>}){
 const {organizationId,area}=await params;const config=areas[area];if(!config)notFound();
 try{await requireMembership(organizationId,config.permission);}catch(error){if(error instanceof AppError&&error.status===401)redirect("/login");if(error instanceof AppError&&error.status===403)return <Panel><h1>Access denied</h1><p>Your current organization role does not permit this area.</p></Panel>;throw error;}
 return <Panel><p className="eyebrow">SERVER-AUTHORIZED AREA</p><h1>{config.title}</h1><p className="page-description">Your active membership permits this area. Editing roles and commerce records is outside Phase 1.</p></Panel>;
}
