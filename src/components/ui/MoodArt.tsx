import type { MoodId } from "@/lib/moods";
/**
 * Pure-CSS art direction per mood (light, optimistic palette).
 * Soft shapes use radial gradients, not CSS blur(): iOS Safari can paint large blurred layers as black squares.
 */
export default function MoodArt({ id, accent }: { id: MoodId; accent: string }) {
  const wrap = "pointer-events-none absolute inset-0 overflow-hidden";
  switch (id) {
    case "focus": return (
      <div aria-hidden className={wrap}>
        {[18, 34, 52, 74].map((s) => <div key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border" style={{ width: `${s}vmin`, height: `${s}vmin`, borderColor: accent, opacity: 0.15 + s / 500 }} />)}
        <div className="absolute left-1/2 top-0 h-full w-px" style={{ background: accent, opacity: 0.25 }} />
        <div className="absolute left-0 top-1/2 h-px w-full" style={{ background: accent, opacity: 0.25 }} />
      </div>);
    case "uplift": return (
      <div aria-hidden className={wrap} style={{ background: "linear-gradient(to top,#F7D58A,#F8E3B0 60%,#FDF4DC)" }}>
        <div className="absolute left-1/2 top-[58%] aspect-square w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle,#F6B04A 0%,#F4CF86 45%,transparent 70%)" }} />
      </div>);
    case "calm": return (
      <div aria-hidden className={wrap}>
        <div className="absolute -left-[16%] top-[4%] h-[72vmin] w-[84vmin]" style={{ background: "radial-gradient(closest-side, #EEF2E8, #EEF2E800)" }} />
        <div className="absolute -right-[11%] -bottom-[6%] h-[62vmin] w-[72vmin]" style={{ background: `radial-gradient(closest-side, ${accent}, ${accent}00)`, opacity: 0.3 }} />
      </div>);
    case "energize": return (
      <div aria-hidden className={wrap}>
        <div className="absolute -inset-1/4 -skew-y-12" style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 4px, transparent 4px 64px)`, opacity: 0.18 }} />
        <div className="absolute bottom-0 right-0 h-2/3 w-1/2 -skew-x-12" style={{ background: accent, opacity: 0.22 }} />
      </div>);
    case "indulge": return (
      <div aria-hidden className={wrap} style={{ background: "radial-gradient(ellipse at 70% 40%, #F3C9B0 0%, #EBD5C4 65%)" }}>
        <div className="absolute right-[8%] top-[24%] aspect-square w-[30vmin]" style={{ background: `radial-gradient(closest-side, ${accent}, ${accent}00)`, opacity: 0.35 }} />
      </div>);
  }
}
