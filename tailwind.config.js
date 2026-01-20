/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'], // Tech / Modern
        mono: ['"Space Grotesk"', 'monospace'],   // Unify mono to Grotesk for cleaner look
        display: ['"Syne"', 'sans-serif'],        // Art / Avant-garde
        serif: ['"Noto Serif JP"', 'serif'],
      },
      colors: {
        canvas: 'var(--bg-primary)',
        'grid-line': 'var(--grid-line)',
        accent: 'var(--accent)',
        primary: 'var(--text-primary)',
      },
    },
  },
  plugins: [],
}
