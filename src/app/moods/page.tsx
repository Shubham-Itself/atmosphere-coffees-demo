import type { Metadata } from "next";
import MoodCollection from "@/components/sections/MoodCollection";

export const metadata: Metadata = {
  title: "The Moods",
  description: "Focus, Uplift, Calm, Energize and Indulge: the five moods of Atmosphere Coffees",
  alternates: { canonical: "/moods" },
};

export default function MoodsPage() {
  return <MoodCollection />;
}
