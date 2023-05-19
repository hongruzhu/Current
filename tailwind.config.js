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
        "fluid-l": "repeat(auto-fit, minmax(40%, 1fr))",
        "fluid-m": "repeat(auto-fit, minmax(30%, 1fr))",
        "fluid-s": "repeat(auto-fit, minmax(20%, 1fr))",
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
  },
};
