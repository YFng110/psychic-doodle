# HRM 人事管理系统 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯前端的 HRM 人事管理系统，包含员工档案、考勤、薪酬、招聘、绩效五大模块，Mock 数据驱动。

**Architecture:** Vue 3 + Vite SPA，经典后台管理布局（顶栏 + 可折叠侧栏 + 内容区 + 底栏），Vue Router 4 管理路由，Pinia 按模块拆分管理状态和 Mock 数据，Element Plus 提供 UI 组件。

**Tech Stack:** Vue 3 (Composition API + `<script setup>`), TypeScript, Vite, Element Plus, Vue Router 4, Pinia

---

### Task 1: 初始化 Vite + Vue 3 + TypeScript 项目

**Files:**
- Create: 整个项目脚手架

- [ ] **Step 1: 使用 Vite 脚手架创建项目**

Run:
```bash
cd d:/Backup/Documents/GitHub/psychic-doodle
npm create vite@latest . -- --template vue-ts
```

Expected: 覆盖当前目录，生成 `package.json`、`tsconfig.json`、`vite.config.ts`、`index.html`、`src/` 等文件。

- [ ] **Step 2: 安装依赖**

Run:
```bash
npm install
```

Expected: `node_modules` 创建完成，无报错。

- [ ] **Step 3: 安装 Element Plus、Vue Router、Pinia**

Run:
```bash
npm install element-plus vue-router@4 pinia
```

Expected: 三个包添加到 `package.json` dependencies。

- [ ] **Step 4: 验证脚手架可运行**

Run:
```bash
npm run dev
```

Expected: Vite 开发服务器在 `http://localhost:5173` 启动，浏览器打开能看到默认的 Vue 欢迎页。

- [ ] **Step 5: 清理 Vite 默认文件**

删除 `src/components/HelloWorld.vue`、`src/assets/vue.svg`、`src/style.css`。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 + Vite + TypeScript project with Element Plus, Vue Router, Pinia

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 定义 TypeScript 类型

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: 写入所有数据模型类型定义**

```typescript
// 员工
export interface Employee {
  id: string
  name: string
  avatar: string
  gender: '男' | '女'
  phone: string
  email: string
  department: string
  position: string
  hireDate: string
  status: '在职' | '离职' | '试用'
  emergencyContact: string
  idCard: string
  bankAccount: string
}

// 考勤记录
export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: '正常' | '迟到' | '早退' | '缺勤' | '请假'
}

// 请假申请
export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: '年假' | '事假' | '病假' | '婚假' | '产假'
  startDate: string
  endDate: string
  duration: number
  reason: string
  status: '待审批' | '已通过' | '已拒绝'
}

// 薪酬记录
export interface SalaryRecord {
  id: string
  employeeId: string
  employeeName: string
  yearMonth: string
  baseSalary: number
  bonus: number
  deduction: number
  socialInsurance: number
  housingFund: number
  tax: number
  netSalary: number
  status: '草稿' | '已发放'
}

// 招聘职位
export interface Job {
  id: string
  title: string
  department: string
  headcount: number
  salaryRange: string
  description: string
  requirements: string
  status: '招聘中' | '已关闭'
  publishDate: string
}

// 候选人
export interface Candidate {
  id: string
  name: string
  jobId: string
  jobTitle: string
  phone: string
  email: string
  resume: string
  status: '初筛' | '面试中' | '已通过' | '已淘汰'
  applyDate: string
}

// 面试安排
export interface Interview {
  id: string
  candidateId: string
  candidateName: string
  jobTitle: string
  interviewer: string
  date: string
  time: string
  location: string
  result: string
  status: '待面试' | '已完成' | '已取消'
}

// 绩效-单项 KPI
export interface KpiItem {
  id: string
  name: string
  target: string
  actual: string
  score: number
}

// 绩效考核
export interface PerformanceReview {
  id: string
  employeeId: string
  employeeName: string
  period: string
  kpiItems: KpiItem[]
  totalScore: number
  reviewComments: string
  reviewerName: string
  status: '待填写' | '待审核' | '已完成'
}
```

- [ ] **Step 2: 验证类型文件无语法错误**

Run:
```bash
npx vue-tsc --noEmit src/types/index.ts
```

Expected: 无类型错误。

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions for all HRM modules

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 创建 Mock 数据

**Files:**
- Create: `src/mock/data.ts`

- [ ] **Step 1: 写入 Mock 数据生成逻辑**

```typescript
import type { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, Job, Candidate, Interview, PerformanceReview, KpiItem } from '../types'

const departments = ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部']
const positions: Record<string, string[]> = {
  '技术部': ['前端工程师', '后端工程师', '测试工程师', '架构师'],
  '产品部': ['产品经理', '产品助理'],
  '市场部': ['市场总监', '市场专员'],
  '销售部': ['销售经理', '销售代表'],
  '人事部': ['HR经理', 'HR专员'],
  '财务部': ['财务经理', '会计', '出纳'],
}

let idCounter = 0
function uid(prefix: string): string {
  return `${prefix}-${String(++idCounter).padStart(4, '0')}`
}

export const mockEmployees: Employee[] = [
  { id: uid('EMP'), name: '张三', avatar: '', gender: '男', phone: '13800001001', email: 'zhangsan@company.com', department: '技术部', position: '前端工程师', hireDate: '2020-03-15', status: '在职', emergencyContact: '李四 13900001001', idCard: '110101199001011234', bankAccount: '6222021234567890' },
  { id: uid('EMP'), name: '李四', avatar: '', gender: '女', phone: '13800001002', email: 'lisi@company.com', department: '技术部', position: '后端工程师', hireDate: '2019-07-01', status: '在职', emergencyContact: '王五 13900001002', idCard: '110101199102022345', bankAccount: '6222021234567891' },
  { id: uid('EMP'), name: '王五', avatar: '', gender: '男', phone: '13800001003', email: 'wangwu@company.com', department: '产品部', position: '产品经理', hireDate: '2021-01-10', status: '在职', emergencyContact: '赵六 13900001003', idCard: '110101199203033456', bankAccount: '6222021234567892' },
  { id: uid('EMP'), name: '赵六', avatar: '', gender: '女', phone: '13800001004', email: 'zhaoliu@company.com', department: '市场部', position: '市场总监', hireDate: '2018-05-20', status: '在职', emergencyContact: '张三 13900001004', idCard: '110101199304044567', bankAccount: '6222021234567893' },
  { id: uid('EMP'), name: '孙七', avatar: '', gender: '男', phone: '13800001005', email: 'sunqi@company.com', department: '销售部', position: '销售经理', hireDate: '2020-09-01', status: '在职', emergencyContact: '李四 13900001005', idCard: '110101199405055678', bankAccount: '6222021234567894' },
  { id: uid('EMP'), name: '周八', avatar: '', gender: '女', phone: '13800001006', email: 'zhouba@company.com', department: '人事部', position: 'HR经理', hireDate: '2019-11-15', status: '在职', emergencyContact: '王五 13900001006', idCard: '110101199506066789', bankAccount: '6222021234567895' },
  { id: uid('EMP'), name: '吴九', avatar: '', gender: '男', phone: '13800001007', email: 'wujiu@company.com', department: '财务部', position: '财务经理', hireDate: '2017-06-30', status: '在职', emergencyContact: '赵六 13900001007', idCard: '110101199607077890', bankAccount: '6222021234567896' },
  { id: uid('EMP'), name: '郑十', avatar: '', gender: '女', phone: '13800001008', email: 'zhengshi@company.com', department: '技术部', position: '测试工程师', hireDate: '2022-02-14', status: '试用', emergencyContact: '孙七 13900001008', idCard: '110101199708088901', bankAccount: '6222021234567897' },
  { id: uid('EMP'), name: '冯十一', avatar: '', gender: '男', phone: '13800001009', email: 'fengshiyi@company.com', department: '产品部', position: '产品助理', hireDate: '2023-04-01', status: '在职', emergencyContact: '周八 13900001009', idCard: '110101199809099012', bankAccount: '6222021234567898' },
  { id: uid('EMP'), name: '陈十二', avatar: '', gender: '女', phone: '13800001010', email: 'chenshier@company.com', department: '销售部', position: '销售代表', hireDate: '2021-08-20', status: '离职', emergencyContact: '吴九 13900001010', idCard: '110101199910100123', bankAccount: '6222021234567899' },
]

export function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const today = new Date()
  for (const emp of mockEmployees.filter(e => e.status !== '离职')) {
    for (let d = 0; d < 20; d++) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - d)
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue
      const hour = 8 + Math.floor(Math.random() * 3)
      const min = Math.random() > 0.8 ? Math.floor(Math.random() * 30 + 30) : Math.floor(Math.random() * 15)
      const checkIn = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`
      const leaveHour = 17 + Math.floor(Math.random() * 2)
      const leaveMin = Math.floor(Math.random() * 60)
      const checkOut = `${String(leaveHour).padStart(2, '0')}:${String(leaveMin).padStart(2, '0')}:00`
      let status: AttendanceRecord['status'] = '正常'
      if (checkIn > '09:00:00') status = '迟到'
      records.push({
        id: uid('ATT'),
        employeeId: emp.id,
        employeeName: emp.name,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
        checkIn,
        checkOut,
        status,
      })
    }
  }
  return records
}

export function generateLeaveRequests(): LeaveRequest[] {
  const types: LeaveRequest['type'][] = ['年假', '事假', '病假', '婚假', '产假']
  const leaves: LeaveRequest[] = []
  const activeEmps = mockEmployees.filter(e => e.status !== '离职')
  for (let i = 0; i < 8; i++) {
    const emp = activeEmps[i % activeEmps.length]
    const type = types[i % types.length]
    leaves.push({
      id: uid('LEV'),
      employeeId: emp.id,
      employeeName: emp.name,
      type,
      startDate: '2026-06-0' + (i + 1),
      endDate: '2026-06-0' + (i + (type === '年假' ? 3 : 1)),
      duration: type === '年假' ? 3 : 1,
      reason: `${type}休息`,
      status: i < 3 ? '已通过' : i < 5 ? '待审批' : '已拒绝',
    })
  }
  return leaves
}

export function generateSalary(): SalaryRecord[] {
  const records: SalaryRecord[] = []
  for (const emp of mockEmployees) {
    const base = 8000 + Math.floor(Math.random() * 22000)
    const bonus = Math.floor(Math.random() * 5000)
    const social = Math.floor(base * 0.105)
    const fund = Math.floor(base * 0.07)
    const taxable = base + bonus - social - fund - 5000
    const tax = taxable > 0 ? Math.floor(taxable * 0.1) : 0
    records.push({
      id: uid('SAL'),
      employeeId: emp.id,
      employeeName: emp.name,
      yearMonth: '2026-05',
      baseSalary: base,
      bonus,
      deduction: 0,
      socialInsurance: social,
      housingFund: fund,
      tax,
      netSalary: base + bonus - social - fund - tax,
      status: emp.status === '离职' ? '草稿' : '已发放',
    })
  }
  return records
}

export const mockJobs: Job[] = [
  { id: uid('JOB'), title: '高级前端工程师', department: '技术部', headcount: 2, salaryRange: '20K-35K', description: '负责公司核心产品的前端架构设计和开发', requirements: '5年以上前端经验，精通Vue/React', status: '招聘中', publishDate: '2026-05-01' },
  { id: uid('JOB'), title: '产品经理', department: '产品部', headcount: 1, salaryRange: '18K-30K', description: '负责B端SaaS产品规划与设计', requirements: '3年以上B端产品经验', status: '招聘中', publishDate: '2026-05-10' },
  { id: uid('JOB'), title: '测试工程师', department: '技术部', headcount: 1, salaryRange: '12K-20K', description: '负责产品质量保障和自动化测试', requirements: '2年以上测试经验，熟悉自动化测试框架', status: '已关闭', publishDate: '2026-04-15' },
]

export const mockCandidates: Candidate[] = [
  { id: uid('CND'), name: '刘甲', jobId: mockJobs[0].id, jobTitle: '高级前端工程师', phone: '13900002001', email: 'liujia@email.com', resume: '5年前端经验，React技术栈', status: '面试中', applyDate: '2026-05-05' },
  { id: uid('CND'), name: '黄乙', jobId: mockJobs[0].id, jobTitle: '高级前端工程师', phone: '13900002002', email: 'huangyi@email.com', resume: '7年前端经验，Vue技术栈', status: '初筛', applyDate: '2026-05-08' },
  { id: uid('CND'), name: '林丙', jobId: mockJobs[1].id, jobTitle: '产品经理', phone: '13900002003', email: 'linbing@email.com', resume: '4年B端产品经验', status: '已通过', applyDate: '2026-05-12' },
]

export const mockInterviews: Interview[] = [
  { id: uid('INT'), candidateId: mockCandidates[0].id, candidateName: '刘甲', jobTitle: '高级前端工程师', interviewer: '张三', date: '2026-05-20', time: '14:00', location: '会议室A', result: '', status: '已完成' },
  { id: uid('INT'), candidateId: mockCandidates[1].id, jobTitle: '高级前端工程师', interviewer: '张三', date: '2026-05-28', time: '10:00', location: '会议室A', result: '', status: '待面试' },
  { id: uid('INT'), candidateId: mockCandidates[2].id, jobTitle: '产品经理', interviewer: '王五', date: '2026-05-18', time: '15:00', location: '会议室B', result: '通过', status: '已完成' },
]

export function generatePerformance(): PerformanceReview[] {
  const reviews: PerformanceReview[] = []
  for (const emp of mockEmployees.filter(e => e.status !== '离职')) {
    const items: KpiItem[] = [
      { id: uid('KPI'), name: '工作质量', target: '95%', actual: `${90 + Math.floor(Math.random() * 10)}%`, score: 80 + Math.floor(Math.random() * 20) },
      { id: uid('KPI'), name: '工作效率', target: '100%', actual: `${85 + Math.floor(Math.random() * 15)}%`, score: 75 + Math.floor(Math.random() * 25) },
      { id: uid('KPI'), name: '团队协作', target: '优秀', actual: ['良好', '优秀'][Math.floor(Math.random() * 2)], score: 80 + Math.floor(Math.random() * 20) },
    ]
    const total = Math.round(items.reduce((s, i) => s + i.score, 0) / items.length)
    reviews.push({
      id: uid('PRF'),
      employeeId: emp.id,
      employeeName: emp.name,
      period: '2026-Q2',
      kpiItems: items,
      totalScore: total,
      reviewComments: total >= 90 ? '表现优秀，继续保持' : total >= 80 ? '表现良好，有提升空间' : '需要改进',
      reviewerName: '周八',
      status: emp.id === mockEmployees[0].id || emp.id === mockEmployees[1].id ? '已完成' : '待审核',
    })
  }
  return reviews
}
```

- [ ] **Step 2: 验证 Mock 文件编译通过**

Run:
```bash
npx vue-tsc --noEmit src/mock/data.ts
```

Expected: 无类型错误。

- [ ] **Step 3: Commit**

```bash
git add src/mock/data.ts
git commit -m "feat: add mock data generation for all HRM modules

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 创建 Pinia Stores

**Files:**
- Create: `src/stores/user.ts`, `src/stores/employee.ts`, `src/stores/attendance.ts`, `src/stores/salary.ts`, `src/stores/recruitment.ts`, `src/stores/performance.ts`

- [ ] **Step 1: 创建 user store**

写入 `src/stores/user.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({
    id: 'U-0001',
    name: '管理员',
    role: 'admin',
    avatar: '',
  })

  return { currentUser }
})
```

- [ ] **Step 2: 创建 employee store**

写入 `src/stores/employee.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee } from '../types'
import { mockEmployees } from '../mock/data'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([...mockEmployees.map(e => ({ ...e }))])
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredEmployees = computed(() => {
    if (!searchKeyword.value) return employees.value
    const kw = searchKeyword.value.toLowerCase()
    return employees.value.filter(e =>
      e.name.includes(kw) || e.department.includes(kw) || e.position.includes(kw)
    )
  })

  const pagedEmployees = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredEmployees.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredEmployees.value.length)

  function addEmployee(emp: Employee) {
    employees.value.unshift(emp)
  }

  function updateEmployee(id: string, data: Partial<Employee>) {
    const idx = employees.value.findIndex(e => e.id === id)
    if (idx !== -1) Object.assign(employees.value[idx], data)
  }

  function deleteEmployee(id: string) {
    const idx = employees.value.findIndex(e => e.id === id)
    if (idx !== -1) employees.value.splice(idx, 1)
  }

  function getEmployeeById(id: string): Employee | undefined {
    return employees.value.find(e => e.id === id)
  }

  return { employees, searchKeyword, currentPage, pageSize, filteredEmployees, pagedEmployees, total, addEmployee, updateEmployee, deleteEmployee, getEmployeeById }
})
```

- [ ] **Step 3: 创建 attendance store**

写入 `src/stores/attendance.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AttendanceRecord, LeaveRequest } from '../types'
import { generateAttendance, generateLeaveRequests } from '../mock/data'

export const useAttendanceStore = defineStore('attendance', () => {
  const attendances = ref<AttendanceRecord[]>(generateAttendance())
  const leaveRequests = ref<LeaveRequest[]>(generateLeaveRequests())
  const attSearchKeyword = ref('')
  const leaveSearchKeyword = ref('')
  const leaveFilter = ref('')

  const filteredAttendances = computed(() => {
    if (!attSearchKeyword.value) return attendances.value
    return attendances.value.filter(a => a.employeeName.includes(attSearchKeyword.value))
  })

  const filteredLeaveRequests = computed(() => {
    let list = leaveRequests.value
    if (leaveSearchKeyword.value) {
      list = list.filter(l => l.employeeName.includes(leaveSearchKeyword.value))
    }
    if (leaveFilter.value) {
      list = list.filter(l => l.status === leaveFilter.value)
    }
    return list
  })

  function addLeaveRequest(req: LeaveRequest) {
    leaveRequests.value.unshift(req)
  }

  function approveLeave(id: string) {
    const item = leaveRequests.value.find(l => l.id === id)
    if (item) item.status = '已通过'
  }

  function rejectLeave(id: string) {
    const item = leaveRequests.value.find(l => l.id === id)
    if (item) item.status = '已拒绝'
  }

  return { attendances, leaveRequests, attSearchKeyword, leaveSearchKeyword, leaveFilter, filteredAttendances, filteredLeaveRequests, addLeaveRequest, approveLeave, rejectLeave }
})
```

- [ ] **Step 4: 创建 salary store**

写入 `src/stores/salary.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SalaryRecord } from '../types'
import { generateSalary } from '../mock/data'

export const useSalaryStore = defineStore('salary', () => {
  const salaries = ref<SalaryRecord[]>(generateSalary())
  const searchKeyword = ref('')

  const filteredSalaries = computed(() => {
    if (!searchKeyword.value) return salaries.value
    return salaries.value.filter(s => s.employeeName.includes(searchKeyword.value))
  })

  function getSalaryById(id: string): SalaryRecord | undefined {
    return salaries.value.find(s => s.id === id)
  }

  function updateSalary(id: string, data: Partial<SalaryRecord>) {
    const idx = salaries.value.findIndex(s => s.id === id)
    if (idx !== -1) Object.assign(salaries.value[idx], data)
  }

  return { salaries, searchKeyword, filteredSalaries, getSalaryById, updateSalary }
})
```

- [ ] **Step 5: 创建 recruitment store**

写入 `src/stores/recruitment.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Job, Candidate, Interview } from '../types'
import { mockJobs, mockCandidates, mockInterviews } from '../mock/data'

export const useRecruitmentStore = defineStore('recruitment', () => {
  const jobs = ref<Job[]>([...mockJobs])
  const candidates = ref<Candidate[]>([...mockCandidates])
  const interviews = ref<Interview[]>([...mockInterviews])

  const activeJobs = computed(() => jobs.value.filter(j => j.status === '招聘中'))

  function addJob(job: Job) { jobs.value.unshift(job) }
  function updateJob(id: string, data: Partial<Job>) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) Object.assign(jobs.value[idx], data)
  }
  function deleteJob(id: string) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) jobs.value.splice(idx, 1)
  }

  function addCandidate(c: Candidate) { candidates.value.unshift(c) }
  function updateCandidate(id: string, data: Partial<Candidate>) {
    const idx = candidates.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(candidates.value[idx], data)
  }

  function addInterview(iv: Interview) { interviews.value.unshift(iv) }
  function updateInterview(id: string, data: Partial<Interview>) {
    const idx = interviews.value.findIndex(i => i.id === id)
    if (idx !== -1) Object.assign(interviews.value[idx], data)
  }

  return { jobs, candidates, interviews, activeJobs, addJob, updateJob, deleteJob, addCandidate, updateCandidate, addInterview, updateInterview }
})
```

- [ ] **Step 6: 创建 performance store**

写入 `src/stores/performance.ts`：

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PerformanceReview, KpiItem } from '../types'
import { generatePerformance } from '../mock/data'

export const usePerformanceStore = defineStore('performance', () => {
  const reviews = ref<PerformanceReview[]>(generatePerformance())
  const searchKeyword = ref('')

  const filteredReviews = computed(() => {
    if (!searchKeyword.value) return reviews.value
    return reviews.value.filter(r => r.employeeName.includes(searchKeyword.value))
  })

  function getReviewById(id: string): PerformanceReview | undefined {
    return reviews.value.find(r => r.id === id)
  }

  function updateReview(id: string, data: Partial<PerformanceReview>) {
    const idx = reviews.value.findIndex(r => r.id === id)
    if (idx !== -1) Object.assign(reviews.value[idx], data)
  }

  return { reviews, searchKeyword, filteredReviews, getReviewById, updateReview }
})
```

- [ ] **Step 7: 验证所有 stores 编译通过**

Run:
```bash
npx vue-tsc --noEmit src/stores/*.ts
```

- [ ] **Step 8: Commit**

```bash
git add src/stores/
git commit -m "feat: add Pinia stores for user, employee, attendance, salary, recruitment, performance

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: 配置 Vue Router

**Files:**
- Create: `src/router/index.ts`

- [ ] **Step 1: 写入路由配置**

```typescript
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
```

- [ ] **Step 2: 验证路由文件编译通过**

Run:
```bash
npx vue-tsc --noEmit src/router/index.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/router/
git commit -m "feat: configure Vue Router with all HRM module routes

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: 创建 MainLayout 布局

**Files:**
- Create: `src/layouts/MainLayout.vue`

- [ ] **Step 1: 写入布局组件**

```vue
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
  Fold, Expand, Bell, ArrowDown,
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
```

- [ ] **Step 2: 安装 @element-plus/icons-vue**

Run:
```bash
npm install @element-plus/icons-vue
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/MainLayout.vue
git commit -m "feat: add MainLayout with collapsible sidebar, header, breadcrumb

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: 配置 main.ts 和 App.vue 入口

**Files:**
- Modify: `src/main.ts`
- Modify: `src/App.vue`

- [ ] **Step 1: 重写 main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
```

- [ ] **Step 2: 重写 App.vue**

```vue
<template>
  <router-view />
</template>

<script setup lang="ts">
</script>
```

- [ ] **Step 3: 验证应用可启动**

Run:
```bash
npm run dev
```

Expected: 浏览器打开后能看到空白的 MainLayout 布局（侧栏菜单 + 顶栏 + 底栏可看到，内容区 404 因为尚无页面组件）。

- [ ] **Step 4: Commit**

```bash
git add src/main.ts src/App.vue
git commit -m "feat: wire up main.ts and App.vue with Pinia, Router, ElementPlus

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: 创建 Dashboard 首页

**Files:**
- Create: `src/views/Dashboard.vue`

- [ ] **Step 1: 写入 Dashboard**

```vue
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

const activeEmployees = computed(() => employeeStore.employees.filter(e => e.status !== '离职'))

const stats = computed(() => [
  { value: employeeStore.employees.length, label: '在职员工', icon: User, color: '#409EFF' },
  { value: employeeStore.employees.filter(e => e.status === '试用').length, label: '试用期员工', icon: Clock, color: '#E6A23C' },
  { value: activeEmployees.value.length, label: '本月全勤人数', icon: TrendCharts, color: '#67C23A' },
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
```

- [ ] **Step 2: 验证 Dashboard 显示**

Run:
```bash
npm run dev
```

Expected: 首页显示统计卡片 + 部门分布 + 最近公告。

- [ ] **Step 3: Commit**

```bash
git add src/views/Dashboard.vue
git commit -m "feat: add Dashboard with stats, dept distribution, announcements

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: 创建员工档案页面

**Files:**
- Create: `src/views/employee/EmployeeList.vue`
- Create: `src/views/employee/EmployeeDetail.vue`

- [ ] **Step 1: 写入 EmployeeList.vue**

```vue
<template>
  <div class="employee-list">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.searchKeyword" placeholder="搜索姓名/部门/职位" clearable style="width: 240px" />
        <el-button type="primary" @click="dialogVisible = true">新增员工</el-button>
      </div>

      <el-table :data="store.pagedEmployees" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="position" label="职位" width="140" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="hireDate" label="入职日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : row.status === '试用' ? 'warning' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="router.push('/employee/' + row.id)">详情</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="store.currentPage"
        :page-size="store.pageSize"
        :total="store.total"
        layout="total, prev, pager, next"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增员工" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="性别" required>
          <el-select v-model="form.gender"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select>
        </el-form-item>
        <el-form-item label="手机号" required><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="form.department">
            <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required><el-input v-model="form.position" /></el-form-item>
        <el-form-item label="入职日期" required><el-input v-model="form.hireDate" type="date" /></el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="form.status"><el-option label="在职" value="在职" /><el-option label="试用" value="试用" /></el-select>
        </el-form-item>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEmployeeStore } from '../../stores/employee'
import type { Employee } from '../../types'

const store = useEmployeeStore()
const router = useRouter()
const dialogVisible = ref(false)
const departments = ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部']

const form = reactive<Employee>({
  id: '', name: '', avatar: '', gender: '男', phone: '', email: '', department: '技术部',
  position: '', hireDate: '', status: '在职', emergencyContact: '', idCard: '', bankAccount: '',
})

function handleAdd() {
  if (!form.name || !form.phone || !form.position) {
    ElMessage.warning('请填写必要信息')
    return
  }
  const count = store.employees.length + 1
  store.addEmployee({
    ...form,
    id: `EMP-${String(count).padStart(4, '0')}`,
  })
  dialogVisible.value = false
  ElMessage.success('员工添加成功')
}

function handleDelete(row: Employee) {
  ElMessageBox.confirm(`确定删除员工 ${row.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteEmployee(row.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
```

- [ ] **Step 2: 写入 EmployeeDetail.vue**

```vue
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
```

- [ ] **Step 3: 验证员工模块**

Run:
```bash
npm run dev
```

Expected: 员工列表页可查看、搜索、分页；可新增员工；可点击详情查看员工完整信息；可删除员工（二次确认）。

- [ ] **Step 4: Commit**

```bash
git add src/views/employee/
git commit -m "feat: add employee list with CRUD and detail page

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: 创建考勤管理页面

**Files:**
- Create: `src/views/attendance/AttendanceManage.vue`
- Create: `src/views/attendance/LeaveManage.vue`
- Create: `src/views/attendance/OvertimeManage.vue`

- [ ] **Step 1: 写入 AttendanceManage.vue**

```vue
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
```

- [ ] **Step 2: 写入 LeaveManage.vue**

```vue
<template>
  <div class="leave-manage">
    <el-card>
      <div class="toolbar">
        <div style="display: flex; gap: 12px">
          <el-input v-model="store.leaveSearchKeyword" placeholder="搜索员工姓名" clearable style="width: 200px" />
          <el-select v-model="store.leaveFilter" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="待审批" value="待审批" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </div>
        <el-button type="primary" @click="dialogVisible = true">申请请假</el-button>
      </div>

      <el-table :data="store.filteredLeaveRequests" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="type" label="类型" width="80" />
        <el-table-column prop="startDate" label="开始" width="110" />
        <el-table-column prop="endDate" label="结束" width="110" />
        <el-table-column prop="duration" label="天数" width="60" />
        <el-table-column prop="reason" label="原因" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '待审批' ? 'warning' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" v-if="false">
          <template #default="{ row }">
            <el-button v-if="row.status === '待审批'" size="small" type="success" @click="store.approveLeave(row.id)">通过</el-button>
            <el-button v-if="row.status === '待审批'" size="small" type="danger" @click="store.rejectLeave(row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="申请请假" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="员工" required>
          <el-select v-model="form.employeeName" style="width: 100%">
            <el-option v-for="e in employeeStore.employees" :key="e.id" :label="e.name" :value="e.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="年假" value="年假" /><el-option label="事假" value="事假" />
            <el-option label="病假" value="病假" /><el-option label="婚假" value="婚假" />
            <el-option label="产假" value="产假" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" required>
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width: 100%" />
        </el-form-item>
        <el-form-item label="原因"><el-input v-model="form.reason" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useAttendanceStore } from '../../stores/attendance'
import { useEmployeeStore } from '../../stores/employee'

const store = useAttendanceStore()
const employeeStore = useEmployeeStore()
const dialogVisible = ref(false)
const dateRange = ref<any[]>([])

const form = reactive({ employeeName: '', type: '年假' as any, reason: '' })

function handleAdd() {
  if (!form.employeeName || !dateRange.value || dateRange.value.length < 2) {
    ElMessage.warning('请填写必要信息')
    return
  }
  const [start, end] = dateRange.value
  const startDate = start instanceof Date ? start.toISOString().slice(0, 10) : String(start || '')
  const endDate = end instanceof Date ? end.toISOString().slice(0, 10) : String(end || '')
  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1
  const emp = employeeStore.employees.find(e => e.name === form.employeeName)
  store.addLeaveRequest({
    id: `LEV-${String(store.leaveRequests.length + 1).padStart(4, '0')}`,
    employeeId: emp?.id || '',
    employeeName: form.employeeName,
    type: form.type,
    startDate,
    endDate,
    duration,
    reason: form.reason,
    status: '待审批',
  })
  dialogVisible.value = false
  ElMessage.success('请假申请已提交')
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
```

- [ ] **Step 3: 写入 OvertimeManage.vue**

```vue
<template>
  <div class="overtime-manage">
    <el-card>
      <el-empty description="加班出差管理功能开发中">
        <el-button type="primary">申请加班</el-button>
        <el-button type="success">申请出差</el-button>
      </el-empty>
    </el-card>
  </div>
</template>
```

- [ ] **Step 4: 验证考勤模块**

Run:
```bash
npm run dev
```

Expected: 考勤记录列表可搜索；请假列表可筛选和新增请假申请。

- [ ] **Step 5: Commit**

```bash
git add src/views/attendance/
git commit -m "feat: add attendance, leave, and overtime management pages

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: 创建薪酬管理页面

**Files:**
- Create: `src/views/salary/SalaryList.vue`
- Create: `src/views/salary/SalaryDetail.vue`

- [ ] **Step 1: 写入 SalaryList.vue**

```vue
<template>
  <div class="salary-list">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.searchKeyword" placeholder="搜索员工姓名" clearable style="width: 240px" />
      </div>
      <el-table :data="store.filteredSalaries" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="yearMonth" label="月份" width="80" />
        <el-table-column prop="baseSalary" label="基本工资" :formatter="(r: any) => '¥' + r.baseSalary.toLocaleString()" width="110" />
        <el-table-column prop="bonus" label="奖金" :formatter="(r: any) => '¥' + r.bonus.toLocaleString()" width="100" />
        <el-table-column prop="deduction" label="扣款" :formatter="(r: any) => '¥' + r.deduction.toLocaleString()" width="80" />
        <el-table-column prop="socialInsurance" label="社保" :formatter="(r: any) => '¥' + r.socialInsurance.toLocaleString()" width="80" />
        <el-table-column prop="tax" label="个税" :formatter="(r: any) => '¥' + r.tax.toLocaleString()" width="80" />
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
```

- [ ] **Step 2: 写入 SalaryDetail.vue**

```vue
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
```

- [ ] **Step 3: 验证薪酬模块**

Run:
```bash
npm run dev
```

Expected: 工资列表显示所有员工薪酬，可搜索；点击详情可查看完整工资条。

- [ ] **Step 4: Commit**

```bash
git add src/views/salary/
git commit -m "feat: add salary list and salary detail pages

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 12: 创建招聘管理页面

**Files:**
- Create: `src/views/recruitment/JobList.vue`
- Create: `src/views/recruitment/CandidateList.vue`
- Create: `src/views/recruitment/InterviewManage.vue`

- [ ] **Step 1: 写入 JobList.vue**

```vue
<template>
  <div class="job-list">
    <el-card>
      <div class="toolbar">
        <h3>招聘职位</h3>
        <el-button type="primary" @click="dialogVisible = true">发布职位</el-button>
      </div>
      <el-table :data="store.jobs" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="title" label="职位" width="160" />
        <el-table-column prop="department" label="部门" width="80" />
        <el-table-column prop="headcount" label="招聘人数" width="80" />
        <el-table-column prop="salaryRange" label="薪资范围" width="100" />
        <el-table-column prop="publishDate" label="发布日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '招聘中' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingJob ? '编辑职位' : '发布职位'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="职位名称" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="form.department"><el-option v-for="d in departments" :key="d" :label="d" :value="d" /></el-select>
        </el-form-item>
        <el-form-item label="招聘人数"><el-input-number v-model="form.headcount" :min="1" /></el-form-item>
        <el-form-item label="薪资范围"><el-input v-model="form.salaryRange" placeholder="如 15K-25K" /></el-form-item>
        <el-form-item label="职位描述"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="任职要求"><el-input v-model="form.requirements" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRecruitmentStore } from '../../stores/recruitment'
import type { Job } from '../../types'

const store = useRecruitmentStore()
const dialogVisible = ref(false)
const editingJob = ref<Job | null>(null)
const departments = ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部']

const form = reactive<Job>({
  id: '', title: '', department: '技术部', headcount: 1, salaryRange: '', description: '', requirements: '', status: '招聘中', publishDate: '',
})

function handleEdit(job: Job) { editingJob.value = job; Object.assign(form, job); dialogVisible.value = true }
function handleDelete(job: Job) {
  ElMessageBox.confirm(`确定删除职位 ${job.title}？`, '提示', { type: 'warning' })
    .then(() => { store.deleteJob(job.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (editingJob.value) {
    store.updateJob(editingJob.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addJob({ ...form, id: `JOB-${String(store.jobs.length + 1).padStart(4, '0')}`, publishDate: new Date().toISOString().slice(0, 10) })
    ElMessage.success('发布成功')
  }
  dialogVisible.value = false
  editingJob.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar h3 { margin: 0; }
</style>
```

- [ ] **Step 2: 写入 CandidateList.vue**

```vue
<template>
  <div class="candidate-list">
    <el-card>
      <div class="toolbar">
        <h3>候选人管理</h3>
        <el-button type="primary" @click="dialogVisible = true">添加候选人</el-button>
      </div>
      <el-table :data="store.candidates" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="jobTitle" label="应聘职位" width="140" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="applyDate" label="投递日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '已淘汰' ? 'danger' : ''" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">更新状态</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="添加候选人" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="应聘职位" required>
          <el-select v-model="form.jobId" style="width: 100%">
            <el-option v-for="j in store.activeJobs" :key="j.id" :label="j.title" :value="j.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
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
import type { Candidate } from '../../types'

const store = useRecruitmentStore()
const dialogVisible = ref(false)

const form = reactive({ name: '', jobId: '', phone: '', email: '' })

function handleEdit(c: Candidate) {
  ElMessageBox.prompt('更新候选人状态', '提示', {
    inputType: 'select',
    inputOptions: [
      { label: '初筛', value: '初筛' },
      { label: '面试中', value: '面试中' },
      { label: '已通过', value: '已通过' },
      { label: '已淘汰', value: '已淘汰' },
    ],
  } as any).then(({ value }: any) => {
    store.updateCandidate(c.id, { status: value })
    ElMessage.success('已更新')
  }).catch(() => {})
}

function handleAdd() {
  if (!form.name || !form.jobId) { ElMessage.warning('请填写必要信息'); return }
  const job = store.jobs.find(j => j.id === form.jobId)
  store.addCandidate({
    id: `CND-${String(store.candidates.length + 1).padStart(4, '0')}`,
    name: form.name, jobId: form.jobId, jobTitle: job?.title || '',
    phone: form.phone, email: form.email, resume: '', status: '初筛',
    applyDate: new Date().toISOString().slice(0, 10),
  })
  dialogVisible.value = false
  ElMessage.success('候选人已添加')
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.toolbar h3 { margin: 0; }
</style>
```

- [ ] **Step 3: 写入 InterviewManage.vue**

```vue
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
        <el-form-item label="候选人" required>
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
```

- [ ] **Step 4: 验证招聘模块**

Run:
```bash
npm run dev
```

Expected: 职位 CRUD、候选人管理、面试安排均可正常使用。

- [ ] **Step 5: Commit**

```bash
git add src/views/recruitment/
git commit -m "feat: add recruitment pages: job list, candidate list, interview management

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 13: 创建绩效考核页面

**Files:**
- Create: `src/views/performance/KpiSetting.vue`
- Create: `src/views/performance/ReviewList.vue`

- [ ] **Step 1: 写入 KpiSetting.vue**

```vue
<template>
  <div class="kpi-setting">
    <el-card>
      <el-empty description="KPI 设定功能开发中">
        <el-button type="primary">新建 KPI 模板</el-button>
      </el-empty>
    </el-card>
  </div>
</template>
```

- [ ] **Step 2: 写入 ReviewList.vue**

```vue
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
  // 简单弹窗展示 KPI 明细
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
```

- [ ] **Step 3: 验证绩效模块**

Run:
```bash
npm run dev
```

Expected: 考核列表正常显示，点击查看可看到 KPI 明细。

- [ ] **Step 4: Commit**

```bash
git add src/views/performance/
git commit -m "feat: add performance review list and KPI setting pages

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 14: 最终验证 & 修复

- [ ] **Step 1: TypeScript 类型检查**

Run:
```bash
npx vue-tsc --noEmit
```

Expected: 所有文件类型检查通过，无报错。

- [ ] **Step 2: 构建生产版本**

Run:
```bash
npm run build
```

Expected: 构建成功，无报错。

- [ ] **Step 3: 手动全流程测试**

Run:
```bash
npm run dev
```

逐一检查：
- 侧栏菜单折展开、所有菜单项可点击跳转
- 面包屑正确显示
- Dashboard 统计卡片数据正确
- 员工列表：搜索 / 分页 / 新增 / 详情 / 删除
- 考勤记录：列表展示正确
- 请假管理：新增请假 / 搜索 / 状态筛选
- 薪酬列表：搜索 / 工资条详情
- 招聘：职位 CRUD / 候选人新增 / 面试安排
- 绩效：考核列表查看 KPI 明细

- [ ] **Step 4: 修复发现的问题并 Commit**

- [ ] **Step 5: 添加 .gitignore 忽略 .superpowers**

Run:
```bash
echo ".superpowers/" >> .gitignore && git add .gitignore && git commit -m "chore: add .superpowers/ to .gitignore
```
