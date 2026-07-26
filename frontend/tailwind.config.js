/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        morado: {
          50: "#f2f0fb",
          100: "#e4e0f7",
          500: "#6d5bd0",
          600: "#5b48c4",
          700: "#4a3aa0",
          900: "#241748",
        },
        amarillo: {
          500: "#f5b942",
        },
      },
    },
  },
  plugins: [],
}

