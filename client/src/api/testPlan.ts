import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export interface TestPlan {
  id: string
  title: string
  status: 'draft' | 'completed'
  creator: string
  createTime: string
  finalizer?: string
  finalizeTime?: string
}

export const testPlanApi = {
  getList: async (keyword?: string): Promise<TestPlan[]> => {
    const response = await api.get('/test-plans', { params: { keyword } })
    return response.data
  },

  getById: async (id: string): Promise<TestPlan> => {
    const response = await api.get(`/test-plans/${id}`)
    return response.data
  },

  create: async (plan: Omit<TestPlan, 'id' | 'createTime'>): Promise<TestPlan> => {
    const response = await api.post('/test-plans', plan)
    return response.data
  },

  update: async (id: string, plan: Partial<TestPlan>): Promise<TestPlan> => {
    const response = await api.put(`/test-plans/${id}`, plan)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/test-plans/${id}`)
  },
}

