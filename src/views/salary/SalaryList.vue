<template>
  <div class="salary-list">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.searchKeyword" placeholder="搜索员工姓名" clearable style="width: 240px" />
      </div>
      <el-table :data="store.filteredSalaries" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="yearMonth" label="月份" width="80" />
        <el-table-column prop="baseSalary" label="基本工资" width="110">
          <template #default="{ row }">¥{{ row.baseSalary.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金" width="100">
          <template #default="{ row }">¥{{ row.bonus.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="socialInsurance" label="社保" width="80">
          <template #default="{ row }">¥{{ row.socialInsurance.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="tax" label="个税" width="80">
          <template #default="{ row }">¥{{ row.tax.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="netSalary" label="实发" width="110">
          <template #default="{ row }"><strong>¥{{ row.netSalary.toLocaleString() }}</strong></template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发放' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="router.push('/salary/' + row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSalaryStore } from '../../stores/salary'

const store = useSalaryStore()
const router = useRouter()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
