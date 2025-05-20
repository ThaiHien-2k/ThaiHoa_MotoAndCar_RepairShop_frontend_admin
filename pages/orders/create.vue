<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Create Order</h1>
    <form @submit.prevent="handleCreateOrder">
      <div>
        <label>Name</label>
        <input v-model="formData.name" type="text" required />
      </div>
      <div>
        <label>Description</label>
        <textarea v-model="formData.description" required></textarea>
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useOrder from '@/composables/useOrder';
import { useRouter } from 'vue-router';

const { createOrder } = useOrder();
const router = useRouter();

const formData = ref({
  name: '',
  description: ''
});

const handleCreateOrder = async () => {
  await createOrder(formData.value);
  router.push('/orders');
};
</script>