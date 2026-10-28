import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { moods } from "@/lib/moods";
import MoodArt from "@/components/ui/MoodArt";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() { return moods.map((m) => ({ id: m.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const m = moods.find((x) => x.id === id);
  if (!m) return {};
  return { title: `${m.name}: ${m.headline}`, description: m.description, alternates: { canonical: `/moods/${m.id}` } };
}

export default async function MoodPage({ params }: Props) {
  const { id } = await params;
  const i = moods.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const m = moods[i];
  const prev = moods[(i - 1 + moods.length) % moods.length], next = moods[(i + 1) % moods.length];

  return (<>
    <article aria-labelledby="mood-h" className="relative min-h-[100svh] overflow-hidden px-[6vw] pb-16 pt-28" style={{ background: m.bg, color: m.fg }}>
      <div aria-hidden className="absolute inset-0 opacity-70"><MoodArt id={m.id} accent={m.accent} /></div>
      <span aria-hidden className="display pointer-events-none absolute -bottom-[0.2em] right-[2vw] hidden whitespace-nowrap text-[clamp(8rem,26vw,28rem)] lg:block"
        style={{ color: "transparent", WebkitTextStroke: `1px ${m.accent}`, opacity: 0.4 }}>{m.name}</span>

      <nav aria-label="Breadcrumb" className="label relative flex items-center gap-2 opacity-70">
        <Link href="/moods" className="flex min-h-11 items-center hover:opacity-100">The moods</Link><span aria-hidden>/</span><span aria-current="page">{m.name}</span>
      </nav>

      <div className="relative mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-last lg:order-first">
          <p className="label flex items-center gap-3" style={{ color: m.accent }}><span aria-hidden className="h-px w-8 bg-current" />Mood {m.index} / 0{moods.length}</p>
          <h1 id="mood-h" className="display mt-4 text-[clamp(4rem,11vw,10rem)]" style={{ color: m.accent }}>{m.name}</h1>
          <p className="display mt-2 text-[clamp(1.75rem,3vw,2.75rem)] italic">{m.headline}</p>
          <p className="mt-6 max-w-md text-lg opacity-85">{m.description}</p>
          <p className="mt-6 max-w-md border-l-2 pl-4 text-sm opacity-75" style={{ borderColor: m.accent }}>{m.recommendation}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#taster">Book a free taster</Button>
          </div>
        </Reveal>
        <div className="relative mx-auto aspect-[1084/1451] h-[42svh] lg:h-[72vh]">
          <div aria-hidden className="absolute -inset-1/4" style={{ background: `radial-gradient(circle, ${m.accent}59 0%, ${m.accent}00 65%)` }} />
          <div aria-hidden className="absolute -bottom-[9%] left-1/2 h-[10%] w-[85%] -translate-x-1/2" style={{ background: `radial-gradient(closest-side, ${m.fg}, transparent)`, opacity: 0.3 }} />
          <div className="relative h-full w-full animate-[mood-float_7s_ease-in-out_infinite] motion-reduce:animate-none">
            <Image src={m.image} alt={`${m.name} packaging`} fill priority sizes="(min-width: 1024px) 40vw, 60vw" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>
    </article>

    <nav aria-label="More moods" className="grid md:grid-cols-2">
      {[{ label: "Previous mood", mood: prev, Icon: ArrowLeft, nudge: "group-hover:-translate-x-1 group-focus-visible:-translate-x-1" }, { label: "Next mood", mood: next, Icon: ArrowRight, nudge: "group-hover:translate-x-1 group-focus-visible:translate-x-1" }].map(({ label, mood, Icon, nudge }) => (
        // Hover changes only the text (name nudges, accent underline draws in) and the arrow (fills with the accent);
        // the card itself stays put. Colours come in as CSS variables so Tailwind hover classes can use them.
        <Link key={label} href={`/moods/${mood.id}`} className="group relative flex min-h-56 items-end justify-between gap-6 overflow-hidden px-[6vw] py-10 md:min-h-64 md:px-12"
          style={{ background: mood.bg, color: mood.fg, "--accent": mood.accent, "--on": "#FAF8F3" } as CSSProperties}>
          <div aria-hidden className="absolute inset-0 opacity-50"><MoodArt id={mood.id} accent={mood.accent} /></div>
          <div className="relative flex h-full flex-col justify-between gap-10 self-stretch">
            <p className="label opacity-70">{label}</p>
            <div className={`transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${nudge}`}>
              <p className="display relative inline-block text-[clamp(2.5rem,5vw,4.5rem)] text-[var(--accent)]">
                {mood.name}
                <span aria-hidden className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" />
              </p>
              <p className="mt-2 opacity-80 transition-opacity duration-500 group-hover:opacity-100">{mood.headline}</p>
            </div>
          </div>
          <span aria-hidden className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-current transition-colors duration-500 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on)] group-focus-visible:border-[var(--accent)] group-focus-visible:bg-[var(--accent)] group-focus-visible:text-[var(--on)]">
            <Icon size={20} className={`transition-transform duration-500 ${nudge}`} />
          </span>
        </Link>))}
    </nav>
  </>);
}
