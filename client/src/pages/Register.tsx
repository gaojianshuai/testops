import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Space, Typography, Divider, Checkbox } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GithubOutlined,
  WechatOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import './Login.css'

const { Title, Text } = Typography

interface RegisterFormValues {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agree: boolean
}

const Register: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 如果已登录，自动跳转
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  // 粒子动画效果（复用登录页面的动画）
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

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true)
    try {
      // 模拟注册请求
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 检查用户名是否已存在（模拟）
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      if (existingUsers.some((u: any) => u.username === values.username)) {
        message.error('用户名已存在，请更换')
        setLoading(false)
        return
      }

      if (existingUsers.some((u: any) => u.email === values.email)) {
        message.error('邮箱已被注册，请更换')
        setLoading(false)
        return
      }

      // 保存注册信息
      const newUser = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password, // 实际应用中应该加密
        registerTime: new Date().toISOString(),
      }
      existingUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))

      message.success('注册成功！正在跳转到登录页...')
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        navigate('/login', { state: { username: values.username } })
      }, 1000)
    } catch (error) {
      message.error('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

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
              加入我们，开启测试之旅
            </Title>
            <div className="brand-features">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="feature-item">
                  <CheckCircleOutlined className="feature-icon" />
                  <div>
                    <Text strong>免费注册</Text>
                    <br />
                    <Text type="secondary">立即开始使用，无需付费</Text>
                  </div>
                </div>
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
                    <Text strong>功能强大</Text>
                    <br />
                    <Text type="secondary">一站式测试开发平台</Text>
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
                创建账户
              </Title>
              <Text type="secondary">填写以下信息完成注册</Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              layout="vertical"
              scrollToFirstError
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 20, message: '用户名最多20个字符' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名（3-20个字符）"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱地址"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' },
                  { max: 20, message: '密码最多20个字符' },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码（至少6位）"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'))
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  style={{ height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议和隐私政策')),
                  },
                ]}
              >
                <Checkbox>
                  我已阅读并同意
                  <Button type="link" style={{ padding: 0, height: 'auto' }}>
                    《用户协议》
                  </Button>
                  和
                  <Button type="link" style={{ padding: 0, height: 'auto' }}>
                    《隐私政策》
                  </Button>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{ height: 48, fontSize: 16, fontWeight: 500 }}
                >
                  立即注册
                </Button>
              </Form.Item>
            </Form>

            <Divider>或</Divider>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button
                icon={<GithubOutlined />}
                block
                style={{ height: 44 }}
                onClick={() => message.info('GitHub注册功能开发中')}
              >
                使用 GitHub 注册
              </Button>
              <Button
                icon={<WechatOutlined />}
                block
                style={{ height: 44 }}
                onClick={() => message.info('微信注册功能开发中')}
              >
                使用微信注册
              </Button>
            </Space>

            <div className="login-footer">
              <Text type="secondary">
                已有账户？ <Link to="/login">立即登录</Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Register

