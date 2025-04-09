<template>
  <div class="p-6 space-y-8">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-white">{{ t('settings') }}</h2>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ t('common.language') }}</h3>
      <button @click="toggleLocale" class="btn-fancy">
        <span v-if="locale === 'en'" class="inline-flex items-center">
          <img src="@/assets/vn.svg" alt="Vietnamese" class="w-5 h-5" loading="lazy" />
          <span class="ml-2">Tiếng Việt</span>
        </span>
        <span v-else class="inline-flex items-center">
          <img src="@/assets/uk.svg" alt="English" class="w-5 h-5" loading="lazy" />
          <span class="ml-2">English</span>
        </span>
      </button>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ t('common.theme') }}</h3>
      <div @click="toggleDarkMode" class="switch-toggle">
        <div :class="['switch-circle', isDarkMode ? 'translate-x-full bg-gray-800' : 'bg-yellow-400']"></div>
        <div class="switch-label">
          <span class="text-sm font-medium"></span>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ t('common.sidebar') }}</h3>
      <button @click="toggleSidebar" class="btn-fancy">
        {{ sidebar.isVisible ?   t('common.hide') :  t('common.show') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSidebarStore } from '@/stores/sidebar'

definePageMeta({ layout: 'admin' })

const { t, locale, setLocale } = useI18n()
const sidebar = useSidebarStore()

const isDarkMode = ref(false)

onMounted(() => {
  isDarkMode.value = localStorage.getItem('darkMode') === 'true'
  document.documentElement.classList.toggle('dark', isDarkMode.value)

  const storedLocale = localStorage.getItem('locale') as 'en' | 'vi' | null
  if (storedLocale === 'en' || storedLocale === 'vi') {
    locale.value = storedLocale
  }
})

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', String(isDarkMode.value))
}

const toggleLocale = async () => {
  const newLocale = locale.value === 'en' ? 'vi' : 'en'
  await setLocale(newLocale)
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
}

const toggleSidebar = () => {
  sidebar.toggle()
}
</script>

<style scoped>
.btn-fancy {
  @apply px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out;
  @apply bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-xl active:scale-95;
  @apply dark:bg-blue-500 dark:hover:bg-blue-600;
}

.switch-toggle {
  @apply relative w-20 h-10 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer transition-colors duration-300;
}

.switch-circle {
  @apply absolute top-1 left-1 w-8 h-8 rounded-full shadow-md transition-all duration-300 ease-in-out;
}

.switch-label {
  @apply absolute inset-0 flex items-center justify-center text-xs text-gray-800 dark:text-gray-100 pointer-events-none;
}
</style>
