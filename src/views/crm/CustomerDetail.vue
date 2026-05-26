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
