import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#facece',
          300: '#f5a8a8',
          400: '#ed7474',
          500: '#C0392B',
          600: '#a93226',
          700: '#8B1A1A',
          800: '#6d1515',
          900: '#5a1616',
          950: '#310808',
        },
        brand: {
          dark: '#1a1a1a',
          cream: '#faf7f2',
          warm: '#f5f0e8',
          gold: '#B8860B',
          red: '#C0392B',
          blue: '#2E86C1',
          gray: '#7F8C8D',
          wine: '#C0392B',
        },
        badge: {
          rager: '#B8860B',
          'rager-bg': '#FFF8E1',
          wildcard: '#C0392B',
          'wildcard-bg': '#FDEDEC',
          reliable: '#2E86C1',
          'reliable-bg': '#EBF5FB',
          lazy: '#7F8C8D',
          'lazy-bg': '#F2F3F4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
