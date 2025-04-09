// stores/sidebar.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isVisible = ref(localStorage.getItem('sidebarVisible') !== 'false')

  function toggle() {
    isVisible.value = !isVisible.value
    localStorage.setItem('sidebarVisible', String(isVisible.value))
  }

  return { isVisible, toggle }
})
