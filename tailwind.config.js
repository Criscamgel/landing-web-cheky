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
          600: '#10602a',
          700: '#0c4b21',
          800: '#093818',
          900: '#062711',
        },
        secondary: {
          DEFAULT: '#79573F',
          50: '#f8f3ef',
          100: '#efe3d9',
          200: '#dfc8b4',
          300: '#cca48a',
          400: '#b8896b',
          500: '#79573F',
          600: '#604632',
          700: '#4b3728',
          800: '#3d2d22',
          900: '#33271e',
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
