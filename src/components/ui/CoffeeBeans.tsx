"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Bean from "./Bean";

/** Seeded random so server and client render the same beans. */
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
/** Each bean's resting place: left %, lift off the floor (px, makes a loose pile), size (px), rotation (deg). */
const BEANS = Array.from({ length: 24 }, () => ({ x: 8 + rnd() * 84, lift: rnd() * 12, size: 18 + rnd() * 14, rot: rnd() * 360 }));

/**
 * Coffee beans that rain down and bounce to rest near the bottom when the parent section scrolls into view.
 * Fills its positioned parent; without motion the beans simply rest on the floor.
 */
export default function CoffeeBeans() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = root.current!;
      const beans = gsap.utils.toArray<HTMLElement>("[data-bean]", el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 65%", toggleActions: "play none none reset", invalidateOnRefresh: true } });
      beans.forEach((b, i) => {
        const at = rnd() * 1.4, dur = 1.1 + rnd() * 0.6;
        tl.fromTo(b, { y: () => -(el.clientHeight + 60 + rnd() * 200) }, { y: 0, duration: dur, ease: "bounce.out" }, at)
          .fromTo(b, { rotation: BEANS[i].rot - 180 - rnd() * 360, x: (rnd() - 0.5) * 80 }, { rotation: BEANS[i].rot, x: 0, duration: dur, ease: "power2.out" }, at);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0">
      {BEANS.map((b, i) => (
        <div key={i} className="absolute -translate-x-1/2" style={{ left: `${b.x}%`, bottom: `calc(7vh + ${b.lift.toFixed(1)}px)` }}>
          <Bean data-bean size={b.size} style={{ transform: `rotate(${b.rot.toFixed(1)}deg)` }} />
        </div>))}
    </div>
  );
}
