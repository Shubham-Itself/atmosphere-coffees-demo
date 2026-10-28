import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { moods } from "@/lib/moods";
import MoodArt from "@/components/ui/MoodArt";
import Reveal from "@/components/ui/Reveal";

/** Home: one compact row of the five moods as product cards, each linking to its own page. */
export default function MoodsTeaser() {
  return (
    <section id="moods" aria-labelledby="moods-h" className="bg-soft py-20 md:py-[14vh] text-espresso">
      <Reveal className="flex flex-col gap-6 px-[6vw] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label mb-5 flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />02 — The five moods</p>
          <h2 id="moods-h" className="display text-[clamp(2.75rem,7vw,6.5rem)]">Find your <em className="text-caramel">atmosphere.</em></h2>
        </div>
        <Link href="/moods" className="label group flex min-h-11 items-center gap-2 border-b border-current pb-1 self-start md:self-auto">
          View all moods <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <ul className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-[6vw] px-[6vw] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:overflow-visible">
        {moods.map((m) => (
          <li key={m.id} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto">
            <Link href={`/moods/${m.id}`} className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden p-6 transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:transition-none"
              style={{ background: m.bg, color: m.fg }}>
              <div aria-hidden className="absolute inset-0 opacity-60 transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"><MoodArt id={m.id} accent={m.accent} /></div>
              <div aria-hidden className="absolute inset-x-[16%] top-[12%] bottom-[30%]">
                <div className="absolute inset-[5%]" style={{ background: `radial-gradient(circle, ${m.accent}59 0%, ${m.accent}00 65%)` }} />
                <Image src={m.image} alt="" fill sizes="(min-width: 1024px) 14vw, 45vw"
                  className="object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:-rotate-3 group-hover:scale-105 motion-reduce:transition-none" />
              </div>
              <div className="relative flex items-center justify-between">
                <span className="label" style={{ color: m.accent }}>{m.index}</span>
                <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <div className="relative">
                <p className="display text-[clamp(2.25rem,3.2vw,3.25rem)]">{m.name}</p>
                <p className="mt-2 text-sm opacity-80">{m.headline}</p>
              </div>
            </Link>
          </li>))}
      </ul>
    </section>
  );
}
