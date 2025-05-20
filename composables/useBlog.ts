import { ref } from 'vue';

export default function useBlog() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/blogs`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const blogs = ref([]);
  const selectedBlog = ref(null);
  const isLoading = ref(false);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch blogs.');
      blogs.value = await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    blogs,
    selectedBlog,
    isLoading,
    fetchBlogs,
  };
}