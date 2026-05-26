# HRM 人事管理系统 — 设计文档

**日期**：2026-05-26
**状态**：已确认

---

## 一、项目概述

为一家科技公司开发人事管理系统（HRM）前端应用，涵盖员工档案、考勤、薪酬、招聘、绩效五大模块。第一阶段为纯前端 MVP，使用 Mock 数据驱动，后续对接真实 API。

## 二、技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite |
| UI 组件库 | Element Plus |
| 路由 | Vue Router 4 |
| 状态管理 | Pinia |
| Mock 数据 | 手写 Mock + Pinia 内存操作 |
| 语言 | TypeScript |

## 三、架构设计

### 3.1 目录结构

```
/src
├── App.vue
├── main.ts
├── router/
│   └── index.ts
├── layouts/
│   └── MainLayout.vue
├── views/
│   ├── Dashboard.vue
│   ├── employee/
│   │   ├── EmployeeList.vue
│   │   └── EmployeeDetail.vue
│   ├── attendance/
│   │   ├── AttendanceManage.vue
│   │   ├── LeaveManage.vue
│   │   └── OvertimeManage.vue
│   ├── salary/
│   │   ├── SalaryList.vue
│   │   └── SalaryDetail.vue
│   ├── recruitment/
│   │   ├── JobList.vue
│   │   ├── CandidateList.vue
│   │   └── InterviewManage.vue
│   └── performance/
│       ├── KpiSetting.vue
│       └── ReviewList.vue
├── mock/
│   └── data.ts
├── stores/
│   ├── employee.ts
│   ├── attendance.ts
│   ├── salary.ts
│   ├── recruitment.ts
│   ├── performance.ts
│   └── user.ts
├── components/
│   └── (公共组件)
└── types/
    └── index.ts
```

### 3.2 路由设计

所有页面包裹在 MainLayout 布局内：

| 路径 | 页面 | 菜单名 |
|------|------|--------|
| `/` | Dashboard | 首页仪表盘 |
| `/employee` | EmployeeList | 员工档案 |
| `/employee/:id` | EmployeeDetail | （隐藏页） |
| `/attendance` | AttendanceManage | 考勤管理 |
| `/attendance/leave` | LeaveManage | 请假管理 |
| `/attendance/overtime` | OvertimeManage | 加班出差 |
| `/salary` | SalaryList | 薪酬管理 |
| `/salary/:id` | SalaryDetail | （隐藏页） |
| `/recruitment` | JobList | 招聘管理 |
| `/recruitment/candidates` | CandidateList | 候选人管理 |
| `/recruitment/interviews` | InterviewManage | 面试安排 |
| `/performance/kpi` | KpiSetting | KPI 设定 |
| `/performance/review` | ReviewList | 绩效考核 |

## 四、UI 布局

经典后台管理布局：

- **顶栏 (60px)**：Logo、系统名称、通知图标、用户头像下拉菜单
- **侧栏 (220px)**：深色主题 (Element Plus dark 模式)，可折叠，二级菜单展开
- **内容区**：白色背景卡片式布局
- **底栏 (40px)**：版权信息

## 五、数据模型

### Employee（员工）
```
id, name, avatar, gender, phone, email, department, position,
hire_date, status(在职/离职/试用), emergency_contact, id_card, bank_account
```

### Attendance（考勤）
```
id, employee_id, date, check_in, check_out, status(正常/迟到/早退/缺勤/请假)
```

### Leave（请假）
```
id, employee_id, type(年假/事假/病假/婚假/产假), start_date, end_date,
duration, reason, status(待审批/已通过/已拒绝), approver_id
```

### Salary（薪酬）
```
id, employee_id, year_month, base_salary, bonus, deduction,
social_insurance, housing_fund, tax, net_salary, status(草稿/已发放)
```

### Job（招聘职位）
```
id, title, department, headcount, salary_range, description,
requirements, status(招聘中/已关闭), publish_date
```

### Performance（绩效）
```
id, employee_id, period, kpi_items[{name, target, actual, score}],
total_score, review_comments, reviewer_id, status(待填写/待审核/已完成)
```

## 六、状态管理策略

Pinia Store 按模块拆分，每个 Store 管理本模块的 Mock 数据和 CRUD 操作：

- `useEmployeeStore` — 员工 CRUD
- `useAttendanceStore` — 考勤/请假/加班
- `useSalaryStore` — 薪酬
- `useRecruitmentStore` — 招聘
- `usePerformanceStore` — 绩效
- `useUserStore` — 当前登录用户

## 七、交互规则

- 列表页：搜索 + 分页（el-pagination）+ 批量操作
- 表单：el-form 带字段校验
- 删除/提交：el-message-box 二次确认
- 操作反馈：el-message 成功/失败提示
- 数据联动：员工离职后关联模块自动处理状态

## 八、非功能需求

- 开发阶段使用 TypeScript 严格模式
- Mock 数据覆盖~20 名员工，所有模块数据围绕此展开
- 暂不做权限控制（仅模拟单用户登录态）
