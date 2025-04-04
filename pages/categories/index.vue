<template>
    <div class="p-6 relative">
      <div class="relative flex justify-between items-center">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('categories.manageCategories') }}</h1>
        <NuxtLink
          to="/categories/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {{ t('categories.createCategory') }}
        </NuxtLink>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('categories.filterByType') }}</label>
            <select v-model.number="filters.type" class="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">{{ t('categories.all') }}</option>
              <option value="0">{{ t('categories.product') }}</option>
              <option value="1">{{ t('categories.service') }}</option>
              <option value="2">{{ t('categories.blog') }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('categories.filterByStatus') }}</label>
            <select v-model="filters.status" class="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">{{ t('categories.all') }}</option>
              <option value="active">{{ t('categories.active') }}</option>
              <option value="inactive">{{ t('categories.inactive') }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('categories.filterByName') }}</label>
            <input v-model="filters.query" type="text" :placeholder="t('categories.enterName')" class="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div v-if="notificationStore.visible" class="notification" :class="notificationStore.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' ">
        {{ notificationStore.message }}
      </div>
      <div class="overflow-x-auto pt-6 dark:text-white">
        <table class="w-full border rounded-lg shadow-md">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
              <th class="p-3 w-40 text-left">{{ t('categories.name') }}</th>
              <th class="p-3 w-60 text-left">{{ t('categories.description') }}</th>
              <th class="p-3 w-32 text-center">{{ t('categories.type') }}</th>
              <th class="p-3 w-32 text-center">{{ t('categories.status') }}</th>
              <th class="p-3 w-40 text-center">{{ t('categories.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in filteredCategories" :key="category._id" class="border-t hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:text-white">
              <td class="p-3">{{ category.name }}</td>
              <td class="p-3">{{ category.description }}</td>
              <td class="p-3 text-center">{{ getCategoryType(category.type) }}</td>
              <td class="p-3 text-center">
                <span class="px-2 py-1 text-sm font-semibold rounded-lg" :class="category.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
                  {{ category.status === 'active' ? t('categories.active') : t('categories.inactive') }}
                </span>
              </td>
              <td class="p-3 flex justify-center gap-3">
                <NuxtLink :to="`/categories/${category._id}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('categories.view') }}</NuxtLink>
                <button @click="confirmDelete(category)" class="text-red-600 dark:text-red-400 hover:underline">{{ t('categories.delete') }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold">{{ t('categories.confirmDelete') }}</h2>
          <p class="mt-2">{{ t('categories.confirmDeleteMessage', { name: selectedCategory?.name }) }}</p>
          <div class="mt-4 flex justify-end gap-3">
            <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">{{ t('categories.cancel') }}</button>
            <button @click="deleteCategoryHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">{{ t('categories.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useCategory } from '~/composables/useCategory';
  import { useNotificationStore } from '@/stores/notificationStore';
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  const notificationStore = useNotificationStore();
  const { categories, fetchCategories, deleteCategory } = useCategory();
  
  const isConfirming = ref(false);
  const selectedCategory = ref(null);
  const filters = ref({ type: '', status: '', query: '' });
  
  const getCategoryType = (type) => {
    return type === 0 ? t('categories.product') : type === 1 ? t('categories.service') : t('categories.blog');
  };
  
  const filteredCategories = computed(() => {
    return categories.value.filter(category => {
      const matchesType = filters.value.type === '' || category.type === filters.value.type;
      const matchesStatus = !filters.value.status || category.status === filters.value.status;
      const matchesQuery = !filters.value.query || category.name.toLowerCase().includes(filters.value.query.toLowerCase());
      return matchesType && matchesStatus && matchesQuery;
    });
  });
  
  const confirmDelete = (category) => {
    selectedCategory.value = category;
    isConfirming.value = true;
  };
  
  const deleteCategoryHandler = async () => {
    if (!selectedCategory.value) return;
    try {
      await deleteCategory(selectedCategory.value._id);
      notificationStore.showNotification(t('categories.deleteSuccess'), 'success');
      fetchCategories();
    } catch {
      notificationStore.showNotification(t('categories.deleteFail'), 'error');
    } finally {
      isConfirming.value = false;
      selectedCategory.value = null;
    }
  };
  
  onMounted(fetchCategories);
  
  definePageMeta({ layout: 'admin' });
  </script>
  