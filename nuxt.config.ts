import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    app: {
      head: {
        title: 'Admin Panel',
        meta: [{ name: 'description', content: 'Admin Panel for Motorbike Repair Shop' }],
      },
    },
  
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
  
    modules: ['@pinia/nuxt'],
  
    compatibilityDate: '2025-03-26',
  
    runtimeConfig: {
      public: {
        BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:3001',
      },
    },
  })
  
  