"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { lenisRef } from "@/lib/lenis";
import SmoothLink from "@/components/ui/SmoothLink";

const links = [{ href: "/moods", label: "The Moods" }, { href: "/ritual", label: "The Ritual" }, { href: "/about", label: "About" }, { href: "/about#faq", label: "FAQ" }];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement; const prev = html.style.overflow;
    html.style.overflow = "hidden"; lenisRef.current?.stop();
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); return; }
      if (e.key !== "Tab") return;
      const f = [btn.current, ...Array.from(menu.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey); mq.addEventListener("change", onMq);
    return () => { html.style.overflow = prev; lenisRef.current?.start(); window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open]);

  const all = [...links, { href: "#taster", label: "Book a Free Taster" }];
  return (<>
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${open || scrolled ? "border-b border-espresso/10 bg-soft/90 backdrop-blur" : "border-b border-transparent"}`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <nav aria-label="Primary" className="flex h-16 items-center justify-between px-[6vw] text-espresso">
        <SmoothLink href="/" onNavigate={close} className="display text-xl">Atmosphere<em className="font-light"> Coffees</em></SmoothLink>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => <li key={l.href}><SmoothLink className="label transition-colors hover:text-caramel" href={l.href}>{l.label}</SmoothLink></li>)}
          <li><SmoothLink className="label border-b border-current pb-1" href="#taster">Free Taster</SmoothLink></li>
        </ul>
        <button ref={btn} type="button" className="relative -mr-3 h-11 w-11 md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className={`absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
          <span aria-hidden className={`absolute left-1/2 top-1/2 block h-px w-6 -translate-x-1/2 bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
        </button>
      </nav>
    </header>
    <div id="mobile-menu" ref={menu} inert={!open} aria-hidden={!open}
      className={`fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto bg-soft px-[6vw] text-espresso transition-[opacity,visibility] duration-300 md:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 5.5rem)", paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <ul className="flex flex-1 flex-col justify-center gap-2">
        {all.map((l, i) => (
          <li key={l.href} className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}>
            <SmoothLink href={l.href} onNavigate={close} className="display block py-2 text-[clamp(2rem,9vw,3.25rem)]">{l.label}</SmoothLink>
          </li>))}
      </ul>
      <p className="label mt-8 text-caramel">Coffee for every mood.</p>
    </div>
  </>);
}
