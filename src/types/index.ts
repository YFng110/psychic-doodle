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
