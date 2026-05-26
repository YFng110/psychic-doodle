# CRM 客户管理系统 — 设计文档

**日期**：2026-05-26
**状态**：已确认

---

## 一、项目概述

在已有 HRM 系统基础上新增 CRM 客户管理模块，涵盖客户管理、联系人、跟进记录、销售漏斗、合同管理。与 HRM 员工数据联动（员工作为销售/跟单负责人）。纯前端 Mock 数据驱动。

## 二、数据模型

### Customer（客户）
```
id, name, industry, size, contactPerson, phone, email, address,
tags[], source(官网/推荐/展会/其他), level(A/B/C/D),
ownerId (→ Employee.id), status(潜在/意向/合作中/已流失), createdAt
```

### Contact（联系人）
```
id, customerId, name, title, phone, email, wechat, isPrimary
```

### FollowUp（跟进记录）
```
id, customerId, contactId, type(电话/拜访/邮件/微信/其他),
content, nextPlan, createdAt, createdBy (→ Employee.id)
```

### Opportunity（商机）
```
id, customerId, customerName, name, product, amount,
stage(初步接触/需求分析/方案报价/商务谈判/已成交/已丢单),
probability, expectedCloseDate, ownerId (→ Employee.id), createdAt
```

### Contract（合同）
```
id, customerId, customerName, opportunityId, name, amount,
startDate, endDate, status(草稿/待审批/已签约/已到期/已终止), signedAt
```

## 三、路由设计

侧栏新增 CRM 菜单组，所有路由包裹在 MainLayout 内：

| 路径 | 页面 | 菜单名 |
|------|------|--------|
| `/crm/customers` | CustomerList | 客户列表 |
| `/crm/customers/:id` | CustomerDetail | （隐藏页） |
| `/crm/opportunities` | OpportunityList | 销售漏斗 |
| `/crm/contracts` | ContractList | 合同管理 |

## 四、状态管理

Pinia Store 按模块拆分：

- `useCustomerStore` — 客户 CRUD + 联系人 + 跟进记录
- `useOpportunityStore` — 商机/销售漏斗
- `useContractStore` — 合同管理

## 五、页面交互设计

### 客户列表 (CustomerList)
- 顶部搜索栏：关键字 + 行业筛选 + 等级筛选 + 状态筛选
- 表格列：名称、行业、联系人、负责人、等级（彩色标签）、状态、创建时间
- 操作：详情、编辑、删除
- 新增/编辑用 dialog 表单，负责人从 HRM 员工下拉选择

### 客户详情 (CustomerDetail)
- 页面返回 + 客户基本信息（Descriptions 组件）
- Tab 1：联系人列表（表格 + 新增/编辑/删除）
- Tab 2：跟进记录（时间线展示 + 新增跟进表单）

### 销售漏斗 (OpportunityList)
- 看板视图：6 列阶段静态卡片排列
- 商机卡片：名称、金额、客户、预计成交日期
- 新增/编辑商机弹窗

### 合同管理 (ContractList)
- 合同列表：搜索 + 状态筛选
- 新增合同关联商机和客户
- 状态流转：草稿 → 待审批 → 已签约

## 六、HRM 联动点

- 客户 `ownerId` 从 Employee 列表选择
- 跟进记录 `createdBy` 从 Employee 列表选择
- 商机 `ownerId` 从 Employee 列表选择

## 七、文件规划

```
src/
├── types/index.ts               # 追加 CRM 类型
├── mock/data.ts                  # 追加 CRM Mock 数据
├── stores/
│   ├── customer.ts               # 新增
│   ├── opportunity.ts            # 新增
│   └── contract.ts               # 新增
├── router/index.ts               # 追加 CRM 路由
├── layouts/MainLayout.vue        # 侧栏追加 CRM 菜单组
└── views/crm/
    ├── CustomerList.vue
    ├── CustomerDetail.vue
    ├── OpportunityList.vue
    └── ContractList.vue
```
