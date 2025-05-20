import { ref } from 'vue';

export default function useBlogComment() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/blogComments`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const comments = ref([]);
  const selectedComment = ref(null);
  const isLoading = ref(false);

  // Fetch all blog comments
  const fetchComments = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch blog comments.');
      comments.value = await response.json();
    } catch (error) {
      console.error('Error fetching blog comments:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch single blog comment by ID
  const fetchCommentById = async (id: string | number) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/detail/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch blog comment.');
      selectedComment.value = await response.json();
    } catch (error) {
      console.error('Error fetching blog comment:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Create new blog comment
  const createComment = async (data: any) => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create blog comment.');
      await fetchComments();
    } catch (error) {
      console.error('Error creating blog comment:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Update blog comment
  const updateComment = async (id: string | number, data: any) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update blog comment.');
      await fetchComments();
    } catch (error) {
      console.error('Error updating blog comment:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Delete blog comment
  const deleteComment = async (id: string | number) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to delete blog comment.');
      await fetchComments();
    } catch (error) {
      console.error('Error deleting blog comment:', error);
    } finally {
      isLoading.value = false;
    }
  };
  const addReplyToComment = async (commentId: string | number, data: any) => {
  try {
    isLoading.value = true;
    const response = await fetch(`${API_URL}/${commentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to reply to comment.');
    await fetchComments();
    return { success: true, ...result };
  } catch (error: any) {
    console.error('Error replying to blog comment:', error);
    return { success: false, message: error.message || 'Reply failed' };
  } finally {
    isLoading.value = false;
  }
};

  return {
    comments,
    selectedComment,
    isLoading,
    fetchComments,
    fetchCommentById,
    createComment,
    updateComment,
    deleteComment,
    addReplyToComment,
  };
}