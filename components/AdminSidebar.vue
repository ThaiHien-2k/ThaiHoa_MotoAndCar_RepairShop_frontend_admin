<template>
  <aside
    class="fixed top-0 left-0 bottom-0 z-40 bg-gray-800 text-white text-sm transition-all duration-300"
    :class="sidebar.isVisible ? 'w-64' : 'w-16'"
  >
    <div class="relative h-full flex flex-col transition-all duration-300">
      <!-- Toggle Button -->
      <button
        class="absolute top-1/2 right-[-18px] transform -translate-y-1/2 z-30 bg-gray-800 text-white rounded-r-full p-1 shadow hover:bg-gray-800 transition-all duration-300"
        @click="sidebar.toggle()"
      >
      <component
        :is="sidebar.isVisible ? ChevronLeftIcon : ChevronRightIcon"
        class="w-5 h-5"
      />
      </button>

      <!-- Sidebar content -->
      <div
        class="flex-1 overflow-y-auto scrollbar-hide transition-all duration-300 z-40"
        :class="sidebar.isVisible ? 'p-2 pr-3' : 'p-2'"
      >
        <nav>
          <ul>
            <li
              v-for="(item, index) in menuItems"
              :key="item.key"
              class="mb-2"
            >
              <!-- Item with subMenu -->
              <div
                v-if="item.subMenu"
                class="cursor-pointer bg-gray-700 rounded-md hover:bg-gray-600 flex items-center transition-all duration-300"
                :class="sidebar.isVisible ? 'p-2 justify-between' : 'p-2 justify-center'"
                @click="sidebar.isVisible && toggleMenu(index)"
              >
                <span class="flex items-center">
                  {{ item.icon }}
                  <span v-if="sidebar.isVisible" class="ml-2">{{ item.name }}</span>
                </span>
                <span
                  v-if="sidebar.isVisible"
                  :class="['transition-transform', { 'rotate-180': item.isOpen }]"
                >▼</span>
              </div>

              <!-- Submenu -->
              <transition name="slide">
                <ul
                  v-if="sidebar.isVisible && item.isOpen"
                  class="mt-2 space-y-1 ml-4"
                >
                  <li v-for="sub in item.subMenu" :key="sub.key">
                    <NuxtLink
                      :to="sub.route"
                      class="block px-4 py-2 hover:bg-gray-600 rounded-md whitespace-nowrap"
                    >
                      {{ sub.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </transition>


              <!-- Item without subMenu -->
              <NuxtLink
                v-if="!item.subMenu && item.route"
                :to="item.route"
                class="block bg-gray-700 rounded-md hover:bg-gray-600 flex items-center transition-all duration-300"
                :class="sidebar.isVisible ? 'p-2' : 'p-2 justify-center'"
              >
                <span :class="sidebar.isVisible ? 'mr-2' : ''">{{ item.icon }}</span>
                <span v-if="sidebar.isVisible">{{ item.name }}</span>
              </NuxtLink>

            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSidebarStore } from '@/stores/sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const { t } = useI18n()
const sidebar = useSidebarStore()

const STORAGE_KEY = 'sidebarMenuState'

interface SubMenuItem {
  key: string
  route: string
  permission: string
  name?: string
}

interface MenuItem {
  key: string
  icon: string
  route?: string
  permission?: string
  isOpen: boolean
  subMenu?: SubMenuItem[]
  name?: string
}

const defaultMenuStructure: MenuItem[] = [
  { key: 'dashboard', icon: '🏠', route: '/', permission: 'all', isOpen: false },
  {
    key: 'accounts',
    icon: '👤',
    isOpen: false,
    subMenu: [
      { key: 'accounts', route: '/accounts', permission: 'admin' },
      { key: 'customers', route: '/customers', permission: 'auth' },
      { key: 'employees', route: '/employees', permission: 'admin' }
    ]
  },
  {
    key: 'products_inventory',
    icon: '🛒',
    isOpen: false,
    subMenu: [
      { key: 'product_list', route: '/products', permission: 'auth' },
      { key: 'product_comments', route: '/product-comments', permission: 'auth' },
      { key: 'categories', route: '/categories', permission: 'auth' }
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
    key: 'promotions',
    icon: '🎁',
    isOpen: false,
    permission: 'admin',
    subMenu: [
      { key: 'promotions', route: '/promotions', permission: 'admin' }
    ]
  }
]

const savedState = localStorage.getItem(STORAGE_KEY)
const menuStructure = reactive<MenuItem[]>(savedState ? JSON.parse(savedState) : defaultMenuStructure)

watch(
  () => menuStructure.map(item => ({ key: item.key, isOpen: item.isOpen })),
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuStructure))
  },
  { deep: true }
)

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

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
