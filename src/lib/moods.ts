export type MoodId = "focus" | "uplift" | "calm" | "energize" | "indulge";
export interface Mood {
  id: MoodId;
  index: string;
  name: string;
  headline: string;
  description: string;
  cta: string;
  choice: string;
  bg: string;
  fg: string;
  accent: string;
  recommendation: string;
  image: string; // Added
}
const note = "Atmosphere Coffees is a brand concept, so specific coffees are still to be defined.";
export const moods: Mood[] = [
  {
    id: "focus",
    index: "01",
    name: "Focus",
    headline: "Enter your zone.",
    description: "For deep work, clear thinking, and the satisfaction of getting into the flow.",
    cta: "Explore Focus",
    choice: "I need to focus.",
    bg: "#DCE3F1",
    fg: "#0B1530",
    accent: "#2C4A8A",
    image: "/main-images/focus-final.webp",
    recommendation: `A quiet, concentrated atmosphere: midnight tones and crisp edges. ${note}`,
  },
  {
    id: "uplift",
    index: "02",
    name: "Uplift",
    headline: "Begin a little brighter.",
    description: "For fresh starts, slow mornings, and the feeling that something good is about to happen.",
    cta: "Explore Uplift",
    choice: "I want a fresh start.",
    bg: "#F8E3B0",
    fg: "#2B1D10",
    accent: "#B5620A",
    image: "/main-images/uplift-final.webp",
    recommendation: `A sunrise atmosphere: golden light and gentle shadows. ${note}`,
  },
  {
    id: "calm",
    index: "03",
    name: "Calm",
    headline: "Make room to breathe.",
    description: "For quiet moments, a slower pace, and a little space to yourself.",
    cta: "Explore Calm",
    choice: "I need a moment of calm.",
    bg: "#b4e3ff",
    fg: "#1B3B50",
    accent: "#4A93C4",
    image: "/main-images/calm-final.webp",
    recommendation: `A misty atmosphere: soft sage and open space. ${note}`,
  },
  {
    id: "energize",
    index: "04",
    name: "Energize",
    headline: "Meet the moment.",
    description: "For demanding days, ambitious plans, and everything that needs your attention.",
    cta: "Explore Energize",
    choice: "I'm ready to take on the day.",
    bg: "#F9D9BF",
    fg: "#3A1A08",
    accent: "#C8470F",
    image: "/main-images/energize-final.webp",
    recommendation: `A high-contrast atmosphere: burnt orange and confident motion. ${note}`,
  },
  {
    id: "indulge",
    index: "05",
    name: "Indulge",
    headline: "Nothing else for a moment.",
    description: "For little rituals, rich atmospheres, and the pleasure of taking your time.",
    cta: "Explore Indulge",
    choice: "I want to slow down and indulge.",
    bg: "#EBD5C4",
    fg: "#3A1512",
    accent: "#8A2B3A",
    image: "/main-images/indulge-final.webp",
    recommendation: `An intimate atmosphere: chocolate, burgundy and caramel light. ${note}`,
  },
];
