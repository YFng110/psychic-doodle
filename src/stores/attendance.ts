import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AttendanceRecord, LeaveRequest } from '../types'
import { generateAttendance, generateLeaveRequests } from '../mock/data'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendances = ref<AttendanceRecord[]>(generateAttendance())
  const leaveRequests = ref<LeaveRequest[]>(generateLeaveRequests())
  const attSearchKeyword = ref('')
  const leaveSearchKeyword = ref('')
  const leaveFilter = ref('')

  const filteredAttendances = computed(() => {
    if (!attSearchKeyword.value) return attendances.value
    return attendances.value.filter(a => a.employeeName.includes(attSearchKeyword.value))
  })

  const filteredLeaveRequests = computed(() => {
    let list = leaveRequests.value
    if (leaveSearchKeyword.value) {
      list = list.filter(l => l.employeeName.includes(leaveSearchKeyword.value))
    }
    if (leaveFilter.value) {
      list = list.filter(l => l.status === leaveFilter.value)
    }
    return list
  })

  function addLeaveRequest(req: LeaveRequest) {
    leaveRequests.value.unshift(req)
  }

  function approveLeave(id: string) {
    const item = leaveRequests.value.find(l => l.id === id)
    if (item) item.status = '已通过'
  }

  function rejectLeave(id: string) {
    const item = leaveRequests.value.find(l => l.id === id)
    if (item) item.status = '已拒绝'
  }

  return { attendances, leaveRequests, attSearchKeyword, leaveSearchKeyword, leaveFilter, filteredAttendances, filteredLeaveRequests, addLeaveRequest, approveLeave, rejectLeave }
})
