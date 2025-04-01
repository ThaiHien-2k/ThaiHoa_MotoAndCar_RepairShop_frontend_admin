<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Quản lý tài khoản</h1>
      
      <NuxtLink
        to="/accounts/create"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        + Tạo tài khoản mới
      </NuxtLink>
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
            <th class="p-3 hidden">ID</th>
            <th class="p-3">Tên</th>
            <th class="p-3">Email</th>
            <th class="p-3">Quyền</th>
            <th class="p-3">Phân loại quyền</th>
            <th class="p-3">Trạng thái</th>
            <th class="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="account in accounts"
            :key="account._id"
            class="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
          >
            <td class="p-3 hidden">{{ account._id }}</td>
            <td class="p-3">{{ account.name }}</td>
            <td class="p-3">{{ account.email }}</td>
            <td class="p-3">
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
                    ? 'Admin'
                    : account.privilege === '1'
                    ? 'Manager'
                    : 'User'
                }}
              </span>
            </td>
            <td class="p-3">{{ account.role_description }}</td>
            <td class="p-3">
              <span
                class="px-2 py-1 text-sm font-semibold rounded-lg"
                :class="{
                  'bg-green-600 text-white': account.is_active,
                  'bg-red-600 text-white': !account.is_active
                }"
              >
                {{ account.is_active ? 'Active' : 'Stop' }}
              </span>
            </td>
            <td class="p-3 flex gap-3">
              <NuxtLink
                :to="`/accounts/${account._id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Xem
              </NuxtLink>
              <button
                @click="confirmDelete(account)"
                class="text-red-600 dark:text-red-400 hover:underline"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup xác nhận xóa -->
    <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Xác nhận xóa</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-300">Bạn có chắc muốn xóa tài khoản <strong>{{ selectedAccount?.name }}</strong>?</p>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">Hủy</button>
          <button @click="deleteAccountHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useAccount from '@/composables/useAccount'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()
const { accounts, fetchAccounts, deleteAccount } = useAccount()

const isConfirming = ref(false) // Trạng thái hiển thị popup xác nhận
const selectedAccount = ref(null) // Lưu tài khoản đang muốn xóa

onMounted(() => {
  fetchAccounts()
})

definePageMeta({ layout: 'admin' })

const confirmDelete = (account) => {
  selectedAccount.value = account
  isConfirming.value = true
}

const deleteAccountHandler = async () => {
  if (!selectedAccount.value) return

  try {
    const result = await deleteAccount(selectedAccount.value._id)
    if (result.success) {
      notificationStore.showNotification('Xóa tài khoản thành công!', 'success')
      fetchAccounts()
    } else {
      throw new Error('Failed to delete the account')
    }
  } catch (error) {
    notificationStore.showNotification('Xóa tài khoản thất bại!', 'error')
    console.error(error)
  } finally {
    isConfirming.value = false
    selectedAccount.value = null
  }
}
</script>
