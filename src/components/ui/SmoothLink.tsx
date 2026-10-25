"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { lenisRef } from "@/lib/lenis";

/** Link that smooth-scrolls to on-page anchors through the single Lenis instance. */
export default function SmoothLink({ href, children, className, onNavigate }: { href: string; children: ReactNode; className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (pathname !== "/") return;
    const top = href === "/";
    const el = href.startsWith("/#") ? document.getElementById(href.slice(2)) : null;
    if (!top && !el) return;
    e.preventDefault();
    setTimeout(() => {
      const target = top ? 0 : el!;
      if (lenisRef.current) lenisRef.current.scrollTo(target as number, { duration: 1.4 });
      else if (top) window.scrollTo(0, 0); else el!.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", top ? "/" : href.slice(1));
    }, 60);
  };
  return <Link href={href} className={className} onClick={onClick}>{children}</Link>;
}
