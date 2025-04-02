import { ref } from 'vue';
import useCustomer from './useCustomer'; // Import useCustomer correctly
import { c } from 'naive-ui';

export default function useAccount() {
  const { createCustomer, deleteCustomer,updateCustomer } = useCustomer(); // Destructure deleteCustomer correctly
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
        throw new Error(`API /accounts (Update Account) failed: ${errorData.message || 'Unknown error'}`);
      }
  
      const updatedData = await response.json();
    
      const dataCustomer = {
        name: updatedData.name,
        customer_typee: updatedData.privilege === '0' || updatedData.privilege === '1' ? '0' : '1',
      };
      if(dataCustomer.customer_typee === '1'){
      const customerResponse = await updateCustomer(updatedData._id, dataCustomer);
  
      if (!customerResponse.success) {
        throw new Error(`API /customers (Update Customer) failed: ${customerResponse.message}`);
      }
    }
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
      const accountResponse = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!accountResponse.ok) {
        const errorData = await accountResponse.json();
        throw new Error(`API /accounts (Create Account) failed: ${errorData.message || 'Unknown error'}`);
      }
  
      const createdData = await accountResponse.json();
  
      const dataCustomer = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        accounts_id: createdData.account._id,
        customer_type: '1',
        customer_typee: createdData.account.privilege === '0' || createdData.account.privilege === '1' ? '0' : '1',
      };
  
      if(dataCustomer.customer_typee === '1'){
      const customerResponse = await createCustomer(dataCustomer);
  
      if (!customerResponse.success) {
        const deleteResponse = await fetch(`${API_URL}/accounts/${createdData.account._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
  
        if (!deleteResponse.ok) {
          const deleteErrorData = await deleteResponse.json();
          throw new Error(
            `API /customers (Create Customer) failed: ${customerResponse.message}. Rollback failed at /accounts (Delete Account): ${deleteErrorData.message || 'Unknown error'}`
          );
        }
  
        throw new Error(`API /customers (Create Customer) failed: ${customerResponse.message}. Account rollback successful.`);
      }
    }
      await fetchAccounts();
  
      return { success: true, data: createdData };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
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
        throw new Error(`API /accounts (Delete Account) failed: ${errorData.message || 'Unknown error'}`);
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
