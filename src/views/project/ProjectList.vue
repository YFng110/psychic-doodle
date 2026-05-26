<template>
  <div class="project-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.searchKeyword" placeholder="搜索项目/客户/负责人" clearable style="width: 220px" />
          <el-select v-model="store.filterStatus" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="筹备中" value="筹备中" /><el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" /><el-option label="已暂停" value="已暂停" /><el-option label="已取消" value="已取消" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增项目</el-button>
      </div>

      <el-table :data="store.pagedProjects" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="项目名称" min-width="160" />
        <el-table-column prop="customerName" label="客户" width="120">
          <template #default="{ row }">{{ row.customerName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="managerName" label="负责人" width="80" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '进行中' ? 'success' : row.status === '筹备中' ? 'warning' : row.status === '已完成' ? 'info' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" @click="router.push('/project/' + row.id)">详情</el-button>
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="store.currentPage"
        :page-size="store.pageSize"
        :total="store.total"
        layout="total, prev, pager, next"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingProject ? '编辑项目' : '新增项目'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" required><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联客户">
              <el-select v-model="form.customerId" style="width: 100%" @change="onCustomerChange" clearable>
                <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" required>
              <el-select v-model="form.managerId" style="width: 100%" @change="onManagerChange">
                <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预算金额"><el-input-number v-model="form.budget" :min="0" :step="10000" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" required><el-input v-model="form.startDate" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" required><el-input v-model="form.endDate" type="date" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" required>
          <el-select v-model="form.status" style="width: 100%"><el-option label="筹备中" value="筹备中" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已暂停" value="已暂停" /><el-option label="已取消" value="已取消" /></el-select>
        </el-form-item>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../../stores/project'
import { useCustomerStore } from '../../stores/customer'
import { useEmployeeStore } from '../../stores/employee'
import type { Project } from '../../types'

const store = useProjectStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const router = useRouter()
const dialogVisible = ref(false)
const editingProject = ref<Project | null>(null)

const form = reactive<Project>({
  id: '', name: '', description: '', customerId: '', customerName: '',
  managerId: '', managerName: '', members: [], memberNames: [],
  startDate: '', endDate: '', budget: 0, status: '筹备中',
})

function onCustomerChange(cid: string) {
  const c = customerStore.customers.find(c => c.id === cid)
  form.customerName = c?.name || ''
}
function onManagerChange(mid: string) {
  const e = employeeStore.employees.find(e => e.id === mid)
  form.managerName = e?.name || ''
}

function handleNew() {
  editingProject.value = null
  Object.assign(form, { id: '', name: '', description: '', customerId: '', customerName: '', managerId: '', managerName: '', members: [], memberNames: [], startDate: '', endDate: '', budget: 0, status: '筹备中' })
  dialogVisible.value = true
}
function handleEdit(p: Project) { editingProject.value = p; Object.assign(form, p); dialogVisible.value = true }
function handleDelete(p: Project) {
  ElMessageBox.confirm(`确定删除项目 ${p.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteProject(p.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.name || !form.managerId || !form.startDate || !form.endDate) { ElMessage.warning('请填写必要信息'); return }
  if (editingProject.value) {
    store.updateProject(editingProject.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addProject({ ...form, id: `PRJ-${String(store.projects.length + 1).padStart(4, '0')}` })
    ElMessage.success('项目已创建')
  }
  dialogVisible.value = false
  editingProject.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 6px; }
</style>
