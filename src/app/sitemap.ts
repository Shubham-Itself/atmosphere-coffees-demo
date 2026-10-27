import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";
import { moods } from "@/lib/moods";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/moods", "/ritual", "/about", ...moods.map((m) => `/moods/${m.id}`)];
  return pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly", priority: p ? 0.7 : 1 }));
}
