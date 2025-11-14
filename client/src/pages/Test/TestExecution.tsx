import { useState } from 'react'
import { Table, Button, Space, Tag, Card, Select, Modal, Form, Input, message, Progress } from 'antd'
import { PlayCircleOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Execution {
  id: string
  planName: string
  status: 'running' | 'completed' | 'failed' | 'pending'
  progress: number
  startTime: string
  executor: string
}

const TestExecution: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([
    {
      id: '1',
      planName: 'COM-CTest测试方案',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15T10:00:00',
      executor: 'Demo用户',
    },
    {
      id: '2',
      planName: 'DOM-cTest测试方案',
      status: 'running',
      progress: 65,
      startTime: '2024-01-15T14:30:00',
      executor: 'Demo用户',
    },
    {
      id: '3',
      planName: '【5.0】测试方案',
      status: 'pending',
      progress: 0,
      startTime: '',
      executor: '',
    },
  ])
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  const filteredExecutions = statusFilter
    ? executions.filter((item) => item.status === statusFilter)
    : executions

  const handleCreate = () => {
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newExecution: Execution = {
        id: Date.now().toString(),
        planName: values.planName,
        status: 'pending',
        progress: 0,
        startTime: '',
        executor: 'Demo用户',
      }
      setExecutions([...executions, newExecution])
      message.success('创建执行任务成功')
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const handleExecute = (id: string) => {
    setExecutions(
      executions.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'running',
              progress: 0,
              startTime: new Date().toISOString(),
            }
          : item
      )
    )
    message.success('开始执行测试')
    // 模拟进度更新
    const interval = setInterval(() => {
      setExecutions((prev) => {
        const updated = prev.map((item) => {
          if (item.id === id && item.status === 'running' && item.progress < 100) {
            const newProgress = Math.min(item.progress + 10, 100)
            return {
              ...item,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : item.status,
            }
          }
          return item
        })
        const item = updated.find((i) => i.id === id)
        if (item && item.progress === 100) {
          clearInterval(interval)
        }
        return updated
      })
    }, 1000)
  }

  const handlePause = (id: string) => {
    setExecutions(
      executions.map((item) => (item.id === id ? { ...item, status: 'pending' } : item))
    )
    message.info('已暂停执行')
  }

  const columns: ColumnsType<Execution> = [
    {
      title: '测试计划',
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          running: { color: 'processing', text: '执行中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
          pending: { color: 'default', text: '待执行' },
        }
        const s = statusMap[status as keyof typeof statusMap]
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number, record) => (
        <Progress percent={progress} size="small" status={record.status === 'failed' ? 'exception' : 'active'} />
      ),
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      key: 'executor',
      render: (executor: string) => executor || '-',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'running' ? (
            <Button icon={<PauseOutlined />} size="small" onClick={() => handlePause(record.id)}>
              暂停
            </Button>
          ) : record.status === 'pending' ? (
            <Button type="primary" icon={<PlayCircleOutlined />} size="small" onClick={() => handleExecute(record.id)}>
              执行
            </Button>
          ) : (
            <Button type="primary" icon={<PlayCircleOutlined />} size="small" onClick={() => handleExecute(record.id)}>
              重新执行
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleCreate}>
            新建执行
          </Button>
          <Select
            placeholder="筛选状态"
            style={{ width: 150 }}
            allowClear
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Select.Option value="running">执行中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="failed">失败</Select.Option>
            <Select.Option value="pending">待执行</Select.Option>
          </Select>
        </Space>
      </div>
      <Table columns={columns} dataSource={filteredExecutions} rowKey="id" />

      <Modal
        title="新建执行"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="planName" label="测试计划" rules={[{ required: true, message: '请输入测试计划名称' }]}>
            <Input placeholder="请输入测试计划名称" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default TestExecution
