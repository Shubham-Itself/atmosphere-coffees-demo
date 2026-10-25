/** Native form: posts to NEXT_PUBLIC_WAITLIST_ACTION (e.g. your email provider's form endpoint). Disabled until configured. */
export default function WaitlistSection() {
  const action = process.env.NEXT_PUBLIC_WAITLIST_ACTION;
  return (
    <section id="waitlist" aria-labelledby="waitlist-h" className="bg-cream px-[6vw] py-[14vh] text-espresso">
      <div className="mx-auto max-w-2xl text-center">
        <p className="label mb-4 text-caramel">07 — Stay close</p>
        <h2 id="waitlist-h" className="display text-[clamp(2.25rem,6vw,4.5rem)]">Be first to find <em>your mood.</em></h2>
        <p className="mt-5 text-espresso/75">Leave your email and we’ll let you know when the first coffees are ready.</p>
        <form action={action} method="post" className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="wl-email" className="sr-only">Email address</label>
          <input id="wl-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" disabled={!action}
            className="min-h-12 flex-1 border border-espresso/30 bg-soft px-4 text-base placeholder:text-espresso/40 focus-visible:border-espresso disabled:opacity-60" />
          <button type="submit" disabled={!action} className="min-h-12 bg-espresso px-6 text-xs uppercase tracking-[0.2em] text-soft transition-colors hover:bg-coffee disabled:cursor-not-allowed disabled:opacity-60">{action ? "Join the waitlist" : "Opening soon"}</button>
        </form>
        {!action && <p className="label mt-4 text-espresso/60">Sign-ups open soon.</p>}
      </div>
    </section>
  );
}
