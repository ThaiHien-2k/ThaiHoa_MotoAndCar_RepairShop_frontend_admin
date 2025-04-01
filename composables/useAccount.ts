import { ref } from 'vue';
import useCustomer from './useCustomer'; // Import useCustomer correctly
import { c } from 'naive-ui';

export default function useAccount() {
  const { createCustomer, deleteCustomer } = useCustomer(); // Destructure deleteCustomer correctly
  const config = useRuntimeConfig();
  const API_URL = config.public.BACKEND_API_URL;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const accounts = ref([]);
  const selectedAccount = ref(null);
  const isLoading = ref(false);

  const fetchAccounts = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch account list.');
      accounts.value = await response.json();
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAccountById = async (id: string) => {
    try {
      isLoading.value = true;
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch account details.');
      selectedAccount.value = await response.json();
    } catch (error) {
      console.error('Error fetching account details:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateAccount = async (id: string, data: object) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account.');
      }

      const updatedData = await response.json();
      await fetchAccounts();

      return { success: true, data: updatedData };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating account:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  const createAccount = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account.');
      }

      const createdData = await response.json();
      const dataCustomer = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        accounts_id: createdData.account._id,
        customer_type: createdData.account.privilege === '0' || createdData.account.privilege === '1' ? '0' : '1',
      };

      // Ensure createCustomer is called correctly
      await createCustomer(dataCustomer);
      await fetchAccounts();

      return { success: true, data: createdData };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating account:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }
      await deleteCustomer(id); 
      await fetchAccounts();

      return { success: true, message: 'Account deleted successfully.' };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting account:', error.message);
        return { success: false, message: error.message };
      } else {
        console.error('Unknown error:', error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  return {
    accounts,
    selectedAccount,
    isLoading,
    fetchAccounts,
    fetchAccountById,
    updateAccount,
    deleteAccount,
    createAccount,
  };
}
