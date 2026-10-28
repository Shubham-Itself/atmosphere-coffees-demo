"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { onIntroDone } from "@/lib/intro";
import { lockScroll } from "@/lib/scrollLock";
import SmoothLink from "@/components/ui/SmoothLink";
import Bean from "@/components/ui/Bean";

const KEY = "ac-taster-popup";
const DELAY = 2500;
/** Floating beans in the side panel: left %, top %, size px, rotation deg, float duration s, delay s. */
const BEANS = [
  [12, 8, 34, -20, 6, 0], [58, 4, 24, 35, 7, -2], [30, 30, 46, 10, 8, -4], [72, 26, 30, -45, 6.5, -1], [6, 54, 26, 60, 7.5, -3],
  [46, 58, 38, -15, 6, -5], [78, 62, 22, 80, 8, -2], [20, 80, 30, 25, 7, -6], [62, 84, 34, -60, 6.5, -3.5],
];

/** One-time "book a free taster" invite, shown shortly after a visitor's first landing (after the intro). */
export default function TasterPopup() {
  const dialog = useRef<HTMLDialogElement>(null);
  const unlock = useRef<(() => void) | null>(null);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch {}
    if (seen || location.hash === "#taster") return;
    let timer: ReturnType<typeof setTimeout> | undefined, dead = false;
    onIntroDone(() => {
      if (dead) return;
      timer = setTimeout(() => {
        const d = dialog.current;
        if (!d || d.open) return;
        d.showModal();
        unlock.current = lockScroll(); // iOS keeps scrolling the page behind a modal dialog
        try { localStorage.setItem(KEY, "1"); } catch {}
      }, DELAY);
    });
    return () => { dead = true; clearTimeout(timer); unlock.current?.(); };
  }, []);

  const close = () => dialog.current?.close();

  return (
    <dialog ref={dialog} aria-labelledby="popup-h" onClose={() => { unlock.current?.(); unlock.current = null; }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      className="m-auto max-h-[90svh] w-[min(92vw,720px)] overflow-y-auto overscroll-contain rounded-[24px] bg-soft p-0 text-espresso shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)] backdrop:bg-espresso/60 backdrop:backdrop-blur-sm open:animate-[taster-pop_0.6s_cubic-bezier(.22,1,.36,1)] motion-reduce:open:animate-none">
      <div className="grid sm:grid-cols-[0.8fr_1.2fr]">
        <div aria-hidden className="relative h-28 overflow-hidden sm:h-auto" style={{ background: "radial-gradient(circle at 35% 30%, #4A2C1C, #211713 70%)" }}>
          <div className="absolute left-1/2 top-1/2 aspect-square w-[80%] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, #E0901F55, transparent 65%)" }} />
          {BEANS.map(([x, y, size, rot, dur, delay], i) => (
            <div key={i} className="absolute animate-[bean-float_ease-in-out_infinite] motion-reduce:animate-none" style={{ left: `${x}%`, top: `${y}%`, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
              <Bean size={size} className="drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]" style={{ rotate: `${rot}deg` }} />
            </div>))}
        </div>
        <div className="relative p-8 sm:p-10">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"><X size={20} /></button>
          <p className="label flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />Free taster</p>
          <h2 id="popup-h" className="display mt-4 text-[clamp(2.5rem,6vw,3.75rem)]">Try your mood, <em className="text-caramel">on us.</em></h2>
          <p className="mt-4 max-w-xs opacity-75">Choose up to two moods to sample, completely free. We’ll contact you to arrange it.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SmoothLink href="#taster" onNavigate={close}
              className="group inline-flex min-h-12 items-center justify-center gap-3 bg-espresso px-7 text-xs uppercase tracking-[0.2em] text-soft transition-colors hover:bg-coffee">
              Book a free taster
            </SmoothLink>
            <button type="button" onClick={close} className="label min-h-11 px-2 opacity-60 transition-opacity hover:opacity-100">Maybe later</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
