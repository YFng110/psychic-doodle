<template>
  <div class="project-detail">
    <el-page-header @back="router.back()" :content="project?.name || '项目详情'" style="margin-bottom: 20px" />
    <el-card v-if="project">
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ project.customerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ project.managerName }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ project.endDate }}</el-descriptions-item>
        <el-descriptions-item label="预算">¥{{ project.budget.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="project.status === '进行中' ? 'success' : project.status === '筹备中' ? 'warning' : project.status === '已完成' ? 'info' : 'danger'">{{ project.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目成员">{{ project.memberNames.join('、') || '-' }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ project.description || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="任务看板" name="kanban">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="taskDialogVisible = true">新增任务</el-button>
          </div>
          <div class="kanban">
            <div class="kanban-col" v-for="col in taskColumns" :key="col.status">
              <div class="kanban-col-header">
                <span>{{ col.label }}</span>
                <el-tag size="small" round>{{ getProjectTasksByStatus(col.status).length }}</el-tag>
              </div>
              <div class="kanban-cards">
                <el-card v-for="t in getProjectTasksByStatus(col.status)" :key="t.id" shadow="hover" class="task-card">
                  <div class="task-name">{{ t.name }}</div>
                  <div class="task-meta">
                    <el-tag size="small" :type="t.priority === '高' ? 'danger' : t.priority === '中' ? 'warning' : 'info'">{{ t.priority }}</el-tag>
                    <span>{{ t.assigneeName }}</span>
                  </div>
                  <div class="task-dates">{{ t.startDate }} ~ {{ t.dueDate }}</div>
                  <div class="task-footer">
                    <el-button size="small" @click="handleEditTask(t)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDeleteTask(t)">删除</el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="甘特图" name="gantt">
          <div v-if="ganttTasks.length > 0" class="gantt-container">
            <div class="gantt-chart">
              <div class="gantt-header">
                <span class="gantt-task-label">任务</span>
                <div class="gantt-months">
                  <div v-for="m in ganttMonths" :key="m" class="gantt-month">{{ m }}</div>
                </div>
              </div>
              <div class="gantt-row" v-for="t in ganttTasks" :key="t.id">
                <span class="gantt-task-label">{{ t.name }}</span>
                <div class="gantt-bar-area">
                  <div class="gantt-bar" :style="getGanttBarStyle(t)" :class="getGanttBarClass(t)">
                    {{ t.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无任务数据" />
        </el-tab-pane>

        <el-tab-pane label="里程碑" name="milestones">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="milestoneDialogVisible = true">新增里程碑</el-button>
          </div>
          <el-timeline style="margin-top: 16px">
            <el-timeline-item
              v-for="m in milestones"
              :key="m.id"
              :timestamp="m.deadline"
              :color="m.status === '已完成' ? '#67C23A' : m.status === '进行中' ? '#409EFF' : '#909399'"
            >
              <div class="milestone-item">
                <strong>{{ m.name }}</strong>
                <el-tag size="small" :type="m.status === '已完成' ? 'success' : m.status === '进行中' ? '' : 'info'" style="margin-left: 12px">{{ m.status }}</el-tag>
                <div class="milestone-actions">
                  <el-button size="small" @click="handleEditMilestone(m)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteMilestone(m)">删除</el-button>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>

        <el-tab-pane label="工时记录" name="time">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="timeDialogVisible = true">新增工时</el-button>
          </div>
          <el-table :data="timeEntries" stripe style="width: 100%; margin-top: 12px">
            <el-table-column prop="date" label="日期" width="110" />
            <el-table-column prop="employeeName" label="员工" width="80" />
            <el-table-column prop="taskName" label="关联任务" min-width="140" />
            <el-table-column prop="hours" label="工时(h)" width="80" />
            <el-table-column prop="description" label="描述" min-width="180" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="handleDeleteTime(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 任务弹窗 -->
    <el-dialog v-model="taskDialogVisible" :title="editingTask ? '编辑任务' : '新增任务'" width="550px">
      <el-form :model="taskForm" label-width="100px">
        <el-form-item label="任务名称" required><el-input v-model="taskForm.name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="taskForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" required>
              <el-select v-model="taskForm.assigneeId" style="width: 100%" @change="onTaskAssigneeChange">
                <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" required>
              <el-select v-model="taskForm.priority" style="width: 100%"><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" required>
              <el-select v-model="taskForm.status" style="width: 100%"><el-option label="待办" value="待办" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已关闭" value="已关闭" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联里程碑">
              <el-select v-model="taskForm.milestoneId" style="width: 100%" clearable>
                <el-option v-for="m in milestones" :key="m.id" :label="m.name" :value="m.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期"><el-input v-model="taskForm.startDate" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期"><el-input v-model="taskForm.dueDate" type="date" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预估工时(h)"><el-input-number v-model="taskForm.estimatedHours" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际工时(h)"><el-input-number v-model="taskForm.actualHours" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTaskSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 里程碑弹窗 -->
    <el-dialog v-model="milestoneDialogVisible" :title="editingMilestone ? '编辑里程碑' : '新增里程碑'" width="450px">
      <el-form :model="milestoneForm" label-width="80px">
        <el-form-item label="名称" required><el-input v-model="milestoneForm.name" /></el-form-item>
        <el-form-item label="截止日期" required><el-input v-model="milestoneForm.deadline" type="date" /></el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="milestoneForm.status" style="width: 100%"><el-option label="待开始" value="待开始" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="milestoneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMilestoneSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 工时弹窗 -->
    <el-dialog v-model="timeDialogVisible" title="新增工时记录" width="500px">
      <el-form :model="timeForm" label-width="80px">
        <el-form-item label="关联任务" required>
          <el-select v-model="timeForm.taskId" style="width: 100%" @change="onTimeTaskChange">
            <el-option v-for="t in getProjectTasks(project?.id || '')" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工" required>
          <el-select v-model="timeForm.employeeId" style="width: 100%" @change="onTimeEmployeeChange">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期" required><el-input v-model="timeForm.date" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时(h)" required><el-input-number v-model="timeForm.hours" :min="0" :max="24" :step="0.5" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述"><el-input v-model="timeForm.description" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="timeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTimeSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../../stores/project'
import { useEmployeeStore } from '../../stores/employee'
import type { Milestone, Task, TimeEntry } from '../../types'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()
const employeeStore = useEmployeeStore()
const activeTab = ref('kanban')

const project = computed(() => store.getProjectById(route.params.id as string))
const milestones = computed(() => project.value ? store.getMilestonesByProject(project.value.id) : [])
const timeEntries = computed(() => project.value ? store.getTimeEntriesByProject(project.value.id) : [])

const taskColumns = [
  { status: '待办', label: '待办' },
  { status: '进行中', label: '进行中' },
  { status: '已完成', label: '已完成' },
  { status: '已关闭', label: '已关闭' },
]

function getProjectTasks(projectId: string): Task[] {
  return projectId ? store.getTasksByProject(projectId) : []
}
function getProjectTasksByStatus(status: string): Task[] {
  return project.value ? store.getTasksByStatus(project.value.id, status) : []
}

// 任务
const taskDialogVisible = ref(false)
const editingTask = ref<Task | null>(null)
const taskForm = reactive({ name: '', description: '', assigneeId: '', assigneeName: '', priority: '中' as Task['priority'], status: '待办' as Task['status'], milestoneId: '', startDate: '', dueDate: '', estimatedHours: 0, actualHours: 0 })

function onTaskAssigneeChange(aid: string) {
  const e = employeeStore.employees.find(e => e.id === aid)
  taskForm.assigneeName = e?.name || ''
}
function handleEditTask(t: Task) { editingTask.value = t; Object.assign(taskForm, t); taskDialogVisible.value = true }
function handleDeleteTask(t: Task) {
  ElMessageBox.confirm(`确定删除任务 ${t.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteTask(t.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleTaskSubmit() {
  if (!taskForm.name || !taskForm.assigneeId) { ElMessage.warning('请填写必要信息'); return }
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, { ...taskForm })
    ElMessage.success('更新成功')
  } else {
    store.addTask({
      id: `TSK-${String(store.tasks.length + 1).padStart(4, '0')}`,
      projectId: project.value!.id,
      ...taskForm,
    } as Task)
    ElMessage.success('任务已创建')
  }
  taskDialogVisible.value = false
  editingTask.value = null
}

// 里程碑
const milestoneDialogVisible = ref(false)
const editingMilestone = ref<Milestone | null>(null)
const milestoneForm = reactive({ name: '', deadline: '', status: '待开始' as Milestone['status'] })

function handleEditMilestone(m: Milestone) { editingMilestone.value = m; Object.assign(milestoneForm, m); milestoneDialogVisible.value = true }
function handleDeleteMilestone(m: Milestone) {
  ElMessageBox.confirm(`确定删除里程碑 ${m.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteMilestone(m.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleMilestoneSubmit() {
  if (!milestoneForm.name || !milestoneForm.deadline) { ElMessage.warning('请填写必要信息'); return }
  if (editingMilestone.value) {
    store.updateMilestone(editingMilestone.value.id, { ...milestoneForm })
    ElMessage.success('更新成功')
  } else {
    store.addMilestone({ id: `MST-${String(store.milestones.length + 1).padStart(4, '0')}`, projectId: project.value!.id, ...milestoneForm })
    ElMessage.success('里程碑已创建')
  }
  milestoneDialogVisible.value = false
  editingMilestone.value = null
}

// 工时
const timeDialogVisible = ref(false)
const timeForm = reactive({ taskId: '', taskName: '', employeeId: '', employeeName: '', date: '', hours: 0, description: '' })

function onTimeTaskChange(tid: string) {
  const t = store.tasks.find(t => t.id === tid)
  timeForm.taskName = t?.name || ''
}
function onTimeEmployeeChange(eid: string) {
  const e = employeeStore.employees.find(e => e.id === eid)
  timeForm.employeeName = e?.name || ''
}
function handleTimeSubmit() {
  if (!timeForm.taskId || !timeForm.employeeId || !timeForm.date || !timeForm.hours) { ElMessage.warning('请填写必要信息'); return }
  store.addTimeEntry({
    id: `TME-${String(store.timeEntries.length + 1).padStart(4, '0')}`,
    projectId: project.value!.id,
    ...timeForm,
  })
  timeDialogVisible.value = false
  ElMessage.success('工时已记录')
}
function handleDeleteTime(t: TimeEntry) { store.deleteTimeEntry(t.id); ElMessage.success('删除成功') }

// 甘特图
interface GanttTask { id: string; name: string; startDate: string; dueDate: string; status: string }

const ganttTasks = computed<GanttTask[]>(() => {
  return project.value ? getProjectTasks(project.value.id).filter(t => t.startDate && t.dueDate).map(t => ({ id: t.id, name: t.name, startDate: t.startDate, dueDate: t.dueDate, status: t.status })) : []
})

const ganttMonths = computed(() => {
  if (ganttTasks.value.length === 0) return []
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
  const months: string[] = []
  const d = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  while (d <= maxDate) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    d.setMonth(d.getMonth() + 1)
  }
  return months
})

const ganttRangeStart = computed(() => {
  if (ganttTasks.value.length === 0) return new Date()
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  return new Date(Math.min(...dates.map(d => d.getTime())))
})

const ganttRangeEnd = computed(() => {
  if (ganttTasks.value.length === 0) return new Date()
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  const max = new Date(Math.max(...dates.map(d => d.getTime())))
  max.setMonth(max.getMonth() + 1)
  return max
})

function getGanttBarStyle(t: GanttTask) {
  const totalDays = (ganttRangeEnd.value.getTime() - ganttRangeStart.value.getTime()) / (1000 * 60 * 60 * 24)
  const startOffset = (new Date(t.startDate).getTime() - ganttRangeStart.value.getTime()) / (1000 * 60 * 60 * 24)
  const duration = (new Date(t.dueDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1
  return {
    left: `${(startOffset / totalDays) * 100}%`,
    width: `${Math.max((duration / totalDays) * 100, 2)}%`,
  }
}

function getGanttBarClass(t: GanttTask) {
  return t.status === '已完成' ? 'gantt-bar-done' : t.status === '进行中' ? 'gantt-bar-active' : 'gantt-bar-pending'
}
</script>

<style scoped>
.tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.kanban { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; }
.kanban-col { min-width: 220px; max-width: 260px; flex: 1; }
.kanban-col-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: bold; font-size: 14px; background: #f0f2f5; border-radius: 6px; margin-bottom: 8px; }
.kanban-cards { display: flex; flex-direction: column; gap: 8px; min-height: 200px; }
.task-card { cursor: default; }
.task-name { font-weight: bold; font-size: 14px; margin-bottom: 6px; }
.task-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.task-dates { font-size: 12px; color: #909399; margin-bottom: 6px; }
.task-footer { display: flex; gap: 6px; }

.milestone-item { display: flex; align-items: center; }
.milestone-actions { display: flex; gap: 6px; margin-left: auto; }

.gantt-container { overflow-x: auto; }
.gantt-chart { min-width: 600px; }
.gantt-header { display: flex; border-bottom: 2px solid #e6e6e6; padding-bottom: 8px; margin-bottom: 8px; }
.gantt-task-label { width: 150px; flex-shrink: 0; font-weight: bold; font-size: 13px; }
.gantt-months { display: flex; flex: 1; }
.gantt-month { flex: 1; text-align: center; font-size: 12px; color: #909399; }
.gantt-row { display: flex; align-items: center; margin-bottom: 6px; padding: 4px 0; border-bottom: 1px solid #f0f0f0; }
.gantt-bar-area { flex: 1; position: relative; height: 28px; }
.gantt-bar { position: absolute; top: 2px; height: 24px; border-radius: 4px; font-size: 11px; line-height: 24px; padding: 0 8px; color: #fff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.gantt-bar-active { background: #409EFF; }
.gantt-bar-done { background: #67C23A; }
.gantt-bar-pending { background: #909399; }
</style>
