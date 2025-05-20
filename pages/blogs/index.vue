<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Manage Blogs</h1>
    <NuxtLink to="/blogs/create" class="btn btn-primary">Create Blog</NuxtLink>
    <div v-if="blogs.length" class="mt-6">
      <ul>
        <li v-for="blog in blogs" :key="blog.id">
          <NuxtLink :to="`/blogs/${blog.id}`">{{ blog.title }}</NuxtLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No blogs available.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useBlog from '@/composables/useBlog';

const { blogs, fetchBlogs } = useBlog();

onMounted(() => {
  fetchBlogs();
});
</script>