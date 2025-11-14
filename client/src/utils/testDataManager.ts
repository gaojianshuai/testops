/**
 * 测试数据管理器
 * 统一管理各测试页面的执行数据，供测试报告使用
 */

export interface TestExecutionRecord {
  id: string
  testType: 'api' | 'ui' | 'case' | 'jmeter'
  testName: string
  status: 'passed' | 'failed' | 'error' | 'skipped' | 'running'
  executionTime: number // 执行耗时（毫秒）
  startTime: string
  endTime?: string
  module?: string
  method?: string
  description?: string
  errorMessage?: string
  responseTime?: number
  statusCode?: number
  passRate?: number
}

interface TestDataStorage {
  executions: TestExecutionRecord[]
  lastUpdateTime: string
}

const STORAGE_KEY = 'test_execution_data'

/**
 * 获取所有测试执行记录
 */
export const getTestExecutions = (): TestExecutionRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const storage: TestDataStorage = JSON.parse(data)
      return storage.executions || []
    }
  } catch (error) {
    console.error('获取测试执行记录失败:', error)
  }
  return []
}

/**
 * 保存测试执行记录
 */
export const saveTestExecution = (record: TestExecutionRecord): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    let storage: TestDataStorage = { executions: [], lastUpdateTime: new Date().toISOString() }
    
    if (data) {
      storage = JSON.parse(data)
    }
    
    // 检查是否已存在，如果存在则更新，否则添加
    const existingIndex = storage.executions.findIndex((e) => e.id === record.id)
    if (existingIndex >= 0) {
      storage.executions[existingIndex] = record
    } else {
      storage.executions.push(record)
    }
    
    storage.lastUpdateTime = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  } catch (error) {
    console.error('保存测试执行记录失败:', error)
  }
}

/**
 * 批量保存测试执行记录
 */
export const saveTestExecutions = (records: TestExecutionRecord[]): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    let storage: TestDataStorage = { executions: [], lastUpdateTime: new Date().toISOString() }
    
    if (data) {
      storage = JSON.parse(data)
    }
    
    records.forEach((record) => {
      const existingIndex = storage.executions.findIndex((e) => e.id === record.id)
      if (existingIndex >= 0) {
        storage.executions[existingIndex] = record
      } else {
        storage.executions.push(record)
      }
    })
    
    storage.lastUpdateTime = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  } catch (error) {
    console.error('批量保存测试执行记录失败:', error)
  }
}

/**
 * 删除测试执行记录
 */
export const deleteTestExecution = (id: string): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const storage: TestDataStorage = JSON.parse(data)
      storage.executions = storage.executions.filter((e) => e.id !== id)
      storage.lastUpdateTime = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    }
  } catch (error) {
    console.error('删除测试执行记录失败:', error)
  }
}

/**
 * 获取统计数据
 */
export const getTestStatistics = () => {
  const executions = getTestExecutions()
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // 只统计今天的执行记录
  const todayExecutions = executions.filter((e) => {
    const execTime = new Date(e.startTime)
    return execTime >= todayStart
  })
  
  const total = todayExecutions.length
  const passed = todayExecutions.filter((e) => e.status === 'passed').length
  const failed = todayExecutions.filter((e) => e.status === 'failed').length
  const error = todayExecutions.filter((e) => e.status === 'error').length
  const skipped = todayExecutions.filter((e) => e.status === 'skipped').length
  const running = todayExecutions.filter((e) => e.status === 'running').length
  
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00'
  
  // 计算总执行时间
  const totalDuration = todayExecutions.reduce((sum, e) => {
    if (e.endTime && e.startTime) {
      return sum + (new Date(e.endTime).getTime() - new Date(e.startTime).getTime())
    }
    return sum + (e.executionTime || 0)
  }, 0)
  
  return {
    total,
    passed,
    failed,
    error,
    skipped,
    running,
    passRate: parseFloat(passRate),
    totalDuration: totalDuration / 1000, // 转换为秒
    startTime: todayExecutions.length > 0 
      ? todayExecutions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0].startTime
      : new Date().toISOString(),
    executions: todayExecutions,
  }
}

/**
 * 获取历史构建数据（最近7天）
 */
export const getHistoricalBuilds = (): Array<{
  executionTime: string
  totalCases: number
  successfulCases: number
  passRate: number
}> => {
  const executions = getTestExecutions()
  const now = new Date()
  const historicalData: Array<{
    executionTime: string
    totalCases: number
    successfulCases: number
    passRate: number
  }> = []
  
  // 获取最近7天的数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    
    const dayExecutions = executions.filter((e) => {
      const execTime = new Date(e.startTime)
      return execTime >= date && execTime < nextDate
    })
    
    const total = dayExecutions.length
    const successful = dayExecutions.filter((e) => e.status === 'passed').length
    const passRate = total > 0 ? parseFloat(((successful / total) * 100).toFixed(2)) : 0
    
    historicalData.push({
      executionTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 12:00:00`,
      totalCases: total,
      successfulCases: successful,
      passRate,
    })
  }
  
  return historicalData
}

/**
 * 监听数据变化
 */
export const subscribeToTestData = (callback: () => void): (() => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback()
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // 返回取消订阅的函数
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}

