<template>
  <div class="p-6 relative">
    <div class="relative">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('accounts.accountProfile') }}</h1>


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
      <select v-model="accountData.privilege" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled>
        <option value="0">{{ t('accounts.admin') }}</option>
        <option value="1">{{ t('accounts.manager') }}</option>
        <option value="2">{{ t('accounts.user') }}</option>
      </select>

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.roleDescription') }}</label>
      <select v-model="accountData.role_description" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled>
        <option v-for="(role, index) in roleOptions[accountData.privilege]" :key="index" :value="index">
          {{ role }}
        </option>
      </select>

      <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.status') }}</label>
      <select v-model="accountData.is_active" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" disabled>
        <option value="true">{{ t('accounts.active') }}</option>
        <option value="false">{{ t('accounts.inactive') }}</option>
      </select>

      <div class="flex gap-4 mt-6">
        <button @click="updateAccountHandler" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          {{ t('accounts.save') }}
        </button>
        <button 
          @click="showChangePass = true" 
          class="bg-yellow-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out">
          {{ t('accounts.changePassword') }}
        </button>
      </div>
    </div>
    <div v-if="showChangePass" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
      {{ t('accounts.changePasswordTitle') }}
    </h2>
    
    <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.oldPassword') }}</label>
    <input v-model="passwordForm.oldPassword" type="password" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"  />

    <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.newPassword') }}</label>
    <input v-model="passwordForm.newPassword" type="password" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" />

    <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('accounts.confirmPassword') }}</label>
    <input v-model="passwordForm.confirmPassword" type="password" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"  />

    <div class="flex justify-end gap-3 mt-6">
      <button @click="cancelChangePass" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        {{ t('accounts.cancel') }}
      </button>
      <button @click="handleChangePassword" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        {{ t('accounts.confirm') }}
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import useAccount from '@/composables/useAccount';
import { useI18n } from 'vue-i18n';
import defaultAvatar from '@/assets/default_avatar.svg';
import useCustomer from '@/composables/useCustomer';

const imageUrl = useRuntimeConfig().public.URL_IMAGE_AVATAR;
const { t } = useI18n();
definePageMeta({ layout: 'admin' });

const notificationStore = useNotificationStore();
const { selectedAccount, isLoading, fetchAccountById, changePassword ,updateAccountWithDelay} = useAccount();
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


// onMounted(async () => {
//   const customerExists = await hasCustomer(route.params.id);
  
//   if (customerExists) {
//     const customerData = await getCustomerByAccountId(route.params.id);

//     accountData.value = {
//       ...accountData.value,
//       phone: customerData.value.phone,
//       address: customerData.value.address,
//     };
//   }
// });



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
  const user = JSON.parse(localStorage.getItem('user'));
  fetchAccountById(user.id);
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
      accountData.value.avatar = reader.result; 
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

    if (avatarInput.value.files[0]) {
      formData.append('avatar', avatarInput.value.files[0]);
    }

    let privilegeChange = 'noChange';
    if ((selectedAccount.value.privilege === '0' || selectedAccount.value.privilege === '1') && accountData.value.privilege === '2') {
      privilegeChange = 'toUser';
    } else if (selectedAccount.value.privilege === '2' && (accountData.value.privilege === '0' || accountData.value.privilege === '1')) {
      privilegeChange = 'toAdmin';
    }
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

const showChangePass = ref(false);
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const cancelChangePass = () => {
  showChangePass.value = false;
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};



const validatePasswordForm = () => {
  if (!passwordForm.value.oldPassword) {
    notificationStore.showNotification(t('accounts.passwordRequired'), 'error');
    return false;
  }

  if (!passwordForm.value.newPassword) {
    notificationStore.showNotification(t('accounts.newPasswordRequired'), 'error');
    return false;
  }

  if (!passwordForm.value.confirmPassword) {
    notificationStore.showNotification(t('accounts.confirmPasswordRequired'), 'error');
    return false;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    notificationStore.showNotification(t('accounts.passwordMismatch'), 'error');
    return false;
  }

  return true; 
};


const handleChangePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }

  try {
    const res = await changePassword(accountData.value._id, {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    });

    if (res.success) {
      notificationStore.showNotification(t('accounts.passwordUpdateSuccess'), 'success');
      cancelChangePass();
    } else {
      notificationStore.showNotification(res.message || t('accounts.passwordUpdateFail'), 'error');
    }
  } catch (err) {
    notificationStore.showNotification(t('accounts.passwordUpdateFail'), 'error');
  }
};


</script>

<style scoped>
</style>
