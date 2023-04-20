/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html,js}",
    "./public/src/**/*.{html,js}",
    "./views/**/*.{html,js,ejs}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(20vw, 1fr))",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("daisyui")],

  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  }
};

