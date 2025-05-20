<template>
  <div class="p-6 relative">
    <div class="relative flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('blogComments.title') }}</h1>
    </div>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">{{ t('blogComments.filterAuthor') }}</label>
          <input v-model="filters.author" :placeholder="t('blogComments.placeholderAuthor')" class="input-field w-full" />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-200 font-medium mb-2">{{ t('blogComments.filterContent') }}</label>
          <input v-model="filters.content" :placeholder="t('blogComments.placeholderContent')" class="input-field w-full" />
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="text-center text-gray-600 dark:text-gray-400 py-8">{{ t('common.loading') }}</div>
    <div v-else class="overflow-x-auto pt-6">
      <table class="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
            <!-- <th class="p-3 text-left">{{ t('blogComments.id') }}</th> -->
            <th class="p-3 text-left">{{ t('blogComments.account') }}</th>
            <th class="p-3 text-left">{{ t('blogComments.author') }}</th>
            <th class="p-3 text-left">{{ t('blogComments.content') }}</th>
            <th class="p-3 text-left">{{ t('blogComments.createdAt') }}</th>
            <th class="p-3 text-center">{{ t('common.action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in filteredComments" :key="comment._id" class="border-b border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <!-- <td class="p-3">{{ comment.blogId }}</td> -->
            <td class="p-3">{{ comment.accountName }}<br>{{ comment.accountEmail }}</td>
            <td class="p-3">{{ comment.author }}</td>
            <td class="p-3 max-w-xs truncate">{{ comment.content }}</td>
            <td class="p-3">{{ formatDate(comment.createdAt) }}</td>
            <td class="p-3 flex justify-center gap-3">
              <NuxtLink :to="`/blog-comments/${comment._id}`" class="text-blue-600 dark:text-blue-400 hover:underline">{{ t('common.detail') }}</NuxtLink>
              <button @click="openReplyPopup(comment)" class="text-green-600 dark:text-green-400 hover:underline">{{ t('blogComments.reply') }}</button>
              <button @click="confirmDelete(comment)" class="text-red-600 dark:text-red-400 hover:underline">{{ t('blogComments.delete') }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filteredComments.length" class="text-center text-gray-500 py-8">{{ t('blogComments.noData') }}</div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="isConfirming" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('blogComments.confirmDelete') }}</h2>
        <p class="mt-2 text-gray-700 dark:text-gray-300">
          {{ t('blogComments.confirmDeleteMessage', { name: selectedComment?.accountName }) }}
        </p>
        <div class="mt-4 flex justify-end gap-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('blogComments.cancel') }}
          </button>
          <button @click="deleteCommentHandler" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            {{ t('blogComments.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Reply Popup -->
    <div v-if="isReplying" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('blogComments.quickReply') }}</h2>
        <div class="mb-2 flex items-center gap-2">
          <input type="checkbox" v-model="useTemplateReply" id="useTemplateReply" />
          <label for="useTemplateReply" class="text-gray-700 dark:text-gray-300">{{ t('blogComments.useTemplateReply') }}</label>
        </div>
        <div v-if="useTemplateReply" class="mb-4">
          <select v-model="selectedTemplate" class="input-field w-full mb-2">
            <option value="">{{ t('blogComments.selectTemplate') }}</option>
            <option v-for="(item, idx) in replyTemplates" :key="idx" :value="item">{{ item }}</option>
          </select>
        </div>
        <textarea v-model="replyContent" rows="4" class="input-field w-full mb-4"></textarea>
        <div class="flex justify-end gap-3">
          <button @click="isReplying = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
            {{ t('blogComments.cancel') }}
          </button>
          <button @click="sendReply" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{ t('blogComments.sendReply') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import useBlogComment from '~/composables/useBlogComment';
import useAccount from '~/composables/useAccount';
import { useNotificationStore } from '@/stores/notificationStore';
import { useI18n } from 'vue-i18n';

definePageMeta({ layout: 'admin' });

const { t } = useI18n();
const notificationStore = useNotificationStore();
const { comments, fetchComments, isLoading, deleteComment, addReplyToComment } = useBlogComment();
const { accounts, fetchAccounts } = useAccount();

const filters = ref({
  author: '',
  content: ''
});

const isConfirming = ref(false);
const selectedComment = ref(null);
const isReplying = ref(false);
const replyContent = ref('');
const replyingComment = ref(null);
const useTemplateReply = ref(false);
const selectedTemplate = ref('');
const replyTemplates = ref([
  t('blogComments.template1'),
  t('blogComments.template2'),
  t('blogComments.template3')
]);

watch(selectedTemplate, (val) => {
  if (useTemplateReply.value && val) {
    replyContent.value = val;
  }
});

watch(useTemplateReply, (val) => {
  if (!val) {
    selectedTemplate.value = '';
    replyContent.value = '';
  }
});

const mappedComments = computed(() => {
  return comments.value.map(c => ({
    ...c,
    accountName: accounts.value.find(u => u._id === c.accounts_id)?.name || '',
    accountEmail: accounts.value.find(u => u._id === c.accounts_id)?.email || '',
  }));
});

const filteredComments = computed(() => {
  return mappedComments.value.filter(c => {
    const matchAuthor = !filters.value.author || c.author?.toLowerCase().includes(filters.value.author.toLowerCase());
    const matchContent = !filters.value.content || c.content?.toLowerCase().includes(filters.value.content.toLowerCase());
    return matchAuthor && matchContent;
  });
});

function confirmDelete(comment) {
  selectedComment.value = comment;
  isConfirming.value = true;
}

async function deleteCommentHandler() {
  if (!selectedComment.value) return;
  const result = await deleteComment(selectedComment.value._id);
  if (result?.success !== false) {
    notificationStore.showNotification(t('blogComments.deleteSuccess'), 'success');
    fetchComments();
  } else {
    notificationStore.showNotification(result.message || t('blogComments.deleteFail'), 'error');
  }
  isConfirming.value = false;
  selectedComment.value = null;
}

function openReplyPopup(comment) {
  replyingComment.value = comment;
  replyContent.value = '';
  useTemplateReply.value = false;
  selectedTemplate.value = '';
  isReplying.value = true;
}

async function sendReply() {
  if (!replyContent.value.trim()) return;
  const comment = replyingComment.value;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accounts_id = user?.id || null;
  const author = user?.name || 'Admin';
  const replyData = {
    accounts_id,
    comment_id: comment._id,
    author,
    content: replyContent.value
  };
  // Call API to add reply (implement addReplyToComment in useBlogComment if needed)
  if (typeof addReplyToComment === 'function') {
    const result = await addReplyToComment(comment._id, replyData);
    if (result.success) {
      notificationStore.showNotification(t('blogComments.replySuccess'), 'success');
      isReplying.value = false;
      fetchComments();
    } else {
      notificationStore.showNotification(result.message || t('blogComments.replyFail'), 'error');
    }
  }
}

onMounted(async () => {
  await fetchComments();
  await fetchAccounts();
});

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
}
</script>

<style scoped>
.input-field {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: #fff;
  color: #111827;
}
.input-field:focus {
  outline: none;
  border-color: #2563eb;
}
.dark .input-field {
  background: #1f2937;
  color: #f3f4f6;
  border-color: #374151;
}
</style>