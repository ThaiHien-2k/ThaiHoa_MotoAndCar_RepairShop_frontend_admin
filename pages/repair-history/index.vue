<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Repair History</h1>
    <div v-if="repairHistories.length" class="mt-6">
      <ul>
        <li v-for="history in repairHistories" :key="history.id">
          <NuxtLink :to="`/repair-history/${history.id}`">{{ history.title }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No repair history available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useRepairHistory from '~/composables/useRepairHistory';

const { repairHistories, fetchRepairHistories } = useRepairHistory();

onMounted(() => {
  fetchRepairHistories();
});
</script>