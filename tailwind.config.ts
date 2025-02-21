
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00B5AD",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#333333",
          foreground: "#D9D9D9",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1A1A3A",
          foreground: "#D9D9D9",
        },
        accent: {
          DEFAULT: "#00B5AD",
          foreground: "#FFFFFF",
        },
        'dashboard': {
          primary: '#00B5AD',
          secondary: '#1A1A3A',
          accent: '#2D2D5F',
          border: '#333333',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading': '48px',
        'body': '16px',
      },
      keyframes: {
        "card-flip": {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(180deg)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 10px #00B5AD" },
          "50%": { boxShadow: "0 0 20px #00B5AD" },
        }
      },
      animation: {
        "card-flip": "card-flip 0.6s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
