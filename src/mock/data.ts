import type { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, Job, Candidate, Interview, PerformanceReview, KpiItem } from '../types'

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
  { id: uid('INT'), candidateId: mockCandidates[1].id, candidateName: '黄乙', jobTitle: '高级前端工程师', interviewer: '张三', date: '2026-05-28', time: '10:00', location: '会议室A', result: '', status: '待面试' },
  { id: uid('INT'), candidateId: mockCandidates[2].id, candidateName: '林丙', jobTitle: '产品经理', interviewer: '王五', date: '2026-05-18', time: '15:00', location: '会议室B', result: '通过', status: '已完成' },
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
