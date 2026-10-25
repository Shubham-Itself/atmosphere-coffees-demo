"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // Respect the user's reduced-motion preference.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: 0.1,

      // Preserve native touch scrolling on mobile.
      syncTouch: false,

      // Keep wheel smoothing enabled on desktop.
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with ScrollTrigger.
    const updateScrollTrigger = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", updateScrollTrigger);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Refresh after initialization.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", updateScrollTrigger);
      lenis.destroy();

      if (lenisRef.current === lenis) {
        lenisRef.current = null;
      }
    };
  }, []);

  return null;
}