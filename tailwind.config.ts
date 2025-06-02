import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Freedom Forever Brand Colors - Following Brand Hierarchy
        brand: {
          'off-white': '#F6F6F6',
          'off-black': '#1E1E1E',
          'olive': '#2C5134', // Primary brand color (PMS 350 C)
          'sorbet': '#FF6B35', // Secondary accent
          'street': '#8B8B8B',
          'lime': '#A4D65E',
          'deep-teal': '#2E8B8B',
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#2C5134", // Olive - Primary brand color
          foreground: "#F6F6F6", // Off-white
        },
        secondary: {
          DEFAULT: "#FF6B35", // Sorbet - Secondary accent
          foreground: "#F6F6F6", // Off-white
        },
        muted: {
          DEFAULT: "#8B8B8B", // Street
          foreground: "#F6F6F6", // Off-white
        },
        accent: {
          DEFAULT: "#A4D65E", // Lime
          foreground: "#1E1E1E", // Off-black
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#2C5134", // Olive
        chart: {
          "1": "#2C5134", // Olive - Primary
          "2": "#FF6B35", // Sorbet - Secondary
          "3": "#A4D65E", // Lime
          "4": "#2E8B8B", // Deep Teal
          "5": "#8B8B8B", // Street
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
