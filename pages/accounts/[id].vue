<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Chi tiết tài khoản</h1>

    <div v-if="notification.visible" 
         :class="notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
         class="p-4 mb-4 rounded-lg">
      {{ notification.message }}
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400">Đang tải...</div>

    <div v-else-if="selectedAccount" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <label class="block mb-2 text-gray-700 dark:text-gray-300">Tên</label>
      <input v-model="accountData.name" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Email</label>
      <input v-model="accountData.email" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Quyền</label>
      <select v-model="accountData.privilege" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option value="0">Admin</option>
        <option value="1">Manager</option>
        <option value="2">User</option>
      </select>

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Trạng thái</label>
      <select v-model="accountData.is_active" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option value="true">Hoạt động</option>
        <option value="false">Ngừng hoạt động</option>
      </select>

      <div class="flex gap-4 mt-6">
        <button @click="updateAccountHandler" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          Lưu
        </button>
        <button @click="navigateToAccounts" 
          class="bg-gray-600 hover:bg-gray-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotification from '@/composables/useNotification'
import useAccount from '@/composables/useAccount'

const { notification, showNotification, setNotificationForNextPage } = useNotification()
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
  accountData.value._id = newVal._id
  accountData.value.name = newVal.name
  accountData.value.email = newVal.email
  accountData.value.privilege = newVal.privilege
  accountData.value.is_active = newVal.is_active
})

const navigateToAccounts = () => {
  router.push('/accounts')
}
definePageMeta({ layout: 'admin' })
const updateAccountHandler = async () => {
  try {
    const result = await updateAccount(accountData.value._id, accountData.value)

    if (result.success) {
      setNotificationForNextPage('Cập nhật tài khoản thành công!', 'success')
      navigateToAccounts()
    } else {
      throw new Error(result.message || 'Cập nhật tài khoản thất bại.')
    }
  } catch (error) {
    showNotification('Cập nhật tài khoản thất bại. Vui lòng thử lại.', 'error')
    console.error('Error updating account:', error)
  }
}
</script>

<style scoped>
</style>
