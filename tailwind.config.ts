import type { Config } from 'tailwindcss';

/**
 * Brand tokens. Use these names in components instead of hex values:
 *   bg-charcoal, text-gold, border-gold/20, font-display, font-heading …
 * They compile to exactly the same CSS as the old inline hex values.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#2C2C2E', // page background
        deep: '#1E1E20', // cards and dark bands
        night: '#1A1A1C', // footer end, hero reel background
        raised: '#252527', // hovered rows
        gold: {
          DEFAULT: '#C8922A', // brand accent
          dark: '#A87520', // end of gold gradients
        },
        cream: '#FDFCF0', // text on dark, light section background
      },
      fontFamily: {
        display: ["'Bebas Neue'", 'sans-serif'], // big headlines and numbers
        heading: ["'Syne'", 'sans-serif'], // labels, buttons, card titles
        body: ["'DM Sans'", 'sans-serif'], // form inputs
      },
    },
  },
  plugins: [],
} satisfies Config;
