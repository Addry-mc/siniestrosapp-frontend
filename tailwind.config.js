/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            colors: {
                brand: {
                    red: '#FF2E4D',
                    purple: '#7E22CE',
                    teal: '#00E59B',
                    dark: '#0a0c10',
                    card: '#151722',
                    input: '#0f1118',
                }
            },
            boxShadow: {
                'glow-cyan': '0 0 25px -2px rgba(0, 229, 155, 0.45)',
                'glow-red': '0 0 25px -4px rgba(255, 46, 77, 0.35)',
                'card-elevated': '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            }
        },
    },
    plugins: [],
}