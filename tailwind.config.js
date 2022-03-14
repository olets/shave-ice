const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['**/*.njk', './.eleventy.js'],
  safelist: ['font-sans', 'shiki'],
  theme: {
    extend: {
      aspectRatio: {
        card: '1280 / 640',
      },
      colors: {
        black: "#474747",
        accent: colors.emerald,
        link: {
          ...colors.blue,
          DEFAULT: colors.blue['500'],
        },
      },
      fontFamily: {
        serif: [
          'Hey August',
          ...defaultTheme.fontFamily.serif,
        ],
      },
      ringColor: ({ theme }) => ({
        DEFAULT: theme('colors.link.DEFAULT'),
      }),
      textDecorationColor: ({ theme }) => ({
        ...theme('colors'),
      }),
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-bullets": theme('colors.accent.400'),
            th: {
              textTransform: 'uppercase',
            },
          },
        },
      }),
    },
  },
  plugins: [ typography ],
}
