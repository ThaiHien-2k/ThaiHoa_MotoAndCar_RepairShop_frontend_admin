<template>
  <div class="p-8 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md" v-if="comment">
    <div class="p-8 relative">
      <!-- Header with Back button and Title -->
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
          {{ t('blogComments.title') }}
        </h1>
        <NuxtLink
          to="/blog-comments"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition whitespace-nowrap"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          {{ t('common.back') }}
        </NuxtLink>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 gap-3 mb-6">
        <div>
          <b class="text-gray-700 dark:text-gray-200">ID:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment._id }}</span>
        </div>
        <div>
          <b class="text-gray-700 dark:text-gray-200">Blog ID:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.blogId }}</span>
        </div>
        <div>
          <b class="text-gray-700 dark:text-gray-200">{{ t('blogComments.account') }}:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ accountName }}</span>
          <br>
          <small class="ml-2 text-gray-500 dark:text-gray-400">{{ accountEmail }}</small>
        </div>
        <div>
          <b class="text-gray-700 dark:text-gray-200">{{ t('blogComments.author') }}:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.author }}</span>
        </div>
        <div>
          <b class="text-gray-700 dark:text-gray-200">{{ t('blogComments.content') }}:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ comment.content }}</span>
        </div>
        <div class="flex items-center gap-2">
          <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.status') }}:</b>
          <span
            class="ml-2 px-3 py-1 rounded-full text-xs font-semibold"
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
        <div>
          <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.createdAt') }}:</b>
          <span class="ml-2 text-gray-800 dark:text-gray-100">{{ formatDate(comment.createdAt) }}</span>
        </div>
      </div>

      <!-- Replies -->
      <div v-if="comment.replies && comment.replies.length" class="mt-8">
        <b class="text-gray-700 dark:text-gray-200">{{ t('commentDetail.replies') }}:</b>
        <ul class="mt-3 space-y-3">
          <li
            v-for="reply in comment.replies"
            :key="reply._id"
            class="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3"
          >
            <div class="flex-shrink-0 mt-1">
              <span class="inline-block w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg">
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
      </div>
      <div v-else class="text-gray-500 mt-4 text-center italic">{{ t('commentDetail.noReplies') }}</div>
    </div>
  </div>
  <div v-else class="p-6 text-center text-gray-500 dark:text-gray-300">
    {{ t('common.loading') }}
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import useBlogComment from '~/composables/useBlogComment';
import useAccount from '~/composables/useAccount';
import { useI18n } from 'vue-i18n';
definePageMeta({ layout: 'admin' });

const { t } = useI18n();
const { fetchCommentById, selectedComment, updateCommentStatus } = useBlogComment();
const { accounts, fetchAccounts } = useAccount();
const route = useRoute();
const comment = ref(null);

const accountName = computed(() => {
  if (!comment.value) return '';
  const acc = accounts.value.find(u => u._id === comment.value.accounts_id);
  return acc ? acc.name : comment.value.accounts_id;
});
const accountEmail = computed(() => {
  if (!comment.value) return '';
  const acc = accounts.value.find(u => u._id === comment.value.accounts_id);
  return acc ? acc.email : '';
});

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
}

onMounted(async () => {
  await fetchAccounts();
  await fetchCommentById(route.params.id);
  comment.value = selectedComment.value;
});
</script>