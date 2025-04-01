import { ref } from 'vue'

export default function useCustomer() {
  const config = useRuntimeConfig()
  const API_URL = config.public.BACKEND_API_URL

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || ''
    }
    return ''
  }

  const customers = ref([]) 
  const selectedCustomer = ref(null) 
  const isLoading = ref(false) 

  const fetchCustomers = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error('Failed to fetch customer list.');
      
      const responseData = await response.json();
      customers.value = responseData.customers || []; // Extract the customers array
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCustomerById = async (id: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!response.ok) throw new Error('Failed to fetch customer details.')
      selectedCustomer.value = await response.json()
    } catch (error) {
      console.error('Error fetching customer details:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomer = async (id: string, data: object) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update customer.');
      }
  
      const updatedData = await response.json();
      await fetchCustomers();
  
      return { success: true, data: updatedData };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating customer:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };
  
  const createCustomer = async (data: object) => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer.');
      }

      const createdData = await response.json();
      await fetchCustomers(); 

      return { success: true, data: createdData };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating customer:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  const deleteCustomer = async (id: string) => {

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer.');
      }

      return { success: true, message: 'Customer deleted successfully.' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting customer:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  return {
    customers,
    selectedCustomer,
    isLoading,
    fetchCustomers,
    fetchCustomerById,
    updateCustomer,
    deleteCustomer,
    createCustomer,
  }
}
