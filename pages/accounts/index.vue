<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('accounts.manageAccounts') }}</h1>
      <NuxtLink
        to="/accounts/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {{ t('accounts.createAccount') }}
      </NuxtLink>
    </div>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="filter-item">
          <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('accounts.filterByPrivilege') }}</label>
          <select v-model="filters.privilege" class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ t('accounts.all') }}</option>
            <option value="0">{{ t('accounts.admin') }}</option>
            <option value="1">{{ t('accounts.manager') }}</option>
            <option value="2">{{ t('accounts.user') }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('accounts.filterByStatus') }}</label>
          <select v-model="filters.status" class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">{{ t('accounts.all') }}</option>
            <option value="active">{{ t('accounts.active') }}</option>
            <option value="inactive">{{ t('accounts.inactive') }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('accounts.filterByNameOrEmail') }}</label>
          <input
            v-model="filters.query"
            type="text"
            :placeholder="t('accounts.enterNameOrEmail')"
            class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button
          @click="resetFilters"
          class="submit-button bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        >
          {{ t('accounts.reset') }}
        </button>
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
            <th class="p-3 hidden w-20">{{ t('accounts.id') }}</th>
            <th class="p-3 w-40 text-left">{{ t('accounts.name') }}</th>
            <th class="p-3 w-60 text-left">{{ t('accounts.email') }}</th>
            <th class="p-3 w-32 text-center">{{ t('accounts.privilege') }}</th>
            <th class="p-3 w-40 text-left">{{ t('accounts.roleDescription') }}</th>
            <th class="p-3 w-32 text-center">{{ t('accounts.status') }}</th>
            <th class="p-3 w-40 text-center">{{ t('accounts.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account in filteredAccounts"
            :key="account._id"
            class="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
          >
            <td class="p-3 hidden">{{ account._id }}</td>
            <td class="p-3">{{ account.name }}</td>
            <td class="p-3">{{ account.email }}</td>
            <td class="p-3 text-center">
              <span
                class="px-2 py-1 text-sm rounded-lg"
                :class="{
                  'bg-red-500 text-white': account.privilege === '0',
                  'bg-yellow-500 text-white': account.privilege === '1',
                  'bg-green-500 text-white': account.privilege === '2'
                }"
              >
                {{
                  account.privilege === '0'
                    ? t('accounts.admin')
                    : account.privilege === '1'
                    ? t('accounts.manager')
                    : t('accounts.user')
                }}
              </span>
            </td>
            <td class="p-3">{{ account.role_description }}</td>
            <td class="p-3 text-center">
              <span
                class="px-2 py-1 text-sm font-semibold rounded-lg"
                :class="{
                  'bg-green-600 text-white': account.is_active,
                  'bg-red-600 text-white': !account.is_active
                }"
              >
                {{ account.is_active ? t('accounts.active') : t('accounts.inactive') }}
              </span>
            </td>
            <td class="p-3 flex justify-center gap-3">
              <NuxtLink
                :to="`/accounts/${account._id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ t('accounts.view') }}
              </NuxtLink>
              <button
                @click="confirmDelete(account)"
                class="text-red-600 dark:text-red-400 hover:underline"
              >
                {{ t('accounts.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('accounts.confirmDelete') }}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          {{ t('accounts.confirmDeleteMessage', { name: selectedAccount?.name }) }}
        </p>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('accounts.cancel') }}
          </button>
          <button @click="deleteAccountHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {{ t('accounts.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useAccount from '@/composables/useAccount';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const notificationStore = useNotificationStore();
const { accounts, fetchAccounts, deleteAccount } = useAccount();

const isConfirming = ref(false);
const selectedAccount = ref(null);

const filters = ref({
  privilege: '',
  status: '',
  query: ''
});

const filteredAccounts = computed(() => {
  return accounts.value.filter((account) => {
    const matchesPrivilege =
      !filters.value.privilege || account.privilege === filters.value.privilege;
    const matchesStatus =
      !filters.value.status ||
      (filters.value.status === 'active' && account.is_active) ||
      (filters.value.status === 'inactive' && !account.is_active);
    const matchesQuery =
      !filters.value.query ||
      account.name.toLowerCase().includes(filters.value.query.toLowerCase()) ||
      account.email.toLowerCase().includes(filters.value.query.toLowerCase());

    return matchesPrivilege && matchesStatus && matchesQuery;
  });
});

const resetFilters = () => {
  filters.value = {
    privilege: '',
    status: '',
    query: ''
  };
};

const confirmDelete = (account) => {
  selectedAccount.value = account;
  isConfirming.value = true;
};

const deleteAccountHandler = async () => {
  if (!selectedAccount.value) return;

  try {
    const result = await deleteAccount(selectedAccount.value._id);
    if (result.success) {
      notificationStore.showNotification(t('accounts.deleteSuccess'), 'success');
      fetchAccounts();
    } else {
      throw new Error('Failed to delete the account');
    }
  } catch (error) {
    notificationStore.showNotification(t('accounts.deleteFail'), 'error');
    console.error(error);
  } finally {
    isConfirming.value = false;
    selectedAccount.value = null;
  }
};

onMounted(() => {
  fetchAccounts();
});

definePageMeta({ layout: 'admin' });
</script>