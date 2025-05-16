<template>
    <div class="p-6 relative">
      <div class="relative flex justify-between items-center">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('products.manageProducts') }}</h1>
        <NuxtLink
          to="/products/create"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {{ t('products.createProduct') }}
        </NuxtLink>
      </div>
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('products.filterByCategory') }}</label>
            <select v-model="filters.category" class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{{ t('products.all') }}</option>
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('products.filterByStock') }}</label>
            <select v-model="filters.stock" class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{{ t('products.all') }}</option>
              <option value="inStock">{{ t('products.inStock') }}</option>
              <option value="outOfStock">{{ t('products.outOfStock') }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="block text-gray-700 dark:text-white font-medium mb-2">{{ t('products.filterByName') }}</label>
            <input
              v-model="filters.query"
              type="text"
              :placeholder="t('products.enterName')"
              class="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div class="overflow-x-auto pt-6">
        <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
              <th class="p-3 w-40 text-left">{{ t('products.name') }}</th>
              <th class="p-3 w-40 text-left">{{ t('products.image') }}</th>
              <th class="p-3 w-40 text-left">{{ t('products.category') }}</th>
              <th class="p-3 w-40 text-left">{{ t('products.price') }}</th>
              <th class="p-3 w-40 text-left">{{ t('products.stock') }}</th>
              <th class="p-3 w-40 text-center">{{ t('products.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product._id"
              class="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-white"
            >
              <td class="p-3">{{ product.name }}</td>
              <td class="p-3">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="`${imageUrl}${product.images[0]}`"
                  alt="Product Image"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <span v-else>{{ t('products.noImage') }}</span>
              </td>
              <td class="p-3">{{ findNameCategory(product.category_id) || t('products.unknownCategory') }}</td>
              <td class="p-3">{{ product.price }}</td>
              <td class="p-3">{{ product.stock_quantity }}</td>
              <td class="p-3 flex justify-center gap-3">
                <NuxtLink
                  :to="`/products/${product._id}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ t('products.view') }}
                </NuxtLink>
                <button
                  @click="confirmDelete(product)"
                  class="text-red-600 dark:text-red-400 hover:underline"
                >
                  {{ t('products.delete') }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('products.confirmDelete') }}</h2>
          <p class="mt-2 text-gray-700 dark:text-gray-300">
            {{ t('products.confirmDeleteMessage', { name: selectedProduct?.name }) }}
          </p>
          <div class="mt-4 flex justify-end gap-3">
            <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
              {{ t('products.cancel') }}
            </button>
            <button @click="deleteProductHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              {{ t('products.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
     </template>
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import useProduct from '~/composables/useProduct';
  import { useNotificationStore } from '@/stores/notificationStore';
  import { useI18n } from 'vue-i18n';
  import { useCategory } from '~/composables/useCategory';

  const { categories, fetchCategories } = useCategory();



  const imageUrl = useRuntimeConfig().public.URL_IMAGE_PRODUCT;
  
  const { t } = useI18n();
  const notificationStore = useNotificationStore();
  const { products, fetchProducts, deleteProduct } = useProduct();

  const isConfirming = ref(false);
  const selectedProduct = ref(null);
  
  const filters = ref({
    category: '',
    stock: '',
    query: '',
  });
  
  
  const filteredProducts = computed(() => {
    return products.value.filter((product) => {
      const matchesCategory = !filters.value.category || product.category_id === filters.value.category;
      const matchesStock =
        !filters.value.stock ||
        (filters.value.stock === 'inStock' && product.stock_quantity > 0) ||
        (filters.value.stock === 'outOfStock' && product.stock_quantity === 0);
      const matchesQuery =
        !filters.value.query || product.name.toLowerCase().includes(filters.value.query.toLowerCase());
  
      return matchesCategory && matchesStock && matchesQuery;
    });
  });
  
  const productCategories = computed(() => {
    return categories.value.filter((cat) => cat.type === 0);
  });

  const findNameCategory = (categoryId) => {
    console.log('categoryId', categoryId);
    const category = productCategories.value.find((cat) => cat._id === categoryId);
    return category ? category.name : null;
  };
  
  const confirmDelete = (product) => {
    selectedProduct.value = product;
    isConfirming.value = true;
  };
  
  const deleteProductHandler = async () => {
    if (!selectedProduct.value) return;
  
    try {
      const result = await deleteProduct(selectedProduct.value._id);
      if (result.success) {
        notificationStore.showNotification(t('products.deleteSuccess'), 'success');
        fetchProducts();
      } else {
        throw new Error('Failed to delete the product');
      }
    } catch (error) {
      notificationStore.showNotification(t('products.deleteFail'), 'error');
      console.error(error);
    } finally {
      isConfirming.value = false;
      selectedProduct.value = null;
    }
  };
  
  onMounted(() => {
    fetchProducts();
    fetchCategories();
  });
  
  definePageMeta({ layout: 'admin' });
  </script>