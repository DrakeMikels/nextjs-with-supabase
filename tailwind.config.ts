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
        // Freedom Forever Brand Colors
        brand: {
          'off-white': '#F8F8F8',
          'off-black': '#2C2C2C',
          'sorbet': '#FF6B35',
          'street': '#8B8B8B',
          'lime': '#A4D65E',
          'deep-teal': '#2E8B8B',
          'olive': '#8FBC8F',
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
          DEFAULT: "#FF6B35", // Sorbet
          foreground: "#F8F8F8", // Off-white
        },
        secondary: {
          DEFAULT: "#2E8B8B", // Deep Teal
          foreground: "#F8F8F8", // Off-white
        },
        muted: {
          DEFAULT: "#8B8B8B", // Street
          foreground: "#F8F8F8", // Off-white
        },
        accent: {
          DEFAULT: "#A4D65E", // Lime
          foreground: "#2C2C2C", // Off-black
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#FF6B35", // Sorbet
        chart: {
          "1": "#FF6B35", // Sorbet
          "2": "#2E8B8B", // Deep Teal
          "3": "#A4D65E", // Lime
          "4": "#8FBC8F", // Olive
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
