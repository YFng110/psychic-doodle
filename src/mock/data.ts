import type { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, Job, Candidate, Interview, PerformanceReview, KpiItem, Customer, Contact, FollowUp, Opportunity, Contract, Invoice, Payment, ExpenseReport, Budget, Project, Milestone, Task, TimeEntry } from '../types'

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

// === CRM Mock 数据 ===

export const mockCustomers: Customer[] = [
  { id: uid('CUS'), name: '字节科技', industry: '互联网', size: '500-1000人', contactPerson: '李明', phone: '13900003001', email: 'liming@bytech.com', address: '北京市海淀区中关村大街1号', tags: ['VIP', '技术合作'], source: '官网', level: 'A', ownerId: mockEmployees[2].id, ownerName: '王五', status: '合作中', createdAt: '2026-01-15' },
  { id: uid('CUS'), name: '星辰金融', industry: '金融', size: '200-500人', contactPerson: '王磊', phone: '13900003002', email: 'wanglei@starfin.com', address: '上海市浦东新区陆家嘴金融城', tags: ['金融科技'], source: '推荐', level: 'A', ownerId: mockEmployees[3].id, ownerName: '赵六', status: '意向', createdAt: '2026-03-20' },
  { id: uid('CUS'), name: '绿源环保', industry: '环保', size: '50-200人', contactPerson: '张华', phone: '13900003003', email: 'zhanghua@greenep.com', address: '广州市天河区体育西路', tags: [], source: '展会', level: 'B', ownerId: mockEmployees[4].id, ownerName: '孙七', status: '潜在', createdAt: '2026-04-10' },
  { id: uid('CUS'), name: '智慧教育', industry: '教育', size: '100-500人', contactPerson: '陈芳', phone: '13900003004', email: 'chenfang@wisedu.com', address: '深圳市南山区科技园', tags: ['教育科技', '长期合作'], source: '官网', level: 'A', ownerId: mockEmployees[0].id, ownerName: '张三', status: '合作中', createdAt: '2025-11-01' },
  { id: uid('CUS'), name: '通达物流', industry: '物流', size: '500-1000人', contactPerson: '刘强', phone: '13900003005', email: 'liuqiang@tongda.com', address: '成都市武侯区天府大道', tags: [], source: '其他', level: 'C', ownerId: mockEmployees[5].id, ownerName: '周八', status: '潜在', createdAt: '2026-05-01' },
  { id: uid('CUS'), name: '云帆医疗', industry: '医疗', size: '200-500人', contactPerson: '赵敏', phone: '13900003006', email: 'zhaomin@yunfan.com', address: '杭州市西湖区文三路', tags: ['医疗健康'], source: '推荐', level: 'B', ownerId: mockEmployees[1].id, ownerName: '李四', status: '已流失', createdAt: '2025-08-15' },
  { id: uid('CUS'), name: '创想制造', industry: '制造业', size: '1000人以上', contactPerson: '孙鹏', phone: '13900003007', email: 'sunpeng@chuangxiang.com', address: '武汉市东湖高新区', tags: ['智能制造', 'VIP'], source: '展会', level: 'A', ownerId: mockEmployees[6].id, ownerName: '吴九', status: '意向', createdAt: '2026-02-28' },
  { id: uid('CUS'), name: '乐享零售', industry: '零售', size: '50-200人', contactPerson: '周婷', phone: '13900003008', email: 'zhouting@lexiang.com', address: '南京市鼓楼区新街口', tags: [], source: '官网', level: 'C', ownerId: mockEmployees[8].id, ownerName: '冯十一', status: '潜在', createdAt: '2026-05-10' },
]

export const mockContacts: Contact[] = [
  { id: uid('CON'), customerId: mockCustomers[0].id, name: '李明', title: '技术总监', phone: '13900003001', email: 'liming@bytech.com', wechat: 'liming_wx', isPrimary: true },
  { id: uid('CON'), customerId: mockCustomers[0].id, name: '王芳', title: '采购经理', phone: '13900003011', email: 'wangfang@bytech.com', wechat: '', isPrimary: false },
  { id: uid('CON'), customerId: mockCustomers[1].id, name: '王磊', title: 'CTO', phone: '13900003002', email: 'wanglei@starfin.com', wechat: 'wanglei_wx', isPrimary: true },
  { id: uid('CON'), customerId: mockCustomers[3].id, name: '陈芳', title: 'CEO', phone: '13900003004', email: 'chenfang@wisedu.com', wechat: 'chenfang_wx', isPrimary: true },
  { id: uid('CON'), customerId: mockCustomers[6].id, name: '孙鹏', title: 'IT经理', phone: '13900003007', email: 'sunpeng@chuangxiang.com', wechat: '', isPrimary: true },
  { id: uid('CON'), customerId: mockCustomers[6].id, name: '黄丽', title: '财务总监', phone: '13900003012', email: 'huangli@chuangxiang.com', wechat: 'huangli_wx', isPrimary: false },
]

export const mockFollowUps: FollowUp[] = [
  { id: uid('FLW'), customerId: mockCustomers[0].id, contactId: mockContacts[0].id, contactName: '李明', type: '拜访', content: '到客户公司进行了产品演示和技术方案沟通，客户对前端架构能力表示认可。', nextPlan: '下周三前发送详细报价方案', createdAt: '2026-05-20', createdBy: mockEmployees[2].id, createdByName: '王五' },
  { id: uid('FLW'), customerId: mockCustomers[0].id, contactId: mockContacts[0].id, contactName: '李明', type: '电话', content: '跟进报价反馈，客户希望增加运维服务条款。', nextPlan: '修改方案后重新发送', createdAt: '2026-05-24', createdBy: mockEmployees[2].id, createdByName: '王五' },
  { id: uid('FLW'), customerId: mockCustomers[1].id, contactId: mockContacts[2].id, contactName: '王磊', type: '微信', content: '发送了产品白皮书和案例集，客户技术团队在评估。', nextPlan: '等待客户反馈后安排技术交流会', createdAt: '2026-05-18', createdBy: mockEmployees[3].id, createdByName: '赵六' },
  { id: uid('FLW'), customerId: mockCustomers[3].id, contactId: mockContacts[3].id, contactName: '陈芳', type: '邮件', content: '发送了Q2产品更新说明和新功能演示邀请。', nextPlan: '下月安排线上演示', createdAt: '2026-05-15', createdBy: mockEmployees[0].id, createdByName: '张三' },
  { id: uid('FLW'), customerId: mockCustomers[6].id, contactId: mockContacts[4].id, contactName: '孙鹏', type: '拜访', content: '参观了客户工厂，了解了智能制造产线需求，初步谈了合作框架。', nextPlan: '整理需求文档并发给客户确认', createdAt: '2026-05-22', createdBy: mockEmployees[6].id, createdByName: '吴九' },
]

export const mockOpportunities: Opportunity[] = [
  { id: uid('OPP'), customerId: mockCustomers[0].id, customerName: '字节科技', name: '前端架构升级项目', product: '技术咨询服务', amount: 300000, stage: '商务谈判', probability: 70, expectedCloseDate: '2026-07-15', ownerId: mockEmployees[2].id, ownerName: '王五', createdAt: '2026-03-01' },
  { id: uid('OPP'), customerId: mockCustomers[1].id, customerName: '星辰金融', name: '风控系统开发', product: '定制开发', amount: 500000, stage: '需求分析', probability: 40, expectedCloseDate: '2026-09-30', ownerId: mockEmployees[3].id, ownerName: '赵六', createdAt: '2026-04-15' },
  { id: uid('OPP'), customerId: mockCustomers[3].id, customerName: '智慧教育', name: '在线教育平台二期', product: 'SaaS平台', amount: 200000, stage: '已成交', probability: 100, expectedCloseDate: '2026-05-01', ownerId: mockEmployees[0].id, ownerName: '张三', createdAt: '2026-02-01' },
  { id: uid('OPP'), customerId: mockCustomers[6].id, customerName: '创想制造', name: 'MES系统集成', product: '系统集成', amount: 800000, stage: '方案报价', probability: 55, expectedCloseDate: '2026-10-01', ownerId: mockEmployees[6].id, ownerName: '吴九', createdAt: '2026-05-10' },
  { id: uid('OPP'), customerId: mockCustomers[2].id, customerName: '绿源环保', name: '碳排放管理系统', product: 'SaaS平台', amount: 150000, stage: '初步接触', probability: 15, expectedCloseDate: '2026-12-31', ownerId: mockEmployees[4].id, ownerName: '孙七', createdAt: '2026-05-15' },
  { id: uid('OPP'), customerId: mockCustomers[5].id, customerName: '云帆医疗', name: 'HIS系统升级', product: '系统集成', amount: 600000, stage: '已丢单', probability: 0, expectedCloseDate: '2026-03-01', ownerId: mockEmployees[1].id, ownerName: '李四', createdAt: '2025-12-01' },
]

export const mockContracts: Contract[] = [
  { id: uid('CTR'), customerId: mockCustomers[3].id, customerName: '智慧教育', opportunityId: mockOpportunities[2].id, name: '在线教育平台二期开发合同', amount: 200000, startDate: '2026-05-01', endDate: '2026-11-01', status: '已签约', signedAt: '2026-04-28' },
  { id: uid('CTR'), customerId: mockCustomers[0].id, customerName: '字节科技', opportunityId: mockOpportunities[0].id, name: '前端架构升级服务合同', amount: 300000, startDate: '2026-07-01', endDate: '2027-01-01', status: '待审批', signedAt: '' },
  { id: uid('CTR'), customerId: mockCustomers[6].id, customerName: '创想制造', opportunityId: '', name: '智能制造咨询服务合同', amount: 400000, startDate: '2026-06-01', endDate: '2026-12-01', status: '草稿', signedAt: '' },
  { id: uid('CTR'), customerId: mockCustomers[5].id, customerName: '云帆医疗', opportunityId: mockOpportunities[5].id, name: 'HIS系统升级合同', amount: 600000, startDate: '2025-12-01', endDate: '2026-06-01', status: '已到期', signedAt: '2025-11-15' },
]

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
