/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          ink: '#14131C',
          panel: '#1D1B29',
          line: '#332F44',
        },
        paper: '#FAF7F1',
        ink: '#1E1B29',
        coral: {
          DEFAULT: '#FF6F59',
          soft: '#FFDCD3',
        },
        teal: {
          DEFAULT: '#2FB6A6',
          soft: '#D3F2ED',
        },
        gold: {
          DEFAULT: '#F5B942',
          soft: '#FBE7BE',
        },
      },
      fontFamily: {
        display: ['"Reggae One"', 'cursive'],
        body: ['"Zen Kaku Gothic New"', 'sans-serif'],
      },
      borderRadius: {
        ticket: '20px',
      },
    },
  },
  plugins: [],
}
