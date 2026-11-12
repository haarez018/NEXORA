import type { ReactNode } from "react";
import clsx from "clsx";
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "cyan" | "emerald" | "amber" | "violet" }) {
  return <span className={clsx("badge", "badge-" + tone)}>{children}</span>;
}
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={clsx("panel", className)}>{children}</section>;
}
export function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p className="muted">{description}</p>}</div>{action}</div>;
}
