"use client";
import { useState } from "react";
import { moods } from "@/lib/moods";
import MoodArt from "@/components/ui/MoodArt";
import Button from "@/components/ui/Button";

export default function MoodDiscovery() {
  const [id, setId] = useState<string | null>(null);
  const mood = moods.find((m) => m.id === id);
  const style = mood ? { background: mood.bg, color: mood.fg } : { background: "#F0E7D8", color: "#211713" };
  return (
    <section id="discover" aria-labelledby="discover-h" className="relative overflow-hidden px-[6vw] py-[16vh] transition-colors duration-700 motion-reduce:transition-none" style={style}>
      {mood && <MoodArt id={mood.id} accent={mood.accent} />}
      <div className="relative grid gap-14 lg:grid-cols-2">
        <div>
          <p className="label mb-4 opacity-70">03 — Discover</p>
          <h2 id="discover-h" className="display text-[clamp(2.5rem,7vw,7rem)]">What does today <em>feel like?</em></h2>
          <p className="mt-6 max-w-sm text-sm opacity-70">A playful way to explore the moods, not a psychological assessment.</p>
        </div>
        <div>
          <div role="group" aria-label="Choose how today feels" className="flex flex-col">
            {moods.map((m) => (
              <button key={m.id} type="button" aria-pressed={id === m.id} onClick={() => setId(m.id)}
                className="flex items-center justify-between border-b border-current/25 py-5 text-left text-xl transition-opacity hover:opacity-100 aria-pressed:opacity-100 [&:not([aria-pressed=true])]:opacity-70 md:text-2xl">
                <span>{m.choice}</span><span className="label" style={{ color: mood?.accent }}>{id === m.id ? "Selected" : m.name}</span>
              </button>))}
          </div>
          <div aria-live="polite" className="mt-10 min-h-48">
            {mood ? (<>
              <h3 className="display text-4xl" style={{ color: mood.accent }}>{mood.name}: {mood.headline}</h3>
              <p className="mt-4 max-w-md">{mood.description}</p>
              <p className="mt-4 max-w-md text-sm opacity-75">{mood.recommendation}</p>
              <Button href="/#moods" variant="line" className="mt-6">{mood.cta}</Button>
            </>) : <p className="opacity-60">Choose one to see your atmosphere.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
