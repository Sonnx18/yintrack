/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        morado: {
          50: "#f1f2fc",
          100: "#e5e7fa",
          200: "#d0d2f5",
          300: "#b2b4ef",
          400: "#9793e6",
          500: "#8579db",
          600: "#6e57ca",
          700: "#654fb3",
          800: "#524291",
          900: "#453b74",
          950: "#292244",
        },
        amarillo: {
          500: "#f5b942",
        },
      },
    },
  },
  plugins: [],
}

