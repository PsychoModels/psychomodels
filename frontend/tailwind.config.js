const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./search.html",
    "./submission_wizard.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#244657",
        secondary: "rgb(14 116 144)",
        tertiary: "#f08410",
      },
      borderRadius: {
        md: "0.3rem",
        lg: "0.3rem",
      },
    },
  },
  plugins: [flowbite.plugin(), require("@tailwindcss/forms")],
};
