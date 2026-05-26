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
