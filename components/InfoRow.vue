<template>
  <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
    <span class="text-gray-600 dark:text-gray-300 font-medium">{{ label }}</span>
    <span class="text-gray-900 dark:text-white">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<style scoped>
</style>
