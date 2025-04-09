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
        <!-- Avatar Upload -->
        <div class="md:col-span-2 text-center">
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.avatar') }}</label>
          <div class="flex flex-col items-center mb-4">
            <img
              :src="previewImage || defaultAvatar"
              alt="Avatar Preview"
              class="w-32 h-32 rounded-full shadow-lg mb-2 object-cover"
            />
            <input type="file" @change="onAvatarChange" class="hidden" ref="avatarInput" />
            <button @click="triggerFileInput" type="button" class="text-blue-600 hover:underline">
              {{ t('accounts.changeAvatar') }}
            </button>
          </div>
        </div>

        <!-- Form Fields -->
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

        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.roleDescription') }}</label>
          <select v-model="formData.role_description" class="input-field">
            <option v-for="(desc, index) in roleOptions[formData.privilege]" :key="index" :value="index">
              {{ desc }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('accounts.address') }}</label>
          <textarea v-model="formData.address" required class="input-field"></textarea>
        </div>

        <!-- Submit Button -->
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
import useAccount from '@/composables/useAccount';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';
import defaultAvatar from '@/assets/default_avatar.svg'; // Import ảnh mặc định

const { t } = useI18n();

definePageMeta({ layout: 'admin' });

const router = useRouter();
const notificationStore = useNotificationStore();
const { createAccount } = useAccount();

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

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  privilege: '2', 
  role_description: 5,
  is_active: true,
  avatar: null,
});

const isLoading = ref(false);
const avatarInput = ref(null);
const previewImage = ref(null); 

const updateRoleDescription = () => {
  formData.value.role_description = roleOptions.value[formData.value.privilege][0];
};

const triggerFileInput = () => {
  avatarInput.value.click();
};

const onAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.avatar = file; // Save file to formData
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result; // Show preview image
    };
    reader.readAsDataURL(file);
  }
};

const handleCreateAccount = async () => {
  isLoading.value = true;

  const formDataToSend = new FormData();
  formDataToSend.append('name', formData.value.name);
  formDataToSend.append('email', formData.value.email);
  formDataToSend.append('password', formData.value.password);
  formDataToSend.append('phone', formData.value.phone);
  formDataToSend.append('address', formData.value.address);
  formDataToSend.append('privilege', formData.value.privilege);
  formDataToSend.append('role_description', formData.value.role_description);
  formDataToSend.append('is_active', formData.value.is_active);
  if (formData.value.avatar) {
    formDataToSend.append('avatar', formData.value.avatar); // Attach avatar file
  }
  console.log(formDataToSend)
  const result = await createAccount(formDataToSend);
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

.avatar-preview {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>