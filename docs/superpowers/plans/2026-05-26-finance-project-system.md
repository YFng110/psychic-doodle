# Finance & Project Management 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在已有 HRM + CRM 系统基础上新增财务管理（发票/收付款/报销/预算）和项目管理（项目/任务/甘特图/里程碑/工时）两个模块，与 CRM 客户和 HRM 员工数据联动。

**Architecture:** 沿用现有架构模式（types → mock → stores → routes → views），追加 8 个 TypeScript 类型、Mock 数据、2 个 Store、8 条路由、2 个菜单组、6 个 View 文件。

**Tech Stack:** Vue 3 (Composition API + `<script setup>`), TypeScript, Element Plus, Pinia, Vue Router 4, gantt-elastic

---

### Task 1: 安装 gantt-elastic 依赖

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: 安装依赖**

```bash
npm install gantt-elastic
```

- [ ] **Step 2: 验证安装**

```bash
npm ls gantt-elastic
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install gantt-elastic dependency

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 追加 Finance + Project TypeScript 类型

**Files:**
- Modify: `src/types/index.ts`

在文件末尾追加以下类型：

```typescript
// === 财务管理模块 ===

export interface Invoice {
  id: string
  type: '应收' | '应付'
  customerId: string
  customerName: string
  supplierName: string
  invoiceNumber: string
  amount: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  currency: 'CNY' | 'USD' | 'EUR' | 'JPY'
  issueDate: string
  dueDate: string
  status: '草稿' | '已开具' | '已发送' | '已收款' | '已逾期' | '已付款'
  notes: string
}

export interface Payment {
  id: string
  invoiceId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  amount: number
  paymentDate: string
  paymentMethod: '银行转账' | '现金' | '支付宝' | '微信' | '其他'
  currency: string
  exchangeRate: number
  notes: string
}

export interface ExpenseReport {
  id: string
  employeeId: string
  employeeName: string
  type: '差旅' | '招待' | '办公' | '其他'
  amount: number
  date: string
  description: string
  status: '待审批' | '已通过' | '已拒绝'
  approverId: string
  approverName: string
  approvedAt: string
}

export interface Budget {
  id: string
  year: string
  department: string
  category: '部门预算' | '项目预算'
  projectId: string
  projectName: string
  totalAmount: number
  usedAmount: number
}

// === 项目管理模块 ===

export interface Project {
  id: string
  name: string
  description: string
  customerId: string
  customerName: string
  managerId: string
  managerName: string
  members: string[]
  memberNames: string[]
  startDate: string
  endDate: string
  budget: number
  status: '筹备中' | '进行中' | '已完成' | '已暂停' | '已取消'
}

export interface Milestone {
  id: string
  projectId: string
  name: string
  deadline: string
  status: '待开始' | '进行中' | '已完成'
}

export interface Task {
  id: string
  projectId: string
  milestoneId: string
  name: string
  description: string
  assigneeId: string
  assigneeName: string
  priority: '高' | '中' | '低'
  status: '待办' | '进行中' | '已完成' | '已关闭'
  startDate: string
  dueDate: string
  estimatedHours: number
  actualHours: number
}

export interface TimeEntry {
  id: string
  taskId: string
  taskName: string
  projectId: string
  employeeId: string
  employeeName: string
  date: string
  hours: number
  description: string
}
```

- [ ] **Step 1: 追加类型到 src/types/index.ts**

- [ ] **Step 2: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add Finance & Project type definitions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 追加 Finance + Project Mock 数据

**Files:**
- Modify: `src/mock/data.ts`

在文件顶部 import 中追加新类型：

```typescript
import type { ..., Invoice, Payment, ExpenseReport, Budget, Project, Milestone, Task, TimeEntry } from '../types'
```

在文件末尾追加以下 Mock 数据：

```typescript
// === Finance Mock 数据 ===

export const mockInvoices: Invoice[] = [
  { id: uid('INV'), type: '应收', customerId: mockCustomers[0].id, customerName: '字节科技', supplierName: '', invoiceNumber: 'INV-2026-001', amount: 300000, taxRate: 6, taxAmount: 18000, totalAmount: 318000, currency: 'CNY', issueDate: '2026-05-01', dueDate: '2026-07-01', status: '已发送', notes: '前端架构升级项目首期款' },
  { id: uid('INV'), type: '应收', customerId: mockCustomers[3].id, customerName: '智慧教育', supplierName: '', invoiceNumber: 'INV-2026-002', amount: 200000, taxRate: 6, taxAmount: 12000, totalAmount: 212000, currency: 'CNY', issueDate: '2026-04-15', dueDate: '2026-06-15', status: '已收款', notes: '在线教育平台二期' },
  { id: uid('INV'), type: '应收', customerId: mockCustomers[6].id, customerName: '创想制造', supplierName: '', invoiceNumber: 'INV-2026-003', amount: 800000, taxRate: 6, taxAmount: 48000, totalAmount: 848000, currency: 'CNY', issueDate: '2026-05-10', dueDate: '2026-08-10', status: '草稿', notes: 'MES系统集成' },
  { id: uid('INV'), type: '应收', customerId: mockCustomers[1].id, customerName: '星辰金融', supplierName: '', invoiceNumber: 'INV-2026-004', amount: 50000, taxRate: 6, taxAmount: 3000, totalAmount: 53000, currency: 'USD', issueDate: '2026-05-20', dueDate: '2026-07-20', status: '已发送', notes: '风控系统咨询费' },
  { id: uid('INV'), type: '应付', customerId: '', customerName: '', supplierName: '云服务科技有限公司', invoiceNumber: 'INV-2026-005', amount: 45000, taxRate: 6, taxAmount: 2700, totalAmount: 47700, currency: 'CNY', issueDate: '2026-05-15', dueDate: '2026-06-15', status: '已开具', notes: '云服务器年费' },
  { id: uid('INV'), type: '应付', customerId: '', customerName: '', supplierName: '办公设备租赁公司', invoiceNumber: 'INV-2026-006', amount: 12000, taxRate: 6, taxAmount: 720, totalAmount: 12720, currency: 'CNY', issueDate: '2026-05-01', dueDate: '2026-06-01', status: '已付款', notes: '办公设备季度租赁费' },
  { id: uid('INV'), type: '应收', customerId: mockCustomers[2].id, customerName: '绿源环保', supplierName: '', invoiceNumber: 'INV-2026-007', amount: 150000, taxRate: 6, taxAmount: 9000, totalAmount: 159000, currency: 'CNY', issueDate: '2026-05-18', dueDate: '2026-08-18', status: '已开具', notes: '碳排放管理系统' },
  { id: uid('INV'), type: '应收', customerId: mockCustomers[5].id, customerName: '云帆医疗', supplierName: '', invoiceNumber: 'INV-2026-008', amount: 600000, taxRate: 6, taxAmount: 36000, totalAmount: 636000, currency: 'CNY', issueDate: '2025-12-01', dueDate: '2026-03-01', status: '已逾期', notes: 'HIS系统升级' },
]

export const mockPayments: Payment[] = [
  { id: uid('PAY'), invoiceId: mockInvoices[1].id, invoiceNumber: 'INV-2026-002', customerId: mockCustomers[3].id, customerName: '智慧教育', amount: 212000, paymentDate: '2026-05-20', paymentMethod: '银行转账', currency: 'CNY', exchangeRate: 1, notes: '在线教育平台二期全款' },
  { id: uid('PAY'), invoiceId: mockInvoices[5].id, invoiceNumber: 'INV-2026-006', customerId: '', customerName: '', amount: 12720, paymentDate: '2026-05-15', paymentMethod: '银行转账', currency: 'CNY', exchangeRate: 1, notes: '办公设备租赁付款' },
  { id: uid('PAY'), invoiceId: mockInvoices[0].id, invoiceNumber: 'INV-2026-001', customerId: mockCustomers[0].id, customerName: '字节科技', amount: 100000, paymentDate: '2026-05-25', paymentMethod: '银行转账', currency: 'CNY', exchangeRate: 1, notes: '首期款部分收款' },
  { id: uid('PAY'), invoiceId: mockInvoices[3].id, invoiceNumber: 'INV-2026-004', customerId: mockCustomers[1].id, customerName: '星辰金融', amount: 53000, paymentDate: '2026-05-22', paymentMethod: '支付宝', currency: 'USD', exchangeRate: 7.21, notes: '咨询费' },
]

export const mockExpenses: ExpenseReport[] = [
  { id: uid('EXP'), employeeId: mockEmployees[0].id, employeeName: '张三', type: '差旅', amount: 3500, date: '2026-05-15', description: '上海客户拜访差旅费（机票+酒店+餐饮）', status: '待审批', approverId: '', approverName: '', approvedAt: '' },
  { id: uid('EXP'), employeeId: mockEmployees[2].id, employeeName: '王五', type: '招待', amount: 1200, date: '2026-05-18', description: '字节科技客户招待晚餐', status: '已通过', approverId: mockEmployees[5].id, approverName: '周八', approvedAt: '2026-05-20' },
  { id: uid('EXP'), employeeId: mockEmployees[4].id, employeeName: '孙七', type: '办公', amount: 800, date: '2026-05-10', description: '购买办公用品（笔记本、文具）', status: '已通过', approverId: mockEmployees[5].id, approverName: '周八', approvedAt: '2026-05-12' },
  { id: uid('EXP'), employeeId: mockEmployees[1].id, employeeName: '李四', type: '差旅', amount: 5200, date: '2026-05-20', description: '广州技术交流会参会费用', status: '待审批', approverId: '', approverName: '', approvedAt: '' },
  { id: uid('EXP'), employeeId: mockEmployees[8].id, employeeName: '冯十一', type: '其他', amount: 500, date: '2026-05-22', description: '团队团建活动零食采购', status: '已拒绝', approverId: mockEmployees[5].id, approverName: '周八', approvedAt: '2026-05-23' },
]

export const mockBudgets: Budget[] = [
  { id: uid('BUD'), year: '2026', department: '技术部', category: '部门预算', projectId: '', projectName: '', totalAmount: 500000, usedAmount: 320000 },
  { id: uid('BUD'), year: '2026', department: '产品部', category: '部门预算', projectId: '', projectName: '', totalAmount: 300000, usedAmount: 180000 },
  { id: uid('BUD'), year: '2026', department: '销售部', category: '部门预算', projectId: '', projectName: '', totalAmount: 400000, usedAmount: 150000 },
  { id: uid('BUD'), year: '2026', department: '市场部', category: '部门预算', projectId: '', projectName: '', totalAmount: 250000, usedAmount: 220000 },
  { id: uid('BUD'), year: '2026', department: '', category: '项目预算', projectId: '', projectName: '前端架构升级项目', totalAmount: 100000, usedAmount: 45000 },
  { id: uid('BUD'), year: '2026', department: '', category: '项目预算', projectId: '', projectName: 'MES系统集成', totalAmount: 300000, usedAmount: 80000 },
]

// === Project Mock 数据 ===

export const mockProjects: Project[] = [
  { id: uid('PRJ'), name: '前端架构升级项目', description: '为客户字节科技进行前端技术架构全面升级', customerId: mockCustomers[0].id, customerName: '字节科技', managerId: mockEmployees[0].id, managerName: '张三', members: [mockEmployees[0].id, mockEmployees[1].id], memberNames: ['张三', '李四'], startDate: '2026-03-01', endDate: '2026-09-30', budget: 300000, status: '进行中' },
  { id: uid('PRJ'), name: 'MES系统集成项目', description: '为创想制造实施MES生产执行系统', customerId: mockCustomers[6].id, customerName: '创想制造', managerId: mockEmployees[1].id, managerName: '李四', members: [mockEmployees[1].id, mockEmployees[6].id, mockEmployees[7].id], memberNames: ['李四', '吴九', '郑十'], startDate: '2026-05-01', endDate: '2026-12-31', budget: 800000, status: '进行中' },
  { id: uid('PRJ'), name: '内部OA系统升级', description: '公司内部OA系统重构升级，提升办公效率', customerId: '', customerName: '', managerId: mockEmployees[2].id, managerName: '王五', members: [mockEmployees[0].id, mockEmployees[2].id, mockEmployees[8].id], memberNames: ['张三', '王五', '冯十一'], startDate: '2026-06-01', endDate: '2026-10-31', budget: 200000, status: '筹备中' },
  { id: uid('PRJ'), name: '碳排放管理系统', description: '为绿源环保开发碳排放监测管理平台', customerId: mockCustomers[2].id, customerName: '绿源环保', managerId: mockEmployees[4].id, managerName: '孙七', members: [mockEmployees[4].id, mockEmployees[8].id], memberNames: ['孙七', '冯十一'], startDate: '2026-04-01', endDate: '2026-08-31', budget: 150000, status: '进行中' },
]

export const mockMilestones: Milestone[] = [
  { id: uid('MST'), projectId: mockProjects[0].id, name: '需求调研完成', deadline: '2026-04-01', status: '已完成' },
  { id: uid('MST'), projectId: mockProjects[0].id, name: '技术方案评审', deadline: '2026-05-15', status: '已完成' },
  { id: uid('MST'), projectId: mockProjects[0].id, name: '核心模块开发', deadline: '2026-07-01', status: '进行中' },
  { id: uid('MST'), projectId: mockProjects[0].id, name: 'UAT验收', deadline: '2026-09-15', status: '待开始' },
  { id: uid('MST'), projectId: mockProjects[1].id, name: '工厂调研', deadline: '2026-05-15', status: '已完成' },
  { id: uid('MST'), projectId: mockProjects[1].id, name: '系统设计', deadline: '2026-06-30', status: '进行中' },
  { id: uid('MST'), projectId: mockProjects[1].id, name: '系统上线', deadline: '2026-12-15', status: '待开始' },
]

export const mockTasks: Task[] = [
  { id: uid('TSK'), projectId: mockProjects[0].id, milestoneId: mockMilestones[2].id, name: '路由模块重构', description: '重构前端路由架构，支持权限控制', assigneeId: mockEmployees[0].id, assigneeName: '张三', priority: '高', status: '进行中', startDate: '2026-05-15', dueDate: '2026-06-10', estimatedHours: 80, actualHours: 30 },
  { id: uid('TSK'), projectId: mockProjects[0].id, milestoneId: mockMilestones[2].id, name: 'API中间件开发', description: '开发请求拦截和响应处理中间件', assigneeId: mockEmployees[1].id, assigneeName: '李四', priority: '高', status: '待办', startDate: '2026-06-01', dueDate: '2026-06-20', estimatedHours: 60, actualHours: 0 },
  { id: uid('TSK'), projectId: mockProjects[0].id, milestoneId: mockMilestones[2].id, name: '组件库升级', description: '升级Element Plus到最新版本并兼容测试', assigneeId: mockEmployees[0].id, assigneeName: '张三', priority: '中', status: '已完成', startDate: '2026-05-10', dueDate: '2026-05-25', estimatedHours: 40, actualHours: 35 },
  { id: uid('TSK'), projectId: mockProjects[0].id, milestoneId: '', name: '性能优化', description: '首屏加载优化，目标LCP<2s', assigneeId: mockEmployees[1].id, assigneeName: '李四', priority: '中', status: '待办', startDate: '2026-07-01', dueDate: '2026-07-20', estimatedHours: 60, actualHours: 0 },
  { id: uid('TSK'), projectId: mockProjects[1].id, milestoneId: mockMilestones[5].id, name: '数据库设计', description: '设计MES系统数据库模型和表结构', assigneeId: mockEmployees[1].id, assigneeName: '李四', priority: '高', status: '进行中', startDate: '2026-05-20', dueDate: '2026-06-15', estimatedHours: 100, actualHours: 25 },
  { id: uid('TSK'), projectId: mockProjects[1].id, milestoneId: mockMilestones[5].id, name: '核心接口定义', description: '定义MES核心业务接口规范', assigneeId: mockEmployees[6].id, assigneeName: '吴九', priority: '高', status: '待办', startDate: '2026-06-01', dueDate: '2026-06-30', estimatedHours: 80, actualHours: 0 },
  { id: uid('TSK'), projectId: mockProjects[1].id, milestoneId: '', name: '测试环境搭建', description: '搭建MES系统测试环境', assigneeId: mockEmployees[7].id, assigneeName: '郑十', priority: '中', status: '已完成', startDate: '2026-05-10', dueDate: '2026-05-20', estimatedHours: 20, actualHours: 18 },
  { id: uid('TSK'), projectId: mockProjects[3].id, milestoneId: '', name: '碳排放算法设计', description: '设计碳排放计算核心算法', assigneeId: mockEmployees[4].id, assigneeName: '孙七', priority: '高', status: '进行中', startDate: '2026-04-15', dueDate: '2026-06-15', estimatedHours: 120, actualHours: 60 },
]

export const mockTimeEntries: TimeEntry[] = [
  { id: uid('TME'), taskId: mockTasks[0].id, taskName: '路由模块重构', projectId: mockProjects[0].id, employeeId: mockEmployees[0].id, employeeName: '张三', date: '2026-05-20', hours: 8, description: '完成路由守卫逻辑编写' },
  { id: uid('TME'), taskId: mockTasks[0].id, taskName: '路由模块重构', projectId: mockProjects[0].id, employeeId: mockEmployees[0].id, employeeName: '张三', date: '2026-05-21', hours: 7, description: '权限控制模块开发' },
  { id: uid('TME'), taskId: mockTasks[2].id, taskName: '组件库升级', projectId: mockProjects[0].id, employeeId: mockEmployees[0].id, employeeName: '张三', date: '2026-05-15', hours: 6, description: 'Element Plus版本升级和兼容性修复' },
  { id: uid('TME'), taskId: mockTasks[4].id, taskName: '数据库设计', projectId: mockProjects[1].id, employeeId: mockEmployees[1].id, employeeName: '李四', date: '2026-05-22', hours: 8, description: 'ER图设计和表结构定义' },
  { id: uid('TME'), taskId: mockTasks[5].id, taskName: '核心接口定义', projectId: mockProjects[1].id, employeeId: mockEmployees[6].id, employeeName: '吴九', date: '2026-05-25', hours: 6, description: 'RESTful API接口规范编写' },
  { id: uid('TME'), taskId: mockTasks[7].id, taskName: '碳排放算法设计', projectId: mockProjects[3].id, employeeId: mockEmployees[4].id, employeeName: '孙七', date: '2026-05-23', hours: 8, description: '核心计算公式推导和验证' },
]

// 注意: mockBudgets 中的项目预算需要关联 project，在 stores 中初始化时动态设置
```

- [ ] **Step 1: 更新 import 追加新类型**

- [ ] **Step 2: 追加 Mock 数据到文件末尾**

- [ ] **Step 3: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/mock/data.ts
git commit -m "feat: add Finance & Project mock data

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 创建 Finance Store

**Files:**
- Create: `src/stores/finance.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice, Payment, ExpenseReport, Budget } from '../types'
import { mockInvoices, mockPayments, mockExpenses, mockBudgets } from '../mock/data'

export const useFinanceStore = defineStore('finance', () => {
  const invoices = ref<Invoice[]>([...mockInvoices])
  const payments = ref<Payment[]>([...mockPayments])
  const expenses = ref<ExpenseReport[]>([...mockExpenses])
  const budgets = ref<Budget[]>([...mockBudgets])

  // Invoice filters
  const invoiceSearchKeyword = ref('')
  const invoiceTypeFilter = ref('')
  const invoiceStatusFilter = ref('')

  const filteredInvoices = computed(() => {
    let list = invoices.value
    if (invoiceSearchKeyword.value) {
      const kw = invoiceSearchKeyword.value.toLowerCase()
      list = list.filter(i => i.invoiceNumber.toLowerCase().includes(kw) || i.customerName.includes(kw) || i.supplierName.includes(kw))
    }
    if (invoiceTypeFilter.value) list = list.filter(i => i.type === invoiceTypeFilter.value)
    if (invoiceStatusFilter.value) list = list.filter(i => i.status === invoiceStatusFilter.value)
    return list
  })

  function addInvoice(inv: Invoice) { invoices.value.unshift(inv) }
  function updateInvoice(id: string, data: Partial<Invoice>) {
    const idx = invoices.value.findIndex(i => i.id === id)
    if (idx !== -1) Object.assign(invoices.value[idx], data)
  }
  function deleteInvoice(id: string) {
    const idx = invoices.value.findIndex(i => i.id === id)
    if (idx !== -1) invoices.value.splice(idx, 1)
  }

  // Payment filters
  const paymentSearchKeyword = ref('')
  const paymentMethodFilter = ref('')

  const filteredPayments = computed(() => {
    let list = payments.value
    if (paymentSearchKeyword.value) {
      const kw = paymentSearchKeyword.value.toLowerCase()
      list = list.filter(p => p.invoiceNumber.toLowerCase().includes(kw) || p.customerName.includes(kw))
    }
    if (paymentMethodFilter.value) list = list.filter(p => p.paymentMethod === paymentMethodFilter.value)
    return list
  })

  function addPayment(p: Payment) { payments.value.unshift(p) }
  function updatePayment(id: string, data: Partial<Payment>) {
    const idx = payments.value.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(payments.value[idx], data)
  }

  // Expense filters
  const expenseSearchKeyword = ref('')
  const expenseTypeFilter = ref('')
  const expenseStatusFilter = ref('')

  const filteredExpenses = computed(() => {
    let list = expenses.value
    if (expenseSearchKeyword.value) {
      const kw = expenseSearchKeyword.value.toLowerCase()
      list = list.filter(e => e.employeeName.includes(kw) || e.description.includes(kw))
    }
    if (expenseTypeFilter.value) list = list.filter(e => e.type === expenseTypeFilter.value)
    if (expenseStatusFilter.value) list = list.filter(e => e.status === expenseStatusFilter.value)
    return list
  })

  function addExpense(ex: ExpenseReport) { expenses.value.unshift(ex) }
  function updateExpense(id: string, data: Partial<ExpenseReport>) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) Object.assign(expenses.value[idx], data)
  }
  function deleteExpense(id: string) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) expenses.value.splice(idx, 1)
  }

  // Budget filters
  const budgetYearFilter = ref('2026')
  const filteredBudgets = computed(() => {
    if (!budgetYearFilter.value) return budgets.value
    return budgets.value.filter(b => b.year === budgetYearFilter.value)
  })

  function addBudget(b: Budget) { budgets.value.unshift(b) }
  function updateBudget(id: string, data: Partial<Budget>) {
    const idx = budgets.value.findIndex(b => b.id === id)
    if (idx !== -1) Object.assign(budgets.value[idx], data)
  }
  function deleteBudget(id: string) {
    const idx = budgets.value.findIndex(b => b.id === id)
    if (idx !== -1) budgets.value.splice(idx, 1)
  }

  return {
    invoices, payments, expenses, budgets,
    invoiceSearchKeyword, invoiceTypeFilter, invoiceStatusFilter, filteredInvoices,
    paymentSearchKeyword, paymentMethodFilter, filteredPayments,
    expenseSearchKeyword, expenseTypeFilter, expenseStatusFilter, filteredExpenses,
    budgetYearFilter, filteredBudgets,
    addInvoice, updateInvoice, deleteInvoice,
    addPayment, updatePayment,
    addExpense, updateExpense, deleteExpense,
    addBudget, updateBudget, deleteBudget,
  }
})
```

- [ ] **Step 1: 创建文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/finance.ts
git commit -m "feat: add Finance store (invoices, payments, expenses, budgets)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: 创建 Project Store

**Files:**
- Create: `src/stores/project.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, Milestone, Task, TimeEntry } from '../types'
import { mockProjects, mockMilestones, mockTasks, mockTimeEntries } from '../mock/data'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([...mockProjects])
  const milestones = ref<Milestone[]>([...mockMilestones])
  const tasks = ref<Task[]>([...mockTasks])
  const timeEntries = ref<TimeEntry[]>([...mockTimeEntries])

  const searchKeyword = ref('')
  const filterStatus = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredProjects = computed(() => {
    let list = projects.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(p => p.name.includes(kw) || p.customerName.includes(kw) || p.managerName.includes(kw))
    }
    if (filterStatus.value) list = list.filter(p => p.status === filterStatus.value)
    return list
  })

  const pagedProjects = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredProjects.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredProjects.value.length)

  function addProject(p: Project) { projects.value.unshift(p) }
  function updateProject(id: string, data: Partial<Project>) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(projects.value[idx], data)
  }
  function deleteProject(id: string) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx !== -1) projects.value.splice(idx, 1)
  }
  function getProjectById(id: string): Project | undefined {
    return projects.value.find(p => p.id === id)
  }

  function getMilestonesByProject(projectId: string): Milestone[] {
    return milestones.value.filter(m => m.projectId === projectId)
  }
  function addMilestone(m: Milestone) { milestones.value.unshift(m) }
  function updateMilestone(id: string, data: Partial<Milestone>) {
    const idx = milestones.value.findIndex(m => m.id === id)
    if (idx !== -1) Object.assign(milestones.value[idx], data)
  }
  function deleteMilestone(id: string) {
    const idx = milestones.value.findIndex(m => m.id === id)
    if (idx !== -1) milestones.value.splice(idx, 1)
  }

  function getTasksByProject(projectId: string): Task[] {
    return tasks.value.filter(t => t.projectId === projectId)
  }
  function getTasksByStatus(projectId: string, status: string): Task[] {
    return tasks.value.filter(t => t.projectId === projectId && t.status === status)
  }
  function addTask(t: Task) { tasks.value.unshift(t) }
  function updateTask(id: string, data: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) Object.assign(tasks.value[idx], data)
  }
  function deleteTask(id: string) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value.splice(idx, 1)
  }

  function getTimeEntriesByProject(projectId: string): TimeEntry[] {
    return timeEntries.value.filter(t => t.projectId === projectId).sort((a, b) => b.date.localeCompare(a.date))
  }
  function addTimeEntry(t: TimeEntry) { timeEntries.value.unshift(t) }
  function deleteTimeEntry(id: string) {
    const idx = timeEntries.value.findIndex(t => t.id === id)
    if (idx !== -1) timeEntries.value.splice(idx, 1)
  }

  return {
    projects, milestones, tasks, timeEntries,
    searchKeyword, filterStatus, currentPage, pageSize,
    filteredProjects, pagedProjects, total,
    addProject, updateProject, deleteProject, getProjectById,
    getMilestonesByProject, addMilestone, updateMilestone, deleteMilestone,
    getTasksByProject, getTasksByStatus, addTask, updateTask, deleteTask,
    getTimeEntriesByProject, addTimeEntry, deleteTimeEntry,
  }
})
```

- [ ] **Step 1: 创建文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/project.ts
git commit -m "feat: add Project store (projects, milestones, tasks, time entries)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: 追加 Finance + Project 路由 & 菜单

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/layouts/MainLayout.vue`

- [ ] **Step 1: 在 router/index.ts 中追加路由**

在 CRM 路由之后、`children` 闭合 `]` 前追加：

```typescript
        { path: 'finance/invoices', name: 'InvoiceList', component: () => import('../views/finance/InvoiceList.vue'), meta: { title: '发票管理' } },
        { path: 'finance/payments', name: 'PaymentList', component: () => import('../views/finance/PaymentList.vue'), meta: { title: '收付款记录' } },
        { path: 'finance/expenses', name: 'ExpenseList', component: () => import('../views/finance/ExpenseList.vue'), meta: { title: '费用报销' } },
        { path: 'finance/budgets', name: 'BudgetList', component: () => import('../views/finance/BudgetList.vue'), meta: { title: '预算管理' } },
        { path: 'project/list', name: 'ProjectList', component: () => import('../views/project/ProjectList.vue'), meta: { title: '项目列表' } },
        { path: 'project/:id', name: 'ProjectDetail', component: () => import('../views/project/ProjectDetail.vue'), meta: { title: '项目详情' } },
```

- [ ] **Step 2: 在 MainLayout.vue 侧栏追加两组菜单**

在 CRM 菜单组 `</el-sub-menu>` 之后、`</el-menu>` 之前追加：

```vue
        <el-sub-menu index="finance-group">
          <template #title>
            <el-icon><Money /></el-icon>
            <span>财务管理</span>
          </template>
          <el-menu-item index="/finance/invoices">发票管理</el-menu-item>
          <el-menu-item index="/finance/payments">收付款记录</el-menu-item>
          <el-menu-item index="/finance/expenses">费用报销</el-menu-item>
          <el-menu-item index="/finance/budgets">预算管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="project-group">
          <template #title>
            <el-icon><Notebook /></el-icon>
            <span>项目管理</span>
          </template>
          <el-menu-item index="/project/list">项目列表</el-menu-item>
        </el-sub-menu>
```

- [ ] **Step 3: 在 MainLayout.vue script 图标导入中追加 Notebook**

```typescript
  DataAnalysis, User, Clock, Money, Briefcase, Trophy,
  Fold, Expand, Bell, ArrowDown, OfficeBuilding, Notebook,
```

- [ ] **Step 4: 在 MainLayout.vue activeMenu 中追加路由匹配**

在 CRM 路由匹配之后、`return '/'` 之前追加：

```typescript
  if (path.startsWith('/finance/budgets')) return '/finance/budgets'
  if (path.startsWith('/finance/expenses')) return '/finance/expenses'
  if (path.startsWith('/finance/payments')) return '/finance/payments'
  if (path.startsWith('/finance/invoices')) return '/finance/invoices'
  if (path.startsWith('/project/list')) return '/project/list'
  if (path.startsWith('/project/')) return '/project/list'
```

- [ ] **Step 5: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/router/index.ts src/layouts/MainLayout.vue
git commit -m "feat: add Finance & Project routes and sidebar menu groups

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: 创建发票管理页 InvoiceList

**Files:**
- Create: `src/views/finance/InvoiceList.vue`

```vue
<template>
  <div class="invoice-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-select v-model="store.invoiceTypeFilter" placeholder="类型筛选" clearable style="width: 100px">
            <el-option label="应收" value="应收" /><el-option label="应付" value="应付" />
          </el-select>
          <el-input v-model="store.invoiceSearchKeyword" placeholder="搜索发票号/客户" clearable style="width: 200px" />
          <el-select v-model="store.invoiceStatusFilter" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="草稿" value="草稿" /><el-option label="已开具" value="已开具" />
            <el-option label="已发送" value="已发送" /><el-option label="已收款" value="已收款" />
            <el-option label="已逾期" value="已逾期" /><el-option label="已付款" value="已付款" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增发票</el-button>
      </div>

      <el-table :data="store.filteredInvoices" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="invoiceNumber" label="发票号码" width="130" />
        <el-table-column prop="type" label="类型" width="70">
          <template #default="{ row }"><el-tag :type="row.type === '应收' ? 'success' : 'warning'" size="small">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column label="客户/供应商" width="140">
          <template #default="{ row }">{{ row.type === '应收' ? row.customerName : row.supplierName }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="110">
          <template #default="{ row }">{{ row.currency === 'USD' ? '$' : '¥' }}{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="税额" width="90">
          <template #default="{ row }">{{ row.currency === 'USD' ? '$' : '¥' }}{{ row.taxAmount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="含税合计" width="110">
          <template #default="{ row }"><strong>{{ row.currency === 'USD' ? '$' : '¥' }}{{ row.totalAmount.toLocaleString() }}</strong></template>
        </el-table-column>
        <el-table-column prop="issueDate" label="开票日期" width="110" />
        <el-table-column prop="dueDate" label="到期日" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已收款' || row.status === '已付款' ? 'success' : row.status === '已逾期' ? 'danger' : row.status === '已发送' ? 'warning' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button v-if="row.type === '应收' && row.status === '已发送'" size="small" type="success" @click="handleReceive(row)">收款</el-button>
              <el-button v-if="row.type === '应付' && row.status === '已开具'" size="small" type="warning" @click="handlePay(row)">付款</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="editingInvoice ? '编辑发票' : '新增发票'" width="650px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发票类型" required>
              <el-select v-model="form.type" style="width: 100%" @change="onTypeChange"><el-option label="应收" value="应收" /><el-option label="应付" value="应付" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号码" required><el-input v-model="form.invoiceNumber" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="form.type === '应收'" label="客户" required>
          <el-select v-model="form.customerId" style="width: 100%" @change="onCustomerChange">
            <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === '应付'" label="供应商" required><el-input v-model="form.supplierName" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="金额" required><el-input-number v-model="form.amount" :min="0" :step="1000" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率(%)"><el-input-number v-model="form.taxRate" :min="0" :max="100" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种"><el-select v-model="form.currency" style="width: 100%"><el-option label="CNY" value="CNY" /><el-option label="USD" value="USD" /><el-option label="EUR" value="EUR" /><el-option label="JPY" value="JPY" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开票日期" required><el-input v-model="form.issueDate" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期日期" required><el-input v-model="form.dueDate" type="date" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" required>
          <el-select v-model="form.status" style="width: 100%"><el-option label="草稿" value="草稿" /><el-option label="已开具" value="已开具" /><el-option label="已发送" value="已发送" /></el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.notes" type="textarea" :rows="2" /></el-form-item>
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
import { useFinanceStore } from '../../stores/finance'
import { useCustomerStore } from '../../stores/customer'
import type { Invoice } from '../../types'

const store = useFinanceStore()
const customerStore = useCustomerStore()
const dialogVisible = ref(false)
const editingInvoice = ref<Invoice | null>(null)

const form = reactive<Invoice>({
  id: '', type: '应收', customerId: '', customerName: '', supplierName: '', invoiceNumber: '',
  amount: 0, taxRate: 6, taxAmount: 0, totalAmount: 0, currency: 'CNY',
  issueDate: '', dueDate: '', status: '草稿', notes: '',
})

function onTypeChange() { form.customerId = ''; form.customerName = ''; form.supplierName = '' }
function onCustomerChange(cid: string) {
  const c = customerStore.customers.find(c => c.id === cid)
  form.customerName = c?.name || ''
}

function handleNew() {
  editingInvoice.value = null
  Object.assign(form, { id: '', type: '应收', customerId: '', customerName: '', supplierName: '', invoiceNumber: '', amount: 0, taxRate: 6, taxAmount: 0, totalAmount: 0, currency: 'CNY', issueDate: '', dueDate: '', status: '草稿', notes: '' })
  dialogVisible.value = true
}
function handleEdit(inv: Invoice) { editingInvoice.value = inv; Object.assign(form, inv); dialogVisible.value = true }
function handleDelete(inv: Invoice) {
  ElMessageBox.confirm(`确定删除发票 ${inv.invoiceNumber} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteInvoice(inv.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleReceive(inv: Invoice) {
  ElMessageBox.confirm(`确认收到客户 ${inv.customerName} 的款项 ¥${inv.totalAmount.toLocaleString()}？`, '收款确认', { type: 'success' })
    .then(() => {
      store.updateInvoice(inv.id, { status: '已收款' })
      store.addPayment({
        id: `PAY-${String(store.payments.length + 1).padStart(4, '0')}`,
        invoiceId: inv.id, invoiceNumber: inv.invoiceNumber,
        customerId: inv.customerId, customerName: inv.customerName,
        amount: inv.totalAmount, paymentDate: new Date().toISOString().slice(0, 10),
        paymentMethod: '银行转账', currency: inv.currency, exchangeRate: 1, notes: '',
      })
      ElMessage.success('收款已登记')
    })
    .catch(() => {})
}
function handlePay(inv: Invoice) {
  ElMessageBox.confirm(`确认向 ${inv.supplierName} 支付 ¥${inv.totalAmount.toLocaleString()}？`, '付款确认', { type: 'warning' })
    .then(() => {
      store.updateInvoice(inv.id, { status: '已付款' })
      store.addPayment({
        id: `PAY-${String(store.payments.length + 1).padStart(4, '0')}`,
        invoiceId: inv.id, invoiceNumber: inv.invoiceNumber,
        customerId: '', customerName: '',
        amount: inv.totalAmount, paymentDate: new Date().toISOString().slice(0, 10),
        paymentMethod: '银行转账', currency: inv.currency, exchangeRate: 1, notes: '',
      })
      ElMessage.success('付款已登记')
    })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.invoiceNumber || !form.amount || !form.issueDate || !form.dueDate) { ElMessage.warning('请填写必要信息'); return }
  if (form.type === '应收' && !form.customerId) { ElMessage.warning('请选择客户'); return }
  if (form.type === '应付' && !form.supplierName) { ElMessage.warning('请填写供应商'); return }
  form.taxAmount = Math.round(form.amount * form.taxRate / 100)
  form.totalAmount = form.amount + form.taxAmount
  if (editingInvoice.value) {
    store.updateInvoice(editingInvoice.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addInvoice({ ...form, id: `INV-${String(store.invoices.length + 1).padStart(4, '0')}` })
    ElMessage.success('发票已创建')
  }
  dialogVisible.value = false
  editingInvoice.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 6px; }
</style>
```

- [ ] **Step 1: 创建目录和文件**

```bash
mkdir -p src/views/finance
```

- [ ] **Step 2: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/views/finance/InvoiceList.vue
git commit -m "feat: add Invoice list page with AR/AP, receive/pay actions

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: 创建收付款记录页 PaymentList

**Files:**
- Create: `src/views/finance/PaymentList.vue`

```vue
<template>
  <div class="payment-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.paymentSearchKeyword" placeholder="搜索发票号/客户" clearable style="width: 200px" />
          <el-select v-model="store.paymentMethodFilter" placeholder="支付方式" clearable style="width: 120px">
            <el-option label="银行转账" value="银行转账" /><el-option label="现金" value="现金" />
            <el-option label="支付宝" value="支付宝" /><el-option label="微信" value="微信" />
            <el-option label="其他" value="其他" />
          </el-select>
        </div>
      </div>

      <el-table :data="store.filteredPayments" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="invoiceNumber" label="关联发票号" width="130" />
        <el-table-column prop="customerName" label="客户" width="120">
          <template #default="{ row }">{{ row.customerName || '-' }}</template>
        </el-table-column>
        <el-table-column label="金额" width="130">
          <template #default="{ row }">{{ row.currency === 'USD' ? '$' : '¥' }}{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="paymentDate" label="支付日期" width="110" />
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column label="汇率" width="80">
          <template #default="{ row }">{{ row.currency === 'CNY' ? '-' : row.exchangeRate }}</template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" min-width="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '../../stores/finance'
const store = useFinanceStore()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/finance/PaymentList.vue
git commit -m "feat: add Payment list page with search and filters

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: 创建费用报销页 ExpenseList

**Files:**
- Create: `src/views/finance/ExpenseList.vue`

```vue
<template>
  <div class="expense-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.expenseSearchKeyword" placeholder="搜索员工/说明" clearable style="width: 200px" />
          <el-select v-model="store.expenseTypeFilter" placeholder="费用类型" clearable style="width: 110px">
            <el-option label="差旅" value="差旅" /><el-option label="招待" value="招待" />
            <el-option label="办公" value="办公" /><el-option label="其他" value="其他" />
          </el-select>
          <el-select v-model="store.expenseStatusFilter" placeholder="状态筛选" clearable style="width: 110px">
            <el-option label="待审批" value="待审批" /><el-option label="已通过" value="已通过" /><el-option label="已拒绝" value="已拒绝" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增报销</el-button>
      </div>

      <el-table :data="store.filteredExpenses" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="employeeName" label="员工" width="80" />
        <el-table-column prop="type" label="类型" width="70">
          <template #default="{ row }">{{ row.type }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="110" />
        <el-table-column prop="description" label="说明" min-width="180" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已通过' ? 'success' : row.status === '已拒绝' ? 'danger' : 'warning'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-btns" v-if="row.status === '待审批'">
              <el-button size="small" type="success" @click="handleApprove(row)">通过</el-button>
              <el-button size="small" type="danger" @click="handleReject(row)">拒绝</el-button>
            </div>
            <el-button v-else size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增报销" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="员工" required>
          <el-select v-model="form.employeeId" style="width: 100%" @change="onEmployeeChange">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name + ' - ' + e.department" :value="e.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型" required>
          <el-select v-model="form.type" style="width: 100%"><el-option label="差旅" value="差旅" /><el-option label="招待" value="招待" /><el-option label="办公" value="办公" /><el-option label="其他" value="其他" /></el-select>
        </el-form-item>
        <el-form-item label="金额" required><el-input-number v-model="form.amount" :min="0" :step="100" style="width: 100%" /></el-form-item>
        <el-form-item label="日期" required><el-input v-model="form.date" type="date" /></el-form-item>
        <el-form-item label="说明" required><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useFinanceStore } from '../../stores/finance'
import { useEmployeeStore } from '../../stores/employee'
import type { ExpenseReport } from '../../types'

const store = useFinanceStore()
const employeeStore = useEmployeeStore()
const dialogVisible = ref(false)

const form = reactive({ employeeId: '', employeeName: '', type: '差旅' as ExpenseReport['type'], amount: 0, date: '', description: '' })

function onEmployeeChange(eid: string) {
  const e = employeeStore.employees.find(e => e.id === eid)
  form.employeeName = e?.name || ''
}

function handleNew() {
  Object.assign(form, { employeeId: '', employeeName: '', type: '差旅', amount: 0, date: '', description: '' })
  dialogVisible.value = true
}
function handleSubmit() {
  if (!form.employeeId || !form.amount || !form.date || !form.description) { ElMessage.warning('请填写必要信息'); return }
  store.addExpense({
    id: `EXP-${String(store.expenses.length + 1).padStart(4, '0')}`,
    ...form,
    status: '待审批', approverId: '', approverName: '', approvedAt: '',
  })
  dialogVisible.value = false
  ElMessage.success('报销申请已提交')
}
function handleApprove(ex: ExpenseReport) {
  store.updateExpense(ex.id, { status: '已通过', approverId: employeeStore.employees[5].id, approverName: '周八', approvedAt: new Date().toISOString().slice(0, 10) })
  ElMessage.success('已通过')
}
function handleReject(ex: ExpenseReport) {
  store.updateExpense(ex.id, { status: '已拒绝', approverId: employeeStore.employees[5].id, approverName: '周八', approvedAt: new Date().toISOString().slice(0, 10) })
  ElMessage.success('已拒绝')
}
function handleDelete(ex: ExpenseReport) { store.deleteExpense(ex.id); ElMessage.success('删除成功') }
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 6px; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/finance/ExpenseList.vue
git commit -m "feat: add Expense report page with approval workflow

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 10: 创建预算管理页 BudgetList

**Files:**
- Create: `src/views/finance/BudgetList.vue`

```vue
<template>
  <div class="budget-list">
    <el-card>
      <div class="toolbar">
        <el-select v-model="store.budgetYearFilter" placeholder="年度筛选" style="width: 100px">
          <el-option label="2026" value="2026" /><el-option label="2025" value="2025" />
        </el-select>
        <el-button type="primary" @click="handleNew">新增预算</el-button>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 16px">
      <el-col :span="8" v-for="b in store.filteredBudgets" :key="b.id" style="margin-bottom: 16px">
        <el-card shadow="hover">
          <div class="budget-card">
            <div class="budget-header">
              <span class="budget-name">{{ b.department || b.projectName }}</span>
              <el-tag size="small" :type="b.category === '部门预算' ? 'info' : 'success'">{{ b.category }}</el-tag>
            </div>
            <div class="budget-amounts">
              <div class="amount-row">
                <span>预算总额</span>
                <strong>¥{{ b.totalAmount.toLocaleString() }}</strong>
              </div>
              <div class="amount-row">
                <span>已使用</span>
                <strong :style="{ color: b.usedAmount > b.totalAmount ? '#F56C6C' : '#409EFF' }">¥{{ b.usedAmount.toLocaleString() }}</strong>
              </div>
              <div class="amount-row">
                <span>剩余</span>
                <strong :style="{ color: b.totalAmount - b.usedAmount < 0 ? '#F56C6C' : '#67C23A' }">¥{{ (b.totalAmount - b.usedAmount).toLocaleString() }}</strong>
              </div>
            </div>
            <el-progress :percentage="Math.min(Math.round(b.usedAmount / b.totalAmount * 100), 100)" :status="b.usedAmount > b.totalAmount ? 'exception' : b.usedAmount / b.totalAmount > 0.8 ? 'warning' : ''" :stroke-width="10" />
            <div class="budget-footer">
              <el-button size="small" @click="handleEdit(b)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(b)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="editingBudget ? '编辑预算' : '新增预算'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="年度" required><el-input v-model="form.year" /></el-form-item>
        <el-form-item label="预算类别" required>
          <el-select v-model="form.category" style="width: 100%" @change="onCategoryChange"><el-option label="部门预算" value="部门预算" /><el-option label="项目预算" value="项目预算" /></el-select>
        </el-form-item>
        <el-form-item v-if="form.category === '部门预算'" label="部门" required>
          <el-select v-model="form.department" style="width: 100%"><el-option label="技术部" value="技术部" /><el-option label="产品部" value="产品部" /><el-option label="销售部" value="销售部" /><el-option label="市场部" value="市场部" /><el-option label="人事部" value="人事部" /><el-option label="财务部" value="财务部" /></el-select>
        </el-form-item>
        <el-form-item v-if="form.category === '项目预算'" label="关联项目" required>
          <el-select v-model="form.projectId" style="width: 100%">
            <el-option v-for="p in projectStore.projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算金额" required><el-input-number v-model="form.totalAmount" :min="0" :step="10000" style="width: 100%" /></el-form-item>
        <el-form-item label="已用金额"><el-input-number v-model="form.usedAmount" :min="0" :step="1000" style="width: 100%" /></el-form-item>
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
import { useFinanceStore } from '../../stores/finance'
import { useProjectStore } from '../../stores/project'
import type { Budget } from '../../types'

const store = useFinanceStore()
const projectStore = useProjectStore()
const dialogVisible = ref(false)
const editingBudget = ref<Budget | null>(null)

const form = reactive({ year: '2026', department: '', category: '部门预算' as Budget['category'], projectId: '', projectName: '', totalAmount: 0, usedAmount: 0 })

function onCategoryChange() { form.department = ''; form.projectId = ''; form.projectName = '' }

function handleNew() {
  editingBudget.value = null
  Object.assign(form, { year: '2026', department: '', category: '部门预算', projectId: '', projectName: '', totalAmount: 0, usedAmount: 0 })
  dialogVisible.value = true
}
function handleEdit(b: Budget) { editingBudget.value = b; Object.assign(form, b); dialogVisible.value = true }
function handleDelete(b: Budget) {
  ElMessageBox.confirm('确定删除该预算吗？', '提示', { type: 'warning' })
    .then(() => { store.deleteBudget(b.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.year || !form.totalAmount) { ElMessage.warning('请填写必要信息'); return }
  if (form.category === '部门预算' && !form.department) { ElMessage.warning('请选择部门'); return }
  if (form.category === '项目预算' && !form.projectId) { ElMessage.warning('请选择项目'); return }
  if (form.category === '项目预算') {
    const p = projectStore.projects.find(p => p.id === form.projectId)
    form.projectName = p?.name || ''
  }
  if (editingBudget.value) {
    store.updateBudget(editingBudget.value.id, { ...form } as Budget)
    ElMessage.success('更新成功')
  } else {
    store.addBudget({ id: `BUD-${String(store.budgets.length + 1).padStart(4, '0')}`, ...form } as Budget)
    ElMessage.success('预算已创建')
  }
  dialogVisible.value = false
  editingBudget.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.budget-card { display: flex; flex-direction: column; gap: 12px; }
.budget-header { display: flex; justify-content: space-between; align-items: center; }
.budget-name { font-size: 16px; font-weight: bold; }
.budget-amounts { display: flex; flex-direction: column; gap: 6px; }
.amount-row { display: flex; justify-content: space-between; font-size: 14px; }
.budget-footer { display: flex; gap: 6px; justify-content: flex-end; margin-top: 4px; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/finance/BudgetList.vue
git commit -m "feat: add Budget management page with card view and progress bars

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: 创建项目列表页 ProjectList

**Files:**
- Create: `src/views/project/ProjectList.vue`

```vue
<template>
  <div class="project-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.searchKeyword" placeholder="搜索项目/客户/负责人" clearable style="width: 220px" />
          <el-select v-model="store.filterStatus" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="筹备中" value="筹备中" /><el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" /><el-option label="已暂停" value="已暂停" /><el-option label="已取消" value="已取消" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增项目</el-button>
      </div>

      <el-table :data="store.pagedProjects" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="项目名称" min-width="160" />
        <el-table-column prop="customerName" label="客户" width="120">
          <template #default="{ row }">{{ row.customerName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="managerName" label="负责人" width="80" />
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '进行中' ? 'success' : row.status === '筹备中' ? 'warning' : row.status === '已完成' ? 'info' : 'danger'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" @click="router.push('/project/' + row.id)">详情</el-button>
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
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

    <el-dialog v-model="dialogVisible" :title="editingProject ? '编辑项目' : '新增项目'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" required><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联客户">
              <el-select v-model="form.customerId" style="width: 100%" @change="onCustomerChange" clearable>
                <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="项目描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" required>
              <el-select v-model="form.managerId" style="width: 100%" @change="onManagerChange">
                <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预算金额"><el-input-number v-model="form.budget" :min="0" :step="10000" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" required><el-input v-model="form.startDate" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" required><el-input v-model="form.endDate" type="date" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" required>
          <el-select v-model="form.status" style="width: 100%"><el-option label="筹备中" value="筹备中" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已暂停" value="已暂停" /><el-option label="已取消" value="已取消" /></el-select>
        </el-form-item>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../../stores/project'
import { useCustomerStore } from '../../stores/customer'
import { useEmployeeStore } from '../../stores/employee'
import type { Project } from '../../types'

const store = useProjectStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const router = useRouter()
const dialogVisible = ref(false)
const editingProject = ref<Project | null>(null)

const form = reactive<Project>({
  id: '', name: '', description: '', customerId: '', customerName: '',
  managerId: '', managerName: '', members: [], memberNames: [],
  startDate: '', endDate: '', budget: 0, status: '筹备中',
})

function onCustomerChange(cid: string) {
  const c = customerStore.customers.find(c => c.id === cid)
  form.customerName = c?.name || ''
}
function onManagerChange(mid: string) {
  const e = employeeStore.employees.find(e => e.id === mid)
  form.managerName = e?.name || ''
}

function handleNew() {
  editingProject.value = null
  Object.assign(form, { id: '', name: '', description: '', customerId: '', customerName: '', managerId: '', managerName: '', members: [], memberNames: [], startDate: '', endDate: '', budget: 0, status: '筹备中' })
  dialogVisible.value = true
}
function handleEdit(p: Project) { editingProject.value = p; Object.assign(form, p); dialogVisible.value = true }
function handleDelete(p: Project) {
  ElMessageBox.confirm(`确定删除项目 ${p.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteProject(p.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.name || !form.managerId || !form.startDate || !form.endDate) { ElMessage.warning('请填写必要信息'); return }
  if (editingProject.value) {
    store.updateProject(editingProject.value.id, { ...form })
    ElMessage.success('更新成功')
  } else {
    store.addProject({ ...form, id: `PRJ-${String(store.projects.length + 1).padStart(4, '0')}` })
    ElMessage.success('项目已创建')
  }
  dialogVisible.value = false
  editingProject.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 6px; }
</style>
```

- [ ] **Step 1: 创建目录和文件**

```bash
mkdir -p src/views/project
```

- [ ] **Step 2: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/views/project/ProjectList.vue
git commit -m "feat: add Project list page with search, filters, and CRUD

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 12: 创建项目详情页 ProjectDetail

**Files:**
- Create: `src/views/project/ProjectDetail.vue`

```vue
<template>
  <div class="project-detail">
    <el-page-header @back="router.back()" :content="project?.name || '项目详情'" style="margin-bottom: 20px" />
    <el-card v-if="project">
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ project.customerName || '-' }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ project.managerName }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ project.endDate }}</el-descriptions-item>
        <el-descriptions-item label="预算">¥{{ project.budget.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="project.status === '进行中' ? 'success' : project.status === '筹备中' ? 'warning' : project.status === '已完成' ? 'info' : 'danger'">{{ project.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目成员">{{ project.memberNames.join('、') || '-' }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ project.description || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <!-- 任务看板 -->
        <el-tab-pane label="任务看板" name="kanban">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="taskDialogVisible = true">新增任务</el-button>
          </div>
          <div class="kanban">
            <div class="kanban-col" v-for="col in taskColumns" :key="col.status">
              <div class="kanban-col-header">
                <span>{{ col.label }}</span>
                <el-tag size="small" round>{{ getProjectTasksByStatus(col.status).length }}</el-tag>
              </div>
              <div class="kanban-cards">
                <el-card v-for="t in getProjectTasksByStatus(col.status)" :key="t.id" shadow="hover" class="task-card">
                  <div class="task-name">{{ t.name }}</div>
                  <div class="task-meta">
                    <el-tag size="small" :type="t.priority === '高' ? 'danger' : t.priority === '中' ? 'warning' : 'info'">{{ t.priority }}</el-tag>
                    <span>{{ t.assigneeName }}</span>
                  </div>
                  <div class="task-dates">{{ t.startDate }} ~ {{ t.dueDate }}</div>
                  <div class="task-footer">
                    <el-button size="small" @click="handleEditTask(t)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDeleteTask(t)">删除</el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 甘特图 -->
        <el-tab-pane label="甘特图" name="gantt">
          <div v-if="ganttTasks.length > 0" class="gantt-container">
            <div class="gantt-chart">
              <div class="gantt-header">
                <span class="gantt-task-label">任务</span>
                <div class="gantt-months">
                  <div v-for="m in ganttMonths" :key="m" class="gantt-month">{{ m }}</div>
                </div>
              </div>
              <div class="gantt-row" v-for="t in ganttTasks" :key="t.id">
                <span class="gantt-task-label">{{ t.name }}</span>
                <div class="gantt-bar-area">
                  <div class="gantt-bar" :style="getGanttBarStyle(t)" :class="getGanttBarClass(t)">
                    {{ t.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无任务数据" />
        </el-tab-pane>

        <!-- 里程碑 -->
        <el-tab-pane label="里程碑" name="milestones">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="milestoneDialogVisible = true">新增里程碑</el-button>
          </div>
          <el-timeline style="margin-top: 16px">
            <el-timeline-item
              v-for="m in milestones"
              :key="m.id"
              :timestamp="m.deadline"
              :color="m.status === '已完成' ? '#67C23A' : m.status === '进行中' ? '#409EFF' : '#909399'"
            >
              <div class="milestone-item">
                <strong>{{ m.name }}</strong>
                <el-tag size="small" :type="m.status === '已完成' ? 'success' : m.status === '进行中' ? '' : 'info'" style="margin-left: 12px">{{ m.status }}</el-tag>
                <div class="milestone-actions">
                  <el-button size="small" @click="handleEditMilestone(m)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteMilestone(m)">删除</el-button>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>

        <!-- 工时记录 -->
        <el-tab-pane label="工时记录" name="time">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="timeDialogVisible = true">新增工时</el-button>
          </div>
          <el-table :data="timeEntries" stripe style="width: 100%; margin-top: 12px">
            <el-table-column prop="date" label="日期" width="110" />
            <el-table-column prop="employeeName" label="员工" width="80" />
            <el-table-column prop="taskName" label="关联任务" min-width="140" />
            <el-table-column prop="hours" label="工时(h)" width="80" />
            <el-table-column prop="description" label="描述" min-width="180" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="danger" @click="handleDeleteTime(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 任务弹窗 -->
    <el-dialog v-model="taskDialogVisible" :title="editingTask ? '编辑任务' : '新增任务'" width="550px">
      <el-form :model="taskForm" label-width="100px">
        <el-form-item label="任务名称" required><el-input v-model="taskForm.name" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="taskForm.description" type="textarea" :rows="2" /></el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" required>
              <el-select v-model="taskForm.assigneeId" style="width: 100%" @change="onTaskAssigneeChange">
                <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" required>
              <el-select v-model="taskForm.priority" style="width: 100%"><el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态" required>
              <el-select v-model="taskForm.status" style="width: 100%"><el-option label="待办" value="待办" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /><el-option label="已关闭" value="已关闭" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联里程碑">
              <el-select v-model="taskForm.milestoneId" style="width: 100%" clearable>
                <el-option v-for="m in milestones" :key="m.id" :label="m.name" :value="m.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期"><el-input v-model="taskForm.startDate" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止日期"><el-input v-model="taskForm.dueDate" type="date" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预估工时(h)"><el-input-number v-model="taskForm.estimatedHours" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际工时(h)"><el-input-number v-model="taskForm.actualHours" :min="0" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="taskDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTaskSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 里程碑弹窗 -->
    <el-dialog v-model="milestoneDialogVisible" :title="editingMilestone ? '编辑里程碑' : '新增里程碑'" width="450px">
      <el-form :model="milestoneForm" label-width="80px">
        <el-form-item label="名称" required><el-input v-model="milestoneForm.name" /></el-form-item>
        <el-form-item label="截止日期" required><el-input v-model="milestoneForm.deadline" type="date" /></el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="milestoneForm.status" style="width: 100%"><el-option label="待开始" value="待开始" /><el-option label="进行中" value="进行中" /><el-option label="已完成" value="已完成" /></el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="milestoneDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleMilestoneSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 工时弹窗 -->
    <el-dialog v-model="timeDialogVisible" title="新增工时记录" width="500px">
      <el-form :model="timeForm" label-width="80px">
        <el-form-item label="关联任务" required>
          <el-select v-model="timeForm.taskId" style="width: 100%" @change="onTimeTaskChange">
            <el-option v-for="t in getProjectTasks(project?.id || '')" :key="t.id" :label="t.name" :value="t.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="员工" required>
          <el-select v-model="timeForm.employeeId" style="width: 100%" @change="onTimeEmployeeChange">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期" required><el-input v-model="timeForm.date" type="date" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时(h)" required><el-input-number v-model="timeForm.hours" :min="0" :max="24" :step="0.5" style="width: 100%" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述"><el-input v-model="timeForm.description" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="timeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleTimeSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../../stores/project'
import { useEmployeeStore } from '../../stores/employee'
import type { Project, Milestone, Task, TimeEntry } from '../../types'

const route = useRoute()
const router = useRouter()
const store = useProjectStore()
const employeeStore = useEmployeeStore()
const activeTab = ref('kanban')

const project = computed(() => store.getProjectById(route.params.id as string))
const milestones = computed(() => project.value ? store.getMilestonesByProject(project.value.id) : [])
const timeEntries = computed(() => project.value ? store.getTimeEntriesByProject(project.value.id) : [])

const taskColumns = [
  { status: '待办', label: '待办' },
  { status: '进行中', label: '进行中' },
  { status: '已完成', label: '已完成' },
  { status: '已关闭', label: '已关闭' },
]

function getProjectTasks(projectId: string): Task[] {
  return projectId ? store.getTasksByProject(projectId) : []
}
function getProjectTasksByStatus(status: string): Task[] {
  return project.value ? store.getTasksByStatus(project.value.id, status) : []
}

// 任务
const taskDialogVisible = ref(false)
const editingTask = ref<Task | null>(null)
const taskForm = reactive({ name: '', description: '', assigneeId: '', assigneeName: '', priority: '中' as Task['priority'], status: '待办' as Task['status'], milestoneId: '', startDate: '', dueDate: '', estimatedHours: 0, actualHours: 0 })

function onTaskAssigneeChange(aid: string) {
  const e = employeeStore.employees.find(e => e.id === aid)
  taskForm.assigneeName = e?.name || ''
}
function handleEditTask(t: Task) { editingTask.value = t; Object.assign(taskForm, t); taskDialogVisible.value = true }
function handleDeleteTask(t: Task) {
  ElMessageBox.confirm(`确定删除任务 ${t.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteTask(t.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleTaskSubmit() {
  if (!taskForm.name || !taskForm.assigneeId) { ElMessage.warning('请填写必要信息'); return }
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, { ...taskForm })
    ElMessage.success('更新成功')
  } else {
    store.addTask({
      id: `TSK-${String(store.tasks.length + 1).padStart(4, '0')}`,
      projectId: project.value!.id,
      ...taskForm,
    } as Task)
    ElMessage.success('任务已创建')
  }
  taskDialogVisible.value = false
  editingTask.value = null
}

// 里程碑
const milestoneDialogVisible = ref(false)
const editingMilestone = ref<Milestone | null>(null)
const milestoneForm = reactive({ name: '', deadline: '', status: '待开始' as Milestone['status'] })

function handleEditMilestone(m: Milestone) { editingMilestone.value = m; Object.assign(milestoneForm, m); milestoneDialogVisible.value = true }
function handleDeleteMilestone(m: Milestone) {
  ElMessageBox.confirm(`确定删除里程碑 ${m.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteMilestone(m.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleMilestoneSubmit() {
  if (!milestoneForm.name || !milestoneForm.deadline) { ElMessage.warning('请填写必要信息'); return }
  if (editingMilestone.value) {
    store.updateMilestone(editingMilestone.value.id, { ...milestoneForm })
    ElMessage.success('更新成功')
  } else {
    store.addMilestone({ id: `MST-${String(store.milestones.length + 1).padStart(4, '0')}`, projectId: project.value!.id, ...milestoneForm })
    ElMessage.success('里程碑已创建')
  }
  milestoneDialogVisible.value = false
  editingMilestone.value = null
}

// 工时
const timeDialogVisible = ref(false)
const timeForm = reactive({ taskId: '', taskName: '', employeeId: '', employeeName: '', date: '', hours: 0, description: '' })

function onTimeTaskChange(tid: string) {
  const t = store.tasks.find(t => t.id === tid)
  timeForm.taskName = t?.name || ''
}
function onTimeEmployeeChange(eid: string) {
  const e = employeeStore.employees.find(e => e.id === eid)
  timeForm.employeeName = e?.name || ''
}
function handleTimeSubmit() {
  if (!timeForm.taskId || !timeForm.employeeId || !timeForm.date || !timeForm.hours) { ElMessage.warning('请填写必要信息'); return }
  store.addTimeEntry({
    id: `TME-${String(store.timeEntries.length + 1).padStart(4, '0')}`,
    projectId: project.value!.id,
    ...timeForm,
  })
  timeDialogVisible.value = false
  ElMessage.success('工时已记录')
}
function handleDeleteTime(t: TimeEntry) { store.deleteTimeEntry(t.id); ElMessage.success('删除成功') }

// 甘特图
interface GanttTask { id: string; name: string; startDate: string; dueDate: string; status: string }

const ganttTasks = computed<GanttTask[]>(() => {
  return project.value ? getProjectTasks(project.value.id).filter(t => t.startDate && t.dueDate).map(t => ({ id: t.id, name: t.name, startDate: t.startDate, dueDate: t.dueDate, status: t.status })) : []
})

const ganttMonths = computed(() => {
  if (ganttTasks.value.length === 0) return []
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
  const months: string[] = []
  const d = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  while (d <= maxDate) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    d.setMonth(d.getMonth() + 1)
  }
  return months
})

const ganttRangeStart = computed(() => {
  if (ganttTasks.value.length === 0) return new Date()
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  return new Date(Math.min(...dates.map(d => d.getTime())))
})

const ganttRangeEnd = computed(() => {
  if (ganttTasks.value.length === 0) return new Date()
  const dates = ganttTasks.value.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)])
  const max = new Date(Math.max(...dates.map(d => d.getTime())))
  max.setMonth(max.getMonth() + 1)
  return max
})

function getGanttBarStyle(t: GanttTask) {
  const totalDays = (ganttRangeEnd.value.getTime() - ganttRangeStart.value.getTime()) / (1000 * 60 * 60 * 24)
  const startOffset = (new Date(t.startDate).getTime() - ganttRangeStart.value.getTime()) / (1000 * 60 * 60 * 24)
  const duration = (new Date(t.dueDate).getTime() - new Date(t.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1
  return {
    left: `${(startOffset / totalDays) * 100}%`,
    width: `${Math.max((duration / totalDays) * 100, 2)}%`,
  }
}

function getGanttBarClass(t: GanttTask) {
  return t.status === '已完成' ? 'gantt-bar-done' : t.status === '进行中' ? 'gantt-bar-active' : 'gantt-bar-pending'
}
</script>

<style scoped>
.tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.kanban { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; }
.kanban-col { min-width: 220px; max-width: 260px; flex: 1; }
.kanban-col-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: bold; font-size: 14px; background: #f0f2f5; border-radius: 6px; margin-bottom: 8px; }
.kanban-cards { display: flex; flex-direction: column; gap: 8px; min-height: 200px; }
.task-card { cursor: default; }
.task-name { font-weight: bold; font-size: 14px; margin-bottom: 6px; }
.task-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.task-dates { font-size: 12px; color: #909399; margin-bottom: 6px; }
.task-footer { display: flex; gap: 6px; }

.milestone-item { display: flex; align-items: center; }
.milestone-actions { display: flex; gap: 6px; margin-left: auto; }

/* 甘特图 */
.gantt-container { overflow-x: auto; }
.gantt-chart { min-width: 600px; }
.gantt-header { display: flex; border-bottom: 2px solid #e6e6e6; padding-bottom: 8px; margin-bottom: 8px; }
.gantt-task-label { width: 150px; flex-shrink: 0; font-weight: bold; font-size: 13px; }
.gantt-months { display: flex; flex: 1; }
.gantt-month { flex: 1; text-align: center; font-size: 12px; color: #909399; }
.gantt-row { display: flex; align-items: center; margin-bottom: 6px; padding: 4px 0; border-bottom: 1px solid #f0f0f0; }
.gantt-bar-area { flex: 1; position: relative; height: 28px; }
.gantt-bar { position: absolute; top: 2px; height: 24px; border-radius: 4px; font-size: 11px; line-height: 24px; padding: 0 8px; color: #fff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.gantt-bar-active { background: #409EFF; }
.gantt-bar-done { background: #67C23A; }
.gantt-bar-pending { background: #909399; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/project/ProjectDetail.vue
git commit -m "feat: add Project detail page with kanban, gantt, milestones, time entries

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 13: 最终验证

- [ ] **Step 1: TypeScript 类型检查**

```bash
npx vue-tsc --noEmit
```

Expected: 无类型错误。

- [ ] **Step 2: 构建生产版本**

```bash
npm run build
```

Expected: 构建成功。

- [ ] **Step 3: 启动开发服务器手动验证**

```bash
npm run dev
```

检查清单：
- 侧栏出现"财务管理"菜单组（发票/收付款/报销/预算）
- 侧栏出现"项目管理"菜单组（项目列表）
- 发票管理：应收/应付切换、搜索/筛选、新增/编辑/删除、收款/付款登记
- 收付款记录：搜索、支付方式筛选
- 费用报销：搜索、类型/状态筛选、审批通过/拒绝
- 预算管理：年度筛选、卡片展示、进度条
- 项目列表：搜索、状态筛选、CRUD
- 项目详情：4个Tab（任务看板/甘特图/里程碑/工时记录）

- [ ] **Step 4: 修复问题并最终提交**

```bash
git add -A
git commit -m "chore: final verification and fixes for Finance & Project modules

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
