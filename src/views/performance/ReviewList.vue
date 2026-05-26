<template>
  <div class="review-list">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.searchKeyword" placeholder="搜索员工姓名" clearable style="width: 240px" />
      </div>
      <el-table :data="store.filteredReviews" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="period" label="考核周期" width="100" />
        <el-table-column prop="totalScore" label="总分" width="80">
          <template #default="{ row }">
            <el-tag :type="row.totalScore >= 90 ? 'success' : row.totalScore >= 80 ? '' : 'danger'">{{ row.totalScore }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewerName" label="考核人" width="80" />
        <el-table-column prop="reviewComments" label="评语" min-width="200" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { usePerformanceStore } from '../../stores/performance'
import type { PerformanceReview } from '../../types'

const store = usePerformanceStore()

function handleView(row: PerformanceReview) {
  const items = row.kpiItems.map(i => `${i.name}: 目标${i.target}, 实际${i.actual}, 得分${i.score}`).join('\n')
  ElMessage({
    message: `${row.employeeName} - ${row.period}\n\n${items}\n\n评语: ${row.reviewComments}\n总分: ${row.totalScore}`,
    type: 'success',
    duration: 8000,
    showClose: true,
  })
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
