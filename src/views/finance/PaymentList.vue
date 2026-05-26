<template>
  <div class="payment-list">
    <el-card>
      <div class="toolbar">
        <div class="filters">
          <el-input v-model="store.paymentSearchKeyword" placeholder="搜索发票号/客户" clearable style="width: 200px" />
          <el-select v-model="store.paymentMethodFilter" placeholder="支付方式" clearable style="width: 120px">
            <el-option label="银行转账" value="银行转账" /><el-option label="现金" value="现金" />
            <el-option label="支付宝" value="支付宝" /><el-option label="微信" value="微信" />
            <el-option label="其他" value="其他" />
          </el-select>
        </div>
      </div>

      <el-table :data="store.filteredPayments" stripe style="width: 100%; margin-top: 16px">
        <el-table-column prop="invoiceNumber" label="关联发票号" width="130" />
        <el-table-column prop="customerName" label="客户" width="120">
          <template #default="{ row }">{{ row.customerName || '-' }}</template>
        </el-table-column>
        <el-table-column label="金额" width="130">
          <template #default="{ row }">{{ row.currency === 'USD' ? '$' : '¥' }}{{ row.amount.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="paymentDate" label="支付日期" width="110" />
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column label="汇率" width="80">
          <template #default="{ row }">{{ row.currency === 'CNY' ? '-' : row.exchangeRate }}</template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" min-width="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useFinanceStore } from '../../stores/finance'
const store = useFinanceStore()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.filters { display: flex; gap: 10px; }
</style>
