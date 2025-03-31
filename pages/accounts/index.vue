<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Quản lý tài khoản</h1>

    <!-- Thông báo -->
    <div v-if="notification.visible" 
         :class="notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
         class="p-4 mb-4 rounded-lg">
      {{ notification.message }}
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <th class="p-3">ID</th>
            <th class="p-3">Tên</th>
            <th class="p-3">Email</th>
            <th class="p-3">Quyền</th>
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
            <td class="p-3">{{ account._id }}</td>
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
                @click="deleteAccountHandler(account._id)"
                class="text-red-600 dark:text-red-400 hover:underline"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import useAccount from '@/composables/useAccount'
import useNotification from '@/composables/useNotification'

definePageMeta({ layout: 'admin' })

const { accounts, isLoading, fetchAccounts } = useAccount()
const { notification, showNotificationOnPageLoad } = useNotification()
console.log(notification)
onMounted(() => {
  showNotificationOnPageLoad()
  fetchAccounts()
})
</script>