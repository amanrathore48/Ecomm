/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "herobg-1": "url('/slide.jpg')",
        formbg: "url('/formimg.jpg')",
      },
    },
    fontFamily: {
      monster: ["Montserrat", "sans-serif"],
      pango: ["Pangolin", "cursive"],
      poppins: ["Poppins", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      ubuntu: ["Ubuntu", "sans-serif"],
    },
  },
  plugins: [],
};
