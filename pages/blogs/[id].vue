<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Blog Details</h1>
    <div v-if="blog">
      <p><strong>Title:</strong> {{ blog.title }}</p>
      <p><strong>Content:</strong> {{ blog.content }}</p>
    </div>
    <div v-else>
      <p>Loading blog details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useBlog from '@/composables/useBlog';

const { fetchBlogById, selectedBlog } = useBlog();
const route = useRoute();
const blog = ref(null);

onMounted(() => {
  fetchBlogById(route.params.id).then(() => {
    blog.value = selectedBlog.value;
  });
});
</script>