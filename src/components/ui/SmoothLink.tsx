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
    const [path, hash] = href.split("#");
    if ((path || pathname) !== pathname) return; // another route: let Next navigate
    const top = !hash;
    const el = hash ? document.getElementById(hash) : null;
    if (!top && !el) return;
    e.preventDefault();
    setTimeout(() => {
      const target = top ? 0 : el!;
      if (lenisRef.current) lenisRef.current.scrollTo(target as number, { duration: 1.4 });
      else if (top) window.scrollTo(0, 0); else el!.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", top ? pathname : `${pathname}#${hash}`);
    }, 60);
  };
  return <Link href={href} className={className} onClick={onClick}>{children}</Link>;
}
