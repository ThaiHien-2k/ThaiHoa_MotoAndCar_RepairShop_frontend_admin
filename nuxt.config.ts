import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css'],
  imports: {
    autoImport: true,
    dirs: ['composables', 'middleware'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'vi', file: 'vi.json' },
    ],
    defaultLocale: 'en',
    langDir: '../locales/',
    lazy: true,
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    public: {
      BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3001',
    },
  },

  compatibilityDate: '2025-03-26',
});
