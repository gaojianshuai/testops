import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Select, Input, message, Popconfirm } from 'antd'
import { RocketOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Deployment {
  id: string
  name: string
  environment: 'dev' | 'test' | 'prod'
  version: string
  status: 'running' | 'stopped' | 'deploying' | 'failed'
  deployTime: string
}

const Deployment: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: '1',
      name: '生产环境部署',
      environment: 'prod',
      version: 'v1.0.0',
      status: 'running',
      deployTime: '2024-01-15T10:00:00',
    },
    {
      id: '2',
      name: '测试环境部署',
      environment: 'test',
      version: 'v1.0.1',
      status: 'stopped',
      deployTime: '2024-01-14T15:30:00',
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const handleCreate = () => {
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newDeployment: Deployment = {
        id: Date.now().toString(),
        ...values,
        status: 'stopped',
        deployTime: '',
      }
      setDeployments([...deployments, newDeployment])
      message.success('创建部署成功')
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const handleDeploy = (id: string) => {
    setDeployments(
      deployments.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'deploying',
              deployTime: new Date().toISOString(),
            }
          : item
      )
    )
    message.info('开始部署...')
    // 模拟部署过程
    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'running',
              }
            : item
        )
      )
      message.success('部署成功')
    }, 3000)
  }

  const handleStop = (id: string) => {
    setDeployments(
      deployments.map((item) => (item.id === id ? { ...item, status: 'stopped' } : item))
    )
    message.success('已停止部署')
  }

  const columns: ColumnsType<Deployment> = [
    {
      title: '部署名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      render: (env: string) => {
        const envMap = {
          dev: { color: 'blue', text: '开发' },
          test: { color: 'orange', text: '测试' },
          prod: { color: 'red', text: '生产' },
        }
        const e = envMap[env as keyof typeof envMap]
        return <Tag color={e.color}>{e.text}</Tag>
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          running: { color: 'success', text: '运行中' },
          stopped: { color: 'default', text: '已停止' },
          deploying: { color: 'processing', text: '部署中' },
          failed: { color: 'error', text: '失败' },
        }
        const s = statusMap[status as keyof typeof statusMap]
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '部署时间',
      dataIndex: 'deployTime',
      key: 'deployTime',
      render: (time: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'running' ? (
            <Popconfirm
              title="确定要停止部署吗？"
              onConfirm={() => handleStop(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button icon={<StopOutlined />} size="small" danger>
                停止
              </Button>
            </Popconfirm>
          ) : (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              size="small"
              onClick={() => handleDeploy(record.id)}
              disabled={record.status === 'deploying'}
            >
              部署
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<RocketOutlined />} onClick={handleCreate}>
          新建部署
        </Button>
      </div>
      <Table columns={columns} dataSource={deployments} rowKey="id" />

      <Modal
        title="新建部署"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="部署名称" rules={[{ required: true, message: '请输入部署名称' }]}>
            <Input placeholder="请输入部署名称" />
          </Form.Item>
          <Form.Item name="environment" label="环境" rules={[{ required: true, message: '请选择环境' }]}>
            <Select placeholder="请选择环境">
              <Select.Option value="dev">开发环境</Select.Option>
              <Select.Option value="test">测试环境</Select.Option>
              <Select.Option value="prod">生产环境</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="version" label="版本" rules={[{ required: true, message: '请输入版本号' }]}>
            <Input placeholder="例如：v1.0.0" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Deployment
