import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
export default function FinalCTASection() {
  return (
    <section aria-labelledby="cta-h" className="grain relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-[6vw] text-center text-espresso" style={{ background: "linear-gradient(to bottom,#FAF8F3,#F3D9AE)" }}>
      <Reveal className="flex flex-col items-center gap-8">
        <h2 id="cta-h" className="display text-[clamp(3rem,11vw,10rem)]">Find your <em className="text-caramel">atmosphere.</em></h2>
        <p className="text-lg opacity-75">Your next coffee moment starts here.</p>
        <Button href="/#moods">Explore the Moods</Button>
      </Reveal>
      <p aria-hidden className="display absolute bottom-6 text-[clamp(2rem,9vw,8rem)] opacity-10">Atmosphere Coffees</p>
    </section>
  );
}
