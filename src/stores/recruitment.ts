import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Job, Candidate, Interview } from '../types'
import { mockJobs, mockCandidates, mockInterviews } from '../mock/data'

export const useRecruitmentStore = defineStore('recruitment', () => {
  const jobs = ref<Job[]>([...mockJobs])
  const candidates = ref<Candidate[]>([...mockCandidates])
  const interviews = ref<Interview[]>([...mockInterviews])

  const activeJobs = computed(() => jobs.value.filter(j => j.status === '招聘中'))

  function addJob(job: Job) { jobs.value.unshift(job) }
  function updateJob(id: string, data: Partial<Job>) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) Object.assign(jobs.value[idx], data)
  }
  function deleteJob(id: string) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) jobs.value.splice(idx, 1)
  }

  function addCandidate(c: Candidate) { candidates.value.unshift(c) }
  function updateCandidate(id: string, data: Partial<Candidate>) {
    const idx = candidates.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(candidates.value[idx], data)
  }

  function addInterview(iv: Interview) { interviews.value.unshift(iv) }
  function updateInterview(id: string, data: Partial<Interview>) {
    const idx = interviews.value.findIndex(i => i.id === id)
    if (idx !== -1) Object.assign(interviews.value[idx], data)
  }

  return { jobs, candidates, interviews, activeJobs, addJob, updateJob, deleteJob, addCandidate, updateCandidate, addInterview, updateInterview }
})
