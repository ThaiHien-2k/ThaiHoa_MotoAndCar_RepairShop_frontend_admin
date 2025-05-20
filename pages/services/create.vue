<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Create Service</h1>
    <form @submit.prevent="handleCreateService">
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
import useService from '~/composables/useService';
import { useRouter } from 'vue-router';

const { createService } = useService();
const router = useRouter();

const formData = ref({
  name: '',
  description: ''
});

const handleCreateService = async () => {
  await createService(formData.value);
  router.push('/services');
};
</script>