<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  label: string
  value: string | number
}>()

const translatedLabel = computed(() => t(props.label))
</script>

<template>
  <div class="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
    <span class="text-gray-600 dark:text-gray-300 font-medium">{{ translatedLabel }}</span>
    <span class="text-gray-900 dark:text-white">{{ value }}</span>
  </div>
</template>
