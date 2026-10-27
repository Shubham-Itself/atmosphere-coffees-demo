import Reveal from "@/components/ui/Reveal";
const faqs = [
  ["How do I try Atmosphere Coffees?", "Book a free taster below. Pick up to two moods and we’ll get in touch to arrange it."],
  ["What are the five moods?", "Focus, Uplift, Calm, Energize and Indulge: five ways to start choosing coffee by how you want to feel."],
  ["Where will the coffee come from?", "Sourcing, roasts and product details haven’t been defined yet. We won’t publish claims until they are real."],
  ["How can I get in touch?", "Email us at atmospherecoffeesmgt@gmail.com."],
];
export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="bg-soft px-[6vw] py-20 md:py-[16vh] text-espresso">
      <Reveal className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4"><p className="label mb-4 text-caramel">Questions</p><h2 id="faq-h" className="display text-[clamp(2.5rem,6vw,5rem)]">Good to <em>know.</em></h2></div>
        <div className="md:col-span-7 md:col-start-6">
          {faqs.map(([q, a]) => (
            <details key={q} className="group border-t border-espresso/20 py-5 last:border-b">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-lg marker:hidden [&::-webkit-details-marker]:hidden">
                {q}<span aria-hidden className="text-2xl transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-xl text-espresso/75">{a}</p>
            </details>))}
        </div>
      </Reveal>
    </section>
  );
}
