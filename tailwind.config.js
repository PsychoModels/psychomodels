/** @type {import('tailwindcss').Config} */
/* eslint-disable */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
    content: [
        "./node_modules/flowbite/**/*.js",
        "./frontend_src/**/*.{js,ts,jsx,tsx}",
        "./templates/**/*.html",
        flowbite.content(),
    ],
    plugins: [require("flowbite/plugin"), require("@tailwindcss/forms")],
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
};
