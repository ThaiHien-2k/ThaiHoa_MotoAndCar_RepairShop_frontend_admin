import { ref } from 'vue'

export default function useNotification() {
  const notification = ref({
    visible: false,
    message: '',
    type: '' // 'success' hoặc 'error'
  })

  const showNotification = (message, type) => {
    notification.value = { visible: true, message, type }
    setTimeout(() => {
      notification.value.visible = false
    }, 3000)
  }

  const setNotificationForNextPage = (message, type) => {
    notification.value = { visible: false, message, type }
  }

  const showNotificationOnPageLoad = () => {
    if (notification.value.message) {
      notification.value.visible = true
      setTimeout(() => {
        notification.value.visible = false
      }, 3000)
    }
  }

  return {
    notification,
    showNotification,
    setNotificationForNextPage,
    showNotificationOnPageLoad
  }
}