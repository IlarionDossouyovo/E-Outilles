/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ingco-yellow': '#FFC400',
        'ingco-black': '#121212',
        'ingco-gray': '#2E2E2E',
        'ingco-dark': '#1a1a1a',
        // Brand gold ramp. Tailwind's stock `yellow`/`amber` are off-brand
        // (#FACC15 is greener, #F59E0B is orange), and legacy pages still use
        // `bg-yellow-400` / `to-yellow-600` classes. Remapping the two scales
        // keeps every such class on-palette without touching each file.
        yellow: {
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE9A8',
          300: '#FFE082',
          400: '#FFC400',
          500: '#E6B000',
          600: '#CC9A00',
          700: '#B38600',
          800: '#8A6700',
          900: '#5C4400',
        },
        amber: {
          300: '#FFCC4D',
          400: '#FFB300',
          500: '#E6A200',
          600: '#CC9000',
          700: '#A67400',
          800: '#7A5500',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
