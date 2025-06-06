<template>
  <aside
    class="fixed top-0 left-0 bottom-0 z-40 bg-gray-800 text-white text-sm transition-all duration-300"
    :class="sidebar.isVisible ? 'w-64' : 'w-16'"
  >
    <div class="relative h-full flex flex-col transition-all duration-300">
      <!-- Toggle Button -->
      <button
        class="absolute top-1/2 right-[-20px] transform -translate-y-1/2 z-10 bg-gray-800 text-white rounded-r-full p-1 shadow hover:bg-gray-800 transition-all duration-300"
        @click="sidebar.toggle()"
      >
        <component
          :is="sidebar.isVisible ? ChevronLeftIcon : ChevronRightIcon"
          class="w-5 h-5"
        />
      </button>

      <!-- Sidebar content -->
      <div
        class="flex-1 overflow-y-auto scrollbar-hide transition-all duration-300"
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
                @click="sidebar.isVisible && toggleMenu(item.key)"
                >
                <span class="flex items-center">
                  {{ item.icon }}
                  <span v-if="isFullyOpen" class="ml-2">{{ item.name }}</span>
                </span>
                <span
                  v-if="isFullyOpen"
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
                      {{ isFullyOpen ? sub.name : '' }}
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
                <span class="flex items-center">
                  <span>{{ item.icon }}</span>
                  <span v-if="isFullyOpen" class="ml-2">{{ item.name }}</span>
                </span>
              </NuxtLink>

            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSidebarStore } from '@/stores/sidebar'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const { t } = useI18n()
const sidebar = useSidebarStore()

const STORAGE_KEY = 'sidebarMenuState'

// Parse user from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userPermissions = user.privilege === '0' ? ['admin'] : ['auth']

const isFullyOpen = ref(sidebar.isVisible)

watch(() => sidebar.isVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      isFullyOpen.value = true
    }, 200) 
  } else {
    isFullyOpen.value = false
  }
})

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

// localStorage.removeItem(STORAGE_KEY)

const savedState = localStorage.getItem(STORAGE_KEY)
const menuStructure = reactive<MenuItem[]>(savedState ? JSON.parse(savedState) : defaultMenuStructure)

menuStructure.forEach(item => {
  item.name = t(`sidebar.${item.key}`)
  if (item.subMenu) {
    item.subMenu.forEach(sub => {
      sub.name = t(`sidebar.${sub.key}`)
    })
  }
})

watch(
  () => menuStructure.map(item => ({ key: item.key, isOpen: item.isOpen })),
  () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuStructure))
  },
  { deep: true }
)

const menuItems = computed(() => {
  return menuStructure
    .filter(item => {
      if (userPermissions.includes('admin')) return true
      return item.permission === 'all' || !item.permission || userPermissions.includes(item.permission)
    })
    .map(item => ({
      ...item,
      name: t(`sidebar.${item.key}`),
      subMenu: item.subMenu?.filter(sub => {
        if (userPermissions.includes('admin')) return true
        return sub.permission === 'all' || userPermissions.includes(sub.permission)
      }).map(sub => ({
        ...sub,
        name: t(`sidebar.${sub.key}`)
      }))
    }))
    .filter(item => !item.subMenu || item.subMenu.length > 0 || item.route)
})


const toggleMenu = (key: string) => {
  const target = menuStructure.find(item => item.key === key)
  if (target) target.isOpen = !target.isOpen
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
