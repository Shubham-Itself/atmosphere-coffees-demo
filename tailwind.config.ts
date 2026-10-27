import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { charcoal: "#171613", ink: "#0D0D0C", coffee: "#38271F", espresso: "#211713", cream: "#F0E7D8", sand: "#C7B49A", soft: "#FAF8F3", caramel: "#9A5B22" },
    fontFamily: { serif: ["var(--font-serif)", "Georgia", "serif"], sans: ["var(--font-sans)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
  } },
  plugins: [],
  future: { hoverOnlyWhenSupported: true },
};
export default config;
