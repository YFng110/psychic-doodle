import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, Milestone, Task, TimeEntry } from '../types'
import { mockProjects, mockMilestones, mockTasks, mockTimeEntries } from '../mock/data'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([...mockProjects])
  const milestones = ref<Milestone[]>([...mockMilestones])
  const tasks = ref<Task[]>([...mockTasks])
  const timeEntries = ref<TimeEntry[]>([...mockTimeEntries])

  const searchKeyword = ref('')
  const filterStatus = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredProjects = computed(() => {
    let list = projects.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(p => p.name.includes(kw) || p.customerName.includes(kw) || p.managerName.includes(kw))
    }
    if (filterStatus.value) list = list.filter(p => p.status === filterStatus.value)
    return list
  })

  const pagedProjects = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredProjects.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredProjects.value.length)

  function addProject(p: Project) { projects.value.unshift(p) }
  function updateProject(id: string, data: Partial<Project>) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(projects.value[idx], data)
  }
  function deleteProject(id: string) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value.splice(idx, 1)
  }
  function getProjectById(id: string): Project | undefined {
    return projects.value.find(p => p.id === id)
  }

  function getMilestonesByProject(projectId: string): Milestone[] {
    return milestones.value.filter(m => m.projectId === projectId)
  }
  function addMilestone(m: Milestone) { milestones.value.unshift(m) }
  function updateMilestone(id: string, data: Partial<Milestone>) {
    const idx = milestones.value.findIndex(m => m.id === id)
    if (idx !== -1) Object.assign(milestones.value[idx], data)
  }
  function deleteMilestone(id: string) {
    const idx = milestones.value.findIndex(m => m.id === id)
    if (idx !== -1) milestones.value.splice(idx, 1)
  }

  function getTasksByProject(projectId: string): Task[] {
    return tasks.value.filter(t => t.projectId === projectId)
  }
  function getTasksByStatus(projectId: string, status: string): Task[] {
    return tasks.value.filter(t => t.projectId === projectId && t.status === status)
  }
  function addTask(t: Task) { tasks.value.unshift(t) }
  function updateTask(id: string, data: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) Object.assign(tasks.value[idx], data)
  }
  function deleteTask(id: string) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value.splice(idx, 1)
  }

  function getTimeEntriesByProject(projectId: string): TimeEntry[] {
    return timeEntries.value.filter(t => t.projectId === projectId).sort((a, b) => b.date.localeCompare(a.date))
  }
  function addTimeEntry(t: TimeEntry) { timeEntries.value.unshift(t) }
  function deleteTimeEntry(id: string) {
    const idx = timeEntries.value.findIndex(t => t.id === id)
    if (idx !== -1) timeEntries.value.splice(idx, 1)
  }

  return {
    projects, milestones, tasks, timeEntries,
    searchKeyword, filterStatus, currentPage, pageSize,
    filteredProjects, pagedProjects, total,
    addProject, updateProject, deleteProject, getProjectById,
    getMilestonesByProject, addMilestone, updateMilestone, deleteMilestone,
    getTasksByProject, getTasksByStatus, addTask, updateTask, deleteTask,
    getTimeEntriesByProject, addTimeEntry, deleteTimeEntry,
  }
})
