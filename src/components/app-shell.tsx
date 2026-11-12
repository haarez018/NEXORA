"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, ArrowUpRight, Boxes, ChevronDown, Command, CreditCard, FlaskConical, Hexagon, LayoutDashboard, Menu, Network, PanelLeftClose, ShieldCheck, Sparkles, Store, FileCheck2, Settings2, X } from "lucide-react";
import { navigation } from "@/lib/navigation";
import { Badge } from "./ui";
const icons = { dashboard: LayoutDashboard, market: Store, coalitions: Network, negotiations: Sparkles, agreements: FileCheck2, risk: ShieldCheck, payments: CreditCard, simulations: FlaskConical, settings: Settings2 };
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = navigation.find(item => item.href === pathname);
  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Skip to content</a>
    {open && <button aria-label="Close navigation overlay" className="sidebar-overlay" onClick={() => setOpen(false)} />}
    <aside className={"sidebar " + (open ? "sidebar-open" : "")}>
      <Link href="/" className="brand" aria-label="NEXORA home"><span className="brand-symbol"><Hexagon size={29}/><span/></span><span>NEXORA<small>COMMERCE INTELLIGENCE</small></span></Link>
      <div className="workspace-switch"><span className="workspace-icon"><Boxes size={18}/></span><span>Nexora Workspace<small>Public demonstration</small></span><ChevronDown size={14}/></div>
      <nav aria-label="Main navigation">{navigation.map((item, index) => {
        const heading = index === 0 || item.group !== navigation[index - 1].group;
        const Icon = icons[item.icon];
        return <div key={item.href}>{heading && <p className="nav-group">{item.group}</p>}<Link className={"nav-link " + (pathname === item.href ? "active" : "")} href={item.href} aria-label={item.label} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={18}/><span>{item.label}</span>{item.href === "/risk" && <span className="nav-count">1</span>}{item.href === "/" && <span className="active-dot"/>}</Link></div>;
      })}</nav>
      <div className="sidebar-bottom"><div className="sandbox-card"><span className="tiny-dot"/><strong>Safe by design</strong><p>Payment & AI execution disabled.<br/>Explore synthetic scenarios.</p><Link href="/settings">Environment details <ArrowUpRight size={14}/></Link></div>
      <Link href="/login" className="profile"><span className="avatar">NX</span><span>Demo explorer<small>Sign in to your workspace</small></span><ArrowUpRight size={16}/></Link></div>
    </aside>
    <div className="main-shell"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={19}/> : <Menu size={19}/>}</button><PanelLeftClose size={17} className="desktop-only"/><span className="desktop-only">Workspace</span><span className="crumb-divider">/</span><strong>{current?.label ?? "Secure workspace"}</strong></div><div className="topbar-right"><Badge tone="amber">DEMO ENVIRONMENT</Badge><Link href="/login" className="topbar-signin">Sign in <ArrowUpRight size={14}/></Link><span className="header-mark"><Command size={15}/></span></div></header>
    <main id="main-content">{children}</main><footer><span><Activity size={12}/> NEXORA FOUNDATION · PHASE 1</span><span>Negotiate. Verify. Transact.</span></footer></div>
  </div>;
}
