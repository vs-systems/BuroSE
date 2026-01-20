/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#0a0a0a',
                    darker: '#050505',
                    card: '#121212',
                    neon: '#00ff9d', // Neon Green
                    alert: '#ff3b30', // Alert Red
                    primary: '#00ff9d',
                    secondary: '#1c1c1e',
                    text: '#e5e5e5',
                    muted: '#a1a1aa'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
