import { useAuth } from '~/composables/useAuth'
import type { NavigationGuard } from 'vue-router'

export default defineNuxtRouteMiddleware((to, from): ReturnType<NavigationGuard> => {
  if (process.server) return

  const token = localStorage.getItem('access_token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
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

  const pathPermissions: Record<string, 'auth' | 'admin'> = {
    '/accounts': 'admin',
    '/employees': 'admin',
    '/suppliers': 'admin',
    '/promotions': 'admin',
    '/customers': 'auth',
    '/products': 'auth',
    '/product-comments': 'auth',
    '/categories': 'auth',
    '/orders': 'auth',
    '/purchase-history': 'auth',
    '/repair-history': 'auth',
    '/services': 'auth',
    '/repair-appointments': 'auth',
    '/blogs': 'auth',
    '/blog-comments': 'auth'
  }

  const requiredPermission = Object.entries(pathPermissions).find(([path]) =>
    to.path === path || to.path.startsWith(path + '/')
  )?.[1]

  const userPermissions = user.privilege === '0' ? ['admin', 'auth'] : ['auth']

  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    return navigateTo('/unauthorized')
  }

  if (to.path === '/') {
    return navigateTo('/dashboard')
  }
})
