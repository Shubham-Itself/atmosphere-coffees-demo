import type { Metadata } from "next";
import BrandStorySection from "@/components/sections/BrandStorySection";
import FaqSection from "@/components/sections/FaqSection";

export const metadata: Metadata = {
  title: "About",
  description: "Atmosphere Coffees began with a simple question: what if coffee could be chosen by the mood you want to create?",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (<><BrandStorySection /><FaqSection /></>);
}
