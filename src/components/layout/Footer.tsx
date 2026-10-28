import SmoothLink from "@/components/ui/SmoothLink";
import { moods } from "@/lib/moods";
import { CONTACT_EMAIL } from "@/lib/contact";

const columns: [string, [string, string][]][] = [
  ["Explore", [["Home", "/"], ["Philosophy", "/#philosophy"], ["Discover your mood", "/#discover"], ["The ritual", "/ritual"], ["About us", "/about"], ["FAQ", "/about#faq"]]],
  ["The moods", [["All moods", "/moods"], ...moods.map((m): [string, string] => [m.name, `/moods/${m.id}`])]],
];

export default function Footer() {
  return (
    <footer className="bg-espresso px-[6vw] pt-20 text-soft" style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
        <div>
          <p className="display text-[clamp(2.25rem,6vw,3.5rem)]">Atmosphere <em>Coffees</em></p>
          <p className="mt-6 max-w-sm text-soft/70">Coffee for every mood.</p>
        </div>
        {columns.map(([title, links]) => (
          <nav key={title} aria-label={title}><p className="label mb-4 text-sand">{title}</p>
            <ul className="space-y-2">{links.map(([l, h]) => <li key={h}><SmoothLink href={h} className="transition-colors hover:text-sand">{l}</SmoothLink></li>)}</ul></nav>))}
        <div><p className="label mb-4 text-sand">Contact</p>
          <ul className="space-y-2">
            <li><SmoothLink href="#taster" className="transition-colors hover:text-sand">Book a free taster</SmoothLink></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-soft/70 transition-colors hover:text-sand">{CONTACT_EMAIL}</a></li>
          </ul></div>
      </div>
      <p className="label mt-16 text-soft/50">© {new Date().getFullYear()} Atmosphere Coffees</p>
    </footer>
  );
}
