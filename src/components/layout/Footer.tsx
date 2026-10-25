import SmoothLink from "@/components/ui/SmoothLink";
const nav = [["Our Philosophy", "/#philosophy"], ["The Collection", "/#collection"], ["The Moods", "/#moods"], ["About", "/#about"], ["FAQ", "/#faq"], ["Join the waitlist", "/#waitlist"]];
export default function Footer() {
  return (
    <footer className="bg-espresso px-[6vw] pt-20 text-soft" style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="display text-[clamp(2.25rem,6vw,3.5rem)]">Atmosphere <em>Coffees</em></p>
          <p className="mt-6 max-w-sm text-soft/70">A brand concept about choosing coffee by the mood you want to create. Coffee for every mood.</p>
        </div>
        <nav aria-label="Footer"><p className="label mb-4 text-sand">Explore</p>
          <ul className="space-y-2">{nav.map(([l, h]) => <li key={h}><SmoothLink href={h} className="transition-colors hover:text-sand">{l}</SmoothLink></li>)}</ul></nav>
        <div><p className="label mb-4 text-sand">Connect</p>
          <ul className="space-y-2 text-soft/70"><li>Instagram: placeholder, not yet live</li><li>Contact: placeholder, not yet live</li></ul></div>
      </div>
      <p className="label mt-16 text-soft/50">© {new Date().getFullYear()} Atmosphere Coffees. A brand concept.</p>
    </footer>
  );
}
