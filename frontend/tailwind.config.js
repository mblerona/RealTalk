/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#E8533A',   // warm coral-red
        secondary: '#2D7DD2',   // clear blue
        accent:    '#3BB273',   // fresh green
        surface:   '#FFFFFF',
        bg:        '#F5F3EE',   // warm off-white
        card:      '#FFFFFF',
        border:    '#E8E4DC',
        muted:     '#8B8680',
        dark:      '#1C1917',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        hover: '0 4px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
