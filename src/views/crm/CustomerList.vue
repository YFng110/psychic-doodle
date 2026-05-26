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
        <el-table-column label="操作" width="210" fixed="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button size="small" @click="router.push('/crm/customers/' + row.id)">详情</el-button>
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </div>
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
.action-btns { display: flex; gap: 6px; white-space: nowrap; }
</style>
