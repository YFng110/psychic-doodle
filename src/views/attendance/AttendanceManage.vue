<template>
  <div class="attendance-manage">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.attSearchKeyword" placeholder="搜索员工姓名" clearable style="width: 240px" />
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </div>
      <el-table :data="store.filteredAttendances" stripe style="width: 100%; margin-top: 16px" max-height="500">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="checkIn" label="签到" width="100" />
        <el-table-column prop="checkOut" label="签退" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAttendanceStore } from '../../stores/attendance'

const store = useAttendanceStore()
const dateRange = ref<any[]>([])
</script>

<style scoped>
.toolbar { display: flex; gap: 12px; }
</style>
