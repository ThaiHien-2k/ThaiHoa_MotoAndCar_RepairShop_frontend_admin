import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    visible: false,
    message: '',
    type: '', 
    timeoutId: null as number | null, 
  }),
  actions: {
    showNotification(message: string, type: string, duration: number = 3000) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }

      this.message = message
      this.type = type
      this.visible = true

      this.timeoutId = window.setTimeout(() => {
        this.visible = false
        this.timeoutId = null
      }, duration)
    },

    clearNotification() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
      this.visible = false
      this.message = ''
      this.type = ''
    },
  },
})
