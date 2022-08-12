/** @type {import('tailwindcss').Config} */
module.exports = {
    important: true,
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                'rose-light': '#F5F1F2',
                'rose': '#FFDDE5',
                'title': '#1B1C3A',
                'text-gray': '#A6A6A6',
                'rose-dark': '#FB4D78'
            },
            fontFamily: { Upheaval: ['Upheaval'], VT323: ['VT323'] }
        }
    },
    plugins: []
}
