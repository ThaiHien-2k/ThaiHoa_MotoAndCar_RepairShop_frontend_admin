<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

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
