import { lenisRef } from "@/lib/lenis";

let locks = 0;

/** Ref-counted page scroll lock shared by the intro, mobile menu and popup. Returns an idempotent release. */
export function lockScroll() {
  if (locks++ === 0) { document.documentElement.style.overflow = "hidden"; lenisRef.current?.stop(); }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) { document.documentElement.style.overflow = ""; lenisRef.current?.start(); }
  };
}
