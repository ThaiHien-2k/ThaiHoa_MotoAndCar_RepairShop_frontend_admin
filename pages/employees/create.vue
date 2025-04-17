<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('employees.createEmployee.title') }}</h1>
      <NuxtLink
        to="/employees"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {{ $t('employees.createEmployee.backButton') }}
      </NuxtLink>
    </div>

    <form @submit.prevent="handleCreateEmployee" class="space-y-6">
      <!-- General Information -->
      <section>
        <h2 class="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">{{ $t('employees.createEmployee.generalInfo') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="text-green-600 dark:text-green-400">{{ $t('employees.createEmployee.name') }}
            <input v-model="form.name" type="text" :placeholder=" $t('employees.createEmployee.name') " class="input" />
          </label>
          <label class="text-green-600 dark:text-green-400">{{ $t('employees.createEmployee.email') }}
            <input v-model="form.email" type="email" :placeholder="$t('employees.createEmployee.email')" class="input" />
          </label>
          <label class="text-green-600 dark:text-green-400">{{ $t('employees.createEmployee.phone') }}
            <input v-model="form.phone" type="text" :placeholder="$t('employees.createEmployee.phone')" class="input" />
          </label>
          <label class="text-green-600 dark:text-green-400">{{ $t('employees.createEmployee.position') }}
            <select v-model="form.position" class="input">
              <option disabled value="">{{ $t('employees.createEmployee.selectPosition') }}</option>
              <option>{{ $t('employees.createEmployee.employee') }}</option>
              <option>{{ $t('employees.createEmployee.manager') }}</option>
              <option>{{ $t('employees.createEmployee.teamLeader') }}</option>
            </select>
          </label>

          <label class="text-green-600 dark:text-green-400">
            {{ $t('employees.createEmployee.contractType') }}
            <select v-model="form.employment_type" class="input">
              <option disabled value="">{{ $t('employees.createEmployee.selectContractType') }}</option>
              <option value="full_time">{{ $t('employees.createEmployee.fullTime') }}</option>
              <option value="part_time">{{ $t('employees.createEmployee.partTime') }}</option>
              <option value="contract">{{ $t('employees.createEmployee.longTermContract') }}</option>
            </select>
          </label>
          <label class="text-green-600 dark:text-green-400">
            {{ $t('employees.createEmployee.startDate') }}
            <input v-model="form.hiredDate" type="date" class="input" />
          </label>
        </div>

        <!-- Bank Information -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('employees.createEmployee.bankInfo') }}</h3>
          <input v-model="form.bank_account.account_name" type="text" :placeholder="$t('employees.createEmployee.accountHolder')" class="input" />
          <input v-model="form.bank_account.account_number" type="text" :placeholder="$t('employees.createEmployee.accountNumber')" class="input" />
          <input v-model="form.bank_account.bank_name" type="text" :placeholder="$t('employees.createEmployee.bankName')" class="input" />
          <input
            v-model="form.bank_account.expiry_date"
            type="text"
            :placeholder="$t('employees.createEmployee.expiryDate')"
            maxlength="4"
            class="input"
            @input="validateExpiryDate"
          />
        </div>
        
        <!-- Specializations & Certifications -->
        <div class="mt-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('employees.createEmployee.specializations') }}</label>
          <input v-model="specializationsText" type="text" class="input" :placeholder="$t('employees.createEmployee.specializations')" />
        </div>

        <div class="mt-4">
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('employees.createEmployee.certifications') }}</label>
          <input v-model="certificationsText" type="text" class="input" :placeholder=" $t('employees.createEmployee.certifications')" />
        </div>
      </section>

      <!-- Salary & Earnings -->
      <section>
        <h2 class="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">{{ $t('employees.createEmployee.salary') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model.number="form.salary.base_salary" type="number" :placeholder=" $t('employees.createEmployee.baseSalary') " class="input" @focus="selectOnFocus" @input="calculateNetSalary" />
          <input :value="form.salary.net_salary" type="number" disabled :placeholder=" $t('employees.createEmployee.netSalary')" class="input bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
        </div>

        <!-- Allowances -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('employees.createEmployee.allowances') }}</h3>
          <div v-for="(item, index) in form.salary.allowances" :key="index" class="grid grid-cols-3 gap-2 mb-2">
            <select v-model="item.type" class="input">
              <option disabled value="">{{ $t('employees.createEmployee.selectAllowance') }}</option>
              <option>{{ $t('employees.createEmployee.meal') }}</option>
              <option>{{ $t('employees.createEmployee.transport') }}</option>
              <option>{{ $t('employees.createEmployee.phone') }}</option>
              <option>{{ $t('employees.createEmployee.other') }}</option>
            </select>
            <input
              v-if="item.type === 'Khác'"
              v-model="item.type"
              :placeholder=" $t('employees.createEmployee.allowanceType') "
              class="input"
            />
            <input
              v-model.number="item.unit"
              type="number"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="calculateAllowances"
            />
            <input
              v-model.number="item.amount"
              type="number"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="() => handleManualAmountInput(item)" />
          </div>
          <button type="button" @click="addAllowance" class="btn-secondary mt-2">{{ $t('employees.createEmployee.addAllowance') }}</button>
        </div>

        <!-- Deductions -->
        <div class="mt-4">
          <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('employees.createEmployee.deductions') }}</h3>
          <div v-for="(item, index) in form.salary.deductions" :key="index" class="grid grid-cols-3 gap-2 mb-2">
            <select v-model="item.type" class="input">
              <option disabled value="">{{ $t('employees.createEmployee.selectDeduction') }}</option>
              <option>{{ $t('employees.createEmployee.insurance') }}</option>
              <option>{{ $t('employees.createEmployee.tax') }}</option>
              <option>{{ $t('employees.createEmployee.other') }}</option>
            </select>
            <input
              v-if="item.type === 'Khác'"
              v-model="item.type"
              placeholder="{{ $t('employees.createEmployee.deductionType') }}"
              class="input"
            />
            <input
              v-model.number="item.unit"
              type="number"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="calculateDeductions"
            />
            <input
              v-model.number="item.amount"
              type="number"
              class="input"
              min="0"
              @focus="selectOnFocus"
              @input="() => handleManualAmountInput(item)" />
          </div>
          <button type="button" @click="addDeduction" class="btn-secondary mt-2">{{ $t('employees.createEmployee.addDeduction') }}</button>
        </div>
      </section>

      <button type="submit" class="btn-primary mt-6">{{ $t('employees.createEmployee.submitButton') }}</button>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import useEmployee from '~/composables/useEmployee' 
import { useNotificationStore } from '~/stores/notificationStore'
import { useI18n } from 'vue-i18n'
  
  
const { t } = useI18n()
const { createEmployee,isLoading } = useEmployee()
const notificationStore = useNotificationStore()

const router = useRouter();

interface SalaryItem {
  type: string
  amount: number
  unit?: number
}

interface Salary {
  base_salary: number
  net_salary: number
  allowances: SalaryItem[]
  deductions: SalaryItem[]
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

watch(() => form.value.salary.base_salary, () => {
  calculateAllowances()
  calculateDeductions()
})

function calculateNetSalary() {
  const base = form.value.salary.base_salary || 0
  const allowances = form.value.salary.allowances.reduce((sum, item) => sum + (item.amount || 0), 0)
  const deductions = form.value.salary.deductions.reduce((sum, item) => sum + (item.amount || 0), 0)
  form.value.salary.net_salary = base + allowances - deductions
}

function handleManualAmountInput(item: { amount: number; unit?: number }) {
  if (item.unit !== undefined) {
    delete item.unit
  }
  calculateNetSalary()
}


function calculateAllowances() {
  const base = form.value.salary.base_salary || 0

  form.value.salary.allowances.forEach((item) => {
    if (item.unit && item.unit > 0) {
      item.amount = Math.round((base * item.unit) / 100)
    }
  })

  calculateNetSalary()
}

function calculateDeductions() {
  const base = form.value.salary.base_salary || 0
  form.value.salary.deductions.forEach((item) => {
    if (item.unit !== undefined && item.unit !== null) {
      item.amount = Math.round((base * item.unit) / 100)
    }
  })
  calculateNetSalary()
}

function addAllowance() {
  form.value.salary.allowances.push({ type: '', amount: 0 })
}

function addDeduction() {
  form.value.salary.deductions.push({ type: '', amount: 0 })
}

const handleCreateEmployee = async () => {
  isLoading.value = true;

  form.value.specializations = specializationsText.value.split(',').map(s => s.trim());
  form.value.certifications = certificationsText.value.split(',').map(c => c.trim());

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

  const result = await createEmployee(dataToSend);

  if (result.success) {
    notificationStore.showNotification(t('employees.createEmployee.successMessage'), 'success');
    router.push('/employees');
  } else {
    notificationStore.showNotification(result.message || t('employees.createEmployee.errorMessage'), 'error');
  }

  isLoading.value = false;
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
