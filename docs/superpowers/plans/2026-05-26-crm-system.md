# CRM 客户管理系统 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在已有 HRM 项目中新增 CRM 模块，包含客户管理、联系人、跟进记录、销售漏斗、合同管理，与 HRM 员工数据联动。

**Architecture:** 沿用 HRM 项目架构模式（types → mock → stores → routes → views），在现有文件基础上追加 CRM 类型/Mock/路由/菜单，新增 3 个 Store 和 4 个 View 文件。

**Tech Stack:** Vue 3 (Composition API + `<script setup>`), TypeScript, Element Plus, Pinia, Vue Router 4

---

### Task 1: 追加 CRM TypeScript 类型

**Files:**
- Modify: `src/types/index.ts`

追加以下类型到文件末尾：

```typescript
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
```

- [ ] **Step 1: 追加类型到 src/types/index.ts**

- [ ] **Step 2: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add CRM type definitions (Customer, Contact, FollowUp, Opportunity, Contract)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: 追加 CRM Mock 数据

**Files:**
- Modify: `src/mock/data.ts`

在文件末尾追加：

```typescript
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
```

- [ ] **Step 1: 追加 Mock 数据到 src/mock/data.ts 末尾**

- [ ] **Step 2: 确认文件顶部 import 了 CRM 类型**

在 `src/mock/data.ts` 顶部 import 中追加：
```typescript
import type { ..., Customer, Contact, FollowUp, Opportunity, Contract } from '../types'
```

- [ ] **Step 3: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/mock/data.ts
git commit -m "feat: add CRM mock data (8 customers, contacts, follow-ups, opportunities, contracts)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: 创建 CRM Pinia Stores

**Files:**
- Create: `src/stores/customer.ts`
- Create: `src/stores/opportunity.ts`
- Create: `src/stores/contract.ts`

- [ ] **Step 1: 创建 customer store**

`src/stores/customer.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, Contact, FollowUp } from '../types'
import { mockCustomers, mockContacts, mockFollowUps } from '../mock/data'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([...mockCustomers])
  const contacts = ref<Contact[]>([...mockContacts])
  const followUps = ref<FollowUp[]>([...mockFollowUps])

  const searchKeyword = ref('')
  const filterIndustry = ref('')
  const filterLevel = ref('')
  const filterStatus = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredCustomers = computed(() => {
    let list = customers.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(c => c.name.includes(kw) || c.contactPerson.includes(kw))
    }
    if (filterIndustry.value) list = list.filter(c => c.industry === filterIndustry.value)
    if (filterLevel.value) list = list.filter(c => c.level === filterLevel.value)
    if (filterStatus.value) list = list.filter(c => c.status === filterStatus.value)
    return list
  })

  const pagedCustomers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredCustomers.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredCustomers.value.length)

  function addCustomer(c: Customer) { customers.value.unshift(c) }
  function updateCustomer(id: string, data: Partial<Customer>) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(customers.value[idx], data)
  }
  function deleteCustomer(id: string) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) customers.value.splice(idx, 1)
  }
  function getCustomerById(id: string): Customer | undefined {
    return customers.value.find(c => c.id === id)
  }

  function getContactsByCustomer(customerId: string): Contact[] {
    return contacts.value.filter(c => c.customerId === customerId)
  }
  function addContact(c: Contact) { contacts.value.unshift(c) }
  function updateContact(id: string, data: Partial<Contact>) {
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(contacts.value[idx], data)
  }
  function deleteContact(id: string) {
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) contacts.value.splice(idx, 1)
  }

  function getFollowUpsByCustomer(customerId: string): FollowUp[] {
    return followUps.value.filter(f => f.customerId === customerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  function addFollowUp(f: FollowUp) { followUps.value.unshift(f) }

  return {
    customers, contacts, followUps,
    searchKeyword, filterIndustry, filterLevel, filterStatus, currentPage, pageSize,
    filteredCustomers, pagedCustomers, total,
    addCustomer, updateCustomer, deleteCustomer, getCustomerById,
    getContactsByCustomer, addContact, updateContact, deleteContact,
    getFollowUpsByCustomer, addFollowUp,
  }
})
```

- [ ] **Step 2: 创建 opportunity store**

`src/stores/opportunity.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Opportunity } from '../types'
import { mockOpportunities } from '../mock/data'

export const useOpportunityStore = defineStore('opportunity', () => {
  const opportunities = ref<Opportunity[]>([...mockOpportunities])

  const stages = ['初步接触', '需求分析', '方案报价', '商务谈判', '已成交', '已丢单'] as const

  function getOppsByStage(stage: string): Opportunity[] {
    return opportunities.value.filter(o => o.stage === stage)
  }

  function addOpportunity(o: Opportunity) { opportunities.value.unshift(o) }
  function updateOpportunity(id: string, data: Partial<Opportunity>) {
    const idx = opportunities.value.findIndex(o => o.id === id)
    if (idx !== -1) Object.assign(opportunities.value[idx], data)
  }
  function deleteOpportunity(id: string) {
    const idx = opportunities.value.findIndex(o => o.id === id)
    if (idx !== -1) opportunities.value.splice(idx, 1)
  }

  const totalAmount = computed(() => opportunities.value.reduce((s, o) => s + o.amount, 0))
  const wonAmount = computed(() => opportunities.value.filter(o => o.stage === '已成交').reduce((s, o) => s + o.amount, 0))

  return { opportunities, stages, getOppsByStage, addOpportunity, updateOpportunity, deleteOpportunity, totalAmount, wonAmount }
})
```

- [ ] **Step 3: 创建 contract store**

`src/stores/contract.ts`:

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contract } from '../types'
import { mockContracts } from '../mock/data'

export const useContractStore = defineStore('contract', () => {
  const contracts = ref<Contract[]>([...mockContracts])
  const searchKeyword = ref('')
  const filterStatus = ref('')

  const filteredContracts = computed(() => {
    let list = contracts.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(c => c.name.includes(kw) || c.customerName.includes(kw))
    }
    if (filterStatus.value) list = list.filter(c => c.status === filterStatus.value)
    return list
  })

  function addContract(c: Contract) { contracts.value.unshift(c) }
  function updateContract(id: string, data: Partial<Contract>) {
    const idx = contracts.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(contracts.value[idx], data)
  }
  function deleteContract(id: string) {
    const idx = contracts.value.findIndex(c => c.id === id)
    if (idx !== -1) contracts.value.splice(idx, 1)
  }

  return { contracts, searchKeyword, filterStatus, filteredContracts, addContract, updateContract, deleteContract }
})
```

- [ ] **Step 4: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/stores/customer.ts src/stores/opportunity.ts src/stores/contract.ts
git commit -m "feat: add CRM Pinia stores (customer, opportunity, contract)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: 追加 CRM 路由 & 菜单

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/layouts/MainLayout.vue`

- [ ] **Step 1: 在 router/index.ts 中追加 CRM 路由**

在 `children` 数组末尾的 `]` 前追加：

```typescript
        { path: 'crm/customers', name: 'CustomerList', component: () => import('../views/crm/CustomerList.vue'), meta: { title: '客户列表' } },
        { path: 'crm/customers/:id', name: 'CustomerDetail', component: () => import('../views/crm/CustomerDetail.vue'), meta: { title: '客户详情' } },
        { path: 'crm/opportunities', name: 'OpportunityList', component: () => import('../views/crm/OpportunityList.vue'), meta: { title: '销售漏斗' } },
        { path: 'crm/contracts', name: 'ContractList', component: () => import('../views/crm/ContractList.vue'), meta: { title: '合同管理' } },
```

- [ ] **Step 2: 在 MainLayout.vue 侧栏中追加 CRM 菜单组**

在绩效考核 `</el-sub-menu>` 之后、`</el-menu>` 之前追加：

```vue
        <el-sub-menu index="crm-group">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>CRM 客户管理</span>
          </template>
          <el-menu-item index="/crm/customers">客户列表</el-menu-item>
          <el-menu-item index="/crm/opportunities">销售漏斗</el-menu-item>
          <el-menu-item index="/crm/contracts">合同管理</el-menu-item>
        </el-sub-menu>
```

- [ ] **Step 3: 在 MainLayout.vue script 中追加图标导入**

在 `@element-plus/icons-vue` 导入中加入 `OfficeBuilding`：

```typescript
import {
  DataAnalysis, User, Clock, Money, Briefcase, Trophy,
  Fold, Expand, Bell, ArrowDown, OfficeBuilding,
} from '@element-plus/icons-vue'
```

- [ ] **Step 4: 在 MainLayout.vue activeMenu 中追加 CRM 路由匹配**

在 `activeMenu` computed 的 `return '/'` 之前追加：

```typescript
  if (path.startsWith('/crm/contracts')) return '/crm/contracts'
  if (path.startsWith('/crm/opportunities')) return '/crm/opportunities'
  if (path.startsWith('/crm/customers')) return '/crm/customers'
```

- [ ] **Step 5: 验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/router/index.ts src/layouts/MainLayout.vue
git commit -m "feat: add CRM routes and sidebar menu group

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 5: 创建客户列表页 CustomerList

**Files:**
- Create: `src/views/crm/CustomerList.vue`

```vue
<template>
  <div class="customer-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.searchKeyword" placeholder="搜索客户名称/联系人" clearable style="width: 200px" />
          <el-select v-model="store.filterIndustry" placeholder="行业筛选" clearable style="width: 120px">
            <el-option v-for="ind in industries" :key="ind" :label="ind" :value="ind" />
          </el-select>
          <el-select v-model="store.filterLevel" placeholder="等级筛选" clearable style="width: 100px">
            <el-option label="A级" value="A" /><el-option label="B级" value="B" />
            <el-option label="C级" value="C" /><el-option label="D级" value="D" />
          </el-select>
          <el-select v-model="store.filterStatus" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="潜在" value="潜在" /><el-option label="意向" value="意向" />
            <el-option label="合作中" value="合作中" /><el-option label="已流失" value="已流失" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增客户</el-button>
      </div>

      <el-table :data="store.pagedCustomers" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="客户名称" width="140" />
        <el-table-column prop="industry" label="行业" width="80" />
        <el-table-column prop="contactPerson" label="联系人" width="80" />
        <el-table-column prop="ownerName" label="负责人" width="80" />
        <el-table-column prop="level" label="等级" width="70">
          <template #default="{ row }">
            <el-tag :type="row.level === 'A' ? 'danger' : row.level === 'B' ? 'warning' : row.level === 'C' ? '' : 'info'" size="small">{{ row.level }}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '合作中' ? 'success' : row.status === '意向' ? 'warning' : row.status === '已流失' ? 'danger' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="110" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="router.push('/crm/customers/' + row.id)">详情</el-button>
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="editingCustomer ? '编辑客户' : '新增客户'" width="650px">
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" required><el-input v-model="form.name" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业" required><el-select v-model="form.industry" style="width: 100%"><el-option v-for="ind in industries" :key="ind" :label="ind" :value="ind" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司规模"><el-input v-model="form.size" placeholder="如 100-500人" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户等级" required><el-select v-model="form.level" style="width: 100%"><el-option label="A级" value="A" /><el-option label="B级" value="B" /><el-option label="C级" value="C" /><el-option label="D级" value="D" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" required><el-input v-model="form.contactPerson" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" required><el-input v-model="form.phone" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源"><el-select v-model="form.source" style="width: 100%"><el-option label="官网" value="官网" /><el-option label="推荐" value="推荐" /><el-option label="展会" value="展会" /><el-option label="其他" value="其他" /></el-select></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="负责人" required>
          <el-select v-model="form.ownerId" style="width: 100%">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name + ' - ' + e.department" :value="e.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" required><el-select v-model="form.status" style="width: 100%"><el-option label="潜在" value="潜在" /><el-option label="意向" value="意向" /><el-option label="合作中" value="合作中" /><el-option label="已流失" value="已流失" /></el-select></el-form-item>
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
import { useCustomerStore } from '../../stores/customer'
import { useEmployeeStore } from '../../stores/employee'
import type { Customer } from '../../types'

const store = useCustomerStore()
const employeeStore = useEmployeeStore()
const router = useRouter()
const dialogVisible = ref(false)
const editingCustomer = ref<Customer | null>(null)

const industries = ['互联网', '金融', '环保', '教育', '物流', '医疗', '制造业', '零售']

const form = reactive<Customer>({
  id: '', name: '', industry: '', size: '', contactPerson: '', phone: '', email: '', address: '', tags: [],
  source: '官网', level: 'C', ownerId: '', ownerName: '', status: '潜在', createdAt: '',
})

function handleNew() {
  editingCustomer.value = null
  Object.assign(form, { id: '', name: '', industry: '', size: '', contactPerson: '', phone: '', email: '', address: '', source: '官网', level: 'C', ownerId: '', ownerName: '', status: '潜在' })
  dialogVisible.value = true
}
function handleEdit(c: Customer) {
  editingCustomer.value = c
  Object.assign(form, c)
  dialogVisible.value = true
}
function handleDelete(c: Customer) {
  ElMessageBox.confirm(`确定删除客户 ${c.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteCustomer(c.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleSubmit() {
  if (!form.name || !form.contactPerson || !form.ownerId) { ElMessage.warning('请填写必要信息'); return }
  const owner = employeeStore.employees.find(e => e.id === form.ownerId)
  if (editingCustomer.value) {
    store.updateCustomer(editingCustomer.value.id, { ...form, ownerName: owner?.name || '' })
    ElMessage.success('更新成功')
  } else {
    store.addCustomer({ ...form, id: `CUS-${String(store.customers.length + 1).padStart(4, '0')}`, ownerName: owner?.name || '', createdAt: new Date().toISOString().slice(0, 10) })
    ElMessage.success('客户添加成功')
  }
  dialogVisible.value = false
  editingCustomer.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
```

- [ ] **Step 1: 创建目录和文件**

```bash
mkdir -p src/views/crm
```

- [ ] **Step 2: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/views/crm/CustomerList.vue
git commit -m "feat: add CRM customer list page with search, filters, and CRUD

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 6: 创建客户详情页 CustomerDetail

**Files:**
- Create: `src/views/crm/CustomerDetail.vue`

```vue
<template>
  <div class="customer-detail">
    <el-page-header @back="router.back()" :content="customer?.name || '客户详情'" style="margin-bottom: 20px" />
    <el-card v-if="customer">
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item label="客户名称">{{ customer.name }}</el-descriptions-item>
        <el-descriptions-item label="行业">{{ customer.industry }}</el-descriptions-item>
        <el-descriptions-item label="规模">{{ customer.size }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ customer.contactPerson }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ customer.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ customer.email }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ customer.address }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ customer.source }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ customer.ownerName }}</el-descriptions-item>
        <el-descriptions-item label="等级">
          <el-tag :type="customer.level === 'A' ? 'danger' : customer.level === 'B' ? 'warning' : customer.level === 'C' ? '' : 'info'">{{ customer.level }}级</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="customer.status === '合作中' ? 'success' : customer.status === '意向' ? 'warning' : customer.status === '已流失' ? 'danger' : 'info'">{{ customer.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ customer.createdAt }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="联系人" name="contacts">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="contactDialogVisible = true">新增联系人</el-button>
          </div>
          <el-table :data="contacts" stripe style="width: 100%; margin-top: 12px">
            <el-table-column prop="name" label="姓名" width="80" />
            <el-table-column prop="title" label="职位" width="100" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column prop="wechat" label="微信" width="120" />
            <el-table-column prop="isPrimary" label="首要联系人" width="90">
              <template #default="{ row }"><el-tag v-if="row.isPrimary" type="success" size="small">是</el-tag><span v-else>-</span></template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditContact(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteContact(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="followups">
          <div class="tab-toolbar">
            <el-button type="primary" size="small" @click="followUpDialogVisible = true">新增跟进</el-button>
          </div>
          <el-timeline style="margin-top: 16px">
            <el-timeline-item v-for="f in followUps" :key="f.id" :timestamp="f.createdAt" placement="top">
              <el-card shadow="hover">
                <div class="followup-header">
                  <el-tag size="small" :type="f.type === '拜访' ? '' : f.type === '电话' ? 'success' : 'info'">{{ f.type }}</el-tag>
                  <span class="followup-contact">联系人：{{ f.contactName }}</span>
                  <span class="followup-by">跟进人：{{ f.createdByName }}</span>
                </div>
                <div class="followup-content">{{ f.content }}</div>
                <div v-if="f.nextPlan" class="followup-plan">下一步计划：{{ f.nextPlan }}</div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 联系人弹窗 -->
    <el-dialog v-model="contactDialogVisible" :title="editingContact ? '编辑联系人' : '新增联系人'" width="500px">
      <el-form :model="contactForm" label-width="100px">
        <el-form-item label="姓名" required><el-input v-model="contactForm.name" /></el-form-item>
        <el-form-item label="职位"><el-input v-model="contactForm.title" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="contactForm.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="contactForm.email" /></el-form-item>
        <el-form-item label="微信"><el-input v-model="contactForm.wechat" /></el-form-item>
        <el-form-item label="首要联系人"><el-switch v-model="contactForm.isPrimary" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contactDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleContactSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 跟进记录弹窗 -->
    <el-dialog v-model="followUpDialogVisible" title="新增跟进记录" width="500px">
      <el-form :model="followUpForm" label-width="80px">
        <el-form-item label="联系人" required>
          <el-select v-model="followUpForm.contactId" style="width: 100%">
            <el-option v-for="c in contacts" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进方式" required>
          <el-select v-model="followUpForm.type" style="width: 100%">
            <el-option label="电话" value="电话" /><el-option label="拜访" value="拜访" />
            <el-option label="邮件" value="邮件" /><el-option label="微信" value="微信" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容" required><el-input v-model="followUpForm.content" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="下一步计划"><el-input v-model="followUpForm.nextPlan" /></el-form-item>
        <el-form-item label="跟进人" required>
          <el-select v-model="followUpForm.createdBy" style="width: 100%">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name" :value="e.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="followUpDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleFollowUpSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCustomerStore } from '../../stores/customer'
import { useEmployeeStore } from '../../stores/employee'
import type { Contact as ContactType, FollowUp as FollowUpType } from '../../types'

const route = useRoute()
const router = useRouter()
const store = useCustomerStore()
const employeeStore = useEmployeeStore()
const activeTab = ref('contacts')

const customer = computed(() => store.getCustomerById(route.params.id as string))
const contacts = computed(() => customer.value ? store.getContactsByCustomer(customer.value.id) : [])
const followUps = computed(() => customer.value ? store.getFollowUpsByCustomer(customer.value.id) : [])

// 联系人
const contactDialogVisible = ref(false)
const editingContact = ref<ContactType | null>(null)
const contactForm = reactive({ name: '', title: '', phone: '', email: '', wechat: '', isPrimary: false })

function handleEditContact(c: ContactType) { editingContact.value = c; Object.assign(contactForm, c); contactDialogVisible.value = true }
function handleDeleteContact(c: ContactType) {
  ElMessageBox.confirm(`确定删除联系人 ${c.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteContact(c.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function handleContactSubmit() {
  if (!contactForm.name) { ElMessage.warning('请填写联系人姓名'); return }
  if (editingContact.value) {
    store.updateContact(editingContact.value.id, { ...contactForm })
    ElMessage.success('更新成功')
  } else {
    store.addContact({ id: `CON-${String(store.contacts.length + 1).padStart(4, '0')}`, customerId: customer.value!.id, ...contactForm })
    ElMessage.success('联系人已添加')
  }
  contactDialogVisible.value = false
  editingContact.value = null
}

// 跟进记录
const followUpDialogVisible = ref(false)
const followUpForm = reactive({ contactId: '', type: '电话' as FollowUpType['type'], content: '', nextPlan: '', createdBy: '' })

function handleFollowUpSubmit() {
  if (!followUpForm.contactId || !followUpForm.content || !followUpForm.createdBy) {
    ElMessage.warning('请填写必要信息')
    return
  }
  const contact = contacts.value.find(c => c.id === followUpForm.contactId)
  const employee = employeeStore.employees.find(e => e.id === followUpForm.createdBy)
  store.addFollowUp({
    id: `FLW-${String(store.followUps.length + 1).padStart(4, '0')}`,
    customerId: customer.value!.id,
    contactId: followUpForm.contactId,
    contactName: contact?.name || '',
    type: followUpForm.type,
    content: followUpForm.content,
    nextPlan: followUpForm.nextPlan,
    createdAt: new Date().toISOString().slice(0, 10),
    createdBy: followUpForm.createdBy,
    createdByName: employee?.name || '',
  })
  followUpDialogVisible.value = false
  ElMessage.success('跟进记录已添加')
}
</script>

<style scoped>
.tab-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
.followup-header { display: flex; gap: 16px; align-items: center; margin-bottom: 8px; font-size: 13px; color: #909399; }
.followup-content { margin-bottom: 4px; }
.followup-plan { font-size: 13px; color: #409EFF; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/crm/CustomerDetail.vue
git commit -m "feat: add CRM customer detail page with contacts and follow-up tabs

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 7: 创建销售漏斗页 OpportunityList

**Files:**
- Create: `src/views/crm/OpportunityList.vue`

```vue
<template>
  <div class="opportunity-list">
    <el-card>
      <div class="toolbar">
        <div class="summary">
          <span>商机总数：<strong>{{ store.opportunities.length }}</strong></span>
          <span>总金额：<strong style="color: #409EFF">¥{{ store.totalAmount.toLocaleString() }}</strong></span>
          <span>已成交额：<strong style="color: #67C23A">¥{{ store.wonAmount.toLocaleString() }}</strong></span>
        </div>
        <el-button type="primary" @click="handleNew">新增商机</el-button>
      </div>
    </el-card>

    <div class="kanban">
      <div class="kanban-col" v-for="stage in store.stages" :key="stage">
        <div class="kanban-col-header">
          <span>{{ stage }}</span>
          <el-tag size="small" round>{{ store.getOppsByStage(stage).length }}</el-tag>
        </div>
        <div class="kanban-cards">
          <el-card v-for="opp in store.getOppsByStage(stage)" :key="opp.id" shadow="hover" class="opp-card">
            <div class="opp-name">{{ opp.name }}</div>
            <div class="opp-customer">{{ opp.customerName }}</div>
            <div class="opp-amount">¥{{ opp.amount.toLocaleString() }}</div>
            <div class="opp-meta">
              <span>成交率 {{ opp.probability }}%</span>
              <span>{{ opp.expectedCloseDate }}</span>
            </div>
            <div class="opp-footer">
              <el-button size="small" @click="handleEdit(opp)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(opp)">删除</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingOpp ? '编辑商机' : '新增商机'" width="550px">
      <el-form :model="form" label-width="110px">
        <el-form-item label="商机名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="关联客户" required>
          <el-select v-model="form.customerId" style="width: 100%" @change="onCustomerChange">
            <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品/服务"><el-input v-model="form.product" /></el-form-item>
        <el-form-item label="金额"><el-input-number v-model="form.amount" :min="0" :step="10000" style="width: 100%" /></el-form-item>
        <el-form-item label="当前阶段" required>
          <el-select v-model="form.stage" style="width: 100%">
            <el-option v-for="s in store.stages" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="成交概率"><el-input-number v-model="form.probability" :min="0" :max="100" style="width: 100%" /> %</el-form-item>
        <el-form-item label="预计成交日期"><el-input v-model="form.expectedCloseDate" type="date" /></el-form-item>
        <el-form-item label="负责人" required>
          <el-select v-model="form.ownerId" style="width: 100%">
            <el-option v-for="e in employeeStore.employees.filter(e => e.status !== '离职')" :key="e.id" :label="e.name + ' - ' + e.department" :value="e.id" />
          </el-select>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOpportunityStore } from '../../stores/opportunity'
import { useCustomerStore } from '../../stores/customer'
import { useEmployeeStore } from '../../stores/employee'
import type { Opportunity } from '../../types'

const store = useOpportunityStore()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const dialogVisible = ref(false)
const editingOpp = ref<Opportunity | null>(null)

const form = reactive<Opportunity>({
  id: '', customerId: '', customerName: '', name: '', product: '', amount: 0,
  stage: '初步接触', probability: 10, expectedCloseDate: '', ownerId: '', ownerName: '', createdAt: '',
})

function handleNew() {
  editingOpp.value = null
  Object.assign(form, { id: '', customerId: '', customerName: '', name: '', product: '', amount: 0, stage: '初步接触', probability: 10, expectedCloseDate: '', ownerId: '', ownerName: '' })
  dialogVisible.value = true
}
function handleEdit(opp: Opportunity) { editingOpp.value = opp; Object.assign(form, opp); dialogVisible.value = true }
function handleDelete(opp: Opportunity) {
  ElMessageBox.confirm(`确定删除商机 ${opp.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteOpportunity(opp.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
function onCustomerChange(customerId: string) {
  const c = customerStore.customers.find(c => c.id === customerId)
  form.customerName = c?.name || ''
}
function handleSubmit() {
  if (!form.name || !form.customerId || !form.ownerId) { ElMessage.warning('请填写必要信息'); return }
  const owner = employeeStore.employees.find(e => e.id === form.ownerId)
  if (editingOpp.value) {
    store.updateOpportunity(editingOpp.value.id, { ...form, ownerName: owner?.name || '' })
    ElMessage.success('更新成功')
  } else {
    store.addOpportunity({ ...form, id: `OPP-${String(store.opportunities.length + 1).padStart(4, '0')}`, ownerName: owner?.name || '', createdAt: new Date().toISOString().slice(0, 10) })
    ElMessage.success('商机已添加')
  }
  dialogVisible.value = false
  editingOpp.value = null
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.summary { display: flex; gap: 24px; font-size: 14px; }
.kanban { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; }
.kanban-col { min-width: 220px; max-width: 240px; flex: 1; }
.kanban-col-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: bold; font-size: 14px; background: #f0f2f5; border-radius: 6px; margin-bottom: 8px; }
.kanban-cards { display: flex; flex-direction: column; gap: 8px; min-height: 200px; }
.opp-card { cursor: default; }
.opp-name { font-weight: bold; font-size: 14px; margin-bottom: 4px; }
.opp-customer { font-size: 12px; color: #909399; margin-bottom: 4px; }
.opp-amount { font-size: 16px; font-weight: bold; color: #409EFF; margin-bottom: 8px; }
.opp-meta { display: flex; justify-content: space-between; font-size: 12px; color: #909399; margin-bottom: 8px; }
.opp-footer { display: flex; gap: 6px; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/crm/OpportunityList.vue
git commit -m "feat: add CRM opportunity kanban page with sales funnel view

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 8: 创建合同管理页 ContractList

**Files:**
- Create: `src/views/crm/ContractList.vue`

```vue
<template>
  <div class="contract-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.searchKeyword" placeholder="搜索合同名称/客户" clearable style="width: 200px" />
          <el-select v-model="store.filterStatus" placeholder="状态筛选" clearable style="width: 120px">
            <el-option label="草稿" value="草稿" /><el-option label="待审批" value="待审批" />
            <el-option label="已签约" value="已签约" /><el-option label="已到期" value="已到期" />
            <el-option label="已终止" value="已终止" />
          </el-select>
        </div>
        <el-button type="primary" @click="handleNew">新增合同</el-button>
      </div>

      <el-table :data="store.filteredContracts" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="合同名称" min-width="180" />
        <el-table-column prop="customerName" label="客户" width="120" />
        <el-table-column prop="amount" label="金额" width="110">
          <template #default="{ row }">¥{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '已签约' ? 'success' : row.status === '待审批' ? 'warning' : row.status === '已到期' ? 'danger' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="signedAt" label="签约日期" width="110">
          <template #default="{ row }">{{ row.signedAt || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button v-if="row.status === '草稿'" size="small" type="warning" @click="handleSubmit(row)">提交审批</el-button>
              <el-button v-if="row.status === '待审批'" size="small" type="success" @click="handleApprove(row)">签约</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增合同" width="550px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="合同名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="关联客户" required>
          <el-select v-model="form.customerId" style="width: 100%" @change="onCustomerChange">
            <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联商机">
          <el-select v-model="form.opportunityId" style="width: 100%">
            <el-option v-for="o in opportunityStore.opportunities.filter(o => o.customerId === form.customerId)" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="合同金额" required><el-input-number v-model="form.amount" :min="0" :step="10000" style="width: 100%" /></el-form-item>
        <el-form-item label="开始日期" required><el-input v-model="form.startDate" type="date" /></el-form-item>
        <el-form-item label="结束日期" required><el-input v-model="form.endDate" type="date" /></el-form-item>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContractStore } from '../../stores/contract'
import { useCustomerStore } from '../../stores/customer'
import { useOpportunityStore } from '../../stores/opportunity'
import type { Contract } from '../../types'

const store = useContractStore()
const customerStore = useCustomerStore()
const opportunityStore = useOpportunityStore()
const dialogVisible = ref(false)

const form = reactive({ name: '', customerId: '', customerName: '', opportunityId: '', amount: 0, startDate: '', endDate: '' })

function handleNew() {
  Object.assign(form, { name: '', customerId: '', customerName: '', opportunityId: '', amount: 0, startDate: '', endDate: '' })
  dialogVisible.value = true
}
function onCustomerChange(customerId: string) {
  const c = customerStore.customers.find(c => c.id === customerId)
  form.customerName = c?.name || ''
  form.opportunityId = ''
}
function handleAdd() {
  if (!form.name || !form.customerId || !form.startDate || !form.endDate) { ElMessage.warning('请填写必要信息'); return }
  store.addContract({
    id: `CTR-${String(store.contracts.length + 1).padStart(4, '0')}`,
    ...form,
    status: '草稿',
    signedAt: '',
  })
  dialogVisible.value = false
  ElMessage.success('合同已创建')
}
function handleSubmit(c: Contract) { store.updateContract(c.id, { status: '待审批' }); ElMessage.success('已提交审批') }
function handleApprove(c: Contract) {
  store.updateContract(c.id, { status: '已签约', signedAt: new Date().toISOString().slice(0, 10) })
  ElMessage.success('已签约')
}
function handleDelete(c: Contract) {
  ElMessageBox.confirm(`确定删除合同 ${c.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteContract(c.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; }
.action-btns { display: flex; gap: 6px; }
</style>
```

- [ ] **Step 1: 写入文件并验证编译**

```bash
npx vue-tsc --noEmit
```

- [ ] **Step 2: Commit**

```bash
git add src/views/crm/ContractList.vue
git commit -m "feat: add CRM contract management page with status flow

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 9: 最终验证

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
- 侧栏出现 CRM 客户管理菜单组
- 客户列表：搜索/筛选/分页/新增/编辑/删除
- 客户详情：基本信息 + 联系人 Tab + 跟进记录 Tab
- 销售漏斗：6 列看板展示、新增商机
- 合同管理：搜索/筛选/新增/提交审批/签约/删除

- [ ] **Step 4: 修复问题并最终提交**

```bash
git add -A
git commit -m "chore: final verification and fixes for CRM module

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```
