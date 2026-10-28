"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type MutableRefObject, type TouchEvent } from "react";
import { Check, Shuffle } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { moods } from "@/lib/moods";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import MoodArt from "@/components/ui/MoodArt";
import Bean from "@/components/ui/Bean";
import Button from "@/components/ui/Button";

const EASE = "cubic-bezier(.22,1,.36,1)";
const EMPTY = { bg: "#211713", fg: "#FAF8F3", accent: "#C7B49A" };
/** Beans scattered around the cup: left %, top %, size px, rotation deg. */
const BEANS = [[6, 70, 22, -30], [18, 84, 16, 40], [74, 78, 20, 70], [86, 64, 15, -15], [62, 90, 14, 20]];

/** Empty-state illustration: a steaming cup of coffee on a saucer with beans around it. */
function CoffeeCup() {
  return (
    <div aria-hidden className="relative mx-auto mt-8 aspect-[5/4] w-56 lg:mt-12 lg:w-72">
      <div className="absolute inset-[10%]" style={{ background: "radial-gradient(circle, #E0901F55, transparent 65%)" }} />
      <svg viewBox="0 0 200 160" className="relative h-full w-full">
        <g fill="none" stroke="#F0E7D8" strokeWidth="3" strokeLinecap="round" opacity="0.55">
          {["M84 50c-7-9 7-14 0-24", "M100 46c-7-10 7-16 0-28", "M116 50c-7-9 7-14 0-24"].map((d, i) => (
            <path key={d} d={d} className="animate-[steam_3s_ease-in-out_infinite] [transform-box:fill-box] motion-reduce:animate-none" style={{ animationDelay: `${i * 0.6}s` }} />))}
        </g>
        <ellipse cx="100" cy="140" rx="80" ry="12" fill="#3A2A22" stroke="#F0E7D8" strokeOpacity="0.25" />
        <path d="M150 82c24 0 24 32 0 34" fill="none" stroke="#F0E7D8" strokeWidth="7" strokeLinecap="round" />
        <path d="M50 70H150V94C150 118 128 136 100 136C72 136 50 118 50 94Z" fill="#F0E7D8" />
        <ellipse cx="100" cy="70" rx="50" ry="9" fill="#4A2C1C" />
        <ellipse cx="100" cy="70" rx="36" ry="5.5" fill="#9A5B22" opacity="0.65" />
      </svg>
      {BEANS.map(([x, y, size, rot], i) => (
        <Bean key={i} size={size} className="absolute drop-shadow-[0_6px_6px_rgba(0,0,0,0.4)]" style={{ left: `${x}%`, top: `${y}%`, rotate: `${rot}deg` }} />))}
    </div>
  );
}

export default function MoodDiscovery() {
  const reduced = useReducedMotion();
  const [sel, setSel] = useState(-1);
  const opts = useRef<(HTMLButtonElement | null)[]>([]);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const chipRow = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const result = useRef<HTMLDivElement>(null);
  const mood = moods[sel];
  const c = mood ?? EMPTY;

  useEffect(() => {
    if (reduced || !result.current) return;
    const tw = gsap.fromTo(result.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, delay: 0.1, ease: "power3.out" });
    return () => { tw.kill(); };
  }, [sel, reduced]);

  const pick = (i: number) => {
    setSel(i);
    // Mobile: keep the chosen chip centred in its row (scrolls the row only, never the page).
    const row = chipRow.current, chip = chips.current[i];
    if (row && chip && row.offsetParent) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
  };
  /** Desktop: hovering a feeling selects it, after a short pause so sweeping across rows doesn't flicker. */
  const hoverPick = (i: number) => { clearTimeout(hoverTimer.current); hoverTimer.current = setTimeout(() => pick(i), 90); };
  const hoverCancel = () => clearTimeout(hoverTimer.current);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);
  const surprise = () => { const n = moods.length; pick((Math.max(sel, 0) + 1 + Math.floor(Math.random() * (n - 1))) % n); };
  const step = (d: number) => pick(sel < 0 ? (d > 0 ? 0 : moods.length - 1) : (sel + d + moods.length) % moods.length);
  /** Mobile: swipe the card sideways to move between moods; vertical drags still scroll the page. */
  const onTouchStart = (e: TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e: TouchEvent) => {
    const t = touch.current; touch.current = null;
    if (!t) return;
    const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  };
  const onKey = (e: KeyboardEvent, i: number, refs: MutableRefObject<(HTMLButtonElement | null)[]>) => {
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + moods.length) % moods.length;
    pick(n); refs.current[n]?.focus();
  };

  return (
    <section id="discover" aria-labelledby="discover-h" className="bg-cream px-[6vw] py-20 md:py-[14vh] text-espresso">
      {/* minmax(0,…) + min-w-0: otherwise the nowrap chip row widens the grid column past the screen on mobile */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-[5vw]">
        <div className="min-w-0">
          <p className="label mb-5 flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />03 — Discover</p>
          <h2 id="discover-h" className="display text-[clamp(2.5rem,5.5vw,5.25rem)]">What does today <em className="text-caramel">feel like?</em></h2>

          {/* Mobile: one swipeable row of feelings, directly above the card */}
          <div ref={chipRow} role="radiogroup" aria-label="Choose how today feels"
            className="-mx-[6vw] mt-8 flex snap-x gap-2 overflow-x-auto overscroll-x-contain scroll-px-[6vw] px-[6vw] pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            {moods.map((m, i) => (
              <button key={m.id} ref={(el) => { chips.current[i] = el; }} type="button" role="radio" aria-checked={sel === i}
                tabIndex={sel === i || (sel < 0 && i === 0) ? 0 : -1} onClick={() => pick(i)} onKeyDown={(e) => onKey(e, i, chips)}
                className="flex min-h-11 shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[15px] transition-colors duration-300"
                style={sel === i ? { background: m.accent, borderColor: m.accent, color: m.bg } : { borderColor: "#21171326", background: "#FAF8F3" }}>
                {sel === i ? <Check size={14} aria-hidden /> : <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: m.accent }} />}
                {m.choice}
              </button>))}
            <button type="button" onClick={surprise} className="label flex min-h-11 shrink-0 items-center gap-2 px-3 opacity-70"><Shuffle size={14} aria-hidden />Surprise me</button>
          </div>

          <div role="radiogroup" aria-label="Choose how today feels" className="mt-10 hidden border-t border-espresso/15 lg:block">
            {moods.map((m, i) => (
              <button key={m.id} ref={(el) => { opts.current[i] = el; }} type="button" role="radio" aria-checked={sel === i}
                tabIndex={sel === i || (sel < 0 && i === 0) ? 0 : -1}
                onClick={() => { hoverCancel(); pick(i); }} onKeyDown={(e) => onKey(e, i, opts)}
                onMouseEnter={() => hoverPick(i)} onMouseLeave={hoverCancel}
                className="group relative flex min-h-11 w-full items-center gap-5 overflow-hidden border-b border-espresso/15 py-4 text-left">
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 transition-transform duration-700 group-aria-checked:scale-x-100 motion-reduce:transition-none"
                  style={{ background: m.accent, opacity: 0.1, transitionTimingFunction: EASE }} />
                <span aria-hidden className="relative h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ background: m.accent }} />
                <span className="display relative flex-1 text-[clamp(1.35rem,2vw,1.85rem)] transition-transform duration-500 group-hover:translate-x-1.5 motion-reduce:transition-none">{m.choice}</span>
                <span className="label relative hidden opacity-0 transition-opacity duration-300 group-hover:opacity-60 group-aria-checked:!opacity-100 sm:block" style={{ color: m.accent }}>{m.name}</span>
                <span aria-hidden className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
                  style={sel === i ? { background: m.accent, borderColor: m.accent, color: m.bg } : { borderColor: "#21171333" }}>
                  {sel === i && <Check size={14} />}
                </span>
              </button>))}
          </div>
          <div className="mt-5 hidden flex-wrap gap-x-6 lg:flex">
            <button type="button" onClick={surprise} className="label flex min-h-11 items-center gap-2 opacity-70 transition-opacity hover:opacity-100"><Shuffle size={14} aria-hidden />Surprise me</button>
          </div>
        </div>

        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          className="relative flex touch-pan-y select-none flex-col overflow-hidden rounded-[24px] shadow-[0_40px_80px_-40px_rgba(33,23,19,0.55)] transition-colors duration-700 motion-reduce:transition-none lg:sticky lg:top-24 lg:select-auto lg:rounded-[28px]"
          style={{ background: c.bg, color: c.fg }}>
          {mood ? <div aria-hidden key={mood.id} className="absolute inset-0 opacity-50"><MoodArt id={mood.id} accent={mood.accent} /></div> : <CoffeeCup />}

          <div ref={result} aria-live="polite" className="relative p-6 md:p-9">
            <div className="label flex items-center justify-between"><span className="opacity-70">Your atmosphere</span>
              <span aria-hidden className="flex gap-1.5">{moods.map((m, i) => (
                <span key={m.id} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === sel ? 18 : 6, background: i === sel ? c.accent : c.fg, opacity: i === sel ? 1 : 0.3 }} />))}</span></div>
            {mood ? (<>
              <p className="display mt-4 text-[clamp(3rem,6vw,5.5rem)]" style={{ color: mood.accent }}>{mood.name}</p>
              <p className="display mt-3 text-2xl italic">{mood.headline}</p>
              <p className="mt-3 max-w-md opacity-80">{mood.description}</p>
              <p className="mt-2 max-w-md text-sm opacity-65">{mood.recommendation}</p>
              <Button href={`/moods/${mood.id}`} variant="line" className="mt-6">{mood.cta}</Button>
            </>) : (<>
              <p className="display mt-3 text-[clamp(2.25rem,3.6vw,3.5rem)]">Pick a feeling.</p>
              <p className="display mt-1 text-xl italic opacity-70">We’ll reveal your coffee.</p>
              <p className="label mt-5 opacity-50 lg:hidden">Tap a feeling or swipe the card</p>
            </>)}
          </div>
        </div>
      </div>
    </section>
  );
}
