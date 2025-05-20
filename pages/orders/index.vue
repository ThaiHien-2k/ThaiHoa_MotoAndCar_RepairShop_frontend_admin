<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Orders</h1>
    <NuxtLink to="/orders/create" class="btn btn-primary">Create Order</NuxtLink>
    <div v-if="orders.length" class="mt-6">
      <ul>
        <li v-for="order in orders" :key="order.id">
          <NuxtLink :to="`/orders/${order.id}`">{{ order.name }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No orders available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useOrder from '@/composables/useOrder';

const { orders, fetchOrders } = useOrder();

onMounted(() => {
  fetchOrders();
});
</script>