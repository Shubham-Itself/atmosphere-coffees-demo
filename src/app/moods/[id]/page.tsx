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
          <div aria-hidden className="absolute -inset-1/4 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${m.accent}59 0%, ${m.accent}00 65%)` }} />
          <div aria-hidden className="absolute -bottom-[7%] left-1/2 h-[6%] w-[70%] -translate-x-1/2 rounded-[50%] blur-xl" style={{ background: m.fg, opacity: 0.28 }} />
          <div className="relative h-full w-full animate-[mood-float_7s_ease-in-out_infinite] motion-reduce:animate-none">
            <Image src={m.image} alt={`${m.name} packaging`} fill priority sizes="(min-width: 1024px) 40vw, 60vw" className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]" />
          </div>
        </div>
      </div>
    </article>

    <nav aria-label="More moods" className="grid md:grid-cols-2">
      {[{ label: "Previous mood", mood: prev, Icon: ArrowLeft }, { label: "Next mood", mood: next, Icon: ArrowRight }].map(({ label, mood, Icon }) => (
        <Link key={label} href={`/moods/${mood.id}`} className="group relative flex min-h-56 flex-col justify-between overflow-hidden px-[6vw] py-10 md:px-12" style={{ background: mood.bg, color: mood.fg }}>
          <div aria-hidden className="absolute inset-0 opacity-50 transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"><MoodArt id={mood.id} accent={mood.accent} /></div>
          <p className="label relative flex items-center gap-2"><Icon size={14} aria-hidden />{label}</p>
          <div className="relative">
            <p className="display text-[clamp(2.5rem,5vw,4.5rem)]" style={{ color: mood.accent }}>{mood.name}</p>
            <p className="mt-1 opacity-80">{mood.headline}</p>
          </div>
        </Link>))}
    </nav>
  </>);
}
