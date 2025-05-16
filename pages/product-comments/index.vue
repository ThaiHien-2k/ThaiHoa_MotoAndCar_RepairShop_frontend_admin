<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('productComments.manageComments') }}</h1>
    </div>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">{{ t('productComments.filterByProduct') }}</label>
          <input
            v-model="filters.product"
            :placeholder="t('productComments.enterProductName')"
            class="input-field w-full"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">{{ t('productComments.filterByCustomer') }}</label>
          <input
            v-model="filters.customer"
            :placeholder="t('productComments.enterCustomerName')"
            class="input-field w-full"
          />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-2 dark:text-white">{{ t('productComments.filterByRating') }}</label>
          <select v-model="filters.rating" class="input-field w-full">
            <option value="">{{ t('productComments.all') }}</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-2 dark:text-white">{{ t('productComments.filterByContent') }}</label>
          <input
            v-model="filters.content"
            :placeholder="t('productComments.enterCommentContent')"
            class="input-field w-full"
          />
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400 py-8">Đang tải...</div>
    <div v-else class="overflow-x-auto pt-6">
      <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <th class="p-3 text-left">{{ t('productComments.product') }}</th>
            <th class="p-3 text-left">{{ t('productComments.customer') }}</th>
            <th class="p-3 text-left">{{ t('productComments.rating') }}</th>
            <th class="p-3 text-left">{{ t('productComments.comment') }}</th>
            <th class="p-3 text-left">{{ t('productComments.createdAt') }}</th>
            <th class="p-3 text-center">{{ t('productComments.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in filteredComments"
            :key="c._id"
            class="border-t border-gray-300 dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <td class="p-3">{{ c.productName }}</td>
            <td class="p-3">{{ c.customerName }} <br> {{ c.customerEmail }} </td>
            <td class="p-3">{{ c.rating }}</td>
            <td class="p-3">{{ c.comment }}</td>
            <td class="p-3">{{formatDateTime(c.createdAt) }}</td>
            <td class="p-3 flex justify-center gap-3">
              <NuxtLink
                :to="`/product-comments/${c._id}`"
                class="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ t('productComments.view') }}
              </NuxtLink>
              <button
                @click="openReplyPopup(c)"
                class="text-green-600 dark:text-green-400 hover:underline"
              >
                {{ t('productComments.reply') }}
              </button>
              <button
                @click="confirmDelete(c)"
                class="text-red-600 dark:text-red-400 hover:underline"
              >
                {{ t('productComments.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('productComments.confirmDelete') }}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          {{ t('productComments.confirmDeleteMessage', { name: selectedComment?.customerName }) }}
        </p>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('productComments.cancel') }}
          </button>
          <button @click="deleteCommentHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {{ t('productComments.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Reply Popup -->
    <div v-if="isReplying" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('productComments.quickReply') }}</h2>
        <div class="mb-2 flex items-center gap-2">
          <input type="checkbox" v-model="useTemplateReply" id="useTemplateReply" />
          <label for="useTemplateReply" class="text-gray-700 dark:text-gray-300">{{ t('productComments.useTemplateReply') }}</label>
        </div>
        <div v-if="useTemplateReply" class="mb-4">
          <select v-model="selectedTemplate" class="input-field w-full mb-2">
            <option value="">{{ t('productComments.selectTemplate') }}</option>
            <option v-for="(item, idx) in replyTemplates" :key="idx" :value="item">{{ item }}</option>
          </select>
        </div>
        <textarea v-model="replyContent" rows="4" class="input-field w-full mb-4"></textarea>
        <div class="flex justify-end gap-3">
          <button @click="isReplying = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('productComments.cancel') }}
          </button>
          <button @click="sendReply" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{ t('productComments.sendReply') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import useProductComment from '~/composables/useProductComment'
import useProduct from '~/composables/useProduct'
import useAccount from '~/composables/useAccount'
import { useNotificationStore } from '@/stores/notificationStore'
import { useI18n } from 'vue-i18n'
definePageMeta({ layout: 'admin' });

const { t } = useI18n()
const { comments, isLoading, fetchAllComments, deleteComment, addReplyToComment } = useProductComment()
const notificationStore = useNotificationStore()
const { products, fetchProducts } = useProduct()
const { accounts, fetchAccounts } = useAccount()

const filters = ref({
  product: '',
  customer: '',
  rating: '',
  content: ''
})

const isConfirming = ref(false)
const selectedComment = ref(null)

const isReplying = ref(false)
const replyContent = ref('')
const replyingComment = ref(null)
const useTemplateReply = ref(false)
const selectedTemplate = ref('')
const replyTemplates = ref([
  t('productComments.template1'),
  t('productComments.template2'),
  t('productComments.template3')
])

watch(selectedTemplate, (val) => {
  if (useTemplateReply.value && val) {
    replyContent.value = val
  }
})

watch(useTemplateReply, (val) => {
  if (!val) {
    selectedTemplate.value = ''
    replyContent.value = ''
  }
})

const mappedComments = computed(() => {
  // comments.value.map(c => {console.log( customers.value.find(u => u), c) })
  return comments.value.map(c => ({
    ...c,
    productName: products.value.find(p => p._id === c.product_id)?.name || '',
    customerName: accounts.value.find(u => u._id === c.customer_id)?.name || '',
    customerEmail: accounts.value.find(u => u._id === c.customer_id)?.email || '',
    
  }))
})

const filteredComments = computed(() => {
  return mappedComments.value.filter(c => {
    const matchProduct = !filters.value.product || c.productName?.toLowerCase().includes(filters.value.product.toLowerCase())
    const matchCustomer = !filters.value.customer || c.customerName?.toLowerCase().includes(filters.value.customer.toLowerCase())
    const matchRating = !filters.value.rating || (c.rating >= Number(filters.value.rating) && c.rating < Number(filters.value.rating) + 1)
    const matchContent = !filters.value.content || c.comment?.toLowerCase().includes(filters.value.content.toLowerCase())
    return matchProduct && matchCustomer && matchRating && matchContent
  })
})

function confirmDelete(comment) {
  selectedComment.value = comment
  isConfirming.value = true
}

async function deleteCommentHandler() {
  if (!selectedComment.value) return
  const result = await deleteComment(selectedComment.value._id)
  if (result.success) {
    notificationStore.showNotification(t('productComments.deleteSuccess'), 'success')
    fetchAllComments()
  } else {
    notificationStore.showNotification(result.message || t('productComments.deleteFail'), 'error')
  }
  isConfirming.value = false
  selectedComment.value = null
}

function openReplyPopup(comment) {
  replyingComment.value = comment
  replyContent.value = ''
  useTemplateReply.value = false
  selectedTemplate.value = ''
  isReplying.value = true
}

async function sendReply() {
  if (!replyContent.value.trim()) return
  const comment = replyingComment.value
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const accounts_id = user?.id || null
  const author = user?.name || 'Admin'
  const replyData = {
    accounts_id,
    comment_id: comment._id,
    author,
    content: replyContent.value
  }
  const result = await addReplyToComment(comment._id, replyData)
  if (result.success) {
    notificationStore.showNotification(t('productComments.replySuccess'), 'success')
    isReplying.value = false
    fetchAllComments()
  } else {
    notificationStore.showNotification(result.message || t('productComments.replyFail'), 'error')
  }
}

onMounted(async () => {
  await fetchAllComments()
  await fetchProducts()
  await fetchAccounts()
})

const formatDateTime = (date) => {
  const d = new Date(date);
  return `${d.toLocaleTimeString('vi-VN')}\n${d.toLocaleDateString('vi-VN')}`;
};
</script>

<style scoped>
.input-field {
  @apply px-2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
}
</style>