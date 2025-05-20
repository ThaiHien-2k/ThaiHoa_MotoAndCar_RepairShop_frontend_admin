<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Create Blog</h1>
    <form @submit.prevent="handleCreateBlog">
      <div>
        <label>Title</label>
        <input v-model="formData.title" type="text" required />
      </div>
      <div>
        <label>Content</label>
        <textarea v-model="formData.content" required></textarea>
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useBlog from '@/composables/useBlog';
import { useRouter } from 'vue-router';

const { createBlog } = useBlog();
const router = useRouter();

const formData = ref({
  title: '',
  content: ''
});

const handleCreateBlog = async () => {
  await createBlog(formData.value);
  router.push('/blogs');
};
</script>