import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PerformanceReview } from '../types'
import { generatePerformance } from '../mock/data'

export const usePerformanceStore = defineStore('performance', () => {
  const reviews = ref<PerformanceReview[]>(generatePerformance())
  const searchKeyword = ref('')

  const filteredReviews = computed(() => {
    if (!searchKeyword.value) return reviews.value
    return reviews.value.filter(r => r.employeeName.includes(searchKeyword.value))
  })

  function getReviewById(id: string): PerformanceReview | undefined {
    return reviews.value.find(r => r.id === id)
  }

  function updateReview(id: string, data: Partial<PerformanceReview>) {
    const idx = reviews.value.findIndex(r => r.id === id)
    if (idx !== -1) Object.assign(reviews.value[idx], data)
  }

  return { reviews, searchKeyword, filteredReviews, getReviewById, updateReview }
})
