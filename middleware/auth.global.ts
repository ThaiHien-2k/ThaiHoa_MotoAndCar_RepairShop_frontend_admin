import { useAuth } from '~/composables/useAuth'
import type { NavigationGuard } from 'vue-router'

export default defineNuxtRouteMiddleware((to, from): ReturnType<NavigationGuard> => {
  if (process.server) return

  const token = localStorage.getItem('access_token')
  const { isTokenExpired, logout } = useAuth()

  const hasLoggedOut = sessionStorage.getItem('hasLoggedOut') === 'true'

  if (!token || isTokenExpired()) {
    if (!hasLoggedOut && to.path !== '/login') {
      logout()
      sessionStorage.setItem('hasLoggedOut', 'true')
      return navigateTo('/login')
    }

    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  } else {
    sessionStorage.removeItem('hasLoggedOut')
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
