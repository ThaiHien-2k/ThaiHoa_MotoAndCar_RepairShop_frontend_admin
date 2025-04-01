<template>
    <div class="p-6 relative">
      <div class="relative flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tạo tài khoản mới</h1>
        <NuxtLink
        to="/accounts"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
      Quay lại
      </NuxtLink>
      </div>
  
      <div v-if="notificationStore.visible" :class="['notification', notificationStore.type]">
        {{ notificationStore.message }}
      </div>
  
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mx-auto max-w-screen-lg">
        <form @submit.prevent="handleCreateAccount" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tên -->
          <div>
            <label class="block text-gray-700 dark:text-white font-medium">Tên</label>
            <input v-model="formData.name" type="text" required class="input-field" />
          </div>
  
          <!-- Email -->
          <div>
            <label class="block text-gray-700 dark:text-white font-medium">Email</label>
            <input v-model="formData.email" type="email" required class="input-field" />
          </div>
  
          <!-- Mật khẩu -->
          <div>
            <label class="block text-gray-700 dark:text-white font-medium">Mật khẩu</label>
            <input v-model="formData.password" type="password" required class="input-field" />
          </div>
  
          <!-- Quyền -->
          <div>
            <label class="block text-gray-700 dark:text-white font-medium">Quyền</label>
            <select v-model="formData.privilege" class="input-field" @change="updateRoleDescription">
              <option value="2">User</option>
              <option value="1">Manager</option>
              <option value="0">Admin</option>
            </select>
          </div>
  
          <!-- Mô tả quyền -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 dark:text-white font-medium">Mô tả quyền</label>
            <select v-model="formData.role_description" class="input-field">
              <option v-for="desc in roleOptions[formData.privilege]" :key="desc" :value="desc">
                {{ desc }}
              </option>
            </select>
          </div>
  
          <!-- Nút tạo tài khoản -->
          <div class="md:col-span-2 text-center">
            <button type="submit" :disabled="isLoading" class="submit-button">
              {{ isLoading ? 'Đang tạo...' : 'Tạo tài khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useAccount from '@/composables/useAccount';
  import { useNotificationStore } from '@/stores/notificationStore';
  
  definePageMeta({ layout: 'admin' });
  
  const router = useRouter();
  const notificationStore = useNotificationStore();
  const { createAccount } = useAccount();
  
  const roleOptions = {
    '0': ['Quản lý toàn bộ hệ thống', 'Quyền hạn cao nhất'],
    '1': ['Quản lý nhân viên', 'Quản lý sản phẩm', 'Quản lý đơn hàng'],
    '2': ['Khách hàng', 'Người dùng bình thường']
  };
  
  const formData = ref({
    name: '',
    email: '',
    password: '',
    privilege: '2',
    role_description: roleOptions['2'][0],
    is_active: true
  });
  
  const isLoading = ref(false);
  
  const updateRoleDescription = () => {
    formData.value.role_description = roleOptions[formData.value.privilege][0];
  };
  
  const handleCreateAccount = async () => {
    isLoading.value = true;
    const result = await createAccount(formData.value);
    if (result.success) {
      notificationStore.showNotification('Tạo tài khoản thành công!', 'success');
      router.push('/accounts');
    } else {
      notificationStore.showNotification(result.message || 'Tạo tài khoản thất bại!', 'error');
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
  