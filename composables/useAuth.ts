import { useStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'

interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    privilege: string
    avatar: string
  }
}

export const useAuth = () => {
  const isClient = typeof window !== 'undefined'
  const token = useStorage<string | null>('access_token', null)
  const user = useStorage<string | null>('user', null)
  const config = useRuntimeConfig()

  const login = async (email: string, password: string) => {
    try {
      const res = await $fetch<AuthResponse>(`${config.public.BACKEND_API_URL}/accounts/login`, {
        method: 'POST',
        body: { email, password },
      })

      token.value = res.token
      user.value = JSON.stringify(res.user)

      if (isClient) {
        localStorage.setItem('access_token', res.token)
        localStorage.setItem('user', JSON.stringify(res.user))
      }
    } catch (err) {
      console.error('Login Error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await $fetch(`${config.public.BACKEND_API_URL}/accounts/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    } catch (err) {
      console.warn('Logout request failed:', err)
    } finally {
      token.value = null
      user.value = null

      if (isClient) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }

      sessionStorage.setItem('hasLoggedOut', 'true')
      return navigateTo('/login')
    }
  }

  const isTokenExpired = () => {
    if (!token.value) return true
    try {
      const decoded: any = jwtDecode(token.value)
      const now = Math.floor(Date.now() / 1000)
      return decoded.exp < now
    } catch {
      return true
    }
  }

  const parsedUser = computed(() => {
    try {
      return user.value ? JSON.parse(user.value) : null
    } catch {
      return null
    }
  })

  const isAuthenticated = computed(() => {
    return !!token.value && !isTokenExpired()
  })

  return {
    token,
    user: parsedUser,
    login,
    logout,
    isAuthenticated,
    isTokenExpired,
  }
}
