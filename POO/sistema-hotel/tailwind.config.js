/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'hotel-navy': '#1B3A5C',
        'hotel-navy-dark': '#0F2340',
        'hotel-navy-light': '#2E5F8A',
        'hotel-gold': '#C9A84C',
        'hotel-gold-light': '#E8C76A',
      }
    }
  },
  plugins: []
}
