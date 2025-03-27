<script setup lang="ts">
const { login, isAuthenticated } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    await login(email.value, password.value)

    if (isAuthenticated.value) {
      router.push('/admin/dashboard')
    } else {
      errorMessage.value = 'Invalid credentials. Please try again.'
    }
  } catch (err) {
    errorMessage.value = 'Login failed. Check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition duration-500">
      <h1 class="text-3xl font-extrabold mb-8 text-center text-gray-800">Admin Login</h1>
      <form @submit.prevent="handleLogin">
        <!-- Email Input -->
        <div class="mb-6">
          <label for="email" class="block text-sm font-semibold text-gray-600 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-semibold text-gray-600 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-300 outline-none"
            placeholder="Enter your password"
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          :disabled="loading"
        >
          <span v-if="loading" class="loader mr-2"></span>
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center animate-bounce">{{ errorMessage }}</p>

      <!-- Footer -->
      <p class="mt-8 text-sm text-center text-gray-500">
        &copy; {{ new Date().getFullYear() }} Admin Dashboard. All rights reserved.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Custom Loader */
.loader {
  border: 3px solid #fff;
  border-top: 3px solid transparent;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
