const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [ './src/**/*.{js,ts,jsx,tsx,mdx}',],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrainsMono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
