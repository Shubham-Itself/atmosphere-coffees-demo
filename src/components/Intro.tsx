"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";

const letters = (w: string) => w.split("").map((c, i) => <span key={i} data-ch aria-hidden className="inline-block">{c}</span>);

/** Short (~2.4s), skippable opening. Shown once per session; skipped for reduced motion. */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current!;
    let seen = false;
    try { seen = sessionStorage.getItem("ac-intro") === "1"; } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.display = "none"; finishIntro(); return; }
    const html = document.documentElement; const prev = html.style.overflow; html.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ onComplete: () => { el.style.display = "none"; try { sessionStorage.setItem("ac-intro", "1"); } catch {} finishIntro(); } });
      t.fromTo("[data-ring]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0)
       .to("[data-orbit]", { rotation: 360, svgOrigin: "100 100", duration: 3, ease: "none" }, 0)
       .from("[data-ch]", { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.035 }, 0.2)
       .from("[data-tag]", { opacity: 0, y: 10, duration: 0.6 }, 0.9)
       .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, 1.7);
      tl.current = t;
    }, el);
    return () => { ctx.revert(); html.style.overflow = prev; };
  }, []);

  useEffect(() => () => { document.documentElement.style.overflow = ""; }, []);
  const done = () => { if (tl.current) { tl.current.timeScale(5); } };

  return (<>
    <noscript><style>{".intro{display:none!important}"}</style></noscript>
    <div ref={root} className="intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream text-espresso">
      <svg aria-hidden viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.4" className="absolute w-[min(80vw,560px)] opacity-60">
        <circle data-ring cx="100" cy="100" r="92" pathLength={1} strokeDasharray="1" />
        <circle data-ring cx="100" cy="100" r="62" pathLength={1} strokeDasharray="1" />
        <g data-orbit><circle cx="100" cy="8" r="2.4" fill="#B5620A" stroke="none" /></g>
      </svg>
      <p className="display relative text-center text-[clamp(2.5rem,10vw,6.5rem)]" aria-label="Atmosphere Coffees">
        <span className="line-mask">{letters("Atmosphere")}</span>
        <span className="line-mask italic text-caramel">{letters("Coffees")}</span>
      </p>
      <p data-tag className="label relative mt-6 opacity-70">Coffee for every mood.</p>
      <button type="button" onClick={done} className="label absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[6vw] min-h-11 px-3 opacity-60 hover:opacity-100">Skip</button>
    </div>
  </>);
}
