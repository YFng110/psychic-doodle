import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SalaryRecord } from '../types'
import { generateSalary } from '../mock/data'

export const useSalaryStore = defineStore('salary', () => {
  const salaries = ref<SalaryRecord[]>(generateSalary())
  const searchKeyword = ref('')

  const filteredSalaries = computed(() => {
    if (!searchKeyword.value) return salaries.value
    return salaries.value.filter(s => s.employeeName.includes(searchKeyword.value))
  })

  function getSalaryById(id: string): SalaryRecord | undefined {
    return salaries.value.find(s => s.id === id)
  }

  function updateSalary(id: string, data: Partial<SalaryRecord>) {
    const idx = salaries.value.findIndex(s => s.id === id)
    if (idx !== -1) Object.assign(salaries.value[idx], data)
  }

  return { salaries, searchKeyword, filteredSalaries, getSalaryById, updateSalary }
})
