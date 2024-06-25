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
        secondary: "#026c7a",
      },
      borderRadius: {
        lg: "0.25rem",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
