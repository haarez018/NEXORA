import { getEnvironment } from "@/server/env";
import { LoginForm } from "@/components/login-form";
import { Badge, Panel } from "@/components/ui";
export const dynamic="force-dynamic";
export default function Login(){let configured=false;try{const env=getEnvironment();configured=env.APP_MODE==="operational"&&!!env.DATABASE_URL&&!!env.AUTH_SESSION_SECRET;}catch{}
 return <div className="login-layout"><div><p className="eyebrow">THE SECURE WORKSPACE</p><h1>Trust is the<br/>foundation.</h1><p className="page-description">Identity, organization membership, and explicit authority.<br/>Every action starts with the right permissions.</p><Badge tone="cyan">DATABASE-BACKED SESSIONS</Badge></div><Panel className="login-panel"><h2>Welcome to NEXORA</h2><p className="muted">Sign in to access your organization.</p><LoginForm configured={configured}/></Panel></div>;
}
