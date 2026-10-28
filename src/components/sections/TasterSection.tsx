"use client";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { preconnect } from "react-dom";
import { AlertCircle, ArrowUpRight, Check } from "lucide-react";
import { moods, type MoodId } from "@/lib/moods";
import { CONTACT_EMAIL } from "@/lib/contact";
import { formatPhone, normalizePhone, validateEmail, validateName, validatePhone } from "@/lib/validation";

const MAX = 2;

type Status = "idle" | "sent" | "error";
type Field = "name" | "email" | "phone" | "moods";
const ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const RED = "#A3341F";
const fieldCls = "min-h-12 w-full border-b bg-transparent py-2 text-lg outline-none transition-colors placeholder:text-espresso/35";

/** Turns a failed send into a message a visitor can act on. */
function sendErrorMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : "";
  if (!navigator.onLine || /failed to fetch|network|load failed/i.test(msg)) return "You seem to be offline. Check your connection and try again.";
  if (/activat/i.test(msg)) return `This form isn’t activated yet. Open the FormSubmit email sent to ${CONTACT_EMAIL} and click “Activate”, then try again.`;
  return "We couldn’t send your request just now. Please try again in a moment.";
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return <p id={id} className="mt-2 flex items-start gap-1.5 text-sm" style={{ color: RED }}><AlertCircle size={15} aria-hidden className="mt-0.5 shrink-0" />{children}</p>;
}

export default function TasterSection() {
  const [picked, setPicked] = useState<MoodId[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState("");
  // Controlled so the details survive if the background send fails and the form comes back.
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  // Errors show once a field has been left (or after a submit attempt), then update live while typing.
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({});
  const banner = useRef<HTMLDivElement>(null);
  preconnect("https://formsubmit.co"); // warm up DNS/TLS before the visitor submits

  // A failed background send swaps the thank-you back to the form; bring its error into view.
  useEffect(() => { if (status === "error") banner.current?.focus(); }, [status]);

  const errors: Record<Field, string> = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    phone: validatePhone(form.phone),
    moods: picked.length ? "" : "Choose at least one mood for your taster.",
  };
  const shown = (k: Field) => (touched[k] ? errors[k] : "");

  const set = (k: "name" | "email" | "phone") => (e: { target: { value: string } }) => {
    // Phone: drop characters that can never be valid, so typos don't silently pile up.
    const v = k === "phone" ? e.target.value.replace(/[^0-9+()\-\s.]/g, "").slice(0, 20) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };
  const blur = (k: Field) => () => setTouched((t) => ({ ...t, [k]: true }));
  const toggle = (id: MoodId) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX ? [...p, id] : p));
    setTouched((t) => ({ ...t, moods: true }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honey = new FormData(e.currentTarget).get("_honey");
    setTouched({ name: true, email: true, phone: true, moods: true });
    const first = (["name", "email", "phone", "moods"] as Field[]).find((k) => errors[k]);
    if (first) { refs.current[first]?.focus(); return; }
    setSendError("");
    // FormSubmit often takes several seconds, so confirm straight away and send in the background;
    // if the send fails, the form returns (details intact) with the error.
    setStatus("sent");
    if (honey) return; // bot
    try {
      // FormSubmit emails the request to CONTACT_EMAIL; its first-ever submission triggers an activation email there.
      const res = await fetch(ENDPOINT, {
        method: "POST",
        keepalive: true, // keep sending if the visitor navigates away
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name.trim(), email: form.email.trim(), phone: formatPhone(normalizePhone(form.phone)!),
          moods: picked.map((id) => moods.find((m) => m.id === id)!.name).join(", "),
          _subject: `Free taster request: ${form.name.trim()}`, _template: "table", _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === "false") throw new Error(json.message);
    } catch (err) {
      setSendError(sendErrorMessage(err));
      setStatus("error");
    }
  };

  const input = (k: "name" | "email" | "phone", label: string, props: InputHTMLAttributes<HTMLInputElement>, className = "") => (
    <div className={className}>
      <label htmlFor={`t-${k}`} className="label opacity-60">{label}</label>
      <input id={`t-${k}`} name={k} ref={(el) => { refs.current[k] = el; }} value={form[k]} onChange={set(k)} onBlur={blur(k)}
        aria-invalid={!!shown(k)} aria-describedby={shown(k) ? `t-${k}-err` : undefined} {...props}
        className={`${fieldCls} ${shown(k) ? "border-[#A3341F]" : "border-espresso/25 focus-visible:border-espresso"}`} />
      {shown(k) && <ErrorText id={`t-${k}-err`}>{shown(k)}</ErrorText>}
    </div>
  );

  return (
    <section id="taster" aria-labelledby="taster-h" className="bg-cream px-[6vw] py-20 md:py-[14vh] text-espresso">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-[6vw]">
        <div>
          <p className="label mb-5 flex items-center gap-3 text-caramel"><span aria-hidden className="h-px w-8 bg-current" />Free taster</p>
          <h2 id="taster-h" className="display text-[clamp(2.75rem,6vw,5.5rem)]">Book a free <em className="text-caramel">taster.</em></h2>
          <p className="mt-6 max-w-sm text-lg opacity-75">Choose up to two moods to sample, completely free. Leave your details and we’ll contact you to arrange it.</p>
        </div>

        {status === "sent" ? (
          <div role="status" className="flex flex-col justify-center border-t border-espresso/15 pt-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-soft"><Check size={20} aria-hidden /></span>
            <p className="display mt-6 text-4xl">Thank you{form.name.trim() ? `, ${form.name.trim().split(" ")[0]}` : ""}.</p>
            <p className="mt-3 max-w-md opacity-75">Your taster request is in. We’ll contact you soon to arrange it.</p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-8">
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {status === "error" && (
              <div ref={banner} tabIndex={-1} role="alert" className="flex scroll-mt-28 items-start gap-3 border-l-2 outline-none bg-[#A3341F]/5 px-4 py-3 text-sm" style={{ borderColor: RED, color: RED }}>
                <AlertCircle size={18} aria-hidden className="mt-0.5 shrink-0" />
                <p>{sendError} If it keeps happening, email us at <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
              </div>)}
            <div className="grid gap-8 sm:grid-cols-2">
              {input("name", "Name", { autoComplete: "name", placeholder: "Your name", maxLength: 60 }, "sm:col-span-2")}
              {input("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com", autoCapitalize: "none", spellCheck: false })}
              {input("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+91 98765 43210" })}
            </div>

            <fieldset ref={(el) => { refs.current.moods = el; }} tabIndex={-1} aria-invalid={!!shown("moods")} aria-describedby={shown("moods") ? "t-moods-err" : undefined} className="outline-none">
              <legend className="label flex w-full justify-between opacity-60"><span>Choose your moods</span><span aria-live="polite">{picked.length} / {MAX}</span></legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {moods.map((m) => {
                  const on = picked.includes(m.id), off = !on && picked.length >= MAX;
                  return (
                    <label key={m.id} className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border-2 px-5 transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-caramel ${off ? "cursor-not-allowed opacity-40" : "hover:-translate-y-0.5"}`}
                      style={on ? { background: m.accent, borderColor: m.accent, color: m.bg } : { background: m.bg, borderColor: "transparent", color: m.fg }}>
                      <input type="checkbox" name="moods" value={m.id} checked={on} disabled={off} onChange={() => toggle(m.id)} className="sr-only" />
                      {on ? <Check size={14} aria-hidden /> : <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: m.accent }} />}
                      <span className="label">{m.name}</span>
                    </label>);
                })}
              </div>
              {shown("moods") ? <ErrorText id="t-moods-err">{shown("moods")}</ErrorText>
                : picked.length >= MAX && <p className="mt-2 text-sm opacity-60">That’s two. Tap one again to swap it.</p>}
            </fieldset>

            <button type="submit"
              className="group inline-flex min-h-12 items-center justify-center gap-3 justify-self-start bg-espresso px-8 text-xs uppercase tracking-[0.2em] text-soft transition-colors hover:bg-coffee max-sm:w-full">
              Book my free taster
              <ArrowUpRight size={14} aria-hidden className="transition-transform duration-300 group-hover:-translate-x-[-2px] group-hover:-translate-y-0.5" />
            </button>
            <p className="-mt-4 text-sm opacity-60">We’ll only use your details to arrange your taster.</p>
          </form>
        )}
      </div>
    </section>
  );
}
