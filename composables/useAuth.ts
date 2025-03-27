import { useStorage } from '@vueuse/core'

interface AuthResponse {
  token: string
  name: Record<string, any>
}

export const useAuth = () => {
  const token = useStorage<string | null>('access_token', null)
  const user = useStorage<Record<string, any> | null>('user', null)
  const config = useRuntimeConfig()

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch<AuthResponse>(`${config.public.BACKEND_API_URL}/accounts/login`, {
        method: 'POST',
        body: { email, password },
      })

      if (error.value) throw new Error('Login failed! Please check your credentials.')

      if (data.value) {
        token.value = data.value.token
        user.value = data.value.name
      }
    } catch (err) {
      console.error('Login Error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await useFetch(`${config.public.BACKEND_API_URL}/accounts/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      })
    } finally {
      token.value = null
      user.value = null
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  return { token, user, login, logout, isAuthenticated }
}
