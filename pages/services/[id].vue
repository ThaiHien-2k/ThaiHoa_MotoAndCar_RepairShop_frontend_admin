<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Service Details</h1>
    <div v-if="service">
      <p><strong>Name:</strong> {{ service.name }}</p>
      <p><strong>Description:</strong> {{ service.description }}</p>
    </div>
    <div v-else>
      <p>Loading service details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useService from '~/composables/useService';

const { fetchServiceById, selectedService } = useService();
const route = useRoute();
const service = ref(null);

onMounted(() => {
  fetchServiceById(route.params.id).then(() => {
    service.value = selectedService.value;
  });
});
</script>