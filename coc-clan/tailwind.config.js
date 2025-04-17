/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/entities/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F2A900',
        secondary: '#282D39',
        tertiary: '#D93E30',
        background: '#0A0F1F',
        war: '#D93E30',
        clan: '#F2A900',
        league: '#4D64EA',
        games: '#47B95C',
      },
      fontFamily: {
        primary: ['Supercell-Magic', 'Arial', 'sans-serif'],
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 