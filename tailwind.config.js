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
                'rose-medium': '#FFDDE5',
                title: '#1B1C3A',
                'text-gray': '#5A5A5A',
                'faq-text': '#A6A6A6',
                rose: '#FB4D78',
                'text-light-gray': '#A6A6A6'
            },
            lineHeight: {
                'extra-loose': '0.75'
            },
            fontFamily: { Upheaval: ['Upheaval'], VT323: ['VT323'] }
        }
    },
    plugins: []
}
