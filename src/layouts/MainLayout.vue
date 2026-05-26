<template>
  <el-container class="layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo" @click="goHome">
        <span v-if="!isCollapse" class="logo-text">HRM 人事管理系统</span>
        <span v-else class="logo-text-mini">HRM</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/">
          <el-icon><DataAnalysis /></el-icon>
          <span>首页仪表盘</span>
        </el-menu-item>

        <el-sub-menu index="employee-group">
          <template #title>
            <el-icon><User /></el-icon>
            <span>员工档案</span>
          </template>
          <el-menu-item index="/employee">员工列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="attendance-group">
          <template #title>
            <el-icon><Clock /></el-icon>
            <span>考勤管理</span>
          </template>
          <el-menu-item index="/attendance">考勤记录</el-menu-item>
          <el-menu-item index="/attendance/leave">请假管理</el-menu-item>
          <el-menu-item index="/attendance/overtime">加班出差</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="salary-group">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>薪酬管理</span>
          </template>
          <el-menu-item index="/salary">工资列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="recruitment-group">
          <template #title>
            <el-icon><Briefcase /></el-icon>
            <span>招聘管理</span>
          </template>
          <el-menu-item index="/recruitment">职位管理</el-menu-item>
          <el-menu-item index="/recruitment/candidates">候选人管理</el-menu-item>
          <el-menu-item index="/recruitment/interviews">面试安排</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="performance-group">
          <template #title>
            <el-icon><Trophy /></el-icon>
            <span>绩效考核</span>
          </template>
          <el-menu-item index="/performance/kpi">KPI 设定</el-menu-item>
          <el-menu-item index="/performance/review">考核列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="crm-group">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>CRM 客户管理</span>
          </template>
          <el-menu-item index="/crm/customers">客户列表</el-menu-item>
          <el-menu-item index="/crm/opportunities">销售漏斗</el-menu-item>
          <el-menu-item index="/crm/contracts">合同管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse" :size="22">
            <Fold v-if="!isCollapse" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-badge :value="3" :max="99">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="user-name">{{ userStore.currentUser.name }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view />
      </el-main>

      <el-footer class="layout-footer">HRM System &copy; 2026</el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataAnalysis, User, Clock, Money, Briefcase, Trophy,
  Fold, Expand, Bell, ArrowDown, OfficeBuilding,
} from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/employee')) return '/employee'
  if (path.startsWith('/attendance/overtime')) return '/attendance/overtime'
  if (path.startsWith('/attendance/leave')) return '/attendance/leave'
  if (path.startsWith('/attendance')) return '/attendance'
  if (path.startsWith('/salary')) return '/salary'
  if (path.startsWith('/recruitment/candidates')) return '/recruitment/candidates'
  if (path.startsWith('/recruitment/interviews')) return '/recruitment/interviews'
  if (path.startsWith('/recruitment')) return '/recruitment'
  if (path.startsWith('/performance/kpi')) return '/performance/kpi'
  if (path.startsWith('/performance/review')) return '/performance/review'
  if (path.startsWith('/crm/contracts')) return '/crm/contracts'
  if (path.startsWith('/crm/opportunities')) return '/crm/opportunities'
  if (path.startsWith('/crm/customers')) return '/crm/customers'
  return '/'
})

function toggleCollapse() { isCollapse.value = !isCollapse.value }
function goHome() { router.push('/') }
</script>

<style scoped>
.layout { height: 100vh; }
.layout-aside { background-color: #304156; transition: width 0.3s; overflow: hidden; }
.logo { height: 60px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.logo-text { color: #fff; font-size: 16px; font-weight: bold; white-space: nowrap; }
.logo-text-mini { color: #fff; font-size: 18px; font-weight: bold; }
.layout-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e6e6e6; background: #fff; height: 60px; padding: 0 20px; }
.header-left { display: flex; align-items: center; gap: 12px; }
.collapse-btn { cursor: pointer; }
.header-right { display: flex; align-items: center; gap: 20px; }
.user-info { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-name { font-size: 14px; }
.layout-main { background: #f0f2f5; min-height: calc(100vh - 100px); padding: 20px; }
.layout-footer { height: 40px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; border-top: 1px solid #e6e6e6; background: #fff; }

.el-menu { border-right: none; }
:deep(.el-sub-menu .el-menu) { background-color: #1f2d3d !important; }
:deep(.el-sub-menu .el-menu .el-menu-item:hover) { background-color: #001528 !important; }
</style>
