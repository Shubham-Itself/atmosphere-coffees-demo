"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import HeroScene from "@/components/three/HeroScene";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: gsap.Context | undefined; let dead = false;
    onIntroDone(() => {
      if (dead) return;
      ctx = gsap.context(() => {
        gsap.timeline({ defaults: { ease: "power4.out" } })
          .from("[data-line]", { yPercent: 110, duration: 1.2, stagger: 0.12 })
          .from("[data-fade]", { opacity: 0, y: 20, duration: 0.9, stagger: 0.08 }, "-=0.7");
        gsap.to("[data-copy]", { yPercent: -8, opacity: 0.3, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      }, root);
    });
    return () => { dead = true; ctx?.revert(); };
  }, []);

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-soft" style={{ background: "radial-gradient(ellipse 70% 60% at 70% 35%, #FBEFD2, #FAF8F3 70%)" }}>
      <div className="absolute inset-0"><HeroScene /></div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-soft via-soft/70 to-transparent" />
      <div data-copy className="relative z-10 flex min-h-[100svh] flex-col justify-end px-[6vw] pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 md:pb-20">
        <h1 className="display text-[clamp(3rem,11vw,10rem)] text-espresso">
          <span className="line-mask"><span data-line className="block">Coffee for</span></span>
          <span className="line-mask md:pl-[10vw]"><em data-line className="block text-caramel">every mood.</em></span>
        </h1>
        <div className="mt-8 flex flex-col max-md:gap-3 gap-7 md:flex-row md:items-end md:justify-between max-md:mt-4">
          <p data-fade className="max-w-sm text-lg text-espresso/80">Not just what you want to taste.<br />How you want to feel.</p>
          <div data-fade className="flex flex-col gap-3 sm:flex-row">
            <Button href="#taster">Book a free taster</Button>
            <Button href="/moods" variant="line">Explore the moods</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
