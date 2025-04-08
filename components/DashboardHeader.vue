<script setup lang="ts">
import { ref, onBeforeMount, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
const { locales, setLocale } = useI18n()
const imageUrl = useRuntimeConfig().public.URL_IMAGE_AVATAR;
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

const initializeSettings = () => {
  if (typeof window !== 'undefined') {
    isDarkMode.value = localStorage.getItem('darkMode') === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode.value)

    const savedLocale = localStorage.getItem('locale') as "en" | "vi"
    if (savedLocale === "en" || savedLocale === "vi") {
      locale.value = savedLocale
    }
  }
}

onBeforeMount(initializeSettings)

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

const toggleLocale = async () => {
  const newLocale = locale.value === 'en' ? 'vi' : 'en'
  await setLocale(newLocale)
  locale.value = newLocale 
  localStorage.setItem('locale', newLocale)
  await nextTick()
}
const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    dropdownOpen.value = false
    notificationOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})
</script>

<template>
  <header class="h-16 px-4 bg-gray-800 dark:bg-gray-900 text-white shadow-md flex justify-between items-center border-b border-gray-700">
    <h1 class="text-lg font-semibold tracking-wide">{{ t('admin_panel') }}</h1>
    
    <div class="relative flex items-center space-x-3">
      <button @click="toggleDarkMode" class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
        <span v-if="isDarkMode">🌙</span>
        <span v-else>☀️</span>
      </button>

      <button @click="toggleLocale" class="p-2 rounded-lg bg-gray-700 border border-gray-600 hover:bg-gray-600 transition">
        <img v-if="locale === 'en'" src="@/assets/uk.svg" alt="English" class="w-5 h-5" loading="lazy" />
        <img v-else src="@/assets/vn.svg" alt="Tiếng Việt" class="w-5 h-5" loading="lazy" />
      </button>

      <div class="relative dropdown-container">
        <button @click="notificationOpen = !notificationOpen" class="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          🔔
        </button>
        <div v-if="notificationOpen" class="absolute right-0 mt-2 w-64 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 text-sm z-50">
          <ul>
            <li v-for="notification in notifications" :key="notification.id" class="px-4 py-2 border-b border-gray-700">{{ notification.message }}</li>
            <li v-if="notifications.length === 0" class="px-4 py-2 text-center">{{ t('no_notifications') }}</li>
          </ul>
        </div>
      </div>

      <div class="relative dropdown-container">
        <button @click="dropdownOpen = !dropdownOpen" class="p-2 rounded-full hover:bg-gray-600 transition">
          <img
            v-if="user?.avatar"
            :src="imageUrl+user.avatar"
            alt="Avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
          <img
            v-else
            src="@/assets/default_avatar.svg"
            alt="Default Avatar"
            class="w-8 h-8 rounded-full object-cover"
          />
        </button>

        <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 text-sm z-50">
          <ul>
            <li class="px-4 py-2 font-medium border-b border-gray-700">{{ user?.name || t('admin') }}</li>
            <li>
              <NuxtLink to="/profile" class="block px-4 py-2 hover:bg-gray-700 transition">{{ t('profile') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/settings" class="block px-4 py-2 hover:bg-gray-700 transition">{{ t('settings') }}</NuxtLink>
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

<style scoped>
html.dark {
  background-color: #1a202c;
  color: white;
}
</style>
