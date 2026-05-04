import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

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
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        blood: "#8B0000",
        "blood-light": "#A30000",
        plum: "#4A0E4E",
        "plum-light": "#6B1B70",
        void: "#0A0A0F",
        obsidian: "#111118",
        crimson: "#DC143C",
      },
      fontFamily: {
        cinzel: ["var(--font-cinzel)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "void-gradient": "radial-gradient(ellipse at top, #1a0a1e 0%, #0A0A0F 60%)",
        "blood-glow": "radial-gradient(ellipse, rgba(139,0,0,0.3) 0%, transparent 70%)",
        "plum-glow": "radial-gradient(ellipse, rgba(74,14,78,0.4) 0%, transparent 70%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "flicker": "flicker 3s linear infinite",
        "card-flip": "cardFlip 0.6s ease-in-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "particle-drift": "particleDrift 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "1" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.4" },
        },
        cardFlip: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(139,0,0,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(139,0,0,0.7), 0 0 60px rgba(74,14,78,0.4)" },
        },
        particleDrift: {
          "0%": { transform: "translateY(100vh) translateX(0) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "0.5" },
          "100%": { transform: "translateY(-10vh) translateX(50px) scale(1)", opacity: "0" },
        },
      },
      boxShadow: {
        "blood-glow": "0 0 20px rgba(139,0,0,0.5), 0 0 60px rgba(139,0,0,0.2)",
        "plum-glow": "0 0 20px rgba(74,14,78,0.5), 0 0 60px rgba(74,14,78,0.2)",
        "card-hover": "0 0 30px rgba(139,0,0,0.4), 0 20px 40px rgba(0,0,0,0.6)",
        "mystic": "0 0 40px rgba(107,27,112,0.3), 0 0 80px rgba(139,0,0,0.15)",
      },
    },
  },
  plugins: [animate],
};

export default config;
