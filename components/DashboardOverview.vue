<template>
    <div class="p-6 space-y-6">
      <div class="grid grid-cols-4 gap-6">
        <div class="stat-box bg-blue-500 dark:bg-blue-700">
          <h3>{{ $t('dashboard.revenue') }}</h3>
          <p>${{ stats.revenue.toLocaleString() }}</p>
        </div>
        <div class="stat-box bg-green-500 dark:bg-green-700">
          <h3>{{ $t('dashboard.orders') }}</h3>
          <p>{{ stats.orders }}</p>
        </div>
        <div class="stat-box bg-yellow-500 dark:bg-yellow-700">
          <h3>{{ $t('dashboard.customers') }}</h3>
          <p>{{ stats.customers }}</p>
        </div>
        <div class="stat-box bg-red-500 dark:bg-red-700">
          <h3>{{ $t('dashboard.products') }}</h3>
          <p>{{ stats.products }}</p>
        </div>
      </div>
  
      <div class="grid grid-cols-2 gap-6">
        <div class="chart-container border rounded-lg">
          <h3>{{ $t('dashboard.salesExpenses') }}</h3>
          <Chart type="bar" :data="barChartData" :options="barChartOptions" />
        </div>
        <div class="chart-container  border rounded-lg">
          <h3>{{ $t('dashboard.popularServices') }}</h3>
          <div class="mb-4 h-64">
            <Chart type="doughnut" :data="doughnutChartData" :options="doughnutOptions" />
          </div>
        </div>
      </div>
  
      <div class="order-table rounded-lg">
        <h3>{{ $t('dashboard.recentOrders') }}</h3>
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-2">{{ $t('dashboard.customers') }}</th>
              <th class="text-left p-2">{{ $t('dashboard.total') }}</th>
              <th class="text-left p-2">{{ $t('dashboard.statusName') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="border-b">
              <td class="p-2">{{ order.customer }}</td>
              <td class="p-2">${{ order.total.toLocaleString() }}</td>
              <td class="p-2">
                <span
                  :class="{
                    'text-green-500': order.status === 'completed',
                    'text-yellow-500': order.status === 'pending',
                    'text-red-500': order.status === 'cancelled'
                  }"
                >
                  {{ $t(`dashboard.status.${order.status}`) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useDashboard } from '@/composables/useDashboard'
  import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Chart } from 'vue-chartjs'
  import { ref, computed, onMounted } from 'vue'
  import { useColorMode } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)
  
  const { stats, recentOrders, barChartData, doughnutChartData } = useDashboard()
  const colorMode = useColorMode()
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
  
  const { t } = useI18n() 
  
  onMounted(() => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  })
  
  const barChartOptions = computed(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `$${tooltipItem.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: isDarkMode.value ? '#ffffff' : '#000000' }
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDarkMode.value ? '#ffffff' : '#000000' }
      }
    }
  }))
  
  const doughnutOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            let value = tooltipItem.raw
            let total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0)
            let percentage = ((value / total) * 100).toFixed(1)
            return `${tooltipItem.label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }))
  </script>
  
  <style scoped>
  .stat-box {
    @apply text-white p-4 rounded-lg shadow text-center;
  }
  
  .chart-container {
    @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow text-gray-900 dark:text-gray-300;
  }
  
  .small-chart {
    height: 300px;
  }
  
  .order-table {
    @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700;
  }
  </style>
  