/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // Fondos y Bases
                'apple-gray': '#F5F5F7',
                'border-light': '#D2D2D7',

                // Acentos de Marca
                'accent-green': '#34C759',
                'accent-green-hover': '#30D158',
                'accent-green-deep': '#047857',
                'alert-red': '#FF3B30',

                // Tipografía
                'text-primary': '#1D1D1F',
                'text-secondary': '#424245',
                'text-muted': '#86868B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'apple-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        },
    },
    plugins: [],
}
