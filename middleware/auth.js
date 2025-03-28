import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return 
  const token = localStorage.getItem('access_token')

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }

  if (!token) {
    return navigateTo('/login')
  }
})
