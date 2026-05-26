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
