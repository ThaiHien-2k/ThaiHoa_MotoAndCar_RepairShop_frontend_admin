<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tạo nhân viên mới</h1>
      <NuxtLink
        to="/accounts"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Quay lại
      </NuxtLink>
    </div>

    <form @submit.prevent="handleCreateEmployee" class="space-y-6">
      <!-- Thông tin chung -->
      <section>
        <h2 class="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">Thông tin chung</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="form.email" type="email" placeholder="Email" class="input" />
          <input v-model="form.name" type="text" placeholder="tên" class="input" />
          <input v-model="form.phone" type="text" placeholder="Số điện thoại" class="input" />

        
          <select v-model="form.position" class="input">
            <option disabled value="">Chọn chức vụ</option>
            <option>Nhân viên</option>
            <option>Quản lý</option>
            <option>Trưởng nhóm</option>
          </select>
        
          <label>
            Loại hợp đồng
          <select v-model="form.employment_type" class="input">
            <option disabled value="">Chọn loại hợp đồng</option>
            <option value="full_time">Toàn thời gian</option>
            <option value="part_time">Bán thời gian</option>
            <option value="contract">Hợp đồng dài hạn</option>
          </select>
        </label>
          <label>
            Ngày bắt đầu làm việc
            <input v-model="form.hiredDate" type="date" class="input" />
          </label>
        </div>

        <!-- Thông tin ngân hàng -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Thông tin ngân hàng</h3>
          <input v-model="form.bank_account.account_name" type="text" placeholder="Tên chủ tài khoản" class="input" />
          <input v-model="form.bank_account.account_number" type="text" placeholder="Số tài khoản" class="input" />
          <input v-model="form.bank_account.bank_name" type="text" placeholder="Tên ngân hàng" class="input" />
          <input
            v-model="form.bank_account.expiry_date"
            type="text"
            placeholder="MMYY"
            maxlength="4"
            class="input"
            @input="validateExpiryDate"
          />
        </div>

        <!-- Chuyên môn & chứng chỉ -->
        <div class="mt-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Chuyên môn (phân cách bằng dấu phẩy)
          </label>
          <input v-model="specializationsText" type="text" class="input" placeholder="VD: Sửa chữa động cơ, Thay lốp xe" />
        </div>

        <div class="mt-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Chứng chỉ (phân cách bằng dấu phẩy)
          </label>
          <input v-model="certificationsText" type="text" class="input" placeholder="VD: Chứng chỉ sửa chữa động cơ" />
        </div>
      </section>

      <!-- Lương & Thu nhập -->
      <section>
        <h2 class="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">Lương & Thu nhập</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model.number="form.salary.base_salary" type="number" placeholder="Lương cơ bản" class="input" @focus="selectOnFocus" @input="calculateNetSalary" />
          <input :value="form.salary.net_salary" type="number" disabled placeholder="Lương thực nhận (tự tính)" class="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
        </div>

        <!-- Phụ cấp -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Phụ cấp</h3>
          <div v-for="(item, index) in form.salary.allowances" :key="index" class="grid grid-cols-2 gap-2 mb-2">
            <select v-model="item.type" class="input">
              <option disabled value="">Chọn loại</option>
              <option>Ăn trưa</option>
              <option>Xăng xe</option>
              <option>Điện thoại</option>
              <option>Khác</option>
            </select>
            <input
              v-if="item.type === 'Khác'"
              v-model="item.type"
              placeholder="Loại phụ cấp"
              class="input"
            />
            <input
              v-model.number="item.amount"
              type="number"
              placeholder="Số tiền / %"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="calculateNetSalary"
            />
          </div>
          <button type="button" @click="addAllowance" class="btn-secondary mt-2">+ Thêm phụ cấp</button>
        </div>

        <!-- Khấu trừ -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Khấu trừ</h3>
          <div v-for="(item, index) in form.salary.deductions" :key="index" class="grid grid-cols-2 gap-2 mb-2">
            <select v-model="item.type" class="input">
              <option disabled value="">Chọn loại</option>
              <option>Bảo hiểm</option>
              <option>Thuế</option>
              <option>Khác</option>
            </select>
            <input
              v-if="item.type === 'Khác'"
              v-model="item.type"
              placeholder="Loại khấu trừ"
              class="input"
            />
            <input
              v-model.number="item.amount"
              type="number"
              placeholder="Số tiền / %"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="calculateNetSalary"
            />
          </div>
          <button type="button" @click="addDeduction" class="btn-secondary mt-2">+ Thêm khấu trừ</button>
        </div>
      </section>

      <button type="submit" class="btn-primary mt-6">Tạo nhân viên</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useEmployee from '~/composables/useEmployee' 
import { useNotificationStore } from '~/stores/notificationStore'

const { createEmployee,isLoading } = useEmployee()
const notificationStore = useNotificationStore()

const router = useRouter();
interface Salary {
  base_salary: number
  net_salary: number
  allowances: { type: string, amount: number }[]
  deductions: { type: string, amount: number }[]
  bonuses: { type: string, amount: number, date: string, reason: string }[]
}

interface BankAccount {
  account_name: string
  account_number: string
  bank_name: string
  expiry_date: string
  _id?: string
}

interface EmployeeForm {
  email: string
  name: string
  phone: string
  position: string
  employment_type: string
  status: string
  hiredDate: string
  bank_account: BankAccount
  specializations: string[]
  certifications: string[]
  salary: Salary
}

const form = ref<EmployeeForm>({
  email: '',
  phone: '',
  name: '',
  position: '',
  employment_type: '',
  status: 'active',
  hiredDate: '',
  bank_account: {
    account_name: '',
    account_number: '',
    bank_name: '',
    expiry_date: '',
  },
  specializations: [],
  certifications: [],
  salary: {
    base_salary: 0,
    net_salary: 0,
    allowances: [],
    deductions: [],
    bonuses: []
  }
})

const specializationsText = ref('')
const certificationsText = ref('')

watch(() => form.value.salary, calculateNetSalary, { deep: true })

function calculateNetSalary() {
  const base = form.value.salary.base_salary || 0
  const allowances = form.value.salary.allowances.reduce((sum, item) => sum + (item.amount || 0), 0)
  const deductions = form.value.salary.deductions.reduce((sum, item) => sum + (item.amount || 0), 0)
  form.value.salary.net_salary = base + allowances - deductions
}

function addAllowance() {
  form.value.salary.allowances.push({ type: '', amount: 0 })
}

function addDeduction() {
  form.value.salary.deductions.push({ type: '', amount: 0 })
}

const handleCreateEmployee = async () => {
  isLoading.value = true;

  // Convert specializations & certifications
  form.value.specializations = specializationsText.value.split(',').map(s => s.trim())
  form.value.certifications = certificationsText.value.split(',').map(c => c.trim())

  const dataToSend = {
    email: form.value.email,
    name: form.value.name,
    phone: form.value.phone,
    position: form.value.position,
    employment_type: form.value.employment_type,
    status: form.value.status,
    hiredDate: form.value.hiredDate,
    bank_account: form.value.bank_account,
    salary: form.value.salary,
    specializations: form.value.specializations,
    certifications: form.value.certifications
  }

  const result = await createEmployee(dataToSend)

  if (result.success) {
    notificationStore.showNotification('Tạo nhân viên thành công', 'success')
    router.push('/employees')
  } else {
    notificationStore.showNotification(result.message || 'Tạo nhân viên thất bại', 'error')
  }

  isLoading.value = false
}


function validateExpiryDate(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 4)

  if (value.length >= 2) {
    const month = parseInt(value.slice(0, 2), 10)
    if (month > 12) value = '12' + value.slice(2)
  }

  form.value.bank_account.expiry_date = value
}

function selectOnFocus(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.value !== '0') input.select()
}

definePageMeta({ layout: 'admin' })
</script>

<style scoped>
.input {
  @apply p-2 border border-gray-300 dark:border-gray-600 rounded w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}

.btn-secondary {
  @apply text-sm text-blue-500 hover:underline;
}
</style>
