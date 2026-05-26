<template>
  <div class="interview-manage">
    <el-card>
      <div class="toolbar">
        <h3>面试安排</h3>
        <el-button type="primary" @click="dialogVisible = true">安排面试</el-button>
      </div>
      <el-table :data="store.interviews" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="candidateName" label="候选人" width="80" />
        <el-table-column prop="jobTitle" label="职位" width="140" />
        <el-table-column prop="interviewer" label="面试官" width="80" />
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="time" label="时间" width="80" />
        <el-table-column prop="location" label="地点" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : row.status === '已取消' ? 'danger' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button v-if="row.status === '待面试'" size="small" type="success" @click="handleComplete(row)">完成</el-button>
            <el-button v-if="row.status === '待面试'" size="small" type="danger" @click="handleCancel(row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="安排面试" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="候选人">
          <el-select v-model="form.candidateId" style="width: 100%">
            <el-option v-for="c in store.candidates" :key="c.id" :label="`${c.name} - ${c.jobTitle}`" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="面试官"><el-input v-model="form.interviewer" /></el-form-item>
        <el-form-item label="日期" required><el-input v-model="form.date" type="date" /></el-form-item>
        <el-form-item label="时间"><el-input v-model="form.time" placeholder="如 14:00" /></el-form-item>
        <el-form-item label="地点"><el-input v-model="form.location" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRecruitmentStore } from '../../stores/recruitment'
import type { Interview } from '../../types'

const store = useRecruitmentStore()
const dialogVisible = ref(false)

const form = reactive({ candidateId: '', interviewer: '', date: '', time: '', location: '' })

function handleAdd() {
  if (!form.candidateId || !form.date) { ElMessage.warning('请填写必要信息'); return }
  const candidate = store.candidates.find(c => c.id === form.candidateId)
  store.addInterview({
    id: `INT-${String(store.interviews.length + 1).padStart(4, '0')}`,
    candidateId: form.candidateId,
    candidateName: candidate?.name || '',
    jobTitle: candidate?.jobTitle || '',
    interviewer: form.interviewer,
    date: form.date,
    time: form.time,
    location: form.location,
    result: '',
    status: '待面试',
  })
  dialogVisible.value = false
  ElMessage.success('面试已安排')
}

function handleComplete(iv: Interview) { store.updateInterview(iv.id, { status: '已完成', result: '通过' }); ElMessage.success('已完成') }
function handleCancel(iv: Interview) { store.updateInterview(iv.id, { status: '已取消' }); ElMessage.success('已取消') }
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar h3 { margin: 0; }
</style>
