import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "#000000",
        surface: { 900: "#0a0a0a", 800: "#111111", 700: "#161616" },
        hairline: "rgba(255,255,255,0.08)",
        cyan: { DEFAULT: "#00E5FF", dim: "rgba(0,229,255,0.15)" },
        violet: { DEFAULT: "#7C3AED", dim: "rgba(124,58,237,0.15)" },
        lime: { DEFAULT: "#A3FF12", dim: "rgba(163,255,18,0.12)" },
        muted: "#9CA3AF",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "glow-cyan": "0 0 24px rgba(0,229,255,0.35)",
        "glow-violet": "0 0 24px rgba(124,58,237,0.35)",
        "glow-lime": "0 0 18px rgba(163,255,18,0.3)",
      },
      backgroundImage: {
        "gradient-card":
          "linear-gradient(#111111, #111111) padding-box, linear-gradient(135deg, rgba(0,229,255,0.4), rgba(124,58,237,0.4)) border-box",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulseGlow: {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        floaty: "floaty 5s ease-in-out infinite",
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
