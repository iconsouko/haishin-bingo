/** @type {import('tailwindcss').Config} */

function withOpacity(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${varName}) / ${opacityValue})`
    }
    return `rgb(var(${varName}))`
  }
}

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          ink: withOpacity('--color-stage-ink'),
          panel: withOpacity('--color-stage-panel'),
          line: withOpacity('--color-stage-line'),
        },
        paper: withOpacity('--color-paper'),
        ink: withOpacity('--color-ink'),
        muted: withOpacity('--color-muted'),
        coral: {
          DEFAULT: withOpacity('--color-coral'),
          soft: withOpacity('--color-coral-soft'),
        },
        teal: {
          DEFAULT: withOpacity('--color-teal'),
          soft: withOpacity('--color-teal-soft'),
        },
        gold: {
          DEFAULT: withOpacity('--color-gold'),
          soft: withOpacity('--color-gold-soft'),
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
