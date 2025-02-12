/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7F11",
        secondary: "#4B5563",
        accent: "#FFB347",
        background: "#F9F9F9",
        text: "#1F2937",
      },
      fontFamily: {
        sans: ["Ubuntu", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
        strong: "0 6px 8px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};