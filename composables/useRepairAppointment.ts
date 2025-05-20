import { ref } from 'vue';

export default function useRepairAppointment() {
  const config = useRuntimeConfig();
  const API_URL = `${config.public.BACKEND_API_URL}/repair-appointments`;

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('access_token') || '';
    }
    return '';
  };

  const appointments = ref([]);
  const selectedAppointment = ref(null);
  const isLoading = ref(false);

  // Fetch all repair appointments
  const fetchAppointments = async () => {
    try {
      isLoading.value = true;
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to fetch repair appointments.');
      appointments.value = await response.json();
    } catch (error) {
      console.error('Error fetching repair appointments:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    appointments,
    selectedAppointment,
    isLoading,
    fetchAppointments,
  };
}