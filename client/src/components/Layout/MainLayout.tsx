import React, { useState } from 'react'
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Badge,
  Space,
  Modal,
  Form,
  Input,
  Button,
  Tabs,
  Switch,
  Select,
  Upload,
  message,
  Divider,
  Card,
  Descriptions,
  Tag,
  Drawer,
  List,
  Typography,
  Empty,
} from 'antd'
import {
  HomeOutlined,
  SettingOutlined,
  TeamOutlined,
  CodeOutlined,
  ApiOutlined,
  ExperimentOutlined,
  RocketOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  NotificationOutlined,
  GlobalOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import type { MenuProps } from 'antd'
import CustomerServiceWidget from '../CustomerServiceWidget'
import DeepseekAssistant from '../DeepseekAssistant'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const { Text } = Typography

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false)
  const [helpDrawerVisible, setHelpDrawerVisible] = useState(false)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()

  // 从localStorage加载用户数据
  const loadUserInfo = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo)
        return {
          username: parsed.username || 'Demo用户',
          nickname: parsed.nickname || parsed.username || 'Demo用户',
          email: parsed.email || 'demo@testops.com',
          phone: parsed.phone || '13152027756',
          avatar: parsed.avatar || '',
          department: parsed.department || '产品研发',
          role: parsed.role || '测试工程师',
          joinDate: parsed.joinDate || '2024-01-15',
          lastLogin: parsed.lastLogin || new Date().toLocaleString('zh-CN'),
          status: parsed.status || 'active',
        }
      } catch (e) {
        console.error('Failed to parse userInfo:', e)
      }
    }
    return {
      username: 'Demo用户',
      nickname: 'Demo用户',
      email: 'demo@testops.com',
      phone: '13152027756',
      avatar: '',
      department: '产品研发',
      role: '测试工程师',
      joinDate: '2024-01-15',
      lastLogin: new Date().toLocaleString('zh-CN'),
      status: 'active',
    }
  }

  const [userInfo, setUserInfo] = useState(loadUserInfo())

  const [settings, setSettings] = useState({
    emailNotification: true,
    smsNotification: false,
    systemNotification: true,
    testReportNotification: true,
    language: 'zh-CN',
    theme: 'light',
    autoSave: true,
  })

  // 模拟通知数据
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success',
      title: '测试执行完成',
      content: 'API接口测试方案执行完成，共执行120个用例，通过115个',
      time: '2分钟前',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: '新任务分配',
      content: '您被分配到"用户登录功能测试"任务，请及时查看',
      time: '1小时前',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: '测试环境告警',
      content: '测试环境CPU使用率超过80%，请关注',
      time: '3小时前',
      read: false,
    },
    {
      id: '4',
      type: 'info',
      title: '代码合并请求',
      content: 'feature/user-login分支有新的合并请求需要您审核',
      time: '5小时前',
      read: true,
    },
    {
      id: '5',
      type: 'success',
      title: '部署成功',
      content: '生产环境v1.2.3版本部署成功',
      time: '1天前',
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = (notification: any) => {
    // 标记为已读
    setNotifications(
      notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    )
    message.info(`查看通知: ${notification.title}`)
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    message.success('已全部标记为已读')
  }

  const handleClearAll = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有通知吗？',
      onOk: () => {
        setNotifications([])
        message.success('已清空所有通知')
      },
    })
  }

  const menuItems: MenuProps['items'] = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/management',
      icon: <SettingOutlined />,
      label: '管理',
    },
    {
      key: '/collaboration',
      icon: <TeamOutlined />,
      label: '协作',
    },
    {
      key: '/code-repository',
      icon: <CodeOutlined />,
      label: '代码库',
    },
    {
      key: '/integration',
      icon: <ApiOutlined />,
      label: '集成',
    },
    {
      key: 'test',
      icon: <ExperimentOutlined />,
      label: '测试',
      children: [
        {
          key: '/test/overview',
          label: '测试概况',
        },
        {
          key: '/test/plans',
          label: '测试方案',
        },
        {
          key: '/test/case-design',
          label: '用例设计',
        },
        {
          key: '/test/execution',
          label: '测试执行',
        },
        {
          key: '/test/report',
          label: '测试报告',
        },
        {
          key: '/test/progress',
          label: '测试进度',
        },
        {
          key: '/test/historical-reports',
          label: '历史报告',
        },
        {
          type: 'divider',
        },
        {
          key: '/test/ui-test',
          label: 'UI测试',
        },
        {
          key: '/test/api-test',
          label: '接口测试',
        },
        {
          key: '/test/jmeter-test',
          label: 'JMETER',
        },
      ],
    },
    {
      key: '/artifacts',
      icon: <DatabaseOutlined />,
      label: '制品',
    },
    {
      key: '/deployment',
      icon: <RocketOutlined />,
      label: '部署',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'profile') {
      setProfileModalVisible(true)
      profileForm.setFieldsValue(userInfo)
    } else if (key === 'logout') {
      Modal.confirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          // 清除登录状态
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('userInfo')
          message.success('已退出登录')
          // 跳转到登录页
          navigate('/login')
        },
      })
    }
  }

  const handleProfileSubmit = () => {
    profileForm.validateFields().then((values) => {
      setUserInfo({ ...userInfo, ...values })
      message.success('个人信息更新成功')
      setProfileModalVisible(false)
    })
  }

  const handlePasswordSubmit = () => {
    passwordForm.validateFields().then((values) => {
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致')
        return
      }
      message.success('密码修改成功')
      passwordForm.resetFields()
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value })
    message.success('设置已更新')
  }

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path.startsWith('/test')) {
      return [path]
    }
    return [path]
  }

  const getOpenKeys = () => {
    if (location.pathname.startsWith('/test')) {
      return ['test']
    }
    return []
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: collapsed ? 14 : 18,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? 'DevOps' : 'TestOps一站式'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Space>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: 18 },
            })}
            <Dropdown
              menu={{
                items: [
                  { key: 'project1', label: 'Demo-产品研发' },
                  { key: 'project2', label: '项目2' },
                  { key: 'project3', label: '项目3' },
                ],
              }}
            >
              <span style={{ cursor: 'pointer', fontSize: 16, fontWeight: 500 }}>
                Demo-产品研发
              </span>
            </Dropdown>
          </Space>
          <Space size="large">
            <DeepseekAssistant />
            <Badge count={unreadCount} size="small">
              <BellOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
                onClick={() => setNotificationDrawerVisible(true)}
              />
            </Badge>
            <QuestionCircleOutlined
              style={{ fontSize: 18, cursor: 'pointer' }}
              onClick={() => setHelpDrawerVisible(true)}
            />
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={userInfo.avatar} />
                <span>{userInfo.username}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
      <CustomerServiceWidget />

      {/* 个人设置模态框 */}
      <Modal
        title="个人中心"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: (
                <span>
                  <UserOutlined />
                  个人信息
                </span>
              ),
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Card
                    style={{ marginBottom: 24 }}
                    title={
                      <Space>
                        <UserOutlined />
                        <span>基本信息</span>
                      </Space>
                    }
                  >
                    <Form
                      form={profileForm}
                      layout="vertical"
                      onFinish={handleProfileSubmit}
                    >
                      <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Space direction="vertical" size="large">
                          <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            src={userInfo.avatar}
                            style={{ border: '3px solid #1890ff' }}
                          />
                          <div>
                            <Upload
                              showUploadList={false}
                              beforeUpload={() => false}
                              onChange={(info) => {
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                  setUserInfo({ ...userInfo, avatar: e.target?.result as string })
                                }
                                reader.readAsDataURL(info.file as any)
                              }}
                            >
                              <Button icon={<CameraOutlined />}>更换头像</Button>
                            </Upload>
                          </div>
                        </Space>
                      </div>

                      <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                      </Form.Item>

                      <Form.Item
                        label="昵称"
                        name="nickname"
                        rules={[{ required: true, message: '请输入昵称' }]}
                      >
                        <Input prefix={<EditOutlined />} placeholder="请输入昵称" />
                      </Form.Item>

                      <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                          { required: true, message: '请输入邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                      </Form.Item>

                      <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                          { required: true, message: '请输入手机号' },
                          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                        ]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                          保存修改
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>

                  <Card
                    title={
                      <Space>
                        <SafetyOutlined />
                        <span>账户信息</span>
                      </Space>
                    }
                  >
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="部门">{userInfo.department}</Descriptions.Item>
                      <Descriptions.Item label="角色">
                        <Tag color="blue">{userInfo.role}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="加入时间">{userInfo.joinDate}</Descriptions.Item>
                      <Descriptions.Item label="最后登录">{userInfo.lastLogin}</Descriptions.Item>
                      <Descriptions.Item label="账户状态">
                        <Tag color={userInfo.status === 'active' ? 'green' : 'red'}>
                          {userInfo.status === 'active' ? '正常' : '禁用'}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </div>
              ),
            },
            {
              key: 'password',
              label: (
                <span>
                  <LockOutlined />
                  修改密码
                </span>
              ),
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Card
                    title={
                      <Space>
                        <LockOutlined />
                        <span>安全设置</span>
                      </Space>
                    }
                  >
                    <Form
                      form={passwordForm}
                      layout="vertical"
                      onFinish={handlePasswordSubmit}
                    >
                      <Form.Item
                        label="当前密码"
                        name="currentPassword"
                        rules={[{ required: true, message: '请输入当前密码' }]}
                      >
                        <Input.Password placeholder="请输入当前密码" />
                      </Form.Item>

                      <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                          { required: true, message: '请输入新密码' },
                          { min: 6, message: '密码长度至少6位' },
                        ]}
                      >
                        <Input.Password placeholder="请输入新密码（至少6位）" />
                      </Form.Item>

                      <Form.Item
                        label="确认新密码"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: '请确认新密码' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('两次输入的密码不一致'))
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="请再次输入新密码" />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                          修改密码
                        </Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </div>
              ),
            },
            {
              key: 'settings',
              label: (
                <span>
                  <SettingOutlined />
                  偏好设置
                </span>
              ),
              children: (
                <div style={{ padding: '20px 0' }}>
                  <Card
                    title={
                      <Space>
                        <NotificationOutlined />
                        <span>通知设置</span>
                      </Space>
                    }
                    style={{ marginBottom: 24 }}
                  >
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>邮件通知</div>
                            <div style={{ color: '#999', fontSize: 12 }}>接收重要通知和报告</div>
                          </div>
                          <Switch
                            checked={settings.emailNotification}
                            onChange={(checked) => handleSettingChange('emailNotification', checked)}
                          />
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>短信通知</div>
                            <div style={{ color: '#999', fontSize: 12 }}>接收紧急通知</div>
                          </div>
                          <Switch
                            checked={settings.smsNotification}
                            onChange={(checked) => handleSettingChange('smsNotification', checked)}
                          />
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>系统通知</div>
                            <div style={{ color: '#999', fontSize: 12 }}>接收系统消息和提醒</div>
                          </div>
                          <Switch
                            checked={settings.systemNotification}
                            onChange={(checked) => handleSettingChange('systemNotification', checked)}
                          />
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>测试报告通知</div>
                            <div style={{ color: '#999', fontSize: 12 }}>测试完成后自动通知</div>
                          </div>
                          <Switch
                            checked={settings.testReportNotification}
                            onChange={(checked) => handleSettingChange('testReportNotification', checked)}
                          />
                        </div>
                      </Space>
                    </Card>

                    <Card
                      title={
                        <Space>
                          <GlobalOutlined />
                          <span>系统设置</span>
                        </Space>
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>语言设置</div>
                            <div style={{ color: '#999', fontSize: 12 }}>选择界面显示语言</div>
                          </div>
                          <Select
                            value={settings.language}
                            onChange={(value) => handleSettingChange('language', value)}
                            style={{ width: 120 }}
                          >
                            <Select.Option value="zh-CN">简体中文</Select.Option>
                            <Select.Option value="zh-TW">繁体中文</Select.Option>
                            <Select.Option value="en-US">English</Select.Option>
                          </Select>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>主题设置</div>
                            <div style={{ color: '#999', fontSize: 12 }}>选择界面主题</div>
                          </div>
                          <Select
                            value={settings.theme}
                            onChange={(value) => handleSettingChange('theme', value)}
                            style={{ width: 120 }}
                          >
                            <Select.Option value="light">浅色</Select.Option>
                            <Select.Option value="dark">深色</Select.Option>
                            <Select.Option value="auto">跟随系统</Select.Option>
                          </Select>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>自动保存</div>
                            <div style={{ color: '#999', fontSize: 12 }}>编辑内容时自动保存</div>
                          </div>
                          <Switch
                            checked={settings.autoSave}
                            onChange={(checked) => handleSettingChange('autoSave', checked)}
                          />
                        </div>
                      </Space>
                    </Card>
                  </div>
                ),
            },
          ]}
        />
      </Modal>

      {/* 通知抽屉 */}
      <Drawer
        title={
          <Space>
            <BellOutlined />
            <span>通知中心</span>
            <Badge count={unreadCount} size="small" />
          </Space>
        }
        placement="right"
        width={420}
        open={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
        extra={
          <Space>
            {unreadCount > 0 && (
              <Button type="link" size="small" onClick={handleMarkAllRead}>
                全部已读
              </Button>
            )}
            {notifications.length > 0 && (
              <Button type="link" size="small" danger onClick={handleClearAll}>
                清空
              </Button>
            )}
          </Space>
        }
      >
        {notifications.length === 0 ? (
          <Empty description="暂无通知" />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => {
              const getIcon = () => {
                switch (item.type) {
                  case 'success':
                    return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                  case 'warning':
                    return <WarningOutlined style={{ color: '#faad14', fontSize: 20 }} />
                  case 'info':
                  default:
                    return <InfoCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />
                }
              }

              return (
                <List.Item
                  style={{
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: item.read ? '#fff' : '#f6ffed',
                    borderRadius: 8,
                    marginBottom: 8,
                    paddingLeft: 12,
                    paddingRight: 12,
                  }}
                  onClick={() => handleNotificationClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = item.read ? '#fff' : '#f6ffed'
                  }}
                >
                  <List.Item.Meta
                    avatar={getIcon()}
                    title={
                      <Space>
                        <Text strong={!item.read}>{item.title}</Text>
                        {!item.read && (
                          <Badge dot style={{ backgroundColor: '#1890ff' }} />
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.content}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )
            }}
          />
        )}
      </Drawer>

      {/* 帮助抽屉 */}
      <Drawer
        title={
          <Space>
            <QuestionCircleOutlined />
            <span>帮助中心</span>
          </Space>
        }
        placement="right"
        width={480}
        open={helpDrawerVisible}
        onClose={() => setHelpDrawerVisible(false)}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 快速开始 */}
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>快速开始</span>
              </Space>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={[
                { title: '平台介绍', desc: '了解TestOps平台的核心功能' },
                { title: '创建项目', desc: '学习如何创建和管理项目' },
                { title: '编写测试用例', desc: '掌握测试用例设计方法' },
                { title: '执行测试', desc: '了解如何执行测试并查看报告' },
              ]}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '8px 12px' }}
                  onClick={() => message.info(`查看: ${item.title}`)}
                >
                  <List.Item.Meta
                    title={<Text>{item.title}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{item.desc}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 常见问题 */}
          <Card
            title={
              <Space>
                <FileTextOutlined />
                <span>常见问题</span>
              </Space>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={[
                {
                  q: '如何创建测试方案？',
                  a: '在测试菜单下选择"测试方案"，点击"新建"按钮即可创建新的测试方案。',
                },
                {
                  q: '如何执行自动化测试？',
                  a: '在UI测试或接口测试页面，创建测试脚本后点击"执行"按钮即可运行测试。',
                },
                {
                  q: '如何查看测试报告？',
                  a: '测试执行完成后，在"测试报告"页面可以查看详细的测试结果和统计信息。',
                },
                {
                  q: '如何集成外部工具？',
                  a: '在"集成"页面，可以连接GitHub、GitLab、Jenkins等外部工具，实现CI/CD流程。',
                },
              ]}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px' }}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text strong style={{ color: '#1890ff' }}>
                      Q: {item.q}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13, marginLeft: 16 }}>
                      A: {item.a}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          {/* 视频教程 */}
          <Card
            title={
              <Space>
                <VideoCameraOutlined />
                <span>视频教程</span>
              </Space>
            }
            size="small"
          >
            <List
              size="small"
              dataSource={[
                { title: '平台概览', duration: '5分钟' },
                { title: '测试用例设计', duration: '10分钟' },
                { title: '自动化测试', duration: '15分钟' },
                { title: 'CI/CD集成', duration: '12分钟' },
              ]}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '8px 12px' }}
                  onClick={() => message.info(`播放视频: ${item.title}`)}
                >
                  <List.Item.Meta
                    title={<Text>{item.title}</Text>}
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        时长: {item.duration}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* 联系方式 */}
          <Card
            title={
              <Space>
                <InfoCircleOutlined />
                <span>获取帮助</span>
              </Space>
            }
            size="small"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>在线客服</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  电话: 13152027756
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  邮箱: testops_jianshuai@126.com
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  QQ: 1170527913
                </Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Button
                type="primary"
                block
                onClick={() => {
                  setHelpDrawerVisible(false)
                  // 可以触发客服组件
                  message.info('正在为您转接客服...')
                }}
              >
                联系客服
              </Button>
            </Space>
          </Card>
        </Space>
      </Drawer>
    </Layout>
  )
}

export default MainLayout

