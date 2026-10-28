"use client";
import { Fragment, useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { moods } from "@/lib/moods";
import Reveal from "@/components/ui/Reveal";

const pillars = ["Chosen by how you feel", "A mood for every part of your day", "Small rituals, made your own"];
const R = 74, SEG = 360 / moods.length, GAP = 4;
const pt = (deg: number, r: number) => { const a = ((deg - 90) * Math.PI) / 180; return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`; };

/** The five moods as one wheel around a warm sun; it draws in on enter and turns with scroll. */
function MoodWheel() {
  const svg = useRef<SVGSVGElement>(null);
  const sun = useId();
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = svg.current!;
      gsap.fromTo(el.querySelectorAll("[data-arc]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 75%", once: true } });
      gsap.to(el.querySelector("[data-spin]"), { rotation: 72, svgOrigin: "0 0", ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <svg ref={svg} viewBox="-110 -110 220 220" aria-hidden className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id={sun}><stop offset="0" stopColor="#E0901F" /><stop offset="0.45" stopColor="#F3C98B" /><stop offset="1" stopColor="#F3C98B" stopOpacity="0" /></radialGradient>
      </defs>
      <circle r="62" fill={`url(#${sun})`} />
      <circle r="104" stroke="#211713" strokeOpacity="0.15" strokeWidth="0.4" strokeDasharray="0.6 3.4" fill="none" />
      <g data-spin>
        {moods.map((m, i) => {
          const a0 = i * SEG + GAP / 2, a1 = (i + 1) * SEG - GAP / 2, mid = (a0 + a1) / 2;
          return (
            <g key={m.id}>
              <path data-arc d={`M ${pt(a0, R)} A ${R} ${R} 0 0 1 ${pt(a1, R)}`} stroke={m.accent} strokeWidth="9" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1" />
              <g transform={`rotate(${mid}) translate(0 -92)`}>
                <text textAnchor="middle" dominantBaseline="middle" fill="#211713" fontSize="5.2" letterSpacing="1.1" style={{ fontFamily: "var(--font-mono)" }}>
                  {m.index} {m.name.toUpperCase()}
                </text>
              </g>
            </g>);
        })}
      </g>
      <text y="4" textAnchor="middle" fill="#211713" fontSize="30" fontWeight="300" style={{ fontFamily: "var(--font-serif)" }}>5</text>
      <text y="18" textAnchor="middle" fill="#211713" fillOpacity="0.6" fontSize="5" letterSpacing="1.4" style={{ fontFamily: "var(--font-mono)" }}>MOODS</text>
    </svg>
  );
}

export default function BrandStorySection() {
  const strip = [...moods, ...moods];
  return (
    <section id="about" aria-labelledby="about-h" className="overflow-hidden bg-cream text-espresso">
      <div className="px-[6vw] pt-32 md:pt-[22vh]">
        <Reveal className="flex flex-col gap-6">
          <p className="label flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />About us</p>
          <h1 id="about-h" className="display max-w-5xl text-[clamp(2.75rem,8vw,8rem)]">Designed around <em className="text-caramel">how you feel.</em></h1>
        </Reveal>

        <div className="mt-16 grid items-center gap-16 lg:mt-24 lg:grid-cols-12">
          <div className="mx-auto aspect-square w-full max-w-[480px] lg:col-span-5"><MoodWheel /></div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal className="flex flex-col gap-6">
              <p className="label opacity-60">Atmosphere Coffees began with a simple question</p>
              <blockquote className="display text-[clamp(2rem,3.8vw,3.75rem)] italic">
                <span aria-hidden className="-ml-[0.45em] text-caramel">“</span>What if coffee could be chosen by the mood you want to create?<span aria-hidden className="text-caramel">”</span>
              </blockquote>
              <p className="max-w-lg text-lg leading-relaxed opacity-80">That question became five coffees, each matched to a feeling: something to help you focus, brighten your morning, find some calm, power through a busy day, or simply take your time.</p>
            </Reveal>
            <Reveal className="mt-12">
              <ul className="border-t border-espresso/15">
                {pillars.map((p, i) => (
                  <li key={p} className="group flex items-baseline gap-6 border-b border-espresso/15 py-5">
                    <span className="label w-6 text-caramel">0{i + 1}</span>
                    <span className="display text-[clamp(1.5rem,2.4vw,2.25rem)] transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transition-none">{p}</span>
                  </li>))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>

      <div aria-hidden className="mt-20 overflow-hidden md:mt-[14vh] border-y border-espresso/15 py-6">
        <div className="flex w-max animate-[about-marquee_40s_linear_infinite] motion-reduce:animate-none">
          {strip.map((m, i) => (
            <Fragment key={i}>
              <span className="display whitespace-nowrap px-8 text-[clamp(2.5rem,6vw,5.5rem)] italic" style={{ color: m.accent }}>{m.name}</span>
              <span className="self-center text-2xl text-espresso/30">✦</span>
            </Fragment>))}
        </div>
      </div>
    </section>
  );
}
