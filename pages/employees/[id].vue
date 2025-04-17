<template>
  <div class="p-6 relative" v-if="employee">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('employees.general.employee_details') }}</h1>
      <NuxtLink
        to="/employees"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {{ $t('employees.general.back') }}
      </NuxtLink>
    </div>

    <section class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{{ $t('employees.info.general') }}</h2>
        <InfoRow label="employees.info.email" :value="employee.email" />
        <InfoRow label="employees.info.phone" :value="employee.phone" />
        <InfoRow label="employees.info.position" :value="employee.position" />
        <InfoRow label="employees.info.employment_type" :value="employmentTypeLabel" />
        <InfoRow label="employees.info.hired_date" :value="formatDate(employee.hiredDate)" />
      </div>

      <div v-if="employee && employee.bank_account">
        <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">{{ $t('employees.bank.general') }}</h2>
        <InfoRow label="employees.bank.account_name" :value="employee.bank_account.account_name" />
        <InfoRow label="employees.bank.account_number" :value="employee.bank_account.account_number" />
        <InfoRow label="employees.bank.bank_name" :value="employee.bank_account.bank_name" />
        <InfoRow label="employees.bank.expiry_date" :value="employee.bank_account.expiry_date" />
      </div>

      <div>
        <InfoRow label="employees.info.specializations" :value="employee.specializations.join(', ')" />
        <InfoRow label="employees.info.certifications" :value="employee.certifications.join(', ')" />
      </div>

      <div>
        <h2 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">{{ $t('employees.salary.general') }}</h2>
        <InfoRow label="employees.salary.base_salary" :value="formatCurrency(employee.salary.base_salary)" />
        <InfoRow label="employees.salary.net_salary" :value="formatCurrency(employee.salary.net_salary)" />

        <div v-if="employee.salary.allowances.length" class="mt-4">
          <h3 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">{{ $t('employees.salary.allowances') }}</h3>
          <ul class="text-gray-600 dark:text-gray-300 font-medium">
            <li v-for="(item, index) in employee.salary.allowances" :key="index">
              {{ item.type }}: {{ formatCurrency(item.amount) }}
            </li>
          </ul>
        </div>

        <div v-if="employee.salary.deductions.length" class="mt-4">
          <h3 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">{{ $t('employees.salary.deductions') }}</h3>
          <ul class="text-gray-600 dark:text-gray-300 font-medium">
            <li v-for="(item, index) in employee.salary.deductions" :key="index">
              {{ item.type }}: {{ formatCurrency(item.amount) }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="p-6">
    <p class="text-gray-600 dark:text-gray-300">{{ $t('employees.general.loading') }}</p>
  </div>
</template>



<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import InfoRow from '@/components/InfoRow.vue'
import useEmployee from '~/composables/useEmployee'
import { useI18n } from 'vue-i18n'
  
const { t } = useI18n()

const route = useRoute()
const { fetchEmployeeById, selectedEmployee } = useEmployee()

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    fetchEmployeeById(id)
  }
})

const employee = computed(() => selectedEmployee.value)

const employmentTypeLabel = computed(() => {
  switch (employee.value?.employment_type) {
    case 'full_time':
      return t('employees.info.full_time')
    case 'part_time':
      return t('employees.info.part_time')
    case 'contract':
      return t('employees.info.contract')
    default:
      return employee.value?.employment_type || ''
  }
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('vi-VN', options)
}

definePageMeta({ layout: 'admin' })
</script>



<style scoped>
</style>
