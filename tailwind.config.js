const colors = require('tailwindcss/colors');

module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                danger: colors.red,
                theme: {
                 '50': '#f0f4fd',
        '100': '#e3ebfc',
        '200': '#ccd9f9',
        '300': '#aec0f3',
        '400': '#8d9eec',
        '500': '#717de3',
        '600': '#565ad5',
        '700': '#4647bc',
        '800': '#3b3d98',
        '900': '#30336b',
        '950': '#202146',
                }
                // theme: {
                //     50:  "#0AB1C7",
                //     100: "#0AADC2",
                //     200: "#0897AA",
                //     300: "#078292",
                //     400: "#066370",
                //     500: "#03363D",
                //     600: "#022B31",
                //     700: "#022B31",
                //     800: "#021E22",
                //     900: "#021E22",
                //     950: "#000000"
                // }
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio')
    ],
};
