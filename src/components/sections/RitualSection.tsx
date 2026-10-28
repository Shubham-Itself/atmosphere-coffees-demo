"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";

const beats = [["Noise", "The day arrives all at once."], ["Pause", "A kettle, a cup, a breath."], ["Yours", "Quiet enough to hear yourself."]];
const bgs = ["#ECE6DC", "#F6E6CB", "#EFD3AA"];
/** Scattered "noise" around the stage: [word, left %, top %, rotation]. */
const noise: [string, number, number, number][] = [
  ["Inbox", 8, 14, -6], ["Alarms", 62, 6, 4], ["Deadlines", 30, 26, 3], ["Pings", 84, 24, -8], ["Traffic", 4, 48, 5],
  ["Meetings", 72, 44, -3], ["Headlines", 16, 78, -4], ["Calls", 58, 82, 7], ["To-dos", 86, 66, 3], ["Updates", 36, 64, -7],
];

/** Sticky scroll story (Noise → Pause → Yours). Reduced motion gets a static three-step list instead. */
export default function RitualSection() {
  const outer = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(outer);
      const tl = gsap.timeline({ defaults: { ease: "none" },
        scrollTrigger: { trigger: outer.current, start: "top top", end: "bottom bottom", scrub: 0.8,
          onUpdate: (s) => setStep(s.progress < 0.3 ? 0 : s.progress < 0.63 ? 1 : 2) } });
      tl.to(q("[data-word]"), { x: (i) => (noise[i][1] < 50 ? -1 : 1) * 160, y: (i) => (noise[i][2] < 50 ? -1 : 1) * 90,
          opacity: 0, filter: "blur(8px)", duration: 0.5, stagger: 0.015 }, 0.6)
        .to(q("[data-beat='0']"), { opacity: 0, y: -40, duration: 0.3 }, 0.8)
        .fromTo(q("[data-beat='1']"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 1.0)
        .to(q("[data-ring]"), { strokeDashoffset: 0, duration: 0.8, stagger: 0.1 }, 0.9)
        .to(q("[data-stage]"), { backgroundColor: bgs[1], duration: 0.8 }, 0.8)
        .to(q("[data-beat='1']"), { opacity: 0, y: -40, duration: 0.3 }, 1.8)
        .fromTo(q("[data-beat='2']"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 2.0)
        .fromTo(q("[data-cup]"), { opacity: 0, y: 40, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, transformOrigin: "50% 100%" }, 1.9)
        .to(q("[data-steam]"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.12 }, 2.1)
        .to(q("[data-glow]"), { opacity: 1, scale: 1, duration: 0.8 }, 1.9)
        .to(q("[data-stage]"), { backgroundColor: bgs[2], duration: 0.8 }, 1.9)
        .to({}, { duration: 0.4 }, 2.6);
      return () => setStep(0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="ritual-h" className="bg-soft text-espresso">
      <Reveal className="px-[6vw] pb-12 pt-32 md:pb-[10vh] md:pt-[22vh]">
        <p className="label mb-6 flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />The ritual</p>
        <h1 id="ritual-h" className="display max-w-5xl text-[clamp(2.5rem,7vw,7rem)]">More than a cup.<br /><em className="text-caramel">A moment that is yours.</em></h1>
      </Reveal>

      {/* Animated story */}
      <div ref={outer} className="relative h-[320svh] motion-reduce:hidden">
        <div data-stage className="sticky top-0 grid h-[100svh] grid-rows-[1fr_auto] overflow-hidden px-[6vw] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20" style={{ backgroundColor: bgs[0] }}>
          <div className="relative grid items-center gap-6 lg:grid-cols-2">
            <div aria-hidden className="relative order-first mx-auto aspect-square w-full max-w-[min(38svh,560px)] lg:order-last lg:max-w-[min(52svh,560px)]">
              {noise.map(([w, l, t, r]) => (
                <span key={w} data-word className="absolute" style={{ left: `${l}%`, top: `${t}%` }}>
                  <span className="label block animate-[ritual-jitter_1.6s_steps(2)_infinite] whitespace-nowrap rounded-full border border-espresso/20 px-3 py-1.5 text-espresso/60"
                    style={{ rotate: `${r}deg`, animationDelay: `${-(l + t) / 40}s` }}>{w}</span>
                </span>))}
              <div data-glow className="absolute inset-[12%] scale-75 opacity-0" style={{ background: "radial-gradient(circle, #E0901F66 0%, transparent 65%)" }} />
              <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="absolute inset-0 h-full w-full text-caramel">
                <g className="origin-center animate-[ritual-breathe_6s_ease-in-out_infinite]">
                  <circle data-ring cx="100" cy="100" r="84" strokeWidth="0.5" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                  <circle data-ring cx="100" cy="100" r="64" strokeWidth="0.35" opacity="0.6" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                </g>
                <g data-cup className="text-espresso opacity-0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M68 96h56v14a28 28 0 0 1-28 28 28 28 0 0 1-28-28z" fill="#FAF8F3" />
                  <path d="M124 102h5a9 9 0 0 1 0 18h-7" />
                  <path d="M56 146h80" /><path d="M64 152h64" opacity="0.5" />
                  {["M84 88c-5-6 5-10 0-17", "M96 86c-5-7 5-12 0-20", "M108 88c-5-6 5-10 0-17"].map((d) => (
                    <path key={d} data-steam d={d} className="text-caramel" stroke="currentColor" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />))}
                </g>
              </svg>
            </div>

            <div className="relative grid">
              {beats.map(([t, d], i) => (
                <div key={t} data-beat={i} className={`[grid-area:1/1] ${i ? "opacity-0" : ""}`} aria-hidden={step !== i}>
                  <p className="label text-caramel">0{i + 1} / 03</p>
                  <p className="display mt-3 text-[clamp(3.25rem,12vw,11rem)]">{i === 2 ? <em className="text-caramel">{t}</em> : t}</p>
                  <p className="mt-3 max-w-sm text-lg opacity-75 lg:mt-4 lg:text-xl">{d}</p>
                </div>))}
            </div>
          </div>

          <ol aria-hidden className="grid grid-cols-3 gap-4 pt-6">
            {beats.map(([t], i) => (
              <li key={t}>
                <span className="relative block h-px bg-espresso/15">
                  <span className="absolute inset-0 origin-left bg-caramel transition-transform duration-700" style={{ transform: `scaleX(${step >= i ? 1 : 0})` }} />
                </span>
                <span className={`label mt-3 block transition-opacity duration-500 ${step === i ? "opacity-100" : "opacity-40"}`}>0{i + 1} {t}</span>
              </li>))}
          </ol>
        </div>
      </div>

      {/* Reduced motion: the same story, static */}
      <ol className="hidden gap-12 bg-gradient-to-b from-soft via-[#F6E6CB] to-[#EFD3AA] px-[6vw] pb-[18vh] pt-8 motion-reduce:grid md:grid-cols-3">
        {beats.map(([t, d], i) => (
          <li key={t} className="border-t border-caramel/40 pt-6">
            <span className="label text-caramel">0{i + 1}</span>
            <p className="display mt-4 text-5xl">{t}</p><p className="mt-3 opacity-75">{d}</p>
          </li>))}
      </ol>
    </section>
  );
}
