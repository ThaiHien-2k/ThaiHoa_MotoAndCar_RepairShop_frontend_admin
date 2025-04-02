<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('customers.manageCustomers') }}</h1>
  
    </div>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="filter-item">
          <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('customers.filterByType') }}</label>
          <select v-model="filters.customer_type" class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ t('customers.all') }}</option>
            <option value="0">{{ t('customers.VIP') }}</option>
            <option value="1">{{ t('customers.normal') }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('customers.filterByNameOrEmail') }}</label>
          <input
            v-model="filters.query"
            type="text"
            :placeholder="t('customers.enterNameOrEmail')"
            class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
    <div
      v-if="notificationStore.visible"
      :class="notificationStore.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      class="notification"
    >
      {{ notificationStore.message }}
    </div>
    <div class="overflow-x-auto pt-6">
      <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <th class="p-3 hidden w-20">{{ t('customers.id') }}</th>
            <th class="p-3 w-60 text-left">{{ t('customers.name') }}</th>
            <th class="p-3 w-60 text-left">{{ t('customers.email') }}</th>
            <th class="p-3 w-40 text-left">{{ t('customers.phone') }}</th>
            <th class="p-3 w-80 text-left">{{ t('customers.address') }}</th>
            <th class="p-3 w-40 text-left">{{ t('customers.type') }}</th>
            <th class="p-3 w-40 text-center">{{ t('customers.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in processedCustomers"
            :key="customer._id"
            class="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
          >
            <td class="p-3 hidden">{{ customer._id }}</td>
            <td class="p-3">{{ customer.name }}</td>
            <td class="p-3">{{ customer.email }}</td>
            <td class="p-3">{{ customer.phone }}</td>
            <td class="p-3">{{ customer.address }}</td>
            <td class="p-3">{{ customer.customer_type_label }}</td>
            <td class="p-3 flex justify-center gap-3">
              <NuxtLink
                :to="`/customers/${customer._id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ t('customers.view') }}
              </NuxtLink>
             
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('customers.confirmDelete') }}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          {{ t('customers.confirmDeleteMessage', { name: selectedCustomer?.name }) }}
        </p>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('customers.cancel') }}
          </button>
    
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useCustomer from '@/composables/useCustomer';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const notificationStore = useNotificationStore();
const { customers, fetchCustomers, deleteCustomer } = useCustomer();

const isConfirming = ref(false);
const selectedCustomer = ref(null);

const filters = ref({
  customer_type: '',
  query: ''
});

const processedCustomers = computed(() => {
  return customers.value
    .map((customer) => ({
      ...customer,
      customer_type_label: customer.customer_type === '0' ? t('customers.VIP') : t('customers.normal'),
    }))
    .filter((customer) => {
      const matchesType =
        !filters.value.customer_type || customer.customer_type === filters.value.customer_type;
      const matchesQuery =
        !filters.value.query ||
        customer.name.toLowerCase().includes(filters.value.query.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.value.query.toLowerCase());

      return matchesType && matchesQuery;
    });
});



onMounted(() => {
  fetchCustomers();
});

definePageMeta({ layout: 'admin' });
</script>