/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        fg: 'var(--color-fg)',
        card: 'var(--color-card)',
        muted: 'var(--color-muted)',
        'muted-darker': 'var(--color-muted-darker)',
        accent: 'var(--color-accent)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'accent-tertiary': 'var(--color-accent-tertiary)',
        'accent-info': 'var(--color-accent-info)',
        'accent-soft': 'var(--color-accent-soft)',
        bad: 'var(--color-bad)',
        link: 'var(--color-link)',
      }
    },
  },
  plugins: [],
}