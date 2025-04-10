<template>
    <div class="p-6 relative">
      <div class="relative flex justify-between items-center">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          {{ t('employees.manageEmployees') }}
        </h1>
        <NuxtLink
          to="/employees/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {{ t('employees.createEmployee') }}
        </NuxtLink>
      </div>
  
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-2">
              {{ t('employees.filterByType') }}
            </label>
            <select
              v-model="filters.employment_type"
              class="input-field w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ t('employees.all') }}</option>
              <option value="full_time">{{ t('employees.fullTime') }}</option>
              <option value="part_time">{{ t('employees.partTime') }}</option>
              <option value="contract">{{ t('employees.contract') }}</option>
            </select>
          </div>
  
          <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-2">
              {{ t('employees.filterByStatus') }}
            </label>
            <select
              v-model="filters.status"
              class="input-field w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{{ t('employees.all') }}</option>
              <option value="active">{{ t('employees.active') }}</option>
              <option value="inactive">{{ t('employees.inactive') }}</option>
            </select>
          </div>
  
          <div>
            <label class="block text-gray-700 dark:text-white font-medium mb-2">
              {{ t('employees.filterByNameOrEmail') }}
            </label>
            <input
              v-model="filters.query"
              type="text"
              :placeholder="t('employees.enterNameOrEmail')"
              class="input-field w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
  
      <div class="overflow-x-auto pt-6">
        <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
              <th class="p-3 w-40 text-left">{{ t('employees.name') }}</th>
              <th class="p-3 w-60 text-left">{{ t('employees.email') }}</th>
              <th class="p-3 w-60 text-left">{{ t('employees.position') }}</th>
              <th class="p-3 w-32 text-center">{{ t('employees.status') }}</th>
              <th class="p-3 w-40 text-center">{{ t('employees.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="employee in filteredEmployees"
              :key="employee._id"
              class="border-t hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
            >
              <td class="p-3">
                <span
                  class="cursor-help"
                  :title="employee.specializations.join(', ') + '\n' + employee.certifications.join(', ')"
                >
                  {{ employee.name }}
                </span>
              </td>
              <td class="p-3">{{ employee.email }}</td>
              <td class="p-3">
                {{ employee.position }}
              </td>

              <td class="p-3 text-center">
                <span
                  class="px-2 py-1 text-sm font-semibold rounded-lg"
                  :class="{
                    'bg-green-600 text-white': employee.status === 'active',
                    'bg-red-600 text-white': employee.status === 'inactive'
                  }"
                >
                  {{ t(`employees.${employee.status}`) }}
                </span>
              </td>
              <td class="p-3 flex justify-center gap-3">
                <NuxtLink
                  :to="`/employees/${employee._id}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ t('employees.view') }}
                </NuxtLink>
                <button
                  @click="confirmDelete(employee)"
                  class="text-red-600 dark:text-red-400 hover:underline"
                >
                  {{ t('employees.delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <div
        v-if="isConfirming"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('employees.confirmDelete') }}
          </h2>
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            {{ t('employees.confirmDeleteMessage', { name: selectedEmployee?.name }) }}
          </p>
          <div class="mt-4 flex justify-end gap-3">
            <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
              {{ t('employees.cancel') }}
            </button>
            <button @click="deleteEmployeeHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              {{ t('employees.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import useEmployee from '@/composables/useEmployee'
  import { useNotificationStore } from '@/stores/notificationStore'
  import { useI18n } from 'vue-i18n'
  
  
  const { t } = useI18n()
  const notificationStore = useNotificationStore()
  const { employees, fetchEmployees, deleteEmployee } = useEmployee()
  
  const isConfirming = ref(false)
  const selectedEmployee = ref<Employee | null>(null)
  
  const filters = ref({
    employment_type: '',
    status: '',
    query: ''
  })
  
  const filteredEmployees = computed(() => {
    return employees.value.filter((emp) => {
      const matchType = !filters.value.employment_type || emp.employment_type === filters.value.employment_type
      const matchStatus = !filters.value.status || emp.status === filters.value.status
      const matchQuery =
        !filters.value.query ||
        emp.name.toLowerCase().includes(filters.value.query.toLowerCase()) ||
        emp.email.toLowerCase().includes(filters.value.query.toLowerCase())
      return matchType && matchStatus && matchQuery
    })
  })
  
  const confirmDelete = (employee: Employee) => {
    selectedEmployee.value = employee
    isConfirming.value = true
  }
  
  const deleteEmployeeHandler = async () => {
    const employee = selectedEmployee.value
    if (!employee || !employee._id) return
  
    try {
      const result = await deleteEmployee(employee._id)
      if (result.success) {
        notificationStore.showNotification(t('employees.deleteSuccess'), 'success')
        fetchEmployees()
      } else {
        throw new Error('Failed to delete employee')
      }
    } catch (error) {
      notificationStore.showNotification(t('employees.deleteFail'), 'error')
      console.error(error)
    } finally {
      isConfirming.value = false
      selectedEmployee.value = null
    }
  }
  
  onMounted(() => {
    fetchEmployees()
  })
  
  definePageMeta({ layout: 'admin' })
  </script>
  