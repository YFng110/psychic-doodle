import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '首页仪表盘' } },
        { path: 'employee', name: 'EmployeeList', component: () => import('../views/employee/EmployeeList.vue'), meta: { title: '员工档案' } },
        { path: 'employee/:id', name: 'EmployeeDetail', component: () => import('../views/employee/EmployeeDetail.vue'), meta: { title: '员工详情' } },
        { path: 'attendance', name: 'AttendanceManage', component: () => import('../views/attendance/AttendanceManage.vue'), meta: { title: '考勤管理' } },
        { path: 'attendance/leave', name: 'LeaveManage', component: () => import('../views/attendance/LeaveManage.vue'), meta: { title: '请假管理' } },
        { path: 'attendance/overtime', name: 'OvertimeManage', component: () => import('../views/attendance/OvertimeManage.vue'), meta: { title: '加班出差' } },
        { path: 'salary', name: 'SalaryList', component: () => import('../views/salary/SalaryList.vue'), meta: { title: '薪酬管理' } },
        { path: 'salary/:id', name: 'SalaryDetail', component: () => import('../views/salary/SalaryDetail.vue'), meta: { title: '工资条详情' } },
        { path: 'recruitment', name: 'JobList', component: () => import('../views/recruitment/JobList.vue'), meta: { title: '招聘管理' } },
        { path: 'recruitment/candidates', name: 'CandidateList', component: () => import('../views/recruitment/CandidateList.vue'), meta: { title: '候选人管理' } },
        { path: 'recruitment/interviews', name: 'InterviewManage', component: () => import('../views/recruitment/InterviewManage.vue'), meta: { title: '面试安排' } },
        { path: 'performance/kpi', name: 'KpiSetting', component: () => import('../views/performance/KpiSetting.vue'), meta: { title: 'KPI设定' } },
        { path: 'performance/review', name: 'ReviewList', component: () => import('../views/performance/ReviewList.vue'), meta: { title: '绩效考核' } },
      ],
    },
  ],
})

export default router
