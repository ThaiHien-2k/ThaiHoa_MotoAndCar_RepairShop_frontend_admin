<template>
  <div class="p-6 relative">
    <div class="relative">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('accounts.detailsTitle') }}</h1>

      <div
        v-if="notificationStore.visible"
        :class="notificationStore.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        class="notification"
      >
        {{ notificationStore.message }}
      </div>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400">{{ t('accounts.loading') }}</div>

    <div v-else-if="selectedAccount" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div class="flex flex-col items-center mb-4">
        <img
          :src="accountData.avatar ? imageUrl + accountData.avatar :  defaultAvatar"
          alt="Avatar"
          class="w-32 h-32 rounded-full shadow-lg mb-2"
        />
        <input type="file" @change="onAvatarChange" class="hidden" ref="avatarInput" />
        <button @click="triggerFileInput" class="text-blue-600 hover:underline">
          {{ t('accounts.changeAvatar') }}
        </button>
      </div>

      <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.name') }}</label>
      <input v-model="accountData.name" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.email') }}</label>
      <input v-model="accountData.email" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled />

      <div >
      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.phone') }}</label>
      <input 
        v-model="accountData.phone" 
        class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" 
      />

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.address') }}</label>
      <input 
        v-model="accountData.address" 
        class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" 
      />
    </div>
      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.privilege') }}</label>
      <select v-model="accountData.privilege" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option value="0">{{ t('accounts.admin') }}</option>
        <option value="1">{{ t('accounts.manager') }}</option>
        <option value="2">{{ t('accounts.user') }}</option>
      </select>

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.roleDescription') }}</label>
      <select v-model="accountData.role_description" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white">
        <option v-for="(role, index) in roleOptions[accountData.privilege]" :key="index" :value="index">
          {{ role }}
        </option>
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
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notificationStore';
import useAccount from '@/composables/useAccount';
import { useI18n } from 'vue-i18n';
import defaultAvatar from '@/assets/default_avatar.svg';
import useCustomer from '@/composables/useCustomer';

const imageUrl = useRuntimeConfig().public.URL_IMAGE_AVATAR;
const { t } = useI18n();
definePageMeta({ layout: 'admin' });

const notificationStore = useNotificationStore();
const { selectedAccount, isLoading, fetchAccountById, updateAccount ,updateAccountWithDelay} = useAccount();
const {getCustomerByAccountId , hasCustomer} =useCustomer();

const route = useRoute();
const router = useRouter();
const avatarInput = ref(null);


const accountData = ref({
  _id: '',
  name: '',
  email: '',
  privilege: '',
  is_active: '',
  role_description: 0, 
  avatar: '',
  phone: '', 
  address: '', 
});


onMounted(async () => {
  const customerExists = await hasCustomer(route.params.id);
  
  if (customerExists) {
    const customerData = await getCustomerByAccountId(route.params.id);

    accountData.value = {
      ...accountData.value,
      phone: customerData.value.phone,
      address: customerData.value.address,
    };
  }
});



const roleOptions = computed(() => ({
  '0': [
    t('accounts.adminRole1'), // 0: Super Admin
    t('accounts.adminRole2'), // 1: Admin
  ],
  '1': [
    t('accounts.managerRole1'), // 2: Manager Level 1
    t('accounts.managerRole2'), // 3: Manager Level 2
    t('accounts.managerRole3'), // 4: Manager Level 3
  ],
  '2': [
    t('accounts.userRole1'), // 5: Regular User
    t('accounts.userRole2'), // 6: Guest User
  ],
}));

onMounted(() => {
  fetchAccountById(route.params.id);
});

watch(selectedAccount, (newVal) => {
  if (newVal) {
    accountData.value = { ...newVal };
  }
});

const navigateToAccounts = () => {
  router.push('/accounts');
};

const triggerFileInput = () => {
  avatarInput.value.click();
};

const onAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      accountData.value.avatar = reader.result; // Hiển thị ảnh xem trước
    };
    reader.readAsDataURL(file);
  }
};

const updateAccountHandler = async () => {
  try {
    const formData = new FormData();
    formData.append('_id', accountData.value._id);
    formData.append('name', accountData.value.name);
    formData.append('email', accountData.value.email);
    formData.append('privilege', accountData.value.privilege);
    formData.append('is_active', accountData.value.is_active);
    formData.append('phone',accountData.value.phone);
    formData.append('address', accountData.value.address)
    formData.append('role_description', accountData.value.role_description);

    // Nếu avatar là file, thêm vào FormData
    if (avatarInput.value.files[0]) {
      formData.append('avatar', avatarInput.value.files[0]);
    }

    // Xác định logic chuyển đổi quyền
    let privilegeChange = 'noChange';
    if ((selectedAccount.value.privilege === '0' || selectedAccount.value.privilege === '1') && accountData.value.privilege === '2') {
      privilegeChange = 'toUser';
    } else if (selectedAccount.value.privilege === '2' && (accountData.value.privilege === '0' || accountData.value.privilege === '1')) {
      privilegeChange = 'toAdmin';
    }
    console.log('privilegeChange:', privilegeChange);
    // Gọi API cập nhật tài khoản
    const result = await updateAccountWithDelay(accountData.value._id, formData, privilegeChange);

    if (result.success) {
      notificationStore.showNotification(t('accounts.updateSuccess'), 'success');
      navigateToAccounts();
    } else {
      throw new Error(result.message || t('accounts.updateFail'));
    }
  } catch (error) {
    notificationStore.showNotification(t('accounts.updateFailRetry'), 'error');
    console.error('Error updating account:', error);
  }
};


</script>

<style scoped>
</style>
