import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteMetadata } from "@/lib/metadata";
import Intro from "@/components/Intro";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TasterSection from "@/components/sections/TasterSection";
import TasterPopup from "@/components/TasterPopup";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", axes: ["opsz"], style: ["normal", "italic"], display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = siteMetadata;
export const viewport: Viewport = { themeColor: "#FAF8F3", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-espresso focus:px-4 focus:py-2 focus:text-soft">Skip to content</a>
        <Intro /><SmoothScroll />
        <Navbar />
        <main id="main">{children}<TasterSection /></main>
        <Footer />
        <TasterPopup />
      </body>
    </html>
  );
}
