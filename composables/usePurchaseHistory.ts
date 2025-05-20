import { ref } from 'vue';

export default function usePurchaseHistory() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/purchase-history`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const purchaseHistories = ref([]);
  const selectedPurchaseHistory = ref(null);
  const isLoading = ref(false);

  // Fetch all purchase histories
  const fetchPurchaseHistories = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch purchase histories.');
      purchaseHistories.value = await response.json();
    } catch (error) {
      console.error('Error fetching purchase histories:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    purchaseHistories,
    selectedPurchaseHistory,
    isLoading,
    fetchPurchaseHistories,
  };
}