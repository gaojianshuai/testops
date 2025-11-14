import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { TestPlanService } from '../services/testPlanService.js'

const router = express.Router()
const testPlanService = new TestPlanService()

// 获取测试方案列表
router.get('/', (req, res) => {
  try {
    console.log('收到获取测试方案列表请求')
    const keyword = req.query.keyword as string | undefined
    console.log('搜索关键字:', keyword)
    const plans = testPlanService.getList(keyword)
    console.log('返回测试方案数量:', plans.length)
    res.json(plans)
  } catch (error: any) {
    console.error('获取测试方案列表失败:', error)
    console.error('错误堆栈:', error?.stack)
    res.status(500).json({ 
      error: '获取测试方案列表失败',
      message: error?.message || '未知错误',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    })
  }
})

// 获取单个测试方案
router.get('/:id', (req, res) => {
  try {
    const plan = testPlanService.getById(req.params.id)
    if (!plan) {
      return res.status(404).json({ error: '测试方案不存在' })
    }
    res.json(plan)
  } catch (error) {
    res.status(500).json({ error: '获取测试方案失败' })
  }
})

// 创建测试方案
router.post('/', (req, res) => {
  try {
    const plan = testPlanService.create(req.body)
    res.status(201).json(plan)
  } catch (error) {
    res.status(500).json({ error: '创建测试方案失败' })
  }
})

// 更新测试方案
router.put('/:id', (req, res) => {
  try {
    const plan = testPlanService.update(req.params.id, req.body)
    if (!plan) {
      return res.status(404).json({ error: '测试方案不存在' })
    }
    res.json(plan)
  } catch (error) {
    res.status(500).json({ error: '更新测试方案失败' })
  }
})

// 删除测试方案
router.delete('/:id', (req, res) => {
  try {
    const success = testPlanService.delete(req.params.id)
    if (!success) {
      return res.status(404).json({ error: '测试方案不存在' })
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: '删除测试方案失败' })
  }
})

export { router as testPlansRouter }

