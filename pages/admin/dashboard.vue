<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth', 
})

const { user } = useAuth()

</script>

<template>
  <div>
    <DashboardHeader />
    <main class="p-8">
      <h1 class="text-3xl font-semibold">Welcome, {{ user?.name }}</h1>
      <p class="mt-4">This is your admin dashboard.</p>
    </main>
    <DashboardFooter />
  </div>
</template>
