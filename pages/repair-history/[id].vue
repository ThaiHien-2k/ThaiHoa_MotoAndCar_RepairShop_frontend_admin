<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Repair History Details</h1>
    <div v-if="repairHistory">
      <p><strong>Title:</strong> {{ repairHistory.title }}</p>
      <p><strong>Description:</strong> {{ repairHistory.description }}</p>
    </div>
    <div v-else>
      <p>Loading repair history details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useRepairHistory from '~/composables/useRepairHistory';

const { fetchRepairHistoryById, selectedRepairHistory } = useRepairHistory();
const route = useRoute();
const repairHistory = ref(null);

onMounted(() => {
  fetchRepairHistoryById(route.params.id).then(() => {
    repairHistory.value = selectedRepairHistory.value;
  });
});
</script>