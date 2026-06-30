/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        aera: {
          bg: "#FFFDF8",
          ink: "#3D2417",
          muted: "#74665A",
          accent: "#A7622A",
          accentHover: "#8A4F1D",
          cream: "#FFFDF8",
          champagne: "#F8EEE3",
          bronze: "#9b591d",
          bronzeDark: "#74370f",
          gold: "#d4a464",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        luxury: "0 18px 50px rgba(77, 43, 20, 0.08)",
      },
    },
  },
  plugins: [],
};
