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
