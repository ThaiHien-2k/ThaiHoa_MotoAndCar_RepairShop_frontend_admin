<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Purchase History</h1>
    <div v-if="purchaseHistories.length" class="mt-6">
      <ul>
        <li v-for="history in purchaseHistories" :key="history.id">
          <NuxtLink :to="`/purchase-history/${history.id}`">{{ history.title }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No purchase history available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import usePurchaseHistory from '~/composables/usePurchaseHistory';

const { purchaseHistories, fetchPurchaseHistories } = usePurchaseHistory();

onMounted(() => {
  fetchPurchaseHistories();
});
</script>