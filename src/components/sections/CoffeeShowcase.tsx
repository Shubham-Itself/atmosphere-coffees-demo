"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { moods } from "@/lib/moods";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Button from "@/components/ui/Button";

const ShowcaseScene = dynamic(() => import("@/components/three/ShowcaseScene"), { ssr: false });

/** Sticky stage: scroll (or buttons) moves the five coffees through the spotlight. */
export default function CoffeeShowcase() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [gl, setGl] = useState(true);
  const m = moods[active];

  useEffect(() => {
    try { const c = document.createElement("canvas"); setGl(!!(c.getContext("webgl2") || c.getContext("webgl"))); } catch { setGl(false); }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(root.current!); return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const st = ScrollTrigger.create({ trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: (s) => { const v = s.progress * (moods.length - 1); target.current = v; setActive(Math.round(v)); } });
    return () => st.kill();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !copy.current) return;
    const tw = gsap.fromTo(copy.current.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
    return () => { tw.kill(); };
  }, [active, reduced]);

  const go = (i: number) => {
    if (reduced) { target.current = i; setActive(i); return; }
    const el = root.current!; const y = el.offsetTop + (i / (moods.length - 1)) * (el.offsetHeight - window.innerHeight);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.4 }); else window.scrollTo(0, y);
  };

  return (
    <section id="collection" ref={root} aria-labelledby="collection-h" className={reduced ? "" : "h-[500svh]"}>
      <div className={`${reduced ? "" : "sticky top-0"} relative h-[100svh] overflow-hidden transition-colors duration-700`} style={{ background: m.bg, color: m.fg }}>
        <div className="absolute inset-0" aria-hidden={!gl}>
          {gl && <ShowcaseScene target={target} reduced={reduced} visible={visible} />}
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-[6vw] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24">
          <div>
            <p className="label opacity-70">The Collection — {m.index} / 05</p>
            <h2 id="collection-h" className="sr-only">The Atmosphere Coffees collection: five coffees for five moods</h2>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div ref={copy} className="pointer-events-auto max-w-md">
              <p className="display text-[clamp(3.5rem,10vw,9rem)]" style={{ color: m.accent }} aria-live="polite">{m.name}</p>
              <p className="mt-3 text-xl">{m.headline}</p>
              <p className="mt-2 text-sm opacity-80">{m.description}</p>
              <Button href="/#discover" variant="line" className="mt-5">{m.cta}</Button>
              <p className="label mt-4 opacity-50">Concept packaging. Details to be announced.</p>
            </div>
            <ol className="pointer-events-auto flex gap-1 md:flex-col md:items-end md:gap-2" aria-label="Choose a coffee">
              {moods.map((x, i) => (
                <li key={x.id}>
                  <button type="button" onClick={() => go(i)} aria-current={i === active ? "true" : undefined}
                    className="label flex min-h-11 items-center gap-3 px-2 py-2 opacity-60 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100">
                    <span className="hidden md:inline">{x.name}</span><span>{x.index}</span>
                    <span aria-hidden className="h-px w-6 transition-all duration-500 md:w-10" style={{ background: x.accent, transform: i === active ? "scaleX(1.6)" : "scaleX(0.5)" }} />
                  </button>
                </li>))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
