"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { moods } from "@/lib/moods";
import MoodArt from "@/components/ui/MoodArt";
import Button from "@/components/ui/Button";

/** Desktop: pinned horizontal sequence. Mobile/reduced motion: stacked full-screen panels. */
export default function MoodCollection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      gsap.to(el, { x: () => -(el.scrollWidth - window.innerWidth), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 0.6, end: () => `+=${el.scrollWidth - window.innerWidth}`, invalidateOnRefresh: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="moods" ref={root} aria-labelledby="moods-h" className="overflow-hidden bg-soft text-espresso">
      <div ref={track} className="flex flex-col lg:w-max lg:flex-row">
        <header className="flex min-h-[80svh] flex-col justify-center gap-6 px-[6vw] py-24 lg:h-screen lg:w-[70vw]">
          <p className="label text-caramel">02 — The five moods</p>
          <h2 id="moods-h" className="display text-[clamp(3rem,9vw,9rem)]">Find your <em className="text-caramel">atmosphere.</em></h2>
          <p className="max-w-sm text-lg opacity-70">Five moods. Five different ways to experience coffee.</p>
        </header>
        {moods.map((m) => (
          <article key={m.id} aria-labelledby={`m-${m.id}`} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-[6vw] py-20 lg:h-screen lg:w-[85vw]" style={{ background: m.bg, color: m.fg }}>
            <MoodArt id={m.id} accent={m.accent} />
            <span aria-hidden className="display absolute right-[4vw] top-24 text-[clamp(6rem,18vw,18rem)] opacity-15" style={{ color: m.accent }}>{m.index}</span>
            <div className="relative max-w-2xl">
              <p className="label mb-4" style={{ color: m.accent }}>{m.index} — {m.name}</p>
              <h3 id={`m-${m.id}`} className="display text-[clamp(2.5rem,6vw,6rem)]">{m.headline}</h3>
              <p className="mt-6 max-w-md text-lg opacity-85">{m.description}</p>
              <Button href={`/#discover`} variant="line" className="mt-8">{m.cta}</Button>
            </div>
          </article>))}
      </div>
    </section>
  );
}
