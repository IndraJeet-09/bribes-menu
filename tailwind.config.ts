import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F7F5",
        foreground: "#0A0A0A",
        surface: "#FFFFFF",
        subtle: "#EAEAEA",
        border: "#E0E0DE",
        muted: "#737373",
        "muted-dark": "#404040",
        mono: {
          950: "#0A0A0A",
          900: "#171717",
          800: "#262626",
          700: "#404040",
          600: "#525252",
          500: "#737373",
          400: "#A3A3A3",
          300: "#D4D4D4",
          200: "#E5E5E5",
          100: "#F5F5F5",
          50: "#FAFAFA",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Space Grotesk", "IBM Plex Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-down": "slideDown 0.25s ease-out forwards",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
