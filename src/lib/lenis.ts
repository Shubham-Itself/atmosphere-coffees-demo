import type Lenis from "lenis";
/** Shared handle to the single Lenis instance (set by SmoothScroll). */
export const lenisRef: { current: Lenis | null } = { current: null };
