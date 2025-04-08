import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const token = localStorage.getItem('access_token')
  const { isTokenExpired, logout } = useAuth()

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }

  if (!token || isTokenExpired()) {
    logout()
  }
})
