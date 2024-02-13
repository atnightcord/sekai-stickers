/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ['SF Pro', 'sans-serif'],
      serif: ['serif']
    },
    extend: {
    },
  },
  plugins: [],
}

