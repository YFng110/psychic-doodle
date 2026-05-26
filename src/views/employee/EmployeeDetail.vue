<template>
  <div class="employee-detail">
    <el-page-header @back="router.back()" :content="employee?.name || '员工详情'" style="margin-bottom: 20px" />
    <el-card v-if="employee">
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item label="姓名">{{ employee.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ employee.gender }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="employee.status === '在职' ? 'success' : employee.status === '试用' ? 'warning' : 'info'">{{ employee.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="部门">{{ employee.department }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ employee.position }}</el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ employee.hireDate }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ employee.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ employee.email }}</el-descriptions-item>
        <el-descriptions-item label="紧急联系人">{{ employee.emergencyContact }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ employee.idCard }}</el-descriptions-item>
        <el-descriptions-item label="银行卡号">{{ employee.bankAccount }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-empty v-else description="员工不存在" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '../../stores/employee'

const route = useRoute()
const router = useRouter()
const store = useEmployeeStore()
const employee = computed(() => store.getEmployeeById(route.params.id as string))
</script>
