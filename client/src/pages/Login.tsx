import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Space, Typography, Divider, Checkbox } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GithubOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import './Login.css'

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
  remember?: boolean
}

const Login: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // 如果已登录，自动跳转
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  // 如果从注册页跳转过来，自动填充用户名
  useEffect(() => {
    const state = location.state as { username?: string } | null
    if (state?.username) {
      form.setFieldsValue({ username: state.username })
      message.success('注册成功，请登录')
    }
  }, [location, form])

  // 粒子动画效果
  useEffect(() => {
    const canvas = document.getElementById('particles') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      opacity: number
    }> = []

    // 创建粒子
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(24, 144, 255, ${particle.opacity})`
        ctx.fill()

        // 连线
        particles.slice(i + 1).forEach((p2) => {
          const dx = particle.x - p2.x
          const dy = particle.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(24, 144, 255, ${0.2 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 验证用户名和密码（演示用，实际应该调用API）
      if (values.username && values.password) {
        // 保存登录状态
        const userInfo = {
          username: values.username,
          nickname: values.username,
          token: `token_${Date.now()}`,
          loginTime: new Date().toISOString(),
          lastLogin: new Date().toLocaleString('zh-CN'),
        }
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        localStorage.setItem('isAuthenticated', 'true')

        if (values.remember) {
          localStorage.setItem('rememberedUsername', values.username)
        } else {
          localStorage.removeItem('rememberedUsername')
        }

        message.success('登录成功！')
        navigate('/home')
      } else {
        message.error('请输入用户名和密码')
      }
    } catch (error) {
      message.error('登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 加载记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername')
    if (rememberedUsername) {
      form.setFieldsValue({ username: rememberedUsername, remember: true })
    }
  }, [form])

  return (
    <div className="login-container">
      <canvas id="particles" className="particles-canvas" />
      <div className="login-content">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-icon">
              <ThunderboltOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </div>
            <Title level={1} className="brand-title">
              TestOps
            </Title>
            <Title level={3} className="brand-subtitle">
              一站式测试开发平台
            </Title>
            <div className="brand-features">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="feature-item">
                  <SafetyOutlined className="feature-icon" />
                  <div>
                    <Text strong>安全可靠</Text>
                    <br />
                    <Text type="secondary">企业级安全保障</Text>
                  </div>
                </div>
                <div className="feature-item">
                  <ThunderboltOutlined className="feature-icon" />
                  <div>
                    <Text strong>高效协同</Text>
                    <br />
                    <Text type="secondary">团队协作更高效</Text>
                  </div>
                </div>
                <div className="feature-item">
                  <ThunderboltOutlined className="feature-icon" />
                  <div>
                    <Text strong>智能测试</Text>
                    <br />
                    <Text type="secondary">自动化测试全覆盖</Text>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </div>

        <div className="login-right">
          <Card className="login-card" bordered={false}>
            <div className="login-header">
              <Title level={2} style={{ marginBottom: 8 }}>
                欢迎回来
              </Title>
              <Text type="secondary">请登录您的账户以继续</Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="用户名"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  <Button type="link" style={{ padding: 0 }}>
                    忘记密码？
                  </Button>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: 48, fontSize: 16, fontWeight: 500 }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <Divider>或</Divider>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button
                icon={<GithubOutlined />}
                block
                style={{ height: 44 }}
                onClick={() => message.info('GitHub登录功能开发中')}
              >
                使用 GitHub 登录
              </Button>
              <Button
                icon={<WechatOutlined />}
                block
                style={{ height: 44 }}
                onClick={() => message.info('微信登录功能开发中')}
              >
                使用微信登录
              </Button>
            </Space>

            <div className="login-footer">
              <Text type="secondary">
                还没有账户？ <Link to="/register">立即注册</Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login

