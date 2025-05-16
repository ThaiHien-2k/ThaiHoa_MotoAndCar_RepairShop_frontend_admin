<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('accounts.createAccount') }}</h1>
      <NuxtLink
        to="/accounts"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {{ t('accounts.back') }}
      </NuxtLink>
    </div>



    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mx-auto max-w-screen-lg">
      <form @submit.prevent="handleCreateAccount" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.name') }}</label>
          <input v-model="formData.name" type="text" required class="input-field" />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.email') }}</label>
          <input v-model="formData.email" type="email" required class="input-field" />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.password') }}</label>
          <input v-model="formData.password" type="password" required class="input-field" />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.phone') }}</label>
          <input v-model="formData.phone" type="text" required class="input-field" />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.privilege') }}</label>
          <select v-model="formData.privilege" class="input-field" @change="updateRoleDescription">
            <option value="2">{{ t('accounts.user') }}</option>
            <option value="1">{{ t('accounts.manager') }}</option>
            <option value="0">{{ t('accounts.admin') }}</option>
          </select>
        </div>

        <div >
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.roleDescription') }}</label>
          <select v-model="formData.role_description" class="input-field">
            <option v-for="desc in roleOptions[formData.privilege]" :key="desc" :value="desc">
              {{ desc }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.address') }}</label>
          <textarea v-model="formData.address" required class="input-field"></textarea>
        </div>

        <div class="md:col-span-2 text-center">
          <button type="submit" :disabled="isLoading" class="submit-button">
            {{ isLoading ? t('accounts.creating') : t('accounts.createAccount') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useAccount from '~/composables/useAccount';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({ layout: 'admin' });

const router = useRouter();
const notificationStore = useNotificationStore();
const { createAccount } = useAccount();

const roleOptions = computed(() => ({
  '0': [t('accounts.adminRole1'), t('accounts.adminRole2')],
  '1': [t('accounts.managerRole1'), t('accounts.managerRole2'), t('accounts.managerRole3')],
  '2': [t('accounts.userRole1'), t('accounts.userRole2')],
}));

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '', // Added phone field
  address: '', // Added address field
  privilege: '2',
  role_description: roleOptions.value['2'][0],
  is_active: true,
});

const isLoading = ref(false);

const updateRoleDescription = () => {
  formData.value.role_description = roleOptions.value[formData.value.privilege][0];
};

const handleCreateAccount = async () => {
  isLoading.value = true;
  const result = await createAccount(formData.value);
  if (result.success) {
    notificationStore.showNotification(t('accounts.createSuccess'), 'success');
    router.push('/accounts');
  } else {
    notificationStore.showNotification(result.message || t('accounts.createFail'), 'error');
  }
  isLoading.value = false;
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background-color: white;
  transition: border 0.3s ease-in-out;
}
.input-field:focus {
  outline: none;
  border-color: #3b82f6;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;
}
.submit-button:hover {
  background-color: #2563eb;
}
.submit-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>