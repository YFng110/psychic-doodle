import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref({
    id: 'U-0001',
    name: '管理员',
    role: 'admin',
    avatar: '',
  })

  return { currentUser }
})
