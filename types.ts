/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'theme-primary': '#008080', // Teal escuro para botões e links
                'theme-primary-hover': '#006666',
                'theme-bg-light': '#F0F5F5', // Fundo principal da página de resultados
                'theme-text': '#333333',
                'theme-text-secondary': '#666666',
                'theme-border': '#DDDDDD',
            }
        },
    },
    plugins: [],
}
