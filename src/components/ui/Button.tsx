import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import SmoothLink from "./SmoothLink";
export default function Button({ href, children, variant = "solid", className = "" }: { href: string; children: ReactNode; variant?: "solid" | "line"; className?: string }) {
  const base = "group inline-flex min-h-11 items-center gap-3 px-6 py-3.5 text-xs uppercase tracking-[0.2em] transition-colors duration-300";
  const v = variant === "solid" ? "bg-espresso text-soft hover:bg-coffee" : "border border-current/40 hover:border-current";
  return (
    <SmoothLink href={href} className={`${base} ${v} ${className}`}>
      {children}
      <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </SmoothLink>
  );
}
