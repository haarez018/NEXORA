export const navigation = [
  { href: "/", label: "Command Center", icon: "dashboard", group: "OVERVIEW" },
  { href: "/marketplace", label: "Marketplace", icon: "market", group: "NEXORA CORE" },
  { href: "/coalitions", label: "Buyer Coalitions", icon: "coalitions", group: "NEXORA CORE" },
  { href: "/negotiations", label: "AI Negotiations", icon: "negotiations", group: "NEXORA CORE" },
  { href: "/agreements", label: "Agreements", icon: "agreements", group: "PROOFRAIL" },
  { href: "/risk", label: "Risk Intelligence", icon: "risk", group: "AEGIS" },
  { href: "/payments", label: "Payments", icon: "payments", group: "PROOFRAIL" },
  { href: "/simulations", label: "Simulations", icon: "simulations", group: "WORKSPACE" },
  { href: "/settings", label: "Settings", icon: "settings", group: "WORKSPACE" },
] as const;
export type ModuleSlug = "marketplace" | "coalitions" | "negotiations" | "agreements" | "risk" | "payments" | "simulations" | "settings";
