import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contract } from '../types'
import { mockContracts } from '../mock/data'

export const useContractStore = defineStore('contract', () => {
  const contracts = ref<Contract[]>([...mockContracts])
  const searchKeyword = ref('')
  const filterStatus = ref('')

  const filteredContracts = computed(() => {
    let list = contracts.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(c => c.name.includes(kw) || c.customerName.includes(kw))
    }
    if (filterStatus.value) list = list.filter(c => c.status === filterStatus.value)
    return list
  })

  function addContract(c: Contract) { contracts.value.unshift(c) }
  function updateContract(id: string, data: Partial<Contract>) {
    const idx = contracts.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(contracts.value[idx], data)
  }
  function deleteContract(id: string) {
    const idx = contracts.value.findIndex(c => c.id === id)
    if (idx !== -1) contracts.value.splice(idx, 1)
  }

  return { contracts, searchKeyword, filterStatus, filteredContracts, addContract, updateContract, deleteContract }
})
