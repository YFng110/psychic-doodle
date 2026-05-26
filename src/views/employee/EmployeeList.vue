<template>
  <div class="employee-list">
    <el-card>
      <div class="toolbar">
        <el-input v-model="store.searchKeyword" placeholder="搜索姓名/部门/职位" clearable style="width: 240px" />
        <el-button type="primary" @click="dialogVisible = true">新增员工</el-button>
      </div>

      <el-table :data="store.pagedEmployees" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="gender" label="性别" width="60" />
        <el-table-column prop="department" label="部门" width="100" />
        <el-table-column prop="position" label="职位" width="140" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="hireDate" label="入职日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '在职' ? 'success' : row.status === '试用' ? 'warning' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="router.push('/employee/' + row.id)">详情</el-button>
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

    <el-dialog v-model="dialogVisible" title="新增员工" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="性别" required>
          <el-select v-model="form.gender"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select>
        </el-form-item>
        <el-form-item label="手机号" required><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="部门" required>
          <el-select v-model="form.department">
            <el-option v-for="d in departments" :key="d" :label="d" :value="d" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required><el-input v-model="form.position" /></el-form-item>
        <el-form-item label="入职日期" required><el-input v-model="form.hireDate" type="date" /></el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="form.status"><el-option label="在职" value="在职" /><el-option label="试用" value="试用" /></el-select>
        </el-form-item>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEmployeeStore } from '../../stores/employee'
import type { Employee } from '../../types'

const store = useEmployeeStore()
const router = useRouter()
const dialogVisible = ref(false)
const departments = ['技术部', '产品部', '市场部', '销售部', '人事部', '财务部']

const form = reactive<Employee>({
  id: '', name: '', avatar: '', gender: '男', phone: '', email: '', department: '技术部',
  position: '', hireDate: '', status: '在职', emergencyContact: '', idCard: '', bankAccount: '',
})

function handleAdd() {
  if (!form.name || !form.phone || !form.position) {
    ElMessage.warning('请填写必要信息')
    return
  }
  const count = store.employees.length + 1
  store.addEmployee({
    ...form,
    id: `EMP-${String(count).padStart(4, '0')}`,
  })
  dialogVisible.value = false
  ElMessage.success('员工添加成功')
}

function handleDelete(row: Employee) {
  ElMessageBox.confirm(`确定删除员工 ${row.name} 吗？`, '提示', { type: 'warning' })
    .then(() => { store.deleteEmployee(row.id); ElMessage.success('删除成功') })
    .catch(() => {})
}
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; }
</style>
