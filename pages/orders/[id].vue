<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Order Details</h1>
    <div v-if="order">
      <p><strong>Name:</strong> {{ order.name }}</p>
      <p><strong>Description:</strong> {{ order.description }}</p>
    </div>
    <div v-else>
      <p>Loading order details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useOrder from '~/composables/useOrder';

const { fetchOrderById, selectedOrder } = useOrder();
const route = useRoute();
const order = ref(null);

onMounted(() => {
  fetchOrderById(route.params.id).then(() => {
    order.value = selectedOrder.value;
  });
});
</script>