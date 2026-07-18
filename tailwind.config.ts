import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07090f",
        panel: "#0d111c",
        line: "rgba(255,255,255,0.10)",
        violet: "#8b5cf6",
        electric: "#36d4ff",
      },
      boxShadow: {
        glow: "0 0 70px rgba(109, 92, 246, 0.15)",
      },
      backgroundImage: {
        "mesh-radial": "radial-gradient(circle at 50% -20%, rgba(121, 93, 255, 0.25), transparent 42%)",
      },
      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.98)" },
          "50%": { opacity: "0.9", transform: "scale(1.03)" },
        },
      },
      animation: { "soft-pulse": "soft-pulse 3s ease-in-out infinite" },
    },
  },
  plugins: [],
};

export default config;
