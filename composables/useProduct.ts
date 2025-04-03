import { ref } from 'vue';

export default function useProduct() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/products`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const products = ref([]);
  const selectedProduct = ref(null);
  const isLoading = ref(false);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch product list.');
      products.value = await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch product details.');
      selectedProduct.value = await response.json();
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new product
  const createProduct = async (data: FormData) => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API /products (Create Product) failed: ${errorData.message || 'Unknown error'}`);
      }

      const createdData = await response.json();
      await fetchProducts(); // Refresh the product list
      return { success: true, data: createdData };
    } catch (error: any) {
      console.error('Error creating product:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing product
  const updateProduct = async (id: string, data: FormData) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API /products (Update Product) failed: ${errorData.message || 'Unknown error'}`);
      }

      const updatedData = await response.json();
      await fetchProducts(); // Refresh the product list
      return { success: true, data: updatedData };
    } catch (error: any) {
      console.error('Error updating product:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API /products (Delete Product) failed: ${errorData.message || 'Unknown error'}`);
      }

      await fetchProducts(); // Refresh the product list
      return { success: true, message: 'Product deleted successfully.' };
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    products,
    selectedProduct,
    isLoading,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}