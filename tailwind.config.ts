import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        surface: "#14141c",
        "surface-hover": "#1c1c28",
        border: "#2a2a3a",
        muted: "#9a9ab0",
        text: "#f0f0f5",
        accent: "#6366f1",
        "accent-hover": "#4f46e5",
        "accent-soft": "rgba(99,102,241,0.12)",
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
