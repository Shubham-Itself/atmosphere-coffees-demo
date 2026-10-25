import Reveal from "@/components/ui/Reveal";
export default function BrandStorySection() {
  return (
    <section id="about" aria-labelledby="about-h" className="grid bg-cream text-espresso md:grid-cols-2">
      <div aria-hidden className="relative min-h-[50svh]" style={{ background: "radial-gradient(circle at 35% 40%, #E0901F 0 12%, #F3C98B 13% 38%, #F8E3B0 39%)" }} />
      <Reveal className="flex flex-col justify-center gap-8 px-[6vw] py-24">
        <p className="label">05 — About</p>
        <h2 id="about-h" className="display text-[clamp(2.5rem,6vw,5.5rem)]">Designed around <em>how you feel.</em></h2>
        <p className="max-w-md text-lg leading-relaxed">Atmosphere Coffees began with a simple question: what if coffee could be chosen by the mood you want to create?</p>
        <p className="max-w-md text-lg leading-relaxed">That idea became a different way to think about coffee, bringing together product positioning, visual storytelling, and the everyday rituals that make each day feel different.</p>
      </Reveal>
    </section>
  );
}
