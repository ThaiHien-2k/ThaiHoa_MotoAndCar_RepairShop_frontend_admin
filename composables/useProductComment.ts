import { ref } from 'vue';

export default function useProductComment() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/productComment`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const comments = ref([]);
  const selectedComment = ref(null);
  const isLoading = ref(false);

  // Lấy tất cả bình luận
  const fetchAllComments = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch all comments.');
      comments.value = await response.json();
    } catch (error) {
      console.error('Error fetching all comments:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch comments by product ID
  const fetchCommentsByProductId = async (productId: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/product/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch comments.');
      comments.value = await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch a single comment by ID
  const fetchCommentById = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch comment details.');
      selectedComment.value = await response.json();
    } catch (error) {
      console.error('Error fetching comment details:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new comment
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }
      const createdData = await response.json();
      return { success: true, data: createdData };
    } catch (error: any) {
      console.error('Error creating comment:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Update a comment
  const updateComment = async (id: string, data: any) => {
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }
      const updatedData = await response.json();
      return { success: true, data: updatedData };
    } catch (error: any) {
      console.error('Error updating comment:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a comment
  const deleteComment = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting comment:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  const addReplyToComment = async (commentId: string, replyData: any) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(replyData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add reply');
      }
      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      console.error('Error adding reply:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    comments,
    selectedComment,
    isLoading,
    fetchAllComments,
    fetchCommentsByProductId,
    fetchCommentById,
    createComment,
    updateComment,
    deleteComment,
    addReplyToComment,
  };
}