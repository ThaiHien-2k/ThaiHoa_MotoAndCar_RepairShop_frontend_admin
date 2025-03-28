import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  css: ['@/assets/css/tailwind.css'],
  imports: {
    autoImport: true,
    dirs: ['composables', 'middleware','assets'],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    layoutTransition: true,
  },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' , src:'/assets/uk.svg'},
      { code: 'vi', iso: 'vi-VN', name: 'Tiếng Việt', file: 'vi.json' , src:'/assets/vn.svg'},
    ],
    defaultLocale: 'en',  
    lazy: true, 
    langDir: '../locales/', 
    strategy: 'no_prefix', 
    detectBrowserLanguage: {
      useCookie: true, 
      // cookieKey: 'i18n_redirected', 
      // redirectOn: 'root', 
      fallbackLocale: 'en',
    },

    bundle: {
      optimizeTranslationDirective: true,
    },
  },

  runtimeConfig: {
    public: {
      BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3001',
    },
  },

  compatibilityDate: '2025-03-26',
  
});
