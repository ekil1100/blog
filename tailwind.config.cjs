/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                'input': ['Input', 'ui-sans-serif'],
                'body': ['PingFang SC', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'ui-sans-serif'],
                'body-mono': ['Cascadia Code', 'SFMono-Regular', 'ui-monospace'],
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
