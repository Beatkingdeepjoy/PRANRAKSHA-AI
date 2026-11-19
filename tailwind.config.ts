import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cobalt Sky Theme
        navy: {
          DEFAULT: "#071126",
          50: "#0e1f42",
          100: "#0b1736",
          900: "#071126",
          950: "#040a17",
        },
        midnight: {
          DEFAULT: "#0B1736",
          dark: "#081026",
          light: "#12234e",
        },
        cobalt: {
          DEFAULT: "#2563EB",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563EB",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        electric: "#3B82F6",
        "sky-blue": "#60A5FA",
        "pale-blue": "#DBEAFE",
        ice: "#F4F8FF",
        success: {
          DEFAULT: "#16A34A",
          light: "#dcfce7",
          dark: "#15803d",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#fef3c7",
          dark: "#b45309",
        },
        critical: {
          DEFAULT: "#DC2626",
          light: "#fee2e2",
          dark: "#991b1b",
        },
        intelligence: {
          DEFAULT: "#8B5CF6",
          light: "#f3e8ff",
          dark: "#6d28d9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "beacon-ping": {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        shimmer: {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(250%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.08)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1200%)" },
        },
      },
      animation: {
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "radar-sweep": "radar-sweep 4s linear infinite",
        "beacon-ping": "beacon-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
