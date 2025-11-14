import { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Tag, Modal, Form, Input, message, Space, Tooltip } from 'antd'
import {
  GithubOutlined,
  GitlabOutlined,
  ToolOutlined,
  DockerOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'


type IntegrationStatus = 'connected' | 'disconnected' | 'connecting'

type IntegrationType = 'github' | 'gitlab' | 'jenkins' | 'docker'

interface IntegrationItem {
  id: number
  name: string
  type: IntegrationType
  status: IntegrationStatus
  color: string
  token?: string
  baseUrl?: string
  username?: string
  lastSync?: string
  notes?: string
}

const iconMap: Record<IntegrationType, React.ReactNode> = {
  github: <GithubOutlined />,
  gitlab: <GitlabOutlined />,
  jenkins: <ToolOutlined />,
  docker: <DockerOutlined />,
}

const storageKey = 'integration-settings'

const Integration: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    { id: 1, name: 'GitHub', type: 'github', status: 'connected', color: '#000', lastSync: '刚刚同步', baseUrl: 'https://api.github.com', username: 'demo-user' },
    { id: 2, name: 'GitLab', type: 'gitlab', status: 'disconnected', color: '#FC6D26' },
    { id: 3, name: 'Jenkins', type: 'jenkins', status: 'connected', color: '#D24939', baseUrl: 'https://jenkins.example.com', username: 'jenkins-bot' },
    { id: 4, name: 'Docker Registry', type: 'docker', status: 'connected', color: '#2496ED', baseUrl: 'https://registry.example.com' },
  ])
  const [currentIntegration, setCurrentIntegration] = useState<IntegrationItem | null>(null)
  const [connectModalVisible, setConnectModalVisible] = useState(false)
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as IntegrationItem[]
        setIntegrations(parsed)
      } catch (error) {
        console.warn('解析集成配置失败，将使用默认配置', error)
      }
    }
  }, [])

  const persistIntegrations = (next: IntegrationItem[]) => {
    setIntegrations(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  const openConnectModal = (item: IntegrationItem) => {
    setCurrentIntegration(item)
    form.setFieldsValue({
      baseUrl: item.baseUrl,
      token: item.token,
      username: item.username,
      notes: item.notes,
    })
    setConnectModalVisible(true)
  }

  const openDisconnectModal = (item: IntegrationItem) => {
    setCurrentIntegration(item)
    setDisconnectModalVisible(true)
  }

  const handleConnect = () => {
    form
      .validateFields()
      .then((values) => {
        if (!currentIntegration) return
        const loadingKey = `connect-${currentIntegration.id}`
        message.loading({ content: `正在连接 ${currentIntegration.name}…`, key: loadingKey })
        setTimeout(() => {
          const next = integrations.map((integration) =>
            integration.id === currentIntegration.id
              ? {
                  ...integration,
                  status: 'connected' as IntegrationStatus,
                  token: values.token,
                  baseUrl: values.baseUrl,
                  username: values.username,
                  notes: values.notes,
                  lastSync: '刚刚同步',
                }
              : integration,
          )
          persistIntegrations(next)
          message.success({ content: `${currentIntegration.name} 已成功连接`, key: loadingKey })
          setConnectModalVisible(false)
          form.resetFields()
        }, 1200)
      })
      .catch(() => undefined)
  }

  const handleDisconnect = () => {
    if (!currentIntegration) return
    const loadingKey = `disconnect-${currentIntegration.id}`
    message.loading({ content: `正在断开 ${currentIntegration.name}…`, key: loadingKey })
    setTimeout(() => {
      const next = integrations.map((integration) =>
        integration.id === currentIntegration.id
          ? {
              ...integration,
              status: 'disconnected' as IntegrationStatus,
              token: undefined,
              username: undefined,
              notes: undefined,
              lastSync: undefined,
            }
          : integration,
      )
      persistIntegrations(next)
      message.success({ content: `${currentIntegration.name} 已断开连接`, key: loadingKey })
      setDisconnectModalVisible(false)
      setCurrentIntegration(null)
    }, 800)
  }

  return (
    <Card title="集成管理">
      <Row gutter={16}>
        {integrations.map((item) => (
          <Col span={6} key={item.id} style={{ marginBottom: 16 }}>
            <Card
              hoverable
              style={{
                textAlign: 'center',
                border:
                  item.status === 'connected'
                    ? '2px solid #52c41a'
                    : item.status === 'connecting'
                    ? '2px dashed #faad14'
                    : '1px solid #d9d9d9',
              }}
            >
              <div style={{ fontSize: 48, color: item.color, marginBottom: 16 }}>{iconMap[item.type]}</div>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{item.name}</div>
              <Space size="small" direction="vertical">
                <Tag color={item.status === 'connected' ? 'green' : item.status === 'connecting' ? 'orange' : 'default'}>
                  {item.status === 'connected'
                    ? '已连接'
                    : item.status === 'connecting'
                    ? '连接中…'
                    : '未连接'}
                </Tag>
                {item.lastSync && (
                  <Tag icon={<CheckCircleOutlined />} color="blue">
                    {item.lastSync}
                  </Tag>
                )}
              </Space>
              <div style={{ marginTop: 16 }}>
                {item.status === 'connected' ? (
                  <Tooltip title="断开后将清除本地凭据">
                    <Button danger size="small" onClick={() => openDisconnectModal(item)} icon={<CloseCircleOutlined />}>
                      断开
                    </Button>
                  </Tooltip>
                ) : (
                  <Button type="primary" size="small" onClick={() => openConnectModal(item)}>
                    连接
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={connectModalVisible}
        title={currentIntegration ? `连接 ${currentIntegration.name}` : '连接服务'}
        okText="确认连接"
        onOk={handleConnect}
        onCancel={() => setConnectModalVisible(false)}
        width={520}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="baseUrl"
            label="服务地址"
            rules={[{ required: true, message: '请输入服务地址' }]}
            extra="例如：https://gitlab.example.com 或 Jenkins 服务地址"
          >
            <Input placeholder="https://service.example.com" />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名/账号"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="token"
            label="访问令牌"
            rules={[{ required: true, message: '请输入访问令牌' }]}
            extra="请在目标平台生成个人访问令牌并填入此处。我们仅保存在浏览器本地。"
          >
            <Input.Password placeholder="请输入访问令牌" autoComplete="off" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <Input.TextArea rows={2} placeholder="可描述集成用途或相关说明" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={disconnectModalVisible}
        title={`断开 ${currentIntegration?.name}`}
        okText="断开连接"
        okButtonProps={{ danger: true }}
        onOk={handleDisconnect}
        onCancel={() => setDisconnectModalVisible(false)}
      >
        <p>
          确认要断开与 <strong>{currentIntegration?.name}</strong> 的连接吗？断开后本地保存的访问令牌将被清除，相关自动同步将停止。
        </p>
      </Modal>
    </Card>
  )
}

export default Integration

