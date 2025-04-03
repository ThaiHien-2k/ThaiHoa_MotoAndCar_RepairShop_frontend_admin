import { ref } from 'vue';
import useCustomer from './useCustomer'; // Import useCustomer correctly

export default function useAccount() {
  const { createCustomer, deleteCustomer,updateCustomer ,fetchCustomerById, hasCustomer} = useCustomer(); // Destructure deleteCustomer correctly
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
 // Hàm delay giúp chờ một khoảng thời gian nhất định trước khi tiếp tục
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hàm cập nhật tài khoản với một khoảng thời gian chờ giữa các yêu cầu
const updateAccountWithDelay = async (id: string, data: FormData, type: string) => {
  await delay(500); // Chờ 500ms trước khi gửi yêu cầu (tùy chỉnh theo nhu cầu)
  return await updateAccount(id, data, type);
};

const updateAccount = async (id: string, data: FormData, type: string) => {
  if (type === 'toUser') {
    return await updateAccountToUser(id, data);
  } else if (type === 'toAdmin') {
    return await updateAccountToAdmin(id, data);
  } else {
    return await updateAccountNochange(id, data);
  }
};

const updateAccountToAdmin = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update account.');
    }

    const updatedData = await response.json();
    if (await hasCustomer(updatedData.account._id)) {
      await deleteCustomer(id);
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

const updateAccountNochange = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update account.');
    }

    let phone = '';
    let address = '';
    for (let [key, value] of data.entries()) {
      if (key === 'phone' && typeof value === 'string') {
        phone = value;
      } else if (key === 'address' && typeof value === 'string') {
        address = value;
      }
    }

    const updatedData = await response.json();
    const dataCustomer = {
      name: updatedData.account.name,
      email: updatedData.account.email,
      phone: phone,
      address: address,
      accounts_id: updatedData.account._id,
      customer_type: updatedData.account.role_description,
    };

    if (await hasCustomer(updatedData.account._id)) {
      await updateCustomer(id, dataCustomer);
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

const updateAccountToUser = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update account.');
    }

    let phone = '';
    let address = '';
    for (let [key, value] of data.entries()) {
      if (key === 'phone' && typeof value === 'string') {
        phone = value;
      } else if (key === 'address' && typeof value === 'string') {
        address = value;
      }
    }

    const updatedData = await response.json();
    const dataCustomer = {
      name: updatedData.account.name,
      email: updatedData.account.email,
      phone: phone,
      address: address,
      accounts_id: updatedData.account._id,
      customer_type: updatedData.account.role_description,
    };

    if (!await hasCustomer(updatedData.account._id)) {
      await createCustomer(dataCustomer);
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


  const createAccount = async (data: FormData) => {
    try {
      const accountResponse = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: data,
      });
  
      if (!accountResponse.ok) {
        const errorData = await accountResponse.json();
        throw new Error(`API /accounts (Create Account) failed: ${errorData.message || 'Unknown error'}`);
      }
  
      const createdData = await accountResponse.json();
  
      // Dữ liệu tạo khách hàng
      const dataCustomer = {
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
        address: data.get('address'),
        accounts_id: createdData.account._id,
        customer_type: createdData.account.privilege,
      };
  
      // Nếu tài khoản có quyền khách hàng, tạo khách hàng
      if (createdData.account.privilege === '2') {
        const createCustomerResponse = await createCustomer(dataCustomer);
        if (!createCustomerResponse.success) {
          // Nếu tạo khách hàng thất bại, rollback bằng cách xóa tài khoản
          const deleteResponse = await fetch(`${API_URL}/accounts/${createdData.account._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
  
          if (!deleteResponse.ok) {
            const deleteErrorData = await deleteResponse.json();
            throw new Error(`Rollback failed at /accounts (Delete Account): ${deleteErrorData.message || 'Unknown error'}`);
          }
  
          // Nếu rollback thành công, ném lỗi đã tạo khách hàng thất bại
          throw new Error('Failed to create customer, account has been deleted.');
        }
      }
  
      // Cập nhật lại danh sách tài khoản
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
      if (await hasCustomer(id)) {
      const customerResponse = await deleteCustomer(id);
  
      if (!customerResponse.success) {
        throw new Error(`API /customers (Delete Customer) failed: ${customerResponse.message}`);
      }
    }
      const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API /accounts (Delete Account) failed: ${errorData.message || 'Unknown error'}`);
      }
  
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
    updateAccountWithDelay,
  };
}
