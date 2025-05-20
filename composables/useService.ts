import { ref } from 'vue';

export default function useService() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/services`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const services = ref([]);
  const selectedService = ref(null);
  const isLoading = ref(false);

  // Fetch all services
  const fetchServices = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch services.');
      services.value = await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    services,
    selectedService,
    isLoading,
    fetchServices,
  };
}