<template>

  </template>
  
  <script setup>
  import { useAuth } from '~/composables/useAuth'
  
  definePageMeta({
    middleware: ['auth'],
  })
  
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
    navigateTo('/login')
  }
  </script>
  
  <style scoped>
  .btn {
    @apply bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600;
  }
  </style>
  