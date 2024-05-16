/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './templates/**/*.html',
        './node_modules/flowbite/**/*.js'
    ],
    plugins: [
        require('flowbite/plugin')
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: '#E6F7FF',
                    200: '#BAE7FF',
                    300: '#7CC4FA',
                    400: '#47A3F3',
                    500: '#2186EB',
                    600: '#0967D2',
                    700: '#0552B5',
                    800: '#03449E',
                    900: '#01337D',
                },
                secondary: {
                    100: '#F3FBEF',
                    200: '#D3F4C7',
                    300: '#AADF8E',
                    400: '#7BC559',
                    500: '#4CA532',
                    600: '#2D7A1E',
                    700: '#1D5D14',
                    800: '#0F470D',
                    900: '#073509',
                },
            },
        }
    }
}
