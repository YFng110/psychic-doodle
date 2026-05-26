<template>
  <div class="expense-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.expenseSearchKeyword" placeholder="搜索员工/说明" clearable style="width: 200px" />
          <el-select v-model="store.expenseTypeFilter" placeholder="费用类型" clearable style="width: 110px">
            <el-option label="差旅" value="差旅" /><el-option label="招待" value="招待" />
            <el-option label="办公" value="办公" /><el-option label="其他" value="其他" />
          </el-select>
          <el-select v-model="store.expenseStatusFilter" placeholder="状态筛选" clearable style="width: 110px">
            <el-option label="待审批" value="待审批" /><el-option label="已通过" value="已通过" /><el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增报销</el-button>
      </div>

      <el-table :data="store.filteredExpenses" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="type" label="类型" width="70" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="description" label="说明" min-width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '已拒绝' ? 'danger' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns" v-if="row.status === '待审批'">
              <el-button size="small" type="success" @click="handleApprove(row)">通过</el-button>
              <el-button size="small" type="danger" @click="handleReject(row)">拒绝</el-button>
            </div>
            <el-button v-else size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增报销" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="员工" required>
          <el-select v-model="form.employeeId" style="width: 100%" @change="onEmployeeChange">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name + ' - ' + e.department" :value="e.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" required>
          <el-select v-model="form.type" style="width: 100%"><el-option label="差旅" value="差旅" /><el-option label="招待" value="招待" /><el-option label="办公" value="办公" /><el-option label="其他" value="其他" /></el-select>
        </el-form-item>
        <el-form-item label="金额" required><el-input-number v-model="form.amount" :min="0" :step="100" style="width: 100%" /></el-form-item>
        <el-form-item label="日期" required><el-input v-model="form.date" type="date" /></el-form-item>
        <el-form-item label="说明" required><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useFinanceStore } from '../../stores/finance'
import { useEmployeeStore } from '../../stores/employee'
import type { ExpenseReport } from '../../types'

const store = useFinanceStore()
const employeeStore = useEmployeeStore()
const dialogVisible = ref(false)

const form = reactive({ employeeId: '', employeeName: '', type: '差旅' as ExpenseReport['type'], amount: 0, date: '', description: '' })

function onEmployeeChange(eid: string) {
  const e = employeeStore.employees.find(e => e.id === eid)
  form.employeeName = e?.name || ''
}

function handleNew() {
  Object.assign(form, { employeeId: '', employeeName: '', type: '差旅', amount: 0, date: '', description: '' })
  dialogVisible.value = true
}
function handleSubmit() {
  if (!form.employeeId || !form.amount || !form.date || !form.description) { ElMessage.warning('请填写必要信息'); return }
  store.addExpense({
    id: `EXP-${String(store.expenses.length + 1).padStart(4, '0')}`,
    ...form,
    status: '待审批', approverId: '', approverName: '', approvedAt: '',
  })
  dialogVisible.value = false
  ElMessage.success('报销申请已提交')
}
function handleApprove(ex: ExpenseReport) {
  store.updateExpense(ex.id, { status: '已通过', approverId: employeeStore.employees[5].id, approverName: '周八', approvedAt: new Date().toISOString().slice(0, 10) })
  ElMessage.success('已通过')
}
function handleReject(ex: ExpenseReport) {
  store.updateExpense(ex.id, { status: '已拒绝', approverId: employeeStore.employees[5].id, approverName: '周八', approvedAt: new Date().toISOString().slice(0, 10) })
  ElMessage.success('已拒绝')
}
function handleDelete(ex: ExpenseReport) { store.deleteExpense(ex.id); ElMessage.success('删除成功') }
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 6px; }
</style>
