import Reveal from "@/components/ui/Reveal";
import CoffeeBeans from "@/components/ui/CoffeeBeans";
export default function PhilosophySection() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-h" className="relative overflow-hidden bg-cream px-[6vw] py-28 md:py-[20vh] text-espresso">
      <CoffeeBeans />
      <Reveal className="relative grid gap-16 md:grid-cols-12">
        <p className="label md:col-span-2">01 — Philosophy</p>
        <h2 id="philosophy-h" className="display text-[clamp(2.5rem,7vw,7rem)] md:col-span-10">Your day has a feeling.<br /><em className="md:pl-[10vw]">Your coffee should too.</em></h2>
        <p className="max-w-xl text-lg leading-relaxed md:col-span-5 md:col-start-7">We believe coffee is more than a flavour profile. It is part of the atmosphere you create, the focus you find, the energy you need, and the moments you make your own.</p>
      </Reveal>
    </section>
  );
}
