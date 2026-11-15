import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { obsidian: "#0A0A0A", surface: "#141414", elevated: "#1A1A1A", zincmuted: "#737373" },
    fontFamily: { sans: ["Inter", "Arial", "sans-serif"], mono: ["DM Mono", "ui-monospace", "monospace"] }
  } },
  plugins: []
};

export default config;
