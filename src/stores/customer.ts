import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, Contact, FollowUp } from '../types'
import { mockCustomers, mockContacts, mockFollowUps } from '../mock/data'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([...mockCustomers])
  const contacts = ref<Contact[]>([...mockContacts])
  const followUps = ref<FollowUp[]>([...mockFollowUps])

  const searchKeyword = ref('')
  const filterIndustry = ref('')
  const filterLevel = ref('')
  const filterStatus = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  const filteredCustomers = computed(() => {
    let list = customers.value
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      list = list.filter(c => c.name.includes(kw) || c.contactPerson.includes(kw))
    }
    if (filterIndustry.value) list = list.filter(c => c.industry === filterIndustry.value)
    if (filterLevel.value) list = list.filter(c => c.level === filterLevel.value)
    if (filterStatus.value) list = list.filter(c => c.status === filterStatus.value)
    return list
  })

  const pagedCustomers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredCustomers.value.slice(start, start + pageSize.value)
  })

  const total = computed(() => filteredCustomers.value.length)

  function addCustomer(c: Customer) { customers.value.unshift(c) }
  function updateCustomer(id: string, data: Partial<Customer>) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(customers.value[idx], data)
  }
  function deleteCustomer(id: string) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) customers.value.splice(idx, 1)
  }
  function getCustomerById(id: string): Customer | undefined {
    return customers.value.find(c => c.id === id)
  }

  function getContactsByCustomer(customerId: string): Contact[] {
    return contacts.value.filter(c => c.customerId === customerId)
  }
  function addContact(c: Contact) { contacts.value.unshift(c) }
  function updateContact(id: string, data: Partial<Contact>) {
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) Object.assign(contacts.value[idx], data)
  }
  function deleteContact(id: string) {
    const idx = contacts.value.findIndex(c => c.id === id)
    if (idx !== -1) contacts.value.splice(idx, 1)
  }

  function getFollowUpsByCustomer(customerId: string): FollowUp[] {
    return followUps.value.filter(f => f.customerId === customerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
  function addFollowUp(f: FollowUp) { followUps.value.unshift(f) }

  return {
    customers, contacts, followUps,
    searchKeyword, filterIndustry, filterLevel, filterStatus, currentPage, pageSize,
    filteredCustomers, pagedCustomers, total,
    addCustomer, updateCustomer, deleteCustomer, getCustomerById,
    getContactsByCustomer, addContact, updateContact, deleteContact,
    getFollowUpsByCustomer, addFollowUp,
  }
})
