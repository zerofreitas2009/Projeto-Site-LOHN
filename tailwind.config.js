/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lohn: {
          // Marrom escuro (primeiro frame)
          dark: "#5A3A2F",
          // Marrom claro (restante do site)
          light: "#F4E7DD",
          // Cor principal de texto sobre o fundo claro
          ink: "#2D1B14",
          // Tom intermediário para detalhes/hover
          accent: "#8A614E",
        },
      },
    },
  },
  plugins: [],
};