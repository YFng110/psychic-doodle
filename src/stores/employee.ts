import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee } from '../types'
import { mockEmployees } from '../mock/data'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([...mockEmployees.map(e => ({ ...e }))])
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredEmployees = computed(() => {
    if (!searchKeyword.value) return employees.value
    const kw = searchKeyword.value.toLowerCase()
    return employees.value.filter(e =>
      e.name.includes(kw) || e.department.includes(kw) || e.position.includes(kw)
    )
  })

  const pagedEmployees = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredEmployees.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredEmployees.value.length)

  function addEmployee(emp: Employee) {
    employees.value.unshift(emp)
  }

  function updateEmployee(id: string, data: Partial<Employee>) {
    const idx = employees.value.findIndex(e => e.id === id)
    if (idx !== -1) Object.assign(employees.value[idx], data)
  }

  function deleteEmployee(id: string) {
    const idx = employees.value.findIndex(e => e.id === id)
    if (idx !== -1) employees.value.splice(idx, 1)
  }

  function getEmployeeById(id: string): Employee | undefined {
    return employees.value.find(e => e.id === id)
  }

  return { employees, searchKeyword, currentPage, pageSize, filteredEmployees, pagedEmployees, total, addEmployee, updateEmployee, deleteEmployee, getEmployeeById }
})
