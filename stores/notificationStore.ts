import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    visible: false,
    message: '',
    type: '', // 'success', 'error', hoặc các loại khác
    timeoutId: null as number | null, // Lưu ID của `setTimeout` để hủy nếu cần
  }),
  actions: {
    showNotification(message: string, type: string, duration: number = 3000) {
      // Hủy thông báo trước đó nếu đang hiển thị
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }

      // Cập nhật trạng thái thông báo
      this.message = message
      this.type = type
      this.visible = true

      // Tự động ẩn thông báo sau `duration` (mặc định 3000ms)
      this.timeoutId = window.setTimeout(() => {
        this.visible = false
        this.timeoutId = null
      }, duration)
    },

    clearNotification() {
      // Hủy thông báo ngay lập tức
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
