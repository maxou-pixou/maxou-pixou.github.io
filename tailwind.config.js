module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#000000",
          "light-purple": "#333333",
          "bright-purple": "#1a1a1a",
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
