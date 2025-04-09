<template>
   <div
    v-if="notificationStore.visible"
    class="fixed bottom-4 right-4 z-50 px-4 py-2 rounded text-white shadow-lg"
    :class="{
      'bg-red-500': notificationStore.type === 'error',
      'bg-green-500': notificationStore.type === 'success',
      'bg-yellow-500': notificationStore.type === 'warning',
      'bg-blue-500': notificationStore.type === 'info',
    }"
  >
    {{ notificationStore.message }}
  </div>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
import { useNotificationStore } from '@/stores/notificationStore';
const notificationStore = useNotificationStore();


onMounted(() => {
  if (window.location.pathname === '/') {
    router.push('/dashboard')
  }
})

</script>

<style scoped>
.btn {
  @apply bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg;
}
</style>
