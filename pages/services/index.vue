<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Manage Services</h1>
    <NuxtLink to="/services/create" class="btn btn-primary">Create Service</NuxtLink>
    <div v-if="services.length" class="mt-6">
      <ul>
        <li v-for="service in services" :key="service.id">
          <NuxtLink :to="`/services/${service.id}`">{{ service.name }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No services available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useService from '~/composables/useService';

const { services, fetchServices } = useService();

onMounted(() => {
  fetchServices();
});
</script>