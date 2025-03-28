<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth', 
})
const { user } = useAuth()
</script>

<template>
  <h1 class="text-3xl font-semibold">Welcome, {{ user?.name }}</h1>
  <p class="mt-4">This is your admin dashboard.</p>
</template>
