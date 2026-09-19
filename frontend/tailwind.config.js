/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        base: {
          950: "#05060a",
          900: "#0a0c14",
          850: "#0e111c",
          800: "#131725",
          700: "#1b2033",
        },
        accent: {
          violet: "#7c5cff",
          blue: "#4f8dff",
          cyan: "#3ce6d0",
          pink: "#ff5cb3",
        },
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(124,92,255,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(76,141,255,0.16), transparent 40%), radial-gradient(circle at 50% 100%, rgba(60,230,208,0.12), transparent 45%)",
        "brand-gradient": "linear-gradient(135deg, #7c5cff 0%, #4f8dff 50%, #3ce6d0 100%)",
        "card-sheen": "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(124,92,255,0.55)",
        "glow-cyan": "0 0 40px -10px rgba(60,230,208,0.5)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
    },
  },
  plugins: [],
};
