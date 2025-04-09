<template>
    <div class="p-6 relative">
      <div class="relative">
        <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{{ t('products.detailsTitle') }}</h1>
  

      </div>
  
      <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400">{{ t('products.loading') }}</div>
  
      <div v-else-if="productData" class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <!-- Product Name -->
        <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('products.name') }}</label>
        <input v-model="productData.name" class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white" />
  
        <!-- Product Description -->
        <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('products.description') }}</label>
        <textarea
          v-model="productData.description"
          class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        ></textarea>
  
        <!-- Product Price -->
        <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('products.price') }}</label>
        <input
          v-model="productData.price"
          type="number"
          class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
  
        <!-- Product Stock -->
        <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('products.stock') }}</label>
        <input
          v-model="productData.stock_quantity"
          type="number"
          class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
  
        <!-- Product Category -->
        <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('products.category') }}</label>
        <select
          v-model="productData.category_id"
          class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        >
        <option v-for="category in productCategories" :key="category._id" :value="category._id">
            {{ category.name }}
        </option>
        </select>
  
        <!-- Product Brand -->
        <label class="block mt-4 mb-2 text-gray-700 dark:text-gray-300">{{ t('products.brand') }}</label>
        <input
          v-model="productData.brand"
          class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
        />
  
        <!-- Warranty Details -->
        <div class="mt-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('products.warranty') }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Warranty Period -->
            <div>
              <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('products.warrantyPeriod') }}</label>
              <select
                v-model="productData.warranty.period"
                class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
              >
                <option value="6 months">{{ t('products.warranty6Months') }}</option>
                <option value="12 months">{{ t('products.warranty12Months') }}</option>
                <option value="24 months">{{ t('products.warranty24Months') }}</option>
              </select>
            </div>
  
            <!-- Warranty Details -->
            <div>
              <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('products.warrantyDetails') }}</label>
              <select
                v-model="productData.warranty.details"
                class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
              >
                <option value="1-to-1 replacement">{{ t('products.warranty1To1') }}</option>
                <option value="Repair only">{{ t('products.warrantyRepairOnly') }}</option>
                <option value="No warranty">{{ t('products.noWarranty') }}</option>
              </select>
            </div>
  
            <!-- Warranty Terms -->
            <div>
              <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('products.warrantyTerms') }}</label>
              <textarea
                v-model="productData.warranty.terms"
                class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
          </div>
        </div>
  
<!-- Product Images -->
<!-- Product Images -->
<div class="mt-6">
  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('products.images') }}</h2>
  <div class="flex gap-4 flex-wrap">
    <!-- Ảnh cũ -->
    <div
      v-for="(image, index) in productData.images"
      :key="'existing-' + index"
      class="relative w-32 h-32"
    >
      <img
        :src="imageUrl + image"
        alt="Product Image"
        class="w-full h-full object-cover rounded-lg"
      />
      <button
        @click="removeImage(index)"
        class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
      >
        ✕
      </button>
    </div>

    <!-- Ảnh mới (preview) -->
    <div
      v-for="(img, index) in newImages"
      :key="'new-' + index"
      class="relative w-32 h-32"
    >
      <img
        :src="img.preview"
        alt="New Image"
        class="w-full h-full object-cover rounded-lg border border-dashed border-blue-400"
      />
      <button
        @click="removeNewImage(index)"
        class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
      >
        ✕
      </button>
    </div>
  </div>

  <!-- Upload input -->
  <div class="mt-4">
    <label class="block mb-2 text-gray-700 dark:text-gray-300">{{ t('products.addImages') }}</label>
    <input
      type="file"
      multiple
      @change="handleImageUpload"
      class="border p-2 rounded w-full bg-gray-100 dark:bg-gray-700 dark:text-white"
    />
  </div>
</div>


  
        <!-- Actions -->
        <div class="flex gap-4 mt-6">
          <button
            @click="updateProductHandler"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out"
          >
            {{ t('products.save') }}
          </button>
          <button
            @click="navigateToProducts"
            class="bg-gray-600 hover:bg-gray-700 text-white font-semibold p-3 rounded-lg w-full transition duration-300 ease-in-out"
          >
            {{ t('products.back') }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useNotificationStore } from '@/stores/notificationStore';
  import useProduct from '@/composables/useProduct';
  import { useCategory } from '~/composables/useCategory';

  import { useI18n } from 'vue-i18n';
  const imageUrl = useRuntimeConfig().public.URL_IMAGE_PRODUCT;
  const { t } = useI18n();
  definePageMeta({ layout: 'admin' });
  
  const notificationStore = useNotificationStore();
  const { selectedProduct, isLoading, fetchProductById, updateProduct } = useProduct();
  const { categories,fetchCategories } = useCategory();

  const route = useRoute();
  const router = useRouter();
  
  const productData = ref(null);
  const newImages = ref([]); 

  const productCategories = ref([]);
  
  onMounted(() => {
    fetchProductById(route.params.id);
    fetchCategories(); 
    productCategories.value = categories.value.filter(cat => cat.type === 0);
  });
  
  watch(selectedProduct, (newVal) => {
    if (newVal) {
      productData.value = { ...newVal };
    }
  });
  
  const navigateToProducts = () => {
    router.push('/products');
  };
  
  const handleImageUpload = (event) => {
  const files = event.target.files;
  for (const file of files) {
    const preview = URL.createObjectURL(file);
    newImages.value.push({ file, preview });
  }
};

  
  const removeImage = (index) => {
    productData.value.images.splice(index, 1);
  };
  
  const updateProductHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(productData.value));
  
      // Append new images to the form data
      newImages.value.forEach(({ file }) => {
        formData.append('images', file);
        });
        
      const result = await updateProduct(productData.value._id, formData);
  
      if (result.success) {
        notificationStore.showNotification(t('products.updateSuccess'), 'success');
        navigateToProducts();
      } else {
        throw new Error(result.message || t('products.updateFail'));
      }
    } catch (error) {
      notificationStore.showNotification(t('products.updateFailRetry'), 'error');
      console.error('Error updating product:', error);
    }
  };

  const removeNewImage = (index) => {
  newImages.value.splice(index, 1);
};
  
  </script>