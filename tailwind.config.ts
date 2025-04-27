import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Game show custom colors
        'neon-blue': '#0CF',
        'neon-purple': '#9F00FF',
        'neon-pink': '#FF3864',
        'gameshow-background': '#0f0f1a',
        'gameshow-card': '#1a1a2e',
        'gameshow-text': '#f2f2f2',
        'gameshow-muted': '#a0a0b0',
        'gameshow-primary': '#FF3864',
        'gameshow-secondary': '#261447',
        'gameshow': {
          background: '#0D0221',
          card: '#1A1031',
          text: '#FFFFFF',
          muted: '#B9B9BE',
          primary: '#39FF14',
          secondary: '#FF3864',
          accent: '#2E9CCA'
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-logo": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(0.95)" }
        },
        "timer-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" }
        },
        "marquee": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "neon-pulse": {
          "0%, 100%": {
            textShadow: "0 0 5px rgba(255, 56, 100, 0.7), 0 0 10px rgba(255, 56, 100, 0.5)"
          },
          "50%": {
            textShadow: "0 0 10px rgba(255, 56, 100, 0.9), 0 0 20px rgba(255, 56, 100, 0.7), 0 0 30px rgba(255, 56, 100, 0.5)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-logo": "pulse-logo 2s infinite",
        "timer-pulse": "timer-pulse 0.5s infinite",
        "marquee": "marquee 15s linear infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "neon-pulse": "neon-pulse 1.5s infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
