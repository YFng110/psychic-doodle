<template>
  <div class="candidate-list">
    <el-card>
      <div class="toolbar">
        <h3>候选人管理</h3>
        <el-button type="primary" @click="dialogVisible = true">添加候选人</el-button>
      </div>
      <el-table :data="store.candidates" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="jobTitle" label="应聘职位" width="140" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="applyDate" label="投递日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '已淘汰' ? 'danger' : ''" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleUpdateStatus(row)">更新状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="添加候选人" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="应聘职位" required>
          <el-select v-model="form.jobId" style="width: 100%">
            <el-option v-for="j in store.activeJobs" :key="j.id" :label="j.title" :value="j.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statusDialogVisible" title="更新候选人状态" width="400px">
      <el-select v-model="selectedStatus" style="width: 100%">
        <el-option label="初筛" value="初筛" />
        <el-option label="面试中" value="面试中" />
        <el-option label="已通过" value="已通过" />
        <el-option label="已淘汰" value="已淘汰" />
      </el-select>
      <template #footer>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmStatus">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRecruitmentStore } from '../../stores/recruitment'
import type { Candidate } from '../../types'

const store = useRecruitmentStore()
const dialogVisible = ref(false)
const statusDialogVisible = ref(false)
const currentCandidate = ref<Candidate | null>(null)
const selectedStatus = ref('')

const form = reactive({ name: '', jobId: '', phone: '', email: '' })

function handleUpdateStatus(c: Candidate) {
  currentCandidate.value = c
  selectedStatus.value = c.status
  statusDialogVisible.value = true
}

function confirmStatus() {
  if (currentCandidate.value) {
    store.updateCandidate(currentCandidate.value.id, { status: selectedStatus.value as Candidate['status'] })
    ElMessage.success('状态已更新')
  }
  statusDialogVisible.value = false
}

function handleAdd() {
  if (!form.name || !form.jobId) { ElMessage.warning('请填写必要信息'); return }
  const job = store.jobs.find(j => j.id === form.jobId)
  store.addCandidate({
    id: `CND-${String(store.candidates.length + 1).padStart(4, '0')}`,
    name: form.name, jobId: form.jobId, jobTitle: job?.title || '',
    phone: form.phone, email: form.email, resume: '', status: '初筛',
    applyDate: new Date().toISOString().slice(0, 10),
  })
  dialogVisible.value = false
  ElMessage.success('候选人已添加')
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar h3 { margin: 0; }
</style>
