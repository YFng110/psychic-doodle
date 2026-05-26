import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice, Payment, ExpenseReport, Budget } from '../types'
import { mockInvoices, mockPayments, mockExpenses, mockBudgets } from '../mock/data'

export const useFinanceStore = defineStore('finance', () => {
  const invoices = ref<Invoice[]>([...mockInvoices])
  const payments = ref<Payment[]>([...mockPayments])
  const expenses = ref<ExpenseReport[]>([...mockExpenses])
  const budgets = ref<Budget[]>([...mockBudgets])

  const invoiceSearchKeyword = ref('')
  const invoiceTypeFilter = ref('')
  const invoiceStatusFilter = ref('')

  const filteredInvoices = computed(() => {
    let list = invoices.value
    if (invoiceSearchKeyword.value) {
      const kw = invoiceSearchKeyword.value.toLowerCase()
      list = list.filter(i => i.invoiceNumber.toLowerCase().includes(kw) || i.customerName.includes(kw) || i.supplierName.includes(kw))
    }
    if (invoiceTypeFilter.value) list = list.filter(i => i.type === invoiceTypeFilter.value)
    if (invoiceStatusFilter.value) list = list.filter(i => i.status === invoiceStatusFilter.value)
    return list
  })

  function addInvoice(inv: Invoice) { invoices.value.unshift(inv) }
  function updateInvoice(id: string, data: Partial<Invoice>) {
    const idx = invoices.value.findIndex(i => i.id === id)
    if (idx !== -1) Object.assign(invoices.value[idx], data)
  }
  function deleteInvoice(id: string) {
    const idx = invoices.value.findIndex(i => i.id === id)
    if (idx !== -1) invoices.value.splice(idx, 1)
  }

  const paymentSearchKeyword = ref('')
  const paymentMethodFilter = ref('')

  const filteredPayments = computed(() => {
    let list = payments.value
    if (paymentSearchKeyword.value) {
      const kw = paymentSearchKeyword.value.toLowerCase()
      list = list.filter(p => p.invoiceNumber.toLowerCase().includes(kw) || p.customerName.includes(kw))
    }
    if (paymentMethodFilter.value) list = list.filter(p => p.paymentMethod === paymentMethodFilter.value)
    return list
  })

  function addPayment(p: Payment) { payments.value.unshift(p) }
  function updatePayment(id: string, data: Partial<Payment>) {
    const idx = payments.value.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(payments.value[idx], data)
  }

  const expenseSearchKeyword = ref('')
  const expenseTypeFilter = ref('')
  const expenseStatusFilter = ref('')

  const filteredExpenses = computed(() => {
    let list = expenses.value
    if (expenseSearchKeyword.value) {
      const kw = expenseSearchKeyword.value.toLowerCase()
      list = list.filter(e => e.employeeName.includes(kw) || e.description.includes(kw))
    }
    if (expenseTypeFilter.value) list = list.filter(e => e.type === expenseTypeFilter.value)
    if (expenseStatusFilter.value) list = list.filter(e => e.status === expenseStatusFilter.value)
    return list
  })

  function addExpense(ex: ExpenseReport) { expenses.value.unshift(ex) }
  function updateExpense(id: string, data: Partial<ExpenseReport>) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) Object.assign(expenses.value[idx], data)
  }
  function deleteExpense(id: string) {
    const idx = expenses.value.findIndex(e => e.id === id)
    if (idx !== -1) expenses.value.splice(idx, 1)
  }

  const budgetYearFilter = ref('2026')
  const filteredBudgets = computed(() => {
    if (!budgetYearFilter.value) return budgets.value
    return budgets.value.filter(b => b.year === budgetYearFilter.value)
  })

  function addBudget(b: Budget) { budgets.value.unshift(b) }
  function updateBudget(id: string, data: Partial<Budget>) {
    const idx = budgets.value.findIndex(b => b.id === id)
    if (idx !== -1) Object.assign(budgets.value[idx], data)
  }
  function deleteBudget(id: string) {
    const idx = budgets.value.findIndex(b => b.id === id)
    if (idx !== -1) budgets.value.splice(idx, 1)
  }

  return {
    invoices, payments, expenses, budgets,
    invoiceSearchKeyword, invoiceTypeFilter, invoiceStatusFilter, filteredInvoices,
    paymentSearchKeyword, paymentMethodFilter, filteredPayments,
    expenseSearchKeyword, expenseTypeFilter, expenseStatusFilter, filteredExpenses,
    budgetYearFilter, filteredBudgets,
    addInvoice, updateInvoice, deleteInvoice,
    addPayment, updatePayment,
    addExpense, updateExpense, deleteExpense,
    addBudget, updateBudget, deleteBudget,
  }
})
