import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Opportunity } from '../types'
import { mockOpportunities } from '../mock/data'

export const useOpportunityStore = defineStore('opportunity', () => {
  const opportunities = ref<Opportunity[]>([...mockOpportunities])

  const stages = ['初步接触', '需求分析', '方案报价', '商务谈判', '已成交', '已丢单'] as const

  function getOppsByStage(stage: string): Opportunity[] {
    return opportunities.value.filter(o => o.stage === stage)
  }

  function addOpportunity(o: Opportunity) { opportunities.value.unshift(o) }
  function updateOpportunity(id: string, data: Partial<Opportunity>) {
    const idx = opportunities.value.findIndex(o => o.id === id)
    if (idx !== -1) Object.assign(opportunities.value[idx], data)
  }
  function deleteOpportunity(id: string) {
    const idx = opportunities.value.findIndex(o => o.id === id)
    if (idx !== -1) opportunities.value.splice(idx, 1)
  }

  const totalAmount = computed(() => opportunities.value.reduce((s, o) => s + o.amount, 0))
  const wonAmount = computed(() => opportunities.value.filter(o => o.stage === '已成交').reduce((s, o) => s + o.amount, 0))

  return { opportunities, stages, getOppsByStage, addOpportunity, updateOpportunity, deleteOpportunity, totalAmount, wonAmount }
})
