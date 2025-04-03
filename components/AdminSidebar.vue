<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const menuStructure = reactive([
  { key: 'dashboard', icon: '🏠', route: '/', permission: 'all', isOpen: false },
  {
    key: 'accounts_customers',
    icon: '👤',
    isOpen: false,
    subMenu: [
      { key: 'accounts', route: '/accounts', permission: 'admin' },
      { key: 'customers', route: '/customers', permission: 'auth' }
    ]
  },
  {
    key: 'products_inventory',
    icon: '🛒',
    isOpen: false,
    subMenu: [
      { key: 'product_list', route: '/products', permission: 'auth' },
      { key: 'product_comments', route: '/product-comments', permission: 'auth' },
    ]
  },
  {
    key: 'orders_history',
    icon: '📦',
    isOpen: false,
    subMenu: [
      { key: 'orders', route: '/orders', permission: 'auth' },
      { key: 'purchase_history', route: '/purchase-history', permission: 'auth' },
      { key: 'repair_history', route: '/repair-history', permission: 'auth' }
    ]
  },

  {
    key: 'services_appointments',
    icon: '🛠️',
    isOpen: false,
    subMenu: [
      { key: 'service_list', route: '/services', permission: 'auth' },
      { key: 'repair_appointments', route: '/repair-appointments', permission: 'auth' }
    ]
  },
  {
    key: 'employees_suppliers',
    icon: '👷',
    isOpen: false,
    permission: 'admin',
    subMenu: [
      { key: 'employees', route: '/employees', permission: 'admin' },
      { key: 'suppliers', route: '/suppliers', permission: 'admin' }
    ]
  },
  {
    key: 'blog',
    icon: '📝',
    isOpen: false,
    subMenu: [
      { key: 'blog_posts', route: '/blogs', permission: 'auth' },
      { key: 'blog_comments', route: '/blog-comments', permission: 'auth' }
    ]
  },
  {
    key: 'promotions_categories',
    icon: '🎁',
    isOpen: false,
    permission: 'admin',
    subMenu: [
      { key: 'promotions', route: '/promotions', permission: 'admin' },
      { key: 'categories', route: '/categories', permission: 'auth' }
    ]
  }
])

const menuItems = computed(() => {
  return menuStructure.map(item => ({
    ...item,
    name: t(`sidebar.${item.key}`),
    subMenu: item.subMenu?.map(sub => ({
      ...sub,
      name: t(`sidebar.${sub.key}`)
    }))
  }))
})

const toggleMenu = (index: number) => {
  menuStructure[index].isOpen = !menuStructure[index].isOpen
}
</script>

<template>
  <aside class="w-64 h-full fixed left-0 top-0 bottom-0 bg-gray-800 text-white p-4 text-sm">
    <nav>
      <ul>
        <li v-for="(item, index) in menuItems" :key="index" class="mb-2">
          <div v-if="item.subMenu"
               class="cursor-pointer p-2 bg-gray-700 rounded-md hover:bg-gray-600 flex justify-between items-center"
               @click="toggleMenu(index)">
            <span>{{ item.icon }} {{ item.name }}</span>
            <span :class="{ 'rotate-180': item.isOpen }">▼</span>
          </div>

          <ul v-if="item.isOpen" class="ml-4 mt-2">
            <li v-for="(sub, subIndex) in item.subMenu" :key="subIndex">
              <router-link :to="sub.route" class="block px-4 py-2 hover:bg-gray-600 rounded-md">
                {{ sub.name }}
              </router-link>
            </li>
          </ul>

          <router-link v-if="!item.subMenu && item.route" :to="item.route"
                 class="block p-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center">
            <span class="mr-2">{{ item.icon }}</span> {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
