import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const token = localStorage.getItem('access_token')
  const { isTokenExpired, logout } = useAuth()

  if (!token || isTokenExpired()) {
    logout()
    return navigateTo('/login') 
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
