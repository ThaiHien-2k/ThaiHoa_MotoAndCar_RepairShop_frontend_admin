<template>
  <div class="h-screen flex flex-col">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col h-full">
      <div class="relative z-50">
        <DashboardHeader />
      </div>

      <div class="flex flex-1 overflow-hidden">
        <AdminSidebar class="relative z-10" />

        <div class="flex-1 p-8 relative z-20 bg-gray-100 dark:bg-gray-900 overflow-auto">
          <slot />
        </div>
      </div>

      <div class="relative z-10">
        <DashboardFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000) 
})
</script>

<style>
/* Fullscreen loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9); 
  z-index: 9999; 
}

/* Spinner styles */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>