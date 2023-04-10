const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  darkMode: 'class',
  // mode: 'jit', // issues here
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans]
      },
      screens: {
        '2xl': '1280px'
      },
      container: {
        center: true
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        accent: 'var(--bg-accent)'
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        accent: 'var(--text-accent)'
      },
      colors: {

      },
      width: {
        'w-inherit': 'inherit'
      },
      borderColor: (theme) => ({
        ...theme('colors'),
        bgPrimary: 'var(--bg-primary)',
        bgSecondary: 'var(--bg-secondary)',
        textSecondary: 'var(--text-secondary)',
        accent: 'var(--bg-accent)'
      })
    }
  },
  variants: {
    container: [],
  },
  plugins: []
}
