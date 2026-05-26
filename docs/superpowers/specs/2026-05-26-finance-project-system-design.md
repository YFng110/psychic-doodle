# 财务管理 & 项目管理系统 — 设计文档

**日期**：2026-05-26
**状态**：已确认

---

## 一、项目概述

在已有 HRM + CRM 系统基础上新增财务管理和项目管理两个模块。与 CRM 客户数据、HRM 员工数据联动。纯前端 Mock 数据驱动。

## 二、财务管理 — 数据模型

### Invoice（发票）
```
id, type(应收/应付), customerId→Customer, supplierName(应付时用),
invoiceNumber, amount, taxRate, taxAmount, totalAmount,
currency(CNY/USD/EUR/JPY), issueDate, dueDate,
status(草稿/已开具/已发送/已收款/已逾期/已付款),
notes
```

### Payment（收付款）
```
id, invoiceId→Invoice, customerId→Customer,
amount, paymentDate, paymentMethod(银行转账/现金/支付宝/微信/其他),
currency, exchangeRate(对CNY汇率),
notes
```

### ExpenseReport（费用报销）
```
id, employeeId→Employee, employeeName,
type(差旅/招待/办公/其他), amount, date,
description, attachments[],
status(待审批/已通过/已拒绝), approverId→Employee, approvedAt
```

### Budget（预算）
```
id, year, department, category(部门预算/项目预算),
projectId(项目预算时关联), totalAmount, usedAmount
```

## 三、项目管理 — 数据模型

### Project（项目）
```
id, name, description, customerId→Customer(可选),
managerId→Employee, members[](→Employee.id[]),
startDate, endDate, budget(金额),
status(筹备中/进行中/已完成/已暂停/已取消)
```

### Milestone（里程碑）
```
id, projectId, name, deadline, status(待开始/进行中/已完成)
```

### Task（任务）
```
id, projectId, milestoneId(可选), name, description,
assigneeId→Employee, priority(高/中/低),
status(待办/进行中/已完成/已关闭),
startDate, dueDate, estimatedHours, actualHours
```

### TimeEntry（工时记录）
```
id, taskId, projectId, employeeId→Employee,
date, hours, description
```

## 四、路由设计

侧栏新增两个菜单组：

### 财务管理（Money 图标）
| 路径 | 页面 | 菜单名 |
|------|------|--------|
| `/finance/invoices` | InvoiceList | 发票管理 |
| `/finance/payments` | PaymentList | 收付款记录 |
| `/finance/expenses` | ExpenseList | 费用报销 |
| `/finance/budgets` | BudgetList | 预算管理 |

### 项目管理（Notebook 图标）
| 路径 | 页面 | 菜单名 |
|------|------|--------|
| `/project/list` | ProjectList | 项目列表 |
| `/project/:id` | ProjectDetail | （隐藏页） |

## 五、状态管理

- `useFinanceStore` — 发票 + 收付款 + 费用报销 + 预算
- `useProjectStore` — 项目 + 里程碑 + 任务 + 工时

## 六、页面交互设计

### 发票管理 (InvoiceList)
- 顶部：type 切换（应收/应付）+ 关键字搜索 + 状态筛选
- 表格列：发票号码、类型标签、客户/供应商、金额(含币种)、税额、含税合计、开票日期、到期日、状态
- 操作：新增/编辑/查看详情/收款登记(应收)/付款登记(应付)
- 新增/编辑用 dialog 表单，客户从 CRM 下拉选择

### 收付款记录 (PaymentList)
- 搜索 + 筛选（按客户、日期范围、支付方式）
- 表格列：关联发票号、客户、金额(含币种)、支付日期、支付方式、汇率

### 费用报销 (ExpenseList)
- 搜索 + 类型筛选 + 状态筛选
- 表格列：员工、类型、金额、日期、说明、状态
- 操作：新增报销/审批通过/审批拒绝

### 预算管理 (BudgetList)
- 按年度筛选
- 卡片/表格混合展示：部门/项目、预算金额、已用金额、剩余金额、使用率进度条
- 新增/编辑预算

### 项目列表 (ProjectList)
- 搜索 + 状态筛选
- 表格列：项目名、客户、负责人、开始/结束日期、状态
- 操作：详情/编辑/删除 + 新增

### 项目详情 (ProjectDetail)
- 返回 + 基本信息（Descriptions）
- Tab 1：任务看板（4列：待办/进行中/已完成/已关闭）
- Tab 2：甘特图（gantt-elastic 或 v-gantt-chart）
- Tab 3：里程碑（时间线列表）
- Tab 4：工时记录（表格 + 新增工时录入）

## 七、联动点

- 发票 `customerId` → CRM Customer
- 费用报销 `employeeId` → HRM Employee
- 项目 `customerId` → CRM Customer
- 项目 `managerId` / `members[]` → HRM Employee
- 任务 `assigneeId` → HRM Employee
- 预算 `projectId` → Project

## 八、甘特图方案

引入 `gantt-elastic`（Vue 3 兼容，MIT 许可）渲染项目任务甘特图。安装依赖：

```bash
npm install gantt-elastic
```

在 ProjectDetail 的甘特图 Tab 中渲染，数据源来自当前项目的 tasks 列表。

## 九、文件规划

```
src/
├── types/index.ts                    # 追加 Invoice, Payment, ExpenseReport, Budget, Project, Milestone, Task, TimeEntry
├── mock/data.ts                       # 追加 Finance + Project Mock 数据
├── stores/
│   ├── finance.ts                     # 新增
│   └── project.ts                     # 新增
├── router/index.ts                    # 追加 Finance + Project 路由
├── layouts/MainLayout.vue             # 侧栏追加两组菜单
└── views/
    ├── finance/
    │   ├── InvoiceList.vue
    │   ├── PaymentList.vue
    │   ├── ExpenseList.vue
    │   └── BudgetList.vue
    └── project/
        ├── ProjectList.vue
        └── ProjectDetail.vue
```
