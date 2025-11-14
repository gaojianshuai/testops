import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { testPlansRouter } from './routes/testPlans.js'

const app = express()
const PORT = 3001

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 路由
app.use('/api/test-plans', testPlansRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DevOps Platform API is running' })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在', path: req.path })
})

// 错误处理中间件（必须在所有路由之后）
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err)
  console.error('错误堆栈:', err?.stack)
  res.status(500).json({ 
    error: '服务器内部错误',
    message: err?.message || '未知错误',
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

