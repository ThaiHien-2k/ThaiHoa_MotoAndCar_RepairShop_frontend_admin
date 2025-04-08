<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('categories.createCategory') }}</h1>
      <NuxtLink
        to="/categories"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {{ t('categories.back') }}
      </NuxtLink>
    </div>

    <div v-if="notificationStore.visible" :class="['notification', notificationStore.type]">
      {{ notificationStore.message }}
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mx-auto max-w-screen-lg">
      <form @submit.prevent="handleCreateCategory" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Category Name -->
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('categories.name') }}</label>
          <input v-model="formData.name" type="text" required class="input-field" />
        </div>

        <!-- Category Description -->
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('categories.description') }}</label>
          <input v-model="formData.description" type="text" class="input-field" />
        </div>

        <!-- Category Type -->
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('categories.type') }}</label>
          <select v-model="formData.type" class="input-field">
            <option value="0">{{ t('categories.productType') }}</option>
            <option value="1">{{ t('categories.serviceType') }}</option>
            <option value="2">{{ t('categories.blogType') }}</option>
          </select>
        </div>

        <!-- Category Slug -->
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('categories.slug') }}</label>
          <input v-model="formData.slug" type="text" required class="input-field" />
        </div>

        <!-- Category Status -->
        <div>
          <label class="block text-gray-700 dark:text-white font-medium">{{ t('categories.status') }}</label>
          <select v-model="formData.status" class="input-field">
            <option value="active">{{ t('categories.active') }}</option>
            <option value="inactive">{{ t('categories.inactive') }}</option>
          </select>
        </div>

        <!-- Submit Button -->
        <div class="md:col-span-2 text-center">
          <button type="submit" :disabled="isLoading" class="submit-button">
            {{ isLoading ? t('categories.creating') : t('categories.createCategory') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCategory } from '@/composables/useCategory';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const notificationStore = useNotificationStore();

const { createCategory } = useCategory();

const formData = ref({
  name: '',
  description: '',
  type: 0,
  slug: '',
  status: 'active',
});

const isLoading = ref(false);

definePageMeta({ layout: 'admin' });

// Handle category creation
const handleCreateCategory = async () => {
  isLoading.value = true;
  const result = await createCategory(formData.value);
  if (result.success) {
    notificationStore.showNotification(t('categories.createSuccess'), 'success');
    router.push('/categories');
  } else {
    notificationStore.showNotification(result.message || t('categories.createFail'), 'error');
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
