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

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  status: '正常' | '迟到' | '早退' | '缺勤' | '请假'
}

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

export interface KpiItem {
  id: string
  name: string
  target: string
  actual: string
  score: number
}

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

// === CRM 模块 ===

export interface Customer {
  id: string
  name: string
  industry: string
  size: string
  contactPerson: string
  phone: string
  email: string
  address: string
  tags: string[]
  source: '官网' | '推荐' | '展会' | '其他'
  level: 'A' | 'B' | 'C' | 'D'
  ownerId: string
  ownerName: string
  status: '潜在' | '意向' | '合作中' | '已流失'
  createdAt: string
}

export interface Contact {
  id: string
  customerId: string
  name: string
  title: string
  phone: string
  email: string
  wechat: string
  isPrimary: boolean
}

export interface FollowUp {
  id: string
  customerId: string
  contactId: string
  contactName: string
  type: '电话' | '拜访' | '邮件' | '微信' | '其他'
  content: string
  nextPlan: string
  createdAt: string
  createdBy: string
  createdByName: string
}

export interface Opportunity {
  id: string
  customerId: string
  customerName: string
  name: string
  product: string
  amount: number
  stage: '初步接触' | '需求分析' | '方案报价' | '商务谈判' | '已成交' | '已丢单'
  probability: number
  expectedCloseDate: string
  ownerId: string
  ownerName: string
  createdAt: string
}

export interface Contract {
  id: string
  customerId: string
  customerName: string
  opportunityId: string
  name: string
  amount: number
  startDate: string
  endDate: string
  status: '草稿' | '待审批' | '已签约' | '已到期' | '已终止'
  signedAt: string
}

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
