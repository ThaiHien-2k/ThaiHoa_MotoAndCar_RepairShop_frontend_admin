import { useStorage } from '@vueuse/core'

interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    privilege: string
  }
}

export const useAuth = () => {
  const isClient = typeof window !== 'undefined' // Kiểm tra nếu đang chạy trên client
  const token = useStorage<string | null>('access_token', isClient ? localStorage.getItem('access_token') : null)
  const user = useStorage<string | null>('user', isClient ? localStorage.getItem('user') : null)

  const config = useRuntimeConfig()

  onMounted(() => {
    if (isClient) {
      token.value = localStorage.getItem('access_token')
      user.value = localStorage.getItem('user')
    }
  })

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await useFetch<AuthResponse>(`${config.public.BACKEND_API_URL}/accounts/login`, {
        method: 'POST',
        body: { email, password },
      })

      if (error.value) throw new Error(error.value.message || 'Login failed!')

      if (data.value) {
        token.value = data.value.token
        user.value = JSON.stringify(data.value.user)

        if (isClient) {
          localStorage.setItem('access_token', data.value.token)
          localStorage.setItem('user', JSON.stringify(data.value.user))
        }
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

      if (isClient) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
    }
  }

  const parsedUser = computed(() => {
    try {
      return user.value ? JSON.parse(user.value) : null
    } catch (e) {
      console.error('Failed to parse user data', e)
      return null
    }
  })

  const isAuthenticated = computed(() => !!token.value)

  return { token, user: parsedUser, login, logout, isAuthenticated }
}
