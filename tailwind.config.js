// tailwind.config.js

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#313338",
          100: "#2b2d31",
        },
        secondary: {
          DEFAULT: "#a9f1df",
          100: "#9df2dd",
        },
        main: "#f0f1f3",
        field: "#383a40",
        placeholder: "#6d6f78",
        gray: "#b6c2bf",
      },
      fontFamily: {
        qregular: ["Quicksand-Regular", "sans-serif"],
        qsemibold: ["Quicksand-SemiBold", "sans-serif"],
        qbold: ["Quicksand-Bold", "sans-serif"],
        qmedium: ["Quicksand-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
