<template>
  <div class="p-6 relative" v-if="employee">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Chi tiết nhân viên</h1>
      <NuxtLink
        to="/employees"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Quay lại
      </NuxtLink>
    </div>

    <section class="space-y-6">
      <!-- Thông tin chung -->
      <div>
        <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Thông tin chung</h2>
        <InfoRow label="Email" :value="employee.email" />
        <InfoRow label="Số điện thoại" :value="employee.phone" />
        <InfoRow label="Chức vụ" :value="employee.position" />
        <InfoRow label="Loại hợp đồng" :value="employmentTypeLabel" />
        <InfoRow label="Ngày bắt đầu làm việc" :value="formatDate(employee.hiredDate)" />
      </div>

      <!-- Thông tin ngân hàng -->
      <div v-if="employee && employee.bank_account">
        <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Thông tin ngân hàng</h2>
        <InfoRow label="Tên chủ tài khoản" :value="employee.bank_account.account_name" />
        <InfoRow label="Số tài khoản" :value="employee.bank_account.account_number" />
        <InfoRow label="Ngân hàng" :value="employee.bank_account.bank_name" />
        <InfoRow label="Ngày hết hạn" :value="employee.bank_account.expiry_date" />
      </div>


      <!-- Chuyên môn và chứng chỉ -->
      <div>
        <InfoRow label="Chuyên môn" :value="employee.specializations.join(', ')" />
        <InfoRow label="Chứng chỉ" :value="employee.certifications.join(', ')" />
      </div>

      <!-- Lương & Thu nhập -->
      <div>
        <h2 class="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">Lương & Thu nhập</h2>
        <InfoRow label="Lương cơ bản" :value="formatCurrency(employee.salary.base_salary)" />
        <InfoRow label="Lương thực nhận" :value="formatCurrency(employee.salary.net_salary)" />

        <!-- Phụ cấp -->
        <div v-if="employee.salary.allowances.length" class="mt-4">
          <h3 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Phụ cấp</h3>
          <ul class=" text-gray-600 dark:text-gray-300 font-medium">
            <li v-for="(item, index) in employee.salary.allowances" :key="index">
              {{ item.type }}: {{ formatCurrency(item.amount) }}
            </li>
          </ul>
        </div>

        <!-- Khấu trừ -->
        <div v-if="employee.salary.deductions.length" class="mt-4">
          <h3 class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Khấu trừ</h3>
          <ul class=" text-gray-600 dark:text-gray-300 font-medium">
            <li v-for="(item, index) in employee.salary.deductions" :key="index">
              {{ item.type }}: {{ formatCurrency(item.amount) }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="p-6">
    <p class="text-gray-600 dark:text-gray-300">Đang tải dữ liệu nhân viên...</p>
  </div>
</template>


<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import InfoRow from '@/components/InfoRow.vue'
import useEmployee from '~/composables/useEmployee'

const route = useRoute()
const { fetchEmployeeById, selectedEmployee } = useEmployee()

// Gọi API khi component được mount
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    fetchEmployeeById(id)
  }
})

// Tạo alias để dễ sử dụng trong template
const employee = computed(() => selectedEmployee.value)

// Gán nhãn cho loại hợp đồng
const employmentTypeLabel = computed(() => {
  switch (employee.value?.employment_type) {
    case 'full_time':
      return 'Toàn thời gian'
    case 'part_time':
      return 'Bán thời gian'
    case 'contract':
      return 'Hợp đồng dài hạn'
    default:
      return employee.value?.employment_type || ''
  }
})

// Format tiền VND
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
