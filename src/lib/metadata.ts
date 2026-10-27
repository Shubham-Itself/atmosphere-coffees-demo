import type { Metadata } from "next";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description = "Atmosphere Coffees: specialty coffee chosen by mood. Focus, Uplift, Calm, Energize and Indulge. Book a free taster.";
export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Atmosphere Coffees — Coffee for Every Mood", template: "%s | Atmosphere Coffees" },
  description,
  alternates: { canonical: "/" },
  openGraph: { title: "Atmosphere Coffees — Coffee for Every Mood", description, url: "/", siteName: "Atmosphere Coffees", type: "website" },
  twitter: { card: "summary_large_image", title: "Atmosphere Coffees — Coffee for Every Mood", description },
};
