<template>
  <div class="salary-detail">
    <el-page-header @back="router.back()" content="工资条详情" style="margin-bottom: 20px" />
    <el-card v-if="salary">
      <el-descriptions title="工资条" :column="2" border>
        <el-descriptions-item label="员工">{{ salary.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="月份">{{ salary.yearMonth }}</el-descriptions-item>
        <el-descriptions-item label="基本工资">¥{{ salary.baseSalary.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="奖金">¥{{ salary.bonus.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="扣款">¥{{ salary.deduction.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="社保">¥{{ salary.socialInsurance.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="公积金">¥{{ salary.housingFund.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="个税">¥{{ salary.tax.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="salary.status === '已发放' ? 'success' : 'info'">{{ salary.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="实发工资" :span="2">
          <span style="font-size: 20px; font-weight: bold; color: #409EFF">¥{{ salary.netSalary.toLocaleString() }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-empty v-else description="工资条不存在" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalaryStore } from '../../stores/salary'

const route = useRoute()
const router = useRouter()
const store = useSalaryStore()
const salary = computed(() => store.getSalaryById(route.params.id as string))
</script>
