import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts}',
    './composables/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './middleware/**/*.{js,ts}',
    './store/**/*.{js,ts}',
    './assets/**/*.{vue,js,ts,jsx,tsx,css,scss}',
    './*.{vue,js,ts,jsx,tsx}',
    './nuxt.config.ts'
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
  "tailwindCSS.experimental.configFile": "./path/to/tailwind.config.js",
}
