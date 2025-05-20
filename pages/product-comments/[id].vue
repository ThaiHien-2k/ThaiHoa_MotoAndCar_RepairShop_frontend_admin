<template>
  <div class="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md" v-if="comment">
    <!-- Title & Back Button in one row -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('commentDetail.title') }}</h1>
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition whitespace-nowrap"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {{ t('common.back') }}
      </button>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.commentId') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment._id }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.product') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.productName }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.customer') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.customerName }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">Email:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.customerEmail }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.rating') }}:</b>
      <span class="ml-2 text-yellow-500 font-bold">{{ comment.rating }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.content') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.comment }}</span>
    </div>
    <div class="mb-2 flex items-center gap-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.status') }}:</b>
      <span
        class="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
        :class="{
          'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': comment.status === 'approved',
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': comment.status === 'pending',
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300': comment.status === 'rejected'
        }"
      >
        {{ comment.status === 'approved'
          ? t('commentDetail.statusApproved')
          : comment.status === 'pending'
            ? t('commentDetail.statusPending')
            : t('commentDetail.statusRejected')
        }}
      </span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.verifiedPurchase') }}:</b>
      <span class="ml-2" :class="comment.isVerifiedPurchase ? 'text-green-600 pr-1' : 'text-gray-500 pr-1'">
        {{ comment.isVerifiedPurchase ? t('commentDetail.yes') : t('commentDetail.no') }}
      </span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.likes') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.likes }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.createdAt') }}:</b>
      <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatDate(comment.createdAt) }}</span>
    </div>
    <div class="mb-2">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.images') }}:</b>
      <div class="flex gap-2 mt-1 flex-wrap">
        <template v-if="comment.imageUploads && comment.imageUploads.length">
          <img v-for="img in comment.imageUploads" :key="img" :src="img" class="rounded border border-gray-300 dark:border-gray-700 shadow-sm" style="max-width:100px;max-height:100px;" />
        </template>
        <span v-else class="text-gray-500">{{ t('commentDetail.noImages') }}</span>
      </div>
    </div>
    <div class="mt-6">
      <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.replies') }}:</b>
      <ul v-if="comment.replies && comment.replies.length" class="mt-3 space-y-4">
        <li
          v-for="reply in comment.replies"
          :key="reply._id"
          class="flex items-start gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3"
        >
          <div class="flex-shrink-0 mt-1">
            <span class="inline-block w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
              {{ reply.author?.charAt(0) || '?' }}
            </span>
          </div>
          <div>
            <div class="font-semibold text-blue-700 dark:text-blue-300">{{ reply.author }}</div>
            <div class="text-gray-800 dark:text-gray-100">{{ reply.content }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ formatDate(reply.createdAt) }}</div>
          </div>
        </li>
      </ul>
      <div v-else class="text-gray-500 mt-2">{{ t('commentDetail.noReplies') }}</div>
    </div>
  </div>
  <div v-else class="text-center text-gray-600 dark:text-gray-400 py-8">Đang tải...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useProductComment from '~/composables/useProductComment'
import useProduct from '~/composables/useProduct'
import useAccount from '~/composables/useAccount'
definePageMeta({ layout: 'admin' });

const { t } = useI18n()
const { selectedComment, fetchCommentById } = useProductComment()
const { products, fetchProducts } = useProduct()
const { accounts, fetchAccounts } = useAccount()
const route = useRoute()
const router = useRouter()

const comment = ref(null)

onMounted(async () => {
  await fetchProducts()
  await fetchAccounts()
  await fetchCommentById(route.params.id)
  const c = selectedComment.value
  comment.value = {
    ...c,
    productName: products.value.find(p => p._id === (c.product_id?._id || c.product_id))?.name || c.product_id?.name || '',
    customerName: accounts.value.find(u => u._id === (c.customer_id?._id || c.customer_id))?.name || c.customer_id?.name || '',
    customerEmail: accounts.value.find(u => u._id === (c.customer_id?._id || c.customer_id))?.email || c.customer_id?.email || '',
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('vi-VN')
}

function goBack() {
  router.push('/product-comments')
}
</script>