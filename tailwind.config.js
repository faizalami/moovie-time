/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    colors: {
      primary: '#FF0000',
      secondary: '#1E232B',
      'dark-grey': '#929292',
      decoration: '#E74C3C',
      gold: '#FFB802',
      black: colors.black,
      white: colors.white,
      neutral: colors.neutral,
    },
    extend: {
      lineClamp: {
        8: '8',
      },
    },
  },
  safelist: [
    'md:grid-cols-4',
    'md:grid-cols-5',
    {
      pattern: /bg-.+/,
    },
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
