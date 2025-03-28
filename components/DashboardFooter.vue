<script setup lang="ts">
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="w-full border-t border-gray-700 bg-gray-800 text-white py-4">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
      <p class="text-sm">© {{ currentYear }} YourCompany. All rights reserved.</p>
      <div class="flex space-x-4 mt-2 md:mt-0">
        <a href="#" class="text-gray-400 hover:text-white transition">Privacy Policy</a>
        <a href="#" class="text-gray-400 hover:text-white transition">Terms of Service</a>
        <a href="#" class="text-gray-400 hover:text-white transition">Contact</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
a {
  transition: color 0.3s;
}
</style>