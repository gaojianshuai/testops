import { v4 as uuidv4 } from 'uuid'

export interface TestPlan {
  id: string
  title: string
  status: 'draft' | 'completed'
  creator: string
  createTime: string
  finalizer?: string
  finalizeTime?: string
}

export class TestPlanService {
  private plans: TestPlan[] = [
    {
      id: '1',
      title: 'COM-CTest测试方案',
      status: 'completed',
      creator: 'Demo用户',
      createTime: '2022-11-16T16:57:30',
      finalizer: 'Demo用户',
      finalizeTime: '2022-11-16T16:59:52',
    },
    {
      id: '2',
      title: 'DOM-cTest测试方案',
      status: 'draft',
      creator: 'Demo用户',
      createTime: '2022-11-16T16:57:08',
    },
    {
      id: '3',
      title: '【5.0】测试方案',
      status: 'completed',
      creator: 'Demo用户',
      createTime: '2022-11-16T15:47:53',
      finalizer: 'Demo用户',
      finalizeTime: '2022-11-16T16:57:38',
    },
  ]

  getList(keyword?: string): TestPlan[] {
    let result = [...this.plans]
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      result = result.filter(
        (plan) =>
          plan.title.toLowerCase().includes(lowerKeyword) ||
          plan.creator.toLowerCase().includes(lowerKeyword)
      )
    }
    return result
  }

  getById(id: string): TestPlan | undefined {
    return this.plans.find((plan) => plan.id === id)
  }

  create(data: Omit<TestPlan, 'id' | 'createTime'>): TestPlan {
    const newPlan: TestPlan = {
      id: uuidv4(),
      ...data,
      createTime: new Date().toISOString(),
    }
    this.plans.push(newPlan)
    return newPlan
  }

  update(id: string, data: Partial<TestPlan>): TestPlan | undefined {
    const index = this.plans.findIndex((plan) => plan.id === id)
    if (index === -1) {
      return undefined
    }
    this.plans[index] = { ...this.plans[index], ...data }
    return this.plans[index]
  }

  delete(id: string): boolean {
    const index = this.plans.findIndex((plan) => plan.id === id)
    if (index === -1) {
      return false
    }
    this.plans.splice(index, 1)
    return true
  }
}

