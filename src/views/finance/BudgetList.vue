<template>
  <div class="budget-list">
    <el-card>
      <div class="toolbar">
        <el-select v-model="store.budgetYearFilter" placeholder="年度筛选" style="width: 100px">
          <el-option label="2026" value="2026" /><el-option label="2025" value="2025" />
        </el-select>
        <el-button type="primary" @click="handleNew">新增预算</el-button>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="8" v-for="b in store.filteredBudgets" :key="b.id" style="margin-bottom: 16px">
        <el-card shadow="hover">
          <div class="budget-card">
            <div class="budget-header">
              <span class="budget-name">{{ b.department || b.projectName }}</span>
              <el-tag size="small" :type="b.category === '部门预算' ? 'info' : 'success'">{{ b.category }}</el-tag>
            </div>
            <div class="budget-amounts">
              <div class="amount-row">
                <span>预算总额</span>
                <strong>¥{{ b.totalAmount.toLocaleString() }}</strong>
              </div>
              <div class="amount-row">
                <span>已使用</span>
                <strong :style="{ color: b.usedAmount > b.totalAmount ? '#F56C6C' : '#409EFF' }">¥{{ b.usedAmount.toLocaleString() }}</strong>
              </div>
              <div class="amount-row">
                <span>剩余</span>
                <strong :style="{ color: b.totalAmount - b.usedAmount < 0 ? '#F56C6C' : '#67C23A' }">¥{{ (b.totalAmount - b.usedAmount).toLocaleString() }}</strong>
              </div>
            </div>
            <el-progress :percentage="Math.min(Math.round(b.usedAmount / b.totalAmount * 100), 100)" :status="b.usedAmount > b.totalAmount ? 'exception' : b.usedAmount / b.totalAmount > 0.8 ? 'warning' : ''" :stroke-width="10" />
            <div class="budget-footer">
              <el-button size="small" @click="handleEdit(b)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(b)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="editingBudget ? '编辑预算' : '新增预算'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="年度" required><el-input v-model="form.year" /></el-form-item>
        <el-form-item label="预算类别" required>
          <el-select v-model="form.category" style="width: 100%" @change="onCategoryChange"><el-option label="部门预算" value="部门预算" /><el-option label="项目预算" value="项目预算" /></el-select>
        </el-form-item>
        <el-form-item v-if="form.category === '部门预算'" label="部门" required>
          <el-select v-model="form.department" style="width: 100%"><el-option label="技术部" value="技术部" /><el-option label="产品部" value="产品部" /><el-option label="销售部" value="销售部" /><el-option label="市场部" value="市场部" /><el-option label="人事部" value="人事部" /><el-option label="财务部" value="财务部" /></el-select>
        </el-form-item>
        <el-form-item v-if="form.category === '项目预算'" label="关联项目" required>
          <el-select v-model="form.projectId" style="width: 100%">
            <el-option v-for="p in projectStore.projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算金额" required><el-input-number v-model="form.totalAmount" :min="0" :step="10000" style="width: 100%" /></el-form-item>
        <el-form-item label="已用金额"><el-input-number v-model="form.usedAmount" :min="0" :step="1000" style="width: 100%" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFinanceStore } from '../../stores/finance'
import { useProjectStore } from '../../stores/project'
import type { Budget } from '../../types'

const store = useFinanceStore()
const projectStore = useProjectStore()
const dialogVisible = ref(false)
const editingBudget = ref<Budget | null>(null)

const form = reactive({ year: '2026', department: '', category: '部门预算' as Budget['category'], projectId: '', projectName: '', totalAmount: 0, usedAmount: 0 })

function onCategoryChange() { form.department = ''; form.projectId = ''; form.projectName = '' }

function handleNew() {
  editingBudget.value = null
  Object.assign(form, { year: '2026', department: '', category: '部门预算', projectId: '', projectName: '', totalAmount: 0, usedAmount: 0 })
  dialogVisible.value = true
}
function handleEdit(b: Budget) { editingBudget.value = b; Object.assign(form, b); dialogVisible.value = true }
function handleDelete(b: Budget) {
  ElMessageBox.confirm('确定删除该预算吗？', '提示', { type: 'warning' })
    .then(() => { store.deleteBudget(b.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.year || !form.totalAmount) { ElMessage.warning('请填写必要信息'); return }
  if (form.category === '部门预算' && !form.department) { ElMessage.warning('请选择部门'); return }
  if (form.category === '项目预算' && !form.projectId) { ElMessage.warning('请选择项目'); return }
  if (form.category === '项目预算') {
    const p = projectStore.projects.find(p => p.id === form.projectId)
    form.projectName = p?.name || ''
  }
  if (editingBudget.value) {
    store.updateBudget(editingBudget.value.id, { ...form } as Budget)
    ElMessage.success('更新成功')
  } else {
    store.addBudget({ id: `BUD-${String(store.budgets.length + 1).padStart(4, '0')}`, ...form } as Budget)
    ElMessage.success('预算已创建')
  }
  dialogVisible.value = false
  editingBudget.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.budget-card { display: flex; flex-direction: column; gap: 12px; }
.budget-header { display: flex; justify-content: space-between; align-items: center; }
.budget-name { font-size: 16px; font-weight: bold; }
.budget-amounts { display: flex; flex-direction: column; gap: 6px; }
.amount-row { display: flex; justify-content: space-between; font-size: 14px; }
.budget-footer { display: flex; gap: 6px; justify-content: flex-end; margin-top: 4px; }
</style>
