<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Create Repair History</h1>
    <form @submit.prevent="handleCreateRepairHistory">
      <div>
        <label>Title</label>
        <input v-model="formData.title" type="text" required />
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
import useRepairHistory from '~/composables/useRepairHistory';
import { useRouter } from 'vue-router';

const { createRepairHistory } = useRepairHistory();
const router = useRouter();

const formData = ref({
  title: '',
  description: ''
});

const handleCreateRepairHistory = async () => {
  await createRepairHistory(formData.value);
  router.push('/repair-history');
};
</script>