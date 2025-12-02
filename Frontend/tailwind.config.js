/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f172a', // Slate 900
          light: '#1e293b',   // Slate 800
        },
        accent: {
          DEFAULT: '#c0a062', // Gold-ish for luxury feel
          hover: '#d4b375',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // Good for luxury headers
      }
    },
  },
  plugins: [],
}
