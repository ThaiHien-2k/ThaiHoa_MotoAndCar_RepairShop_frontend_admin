import { ref } from 'vue'

interface DashboardData {
  stats: {
    revenue: number
    orders: number
    customers: number
    products: number
  }
  recentOrders: {
    id: number
    customer: string
    total: number
    status: string
  }[]
  barChartData: {
    labels: string[]
    revenue: number[]
    expense: number[]
  }
  doughnutChartData: {
    labels: string[]
    data: number[]
  }
}

const sampleData: DashboardData = {
  stats: {
    revenue: 1250000,
    orders: 320,
    customers: 185,
    products: 45
  },
  recentOrders: [
    { id: 1, customer: 'Nguyễn Văn A', total: 350000, status: 'completed' },
    { id: 2, customer: 'Trần Thị B', total: 420000, status: 'pending' },
    { id: 3, customer: 'Lê Văn C', total: 220000, status: 'cancelled' }
  ],
  barChartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenue: [200000, 250000, 180000, 300000, 220000, 270000],
    expense: [120000, 150000, 100000, 200000, 180000, 210000]
  },
  doughnutChartData: {
    labels: ['Sửa xe', 'Thay nhớt', 'Vệ sinh', 'Bảo dưỡng'],
    data: [50, 30, 20, 10]
  }
}

export function useDashboard() {
  const stats = ref(sampleData.stats)
  const recentOrders = ref(sampleData.recentOrders)
  const barChartData = ref({
    labels: sampleData.barChartData.labels,
    datasets: [
      { label: 'Doanh thu', data: sampleData.barChartData.revenue, backgroundColor: '#36A2EB' },
      { label: 'Chi phí', data: sampleData.barChartData.expense, backgroundColor: '#FF6384' }
    ]
  })
  const doughnutChartData = ref({
    labels: sampleData.doughnutChartData.labels,
    datasets: [{ data: sampleData.doughnutChartData.data, backgroundColor: ['#4CAF50', '#FFC107', '#03A9F4', '#E91E63'] }]
  })

  return { stats, recentOrders, barChartData, doughnutChartData }
}
