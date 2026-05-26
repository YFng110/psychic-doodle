<template>
  <div class="dashboard">
    <h2>欢迎回来，{{ userStore.currentUser.name }}</h2>
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="s in stats" :key="s.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon">
            <el-icon :size="32" :color="s.color"><component :is="s.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>部门人员分布</template>
          <div class="chart-placeholder">
            <div v-for="(count, dept) in deptStats" :key="dept" class="chart-bar-row">
              <span class="chart-label">{{ dept }}</span>
              <div class="chart-bar-wrap">
                <div class="chart-bar" :style="{ width: (count / maxDeptCount * 100) + '%' }" />
              </div>
              <span class="chart-count">{{ count }}人</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>最近公告</template>
          <el-timeline>
            <el-timeline-item timestamp="2026-05-25" placement="top">Q2 绩效考核启动，请各部门在6月5日前完成评分。</el-timeline-item>
            <el-timeline-item timestamp="2026-05-20" placement="top">新员工入职培训将于5月28日下午2点在3号会议室举行。</el-timeline-item>
            <el-timeline-item timestamp="2026-05-15" placement="top">五一假期安排：5月1日至5月5日放假，共5天。</el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, Clock, Money, TrendCharts } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'
import { useEmployeeStore } from '../stores/employee'

const userStore = useUserStore()
const employeeStore = useEmployeeStore()

const stats = computed(() => [
  { value: employeeStore.employees.length, label: '在职员工', icon: User, color: '#409EFF' },
  { value: employeeStore.employees.filter(e => e.status === '试用').length, label: '试用期员工', icon: Clock, color: '#E6A23C' },
  { value: employeeStore.employees.filter(e => e.status !== '离职').length, label: '本月全勤人数', icon: TrendCharts, color: '#67C23A' },
  { value: '3', label: '待审批请假', icon: Money, color: '#F56C6C' },
])

const deptStats = computed(() => {
  const map: Record<string, number> = {}
  employeeStore.employees.forEach(e => {
    map[e.department] = (map[e.department] || 0) + 1
  })
  return map
})

const maxDeptCount = computed(() => Math.max(...Object.values(deptStats.value)))
</script>

<style scoped>
.dashboard h2 { margin: 0 0 20px 0; font-size: 20px; }
.stat-row { margin-bottom: 20px; }
.stat-card { display: flex; align-items: center; gap: 16px; padding: 8px 0; }
.stat-icon { flex-shrink: 0; }
.stat-value { font-size: 24px; font-weight: bold; }
.stat-label { font-size: 13px; color: #999; margin-top: 4px; }
.chart-placeholder { display: flex; flex-direction: column; gap: 12px; }
.chart-bar-row { display: flex; align-items: center; gap: 8px; }
.chart-label { width: 60px; font-size: 13px; color: #666; text-align: right; flex-shrink: 0; }
.chart-bar-wrap { flex: 1; height: 20px; background: #f0f2f5; border-radius: 4px; overflow: hidden; }
.chart-bar { height: 100%; background: #409EFF; border-radius: 4px; transition: width 0.3s; }
.chart-count { width: 40px; font-size: 13px; color: #666; }
:deep(.el-card__header) { font-weight: bold; }
</style>
