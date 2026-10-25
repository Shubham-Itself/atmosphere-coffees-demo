import Reveal from "@/components/ui/Reveal";
const faqs = [
  ["Can I buy Atmosphere Coffees yet?", "Not yet. Atmosphere Coffees is a brand concept, so there is nothing to order today. Join the waitlist below to hear when that changes."],
  ["What are the five moods?", "Focus, Uplift, Calm, Energize and Indulge: five ways to start choosing coffee by how you want to feel."],
  ["Is the mood picker a personality test?", "No. It is a playful way to explore the moods, not a psychological assessment."],
  ["Where will the coffee come from?", "Sourcing, roasts and product details haven’t been defined yet. We won’t publish claims until they are real."],
  ["How can I get in touch?", "Contact details are placeholders for now and will be added when the business information is confirmed."],
];
export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="bg-soft px-[6vw] py-[16vh] text-espresso">
      <Reveal className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4"><p className="label mb-4 text-caramel">06 — Questions</p><h2 id="faq-h" className="display text-[clamp(2.5rem,6vw,5rem)]">Good to <em>know.</em></h2></div>
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
