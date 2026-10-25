import Button from "@/components/ui/Button";
export default function NotFound() {
  return (<section className="flex min-h-[100svh] flex-col items-start justify-center gap-8 px-[6vw]">
    <p className="label text-caramel">404</p>
    <h1 className="display text-[clamp(3rem,10vw,9rem)]">This atmosphere <em>doesn’t exist.</em></h1>
    <Button href="/">Back to the moods</Button></section>);
}
