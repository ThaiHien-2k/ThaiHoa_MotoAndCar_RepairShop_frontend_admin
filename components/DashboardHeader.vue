<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { logout, user } = useAuth()
const { t, locale } = useI18n()
const router = useRouter()
const dropdownOpen = ref(false)
const isDarkMode = ref(false)
const notificationOpen = ref(false)
const notifications = ref([
  { id: 1, message: 'New order received' },
  { id: 2, message: 'System update available' },
  { id: 3, message: 'Reminder: Scheduled maintenance' }
])

onMounted(() => {
  if (process.client) {
    isDarkMode.value = localStorage.getItem('darkMode') === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
})

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (process.client) {
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'vi' : 'en'
}
</script>

<template>
  <header 
    class="h-16 px-4 bg-gray-800 dark:bg-gray-900 text-white shadow-md transition-colors duration-300 flex justify-between items-center border-b border-gray-700">
    <h1 class="text-lg font-semibold tracking-wide">{{ t('admin_panel') }}</h1>
    <div class="relative flex items-center space-x-3">
      <!-- Dark Mode Toggle -->
      <button @click="toggleDarkMode" class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
        <span v-if="isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </button>

      <!-- Language Selector -->
      <button @click="toggleLocale" class="p-2 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition">
        <img v-if="locale === 'en'" src="../public/uk.svg" alt="English" class="w-5 h-5" />
        <img v-else src="../public/vn.svg" alt="Tiếng Việt" class="w-5 h-5" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button @click="notificationOpen = !notificationOpen" class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          🔔
        </button>
        <div v-if="notificationOpen" class="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 text-sm">
          <ul>
            <li v-for="notification in notifications" :key="notification.id" class="px-4 py-2 border-b border-gray-700">{{ notification.message }}</li>
            <li v-if="notifications.length === 0" class="px-4 py-2 text-center">{{ t('no_notifications') }}</li>
          </ul>
        </div>
      </div>

      <!-- User Dropdown -->
      <div class="relative">
        <button @click="dropdownOpen = !dropdownOpen" class="p-2 rounded-full  hover:bg-gray-600 transition">
          <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="w-8 h-8 rounded-full object-cover" />
          <div v-else class="w-8 h-8 flex items-center justify-center bg-gray-600 text-white rounded-full text-sm">
            👤
          </div>
        </button>

        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 text-sm">
          <ul>
            <li class="px-4 py-2 font-medium border-b border-gray-700">{{ user?.name || t('admin') }}</li>
            <li>
              <router-link to="/profile" class="block px-4 py-2 hover:bg-gray-700 transition">{{ t('profile') }}</router-link>
            </li>
            <li>
              <router-link to="/settings" class="block px-4 py-2 hover:bg-gray-700 transition">{{ t('settings') }}</router-link>
            </li>
            <li>
              <button @click="handleLogout" class="w-full text-left px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white transition">{{ t('logout') }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style>
html.dark {
  background-color: #1a202c;
  color: white;
}
</style>
