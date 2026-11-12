import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModulePage } from "@/components/module-page";
import { navigation, type ModuleSlug } from "@/lib/navigation";
export function generateStaticParams() { return navigation.filter(n=>n.href!=="/").map(n=>({module:n.href.slice(1)})); }
export async function generateMetadata({params}:{params:Promise<{module:string}>}):Promise<Metadata>{
 const {module}=await params;return {title:navigation.find(n=>n.href==="/"+module)?.label??"Not found"};
}
export default async function Page({params}:{params:Promise<{module:string}>}) {
 const {module}=await params;
 if(!navigation.some(n=>n.href==="/"+module))notFound();
 return <ModulePage slug={module as ModuleSlug}/>;
}
