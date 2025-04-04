import { useStorage } from '@vueuse/core'

interface Category {
  _id?: string
  name: string
  description?: string
  type: 0 | 1 | 2
  slug: string
  createdAt?: string
  updatedAt?: string
  status?: 'active' | 'inactive'
}



export const useCategory = () => {
    const config = useRuntimeConfig();
    const categories = useStorage<Category[]>('categories', []);
    const selectedCategory = useStorage<Category | null>('selected_category', null);
    const isLoading = ref(false);
    const API_URL = config.public.BACKEND_API_URL;
  
    const getToken = () => {
      return process.client ? localStorage.getItem('access_token') || '' : '';
    };
  
    const handleApiError = (error: any, defaultMessage: string) => {
      console.error(error);
    };
  
    // Fetch all categories
    const fetchCategories = async () => {
      isLoading.value = true;
      try {
        const { data, error } = await useFetch<Category[]>(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (error.value) throw new Error(error.value.message || 'Failed to fetch categories');
        categories.value = data.value || [];
      } catch (error) {
        handleApiError(error, 'Error fetching categories');
      } finally {
        isLoading.value = false;
      }
    };
  
    // Fetch category by ID
    const fetchCategoryById = async (id: string) => {
      isLoading.value = true;
      try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch category details.');
        selectedCategory.value = await response.json();
      } catch (error) {
        handleApiError(error, 'Error fetching category details');
      } finally {
        isLoading.value = false;
      }
    };
  
    // Create new category
    const createCategory = async (newCategory: Category) => {
        isLoading.value = true;
        try {
          const { data, error } = await useFetch<Category>(`${API_URL}/categories`, {
            method: 'POST',
            body: newCategory,
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          
          if (error.value) {
            throw new Error(error.value.message || 'Failed to create category');
          }
      
          if (data.value) {
            categories.value.push(data.value);
            return { success: true, message: 'Category created successfully' };
          }
        } catch (error: unknown) {
            const e = error as Error;
          handleApiError(error, 'Error creating category');
          return { success: false, message: e.message || 'An error occurred while creating category' };
        } finally {
          isLoading.value = false;
        }
      };
      
  
    // Update category
    const updateCategory = async (id: string, updatedData: Partial<Category>) => {
        isLoading.value = true;
        try {
          const { data, error } = await useFetch<Category>(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            body: updatedData,
            headers: { Authorization: `Bearer ${getToken()}` },
          });
      
          if (error.value) {
            throw new Error(error.value.message || `Failed to update category ID: ${id}`);
          }
      
          categories.value = categories.value.map((cat) =>
            cat._id === id ? { ...cat, ...updatedData } : cat
          );
      
          return { success: true, message: 'Category updated successfully' }; 
      
        } catch (error: unknown) {
          const e = error as Error;
          return { success: false, message: 'Error updating category: ' + e.message }; 
        } finally {
          isLoading.value = false;
        }
      };
      
  
  
    // Delete category
    const deleteCategory = async (id: string) => {
      isLoading.value = true;
      try {
        const { error } = await useFetch(`${API_URL}/categories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (error.value) throw new Error(error.value.message || `Failed to delete category ID: ${id}`);
        categories.value = categories.value.filter((cat) => cat._id !== id);
      } catch (error) {
        handleApiError(error, `Error deleting category ID: ${id}`);
      } finally {
        isLoading.value = false;
      }
    };
  
    return {
      categories,
      selectedCategory,
      fetchCategories,
      fetchCategoryById,
      createCategory,
      updateCategory,
      deleteCategory,
      isLoading,
    };
  };
  