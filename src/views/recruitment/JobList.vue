<template>
  <div class="job-list">
    <el-card>
      <div class="toolbar">
        <h3>招聘职位</h3>
        <el-button type="primary" @click="handleNew">发布职位</el-button>
      </div>
      <el-table :data="store.jobs" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="title" label="职位" width="160" />
        <el-table-column prop="department" label="部门" width="80" />
        <el-table-column prop="headcount" label="招聘人数" width="80" />
        <el-table-column prop="salaryRange" label="薪资范围" width="100" />
        <el-table-column prop="publishDate" label="发布日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '招聘中' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingJob ? '编辑职位' : '发布职位'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="职位名称" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="form.department"><el-option v-for="d in departments" :key="d" :label="d" :value="d" /></el-select>
        </el-form-item>
        <el-form-item label="招聘人数"><el-input-number v-model="form.headcount" :min="1" /></el-form-item>
        <el-form-item label="薪资范围"><el-input v-model="form.salaryRange" placeholder="如 15K-25K" /></el-form-item>
        <el-form-item label="职位描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="任职要求"><el-input v-model="form.requirements" type="textarea" :rows="3" /></el-form-item>
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
import { useRecruitmentStore } from '../../stores/recruitment'
import type { Job } from '../../types'

const store = useRecruitmentStore()
const dialogVisible = ref(false)
const editingJob = ref<Job | null>(null)
const departments = ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部']

const form = reactive<Job>({
  id: '', title: '', department: '技术部', headcount: 1, salaryRange: '', description: '', requirements: '', status: '招聘中', publishDate: '',
})

function handleNew() { editingJob.value = null; form.title = ''; form.department = '技术部'; form.headcount = 1; form.salaryRange = ''; form.description = ''; form.requirements = ''; dialogVisible.value = true }
function handleEdit(job: Job) { editingJob.value = job; Object.assign(form, job); dialogVisible.value = true }
function handleDelete(job: Job) {
  ElMessageBox.confirm(`确定删除职位 ${job.title}？`, '提示', { type: 'warning' })
    .then(() => { store.deleteJob(job.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (editingJob.value) {
    store.updateJob(editingJob.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addJob({ ...form, id: `JOB-${String(store.jobs.length + 1).padStart(4, '0')}`, publishDate: new Date().toISOString().slice(0, 10) })
    ElMessage.success('发布成功')
  }
  dialogVisible.value = false
  editingJob.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar h3 { margin: 0; }
</style>
