import { ref } from 'vue'

export default function useAccount() {
  const config = useRuntimeConfig()
  const API_URL = config.public.BACKEND_API_URL

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || ''
    }
    return ''
  }

  const accounts = ref([]) 
  const selectedAccount = ref(null) 
  const isLoading = ref(false) 

  const fetchAccounts = async () => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/accounts`, {
        headers: { Authorization: `Bearer ${getToken()}` } 
      })
      if (!response.ok) throw new Error('Failed to fetch account list.')
      accounts.value = await response.json()
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAccountById = async (id: string) => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!response.ok) throw new Error('Failed to fetch account details.')
      selectedAccount.value = await response.json()
    } catch (error) {
      console.error('Error fetching account details:', error)
    } finally {
      isLoading.value = false
    }
  }

  const updateAccount = async (id: string, data: object) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data)
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
  
  const createAccount = async (data: object) => {
    try {
      const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account.');
      }

      const createdData = await response.json();
      await fetchAccounts(); // Refetch the account list after creating a new account

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
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }

      await fetchAccounts(); // Refetch the account list after deletion

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

  const toggleAccountStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await fetch(`${API_URL}/accounts/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update account status.')
      await fetchAccounts()
    } catch (error) {
      console.error('Error updating account status:', error)
    }
  }

  const updateAccountPrivilege = async (id: string, privilege: string) => {
    try {
      const response = await fetch(`${API_URL}/accounts/${id}/privilege`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ privilege })
      })
      if (!response.ok) throw new Error('Failed to update account privilege.')
      await fetchAccounts()
    } catch (error) {
      console.error('Error updating account privilege:', error)
    }
  }

  return {
    accounts,
    selectedAccount,
    isLoading,
    fetchAccounts,
    fetchAccountById,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
    updateAccountPrivilege,
    createAccount
  }
}
