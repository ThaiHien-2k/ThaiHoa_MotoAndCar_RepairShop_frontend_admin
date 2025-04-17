import { ref } from 'vue'

export interface Allowance {
  _id?: string
  type: string
  amount: number
}

export interface Deduction {
  _id?: string
  type: string
  amount: number
}

export interface Bonus {
  _id?: string
  type: string
  amount: number
  date: string
  reason: string
}

export interface PaymentHistory {
  _id?: string
  month: string
  payment_date: string
  paid_amount: number
  status: string
}

export interface Salary {
  _id?: string
  base_salary: number
  allowances: Allowance[]
  deductions: Deduction[]
  bonuses: Bonus[]
  net_salary: number
  payment_history: PaymentHistory[]
}

export interface PerformanceReview {
  _id?: string
  date: string
  score: number
  comments: string
}

export interface LeaveRecord {
  _id?: string
  date: string
  reason: string
}

export interface BankAccount {
  account_name: string
  account_number: string
  bank_name: string
  expiry_date: string
}

export interface Employee {
  _id: string
  name: string
  email: string
  phone: string
  position: string
  employment_type: 'full_time' | 'part_time' | 'contract'
  status: 'active' | 'inactive'
  hiredDate: string
  specializations: string[]
  certifications: string[]
  salary: Salary
  performance_reviews: PerformanceReview[]
  leave_records: LeaveRecord[]
  bank_account: BankAccount // ✅ Sửa lại từ string thành object
  createdAt: string
  updatedAt: string
}


export default function useEmployee() {
  const config = useRuntimeConfig()
  const API_URL = config.public.BACKEND_API_URL

  const getToken = (): string => {
    if (process.client) {
      return localStorage.getItem('access_token') || ''
    }
    return ''
  }

  const employees = ref<Employee[]>([])
  const selectedEmployee = ref<Employee | null>(null)
  const isLoading = ref<boolean>(false)

  const fetchEmployees = async (): Promise<void> => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!response.ok) throw new Error('Failed to fetch employee list.')

      const responseData = await response.json()
      employees.value = responseData || []
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchEmployeeById = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      if (!response.ok) throw new Error('Failed to fetch employee details.')

      selectedEmployee.value = await response.json()
    } catch (error) {
      console.error('Error fetching employee details:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createEmployee = async (data: any): Promise<{ success: boolean; data?: Employee; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure it is JSON, not FormData
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)  // Sending the data as JSON
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create employee.')
      }
  
      const createdData = await response.json()
      await fetchEmployees()
  
      return { success: true, data: createdData }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unknown error occurred.'
      console.error('Error creating employee:', msg)
      return { success: false, message: msg }
    }
  }
  

  const updateEmployee = async (
    id: string,
    data: Partial<Employee>
  ): Promise<{ success: boolean; data?: Employee; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update employee.')
      }

      const updatedData = await response.json()
      await fetchEmployees()

      return { success: true, data: updatedData }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unknown error occurred.'
      console.error('Error updating employee:', msg)
      return { success: false, message: msg }
    }
  }

  const deleteEmployee = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete employee.')
      }

      return { success: true, message: 'Employee deleted successfully.' }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unknown error occurred.'
      console.error('Error deleting employee:', msg)
      return { success: false, message: msg }
    }
  }

  const hasEmployee = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/employees/has_employee`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ id })
      });
  
      if (!response.ok) {
        return false; 
      }
  
      const data = await response.json();
      return data.exists; 
    } catch (error) {
      console.error('Error checking employee:', error);
      return false;
    }
  };

  return {
    employees,
    selectedEmployee,
    isLoading,
    fetchEmployees,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    hasEmployee
  }
}
