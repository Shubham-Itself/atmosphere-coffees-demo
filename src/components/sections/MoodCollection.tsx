"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { moods } from "@/lib/moods";
import MoodArt from "@/components/ui/MoodArt";
import Button from "@/components/ui/Button";

const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: pinned horizontal gallery with parallax packaging and a scroll-linked mood nav.
 * Mobile: full-screen cards that stack over each other (CSS sticky). Reduced motion: plain stack.
 */
export default function MoodCollection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(-1); // -1 = intro panel

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      const el = track.current!;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", el);
      const dist = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: true, scrub: 0.6, end: () => `+=${dist()}`, invalidateOnRefresh: true,
          onUpdate: (s) => {
            if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
            const center = s.progress * dist() + window.innerWidth / 2;
            setActive(panels.findIndex((p) => center < p.offsetLeft + p.offsetWidth) - 1);
          } } });
      st.current = tween.scrollTrigger ?? null;

      panels.slice(1).forEach((p) => {
        const along = () => ({ trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true });
        gsap.fromTo(p.querySelector("[data-bag]"), { xPercent: 22, rotate: 7 }, { xPercent: -22, rotate: -7, ease: "none", scrollTrigger: along() });
        gsap.fromTo(p.querySelector("[data-word]"), { xPercent: -12 }, { xPercent: 8, ease: "none", scrollTrigger: along() });
        gsap.from(p.querySelectorAll("[data-copy] > *"), { opacity: 0, y: 40, duration: 0.9, stagger: 0.07, ease: "power3.out",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 55%", toggleActions: "play none none reverse" } });
      });
      return () => { st.current = null; setActive(-1); };
    });
    return () => mm.revert();
  }, []);

  /** Scrolls so panel `i` (0 = intro) is centred on desktop, or at the top of the stack on mobile. */
  const jump = (i: number) => {
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track.current);
    const p = panels[i]; if (!p) return;
    const s = st.current;
    // The pin distance equals the horizontal distance, so scroll maps 1:1 onto x.
    const y = s
      ? s.start + gsap.utils.clamp(0, s.end - s.start, p.offsetLeft + p.offsetWidth / 2 - window.innerWidth / 2)
      : root.current!.getBoundingClientRect().top + window.scrollY + panels.slice(0, i).reduce((a, e) => a + e.offsetHeight, 0);
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.4 }); else window.scrollTo(0, y);
  };

  const cur = moods[active];
  // GSAP's pin wraps the section in a pin-spacer; this React-owned wrapper keeps that out of React's
  // way so unmounting (e.g. navigating to another route) doesn't hit a removeChild error.
  return (<div>
    <section id="moods" ref={root} aria-labelledby="moods-h" className="relative overflow-clip bg-soft text-espresso">
      <div ref={track} className="relative flex flex-col lg:w-max lg:flex-row">
        <header data-panel className="relative flex min-h-[90svh] flex-col justify-between px-[6vw] pb-16 pt-28 lg:h-screen lg:w-[78vw] lg:pb-24">
          <p className="label flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />The collection</p>
          <div className="mt-12">
            <h1 id="moods-h" className="display text-[clamp(3.25rem,9vw,9.5rem)]">Find your <em className="text-caramel">atmosphere.</em></h1>
            <p className="mt-6 max-w-sm text-lg opacity-70">Five moods. Five different ways to experience coffee.</p>
          </div>
          <div className="mt-12">
            <ol className="grid border-t border-espresso/15 sm:grid-cols-5">
              {moods.map((m, i) => (
                <li key={m.id} className="border-b border-espresso/15 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0">
                  <button type="button" onClick={() => jump(i + 1)} style={{ "--a": m.accent } as CSSProperties}
                    className="group flex min-h-11 w-full items-center gap-4 py-4 text-left sm:flex-col sm:items-start sm:gap-3 sm:pt-5">
                    <span className="label opacity-50">{m.index}</span>
                    <span className="display flex-1 text-2xl transition-colors duration-300 group-hover:text-[var(--a)] lg:text-3xl">{m.name}</span>
                    <span aria-hidden className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: m.accent }} />
                  </button>
                </li>))}
            </ol>
            <p className="label mt-8 hidden items-center gap-3 opacity-50 lg:flex">Scroll to explore <ArrowRight size={14} aria-hidden /></p>
          </div>
        </header>

        {moods.map((m, i) => (
          <article key={m.id} data-panel aria-labelledby={`m-${m.id}`}
            className="mood-card relative flex min-h-[100svh] flex-col overflow-hidden px-[6vw] pb-10 pt-20 max-lg:rounded-t-[28px] max-lg:shadow-[0_-24px_60px_-24px_rgba(0,0,0,0.3)] lg:h-screen lg:w-screen lg:p-0"
            style={{ background: m.bg, color: m.fg }}>
            <div aria-hidden className="absolute inset-0 opacity-70"><MoodArt id={m.id} accent={m.accent} /></div>
            <span data-word aria-hidden className="display pointer-events-none absolute -bottom-[0.2em] left-[2vw] hidden whitespace-nowrap text-[clamp(8rem,28vw,30rem)] lg:block"
              style={{ color: "transparent", WebkitTextStroke: `1px ${m.accent}`, opacity: 0.4 }}>{m.name}</span>

            <div className="label relative flex items-center justify-between border-t pt-4 lg:absolute lg:inset-x-[6vw] lg:top-24" style={{ borderColor: `${m.fg}2e` }}>
              <span style={{ color: m.accent }}>{m.index} / 0{moods.length}</span>
            </div>

            <div className="relative my-4 flex flex-1 items-center justify-center lg:absolute lg:inset-y-0 lg:right-[6vw] lg:my-0 lg:w-[42vw]">
              <div data-bag className="relative aspect-[1084/1451] h-[30svh] min-h-44 lg:h-[64vh]">
                <div aria-hidden className="absolute -inset-1/4 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${m.accent}59 0%, ${m.accent}00 65%)` }} />
                <div aria-hidden className="absolute -bottom-[7%] left-1/2 h-[6%] w-[70%] -translate-x-1/2 rounded-[50%] blur-xl" style={{ background: m.fg, opacity: 0.28 }} />
                <div className="relative h-full w-full animate-[mood-float_7s_ease-in-out_infinite] motion-reduce:animate-none" style={{ animationDelay: `${-i * 1.4}s` }}>
                  <Image src={m.image} alt={`${m.name} packaging`} fill sizes="(min-width: 1024px) 34vw, 45vw"
                    className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]" />
                </div>
              </div>
            </div>

            <div data-copy className="relative lg:absolute lg:bottom-24 lg:left-[6vw] lg:w-[44vw] lg:max-w-2xl">
              <p className="label mb-4 flex items-center gap-3" style={{ color: m.accent }}><span aria-hidden className="h-px w-8 bg-current" />{m.name}</p>
              <h3 id={`m-${m.id}`} className="display text-[clamp(2.25rem,5.5vw,5.75rem)]">{m.headline}</h3>
              <p className="mt-4 max-w-md opacity-80 lg:mt-6 lg:text-lg">{m.description}</p>
              <p className="display mt-6 hidden text-2xl italic opacity-90 sm:block lg:text-3xl">“{m.choice}”</p>
              <Button href={`/moods/${m.id}`} variant="line" className="mt-6 lg:mt-8">{m.cta}</Button>
            </div>
          </article>))}
      </div>

      <nav aria-label="Moods" inert={active < 0} className="absolute inset-x-[6vw] bottom-6 z-10 hidden transition-[opacity,color] duration-500 lg:block"
        style={{ opacity: active < 0 ? 0 : 1, color: cur?.fg }}>
        <div className="relative h-px">
          <span aria-hidden className="absolute inset-0 bg-current opacity-20" />
          <span ref={bar} aria-hidden className="absolute inset-0 origin-left bg-current" style={{ transform: "scaleX(0)" }} />
        </div>
        <ol className="mt-1 flex justify-between">
          {moods.map((m, i) => (
            <li key={m.id}>
              <button type="button" onClick={() => jump(i + 1)} aria-current={i === active ? "step" : undefined}
                className="label flex min-h-11 items-center gap-2 opacity-45 transition-opacity hover:opacity-100 aria-[current=step]:opacity-100">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: m.accent }} />{m.index} {m.name}
              </button>
            </li>))}
        </ol>
      </nav>
    </section>
  </div>);
}
