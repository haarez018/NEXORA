import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
export const metadata: Metadata = { title: { default: "NEXORA · Command Center", template: "%s · NEXORA" }, description: "Autonomous Commerce Intelligence. Negotiate. Verify. Transact. Phase 1 foundation with an explicitly synthetic demonstration." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body><AppShell>{children}</AppShell></body></html>;
}
