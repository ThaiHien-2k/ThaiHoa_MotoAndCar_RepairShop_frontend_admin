import { ref } from 'vue';

export default function useOrder() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/orders`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const orders = ref([]);
  const selectedOrder = ref(null);
  const isLoading = ref(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch orders.');
      orders.value = await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch a single order by ID
  const fetchOrderById = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch order details.');
      selectedOrder.value = await response.json();
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // Create a new order
  const createOrder = async (data: object) => {
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
        throw new Error(errorData.message || 'Failed to create order.');
      }

      const createdData = await response.json();
      await fetchOrders(); // Refresh the order list
      return { success: true, data: createdData };
    } catch (error: any) {
      console.error('Error creating order:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Update an existing order
  const updateOrder = async (id: string, data: object) => {
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
        throw new Error(errorData.message || 'Failed to update order.');
      }

      const updatedData = await response.json();
      await fetchOrders(); // Refresh the order list
      return { success: true, data: updatedData };
    } catch (error: any) {
      console.error('Error updating order:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete an order by ID
  const deleteOrder = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete order.');
      }

      await fetchOrders(); // Refresh the order list
      return { success: true, message: 'Order deleted successfully.' };
    } catch (error: any) {
      console.error('Error deleting order:', error.message);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    orders,
    selectedOrder,
    isLoading,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}