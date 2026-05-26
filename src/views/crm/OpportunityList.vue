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
