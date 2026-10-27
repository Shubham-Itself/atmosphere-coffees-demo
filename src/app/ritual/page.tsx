import type { Metadata } from "next";
import RitualSection from "@/components/sections/RitualSection";

export const metadata: Metadata = {
  title: "The Ritual",
  description: "More than a cup. A moment that is yours: from the noise of the day to a pause of your own.",
  alternates: { canonical: "/ritual" },
};

export default function RitualPage() {
  return <RitualSection />;
}
