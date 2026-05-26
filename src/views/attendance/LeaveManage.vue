<template>
  <div class="leave-manage">
    <el-card>
      <div class="toolbar">
        <div style="display: flex; gap: 12px">
          <el-input v-model="store.leaveSearchKeyword" placeholder="搜索员工姓名" clearable style="width: 200px" />
          <el-select v-model="store.leaveFilter" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="待审批" value="待审批" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </div>
        <el-button type="primary" @click="dialogVisible = true">申请请假</el-button>
      </div>

      <el-table :data="store.filteredLeaveRequests" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column prop="startDate" label="开始" width="110" />
        <el-table-column prop="endDate" label="结束" width="110" />
        <el-table-column prop="duration" label="天数" width="60" />
        <el-table-column prop="reason" label="原因" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '待审批' ? 'warning' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="申请请假" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="员工" required>
          <el-select v-model="form.employeeName" style="width: 100%">
            <el-option v-for="e in employeeStore.employees" :key="e.id" :label="e.name" :value="e.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="年假" value="年假" /><el-option label="事假" value="事假" />
            <el-option label="病假" value="病假" /><el-option label="婚假" value="婚假" />
            <el-option label="产假" value="产假" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
        </el-form-item>
        <el-form-item label="原因"><el-input v-model="form.reason" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAttendanceStore } from '../../stores/attendance'
import { useEmployeeStore } from '../../stores/employee'

const store = useAttendanceStore()
const employeeStore = useEmployeeStore()
const dialogVisible = ref(false)
const dateRange = ref<any[]>([])

const form = reactive({ employeeName: '', type: '年假' as string, reason: '' })

function handleAdd() {
  if (!form.employeeName || !dateRange.value || dateRange.value.length < 2) {
    ElMessage.warning('请填写必要信息')
    return
  }
  const [start, end] = dateRange.value
  const startDate = start instanceof Date ? start.toISOString().slice(0, 10) : String(start || '')
  const endDate = end instanceof Date ? end.toISOString().slice(0, 10) : String(end || '')
  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1
  const emp = employeeStore.employees.find(e => e.name === form.employeeName)
  store.addLeaveRequest({
    id: `LEV-${String(store.leaveRequests.length + 1).padStart(4, '0')}`,
    employeeId: emp?.id || '',
    employeeName: form.employeeName,
    type: form.type as '年假' | '事假' | '病假' | '婚假' | '产假',
    startDate,
    endDate,
    duration,
    reason: form.reason,
    status: '待审批',
  })
  dialogVisible.value = false
  ElMessage.success('请假申请已提交')
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
