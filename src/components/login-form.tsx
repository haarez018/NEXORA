"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "better-auth/react";
import { ArrowRight, LockKeyhole } from "lucide-react";
const client = createAuthClient();
export function LoginForm({ configured }: { configured: boolean }) {
 const router=useRouter();
 const [message,setMessage]=useState("");const [pending,setPending]=useState(false);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setPending(true);setMessage("");
  const form=new FormData(event.currentTarget);
  try{
   const result=await client.signIn.email({email:String(form.get("email")),password:String(form.get("password"))});
   if(result.error)setMessage("Unable to sign in. Check your credentials and service availability.");
   else { router.push("/workspace"); router.refresh(); }
  }catch{setMessage("Authentication service is unavailable. Please try again.");}
  finally{setPending(false);}
 }
 return <form onSubmit={submit} className="login-form"><label>Email address<input type="email" name="email" autoComplete="username" required disabled={!configured||pending}/></label><label>Password<input type="password" name="password" autoComplete="current-password" minLength={12} maxLength={128} required disabled={!configured||pending}/></label><button className="button button-primary" disabled={!configured||pending}><LockKeyhole size={16}/>{pending?"Signing in…":"Sign in securely"}<ArrowRight size={15}/></button><p role="status" className="form-message">{message||(!configured?"Authentication is not configured. Set operational environment values and connect PostgreSQL.":"Use an account provisioned by your workspace operator. Public registration is disabled.")}</p></form>;
}
export function SignOutButton(){const router=useRouter();const [error,setError]=useState("");return <><button className="button" onClick={async()=>{try{const result=await client.signOut();if(result.error)setError("Unable to sign out. Please retry.");else {router.push("/login");router.refresh();}}catch{setError("Unable to sign out. Please retry.");}}}>Sign out</button>{error&&<p role="alert">{error}</p>}</>;}
