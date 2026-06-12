/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#157634',
          50: '#eef7f1',
          100: '#d5ebdd',
          200: '#aed8be',
          300: '#7dbe97',
          400: '#4a9e6f',
          500: '#157634',
          600: '#0D4720',
          700: '#0a3a1a',
          800: '#072d14',
          900: '#05200e',
        },
        secondary: {
          DEFAULT: '#CD8A5C',
          50: '#fdf6f1',
          100: '#faeadd',
          200: '#f4d4bb',
          300: '#e8b48e',
          400: '#CD8A5C',
          500: '#b87444',
          600: '#a06038',
          700: '#834d2e',
          800: '#6b3f27',
          900: '#573422',
        },
        surface: {
          DEFAULT: '#FAFAF7',
          50: '#fdfcfb',
          100: '#FAFAF7',
          200: '#f3f3ef',
          300: '#eaeae5',
          400: '#ddddd8',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 2.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
    },
  },
  plugins: [],
}
