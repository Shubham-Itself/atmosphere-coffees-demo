import Reveal from "@/components/ui/Reveal";
const beats = [["Noise", "The day arrives all at once."], ["Pause", "A kettle, a cup, a breath."], ["Yours", "Quiet enough to hear yourself."]];
export default function RitualSection() {
  return (
    <section aria-labelledby="ritual-h" className="bg-gradient-to-b from-soft via-[#F6E6CB] to-[#EFD3AA] text-espresso px-[6vw] py-[20vh]">
      <Reveal>
        <p className="label mb-6 text-caramel">04 — The ritual</p>
        <h2 id="ritual-h" className="display max-w-5xl text-[clamp(2.5rem,7vw,7rem)]">More than a cup.<br /><em className="text-caramel">A moment that is yours.</em></h2>
      </Reveal>
      <ol className="mt-24 grid gap-12 md:grid-cols-3">
        {beats.map(([t, d], i) => (
          <li key={t} className={`border-t border-caramel/40 pt-6 ${i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}`}>
            <span className="label text-caramel">0{i + 1}</span>
            <p className="display mt-4 text-5xl">{t}</p><p className="mt-3 opacity-75">{d}</p>
          </li>))}
      </ol>
    </section>
  );
}
