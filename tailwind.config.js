/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          soft: "#E5C76B",
        },
      },
    },
  },
  plugins: [],
};
