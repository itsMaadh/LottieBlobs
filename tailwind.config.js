const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        teal: {
          100: "#e4f7f7",
          200: "#9fefef",
          500: "#0fccce",
          600: "#1fa4ab",
          700: "#19858b",
          800: "#13666b",
          900: "#006B78",
        },
      },
    },
  },
  plugins: [],
};
