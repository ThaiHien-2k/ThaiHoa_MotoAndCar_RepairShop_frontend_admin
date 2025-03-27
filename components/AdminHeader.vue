<script setup lang="ts">
const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-blue-700 text-white p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">Admin Panel</h1>
    <button @click="handleLogout" class="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
      Logout
    </button>
  </header>
</template>
