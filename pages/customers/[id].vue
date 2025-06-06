<template>
  <div class="p-6 relative">
    <div class="relative">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('accounts.detailsTitle') }}</h1>

    </div>

    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400">{{ t('accounts.loading') }}</div>

    <div v-else-if="selectedAccount" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.name') }}</label>
      <input v-model="accountData.name" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.email') }}</label>
      <input v-model="accountData.email" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.privilege') }}</label>
      <select v-model="accountData.privilege" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option value="0">{{ t('accounts.admin') }}</option>
        <option value="1">{{ t('accounts.manager') }}</option>
        <option value="2">{{ t('accounts.user') }}</option>
      </select>

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.status') }}</label>
      <select v-model="accountData.is_active" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option value="true">{{ t('accounts.active') }}</option>
        <option value="false">{{ t('accounts.inactive') }}</option>
      </select>

      <div class="flex gap-4 mt-6">
        <button @click="updateAccountHandler" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          {{ t('accounts.save') }}
        </button>
        <button @click="navigateToAccounts" 
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          {{ t('accounts.back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import useAccount from '@/composables/useAccount'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
definePageMeta({ layout: 'admin' })

const notificationStore = useNotificationStore()
const { selectedAccount, isLoading, fetchAccountById, updateAccount } = useAccount()

const route = useRoute()
const router = useRouter()

const accountData = ref({
  _id: '',
  name: '',
  email: '',
  privilege: '',
  is_active: ''
})

onMounted(() => {
  fetchAccountById(route.params.id)
})

watch(selectedAccount, (newVal) => {
  if (newVal) {
    accountData.value = { ...newVal }
  }
})

const navigateToAccounts = () => {
  router.push('/accounts')
}

const updateAccountHandler = async () => {
  try {
    const result = await updateAccount(accountData.value._id, accountData.value)

    if (result.success) {
      notificationStore.showNotification(t('accounts.updateSuccess'), 'success')
      navigateToAccounts()
    } else {
      throw new Error(result.message || t('accounts.updateFail'))
    }
  } catch (error) {
    notificationStore.showNotification(t('accounts.updateFailRetry'), 'error')
    console.error('Error updating account:', error)
  }
}
</script>

<style scoped>
</style>