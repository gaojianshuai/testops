import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Upload, message, Popconfirm } from 'antd'
import {
  PlusOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { saveTestExecution } from '../../utils/testDataManager'

interface JMeterTest {
  id: string
  name: string
  threads: number
  rampUp: number
  duration: number
  status: 'draft' | 'running' | 'completed' | 'failed'
  lastRunTime?: string
  tps?: number
  errorRate?: number
}

const JMeterTest: React.FC = () => {
  const [tests, setTests] = useState<JMeterTest[]>([
    {
      id: '1',
      name: '登录接口压力测试',
      threads: 100,
      rampUp: 60,
      duration: 300,
      status: 'completed',
      lastRunTime: '2024-01-15T10:30:00',
      tps: 850,
      errorRate: 0.5,
    },
    {
      id: '2',
      name: '查询接口性能测试',
      threads: 200,
      rampUp: 120,
      duration: 600,
      status: 'running',
      lastRunTime: '2024-01-15T14:20:00',
    },
    {
      id: '3',
      name: '批量操作压力测试',
      threads: 50,
      rampUp: 30,
      duration: 180,
      status: 'draft',
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingTest, setEditingTest] = useState<JMeterTest | null>(null)
  const [form] = Form.useForm()

  const handleCreate = () => {
    setEditingTest(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: JMeterTest) => {
    setEditingTest(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setTests(tests.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  const handleExecute = (id: string) => {
    const test = tests.find((t) => t.id === id)
    if (!test) return

    const startTime = new Date().toISOString()
    
    setTests(
      tests.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'running',
              lastRunTime: startTime,
            }
          : item
      )
    )
    message.success('开始执行性能测试')

    // 保存执行中的记录
    saveTestExecution({
      id: `jmeter_${id}_${Date.now()}`,
      testType: 'jmeter',
      testName: test.name,
      status: 'running',
      executionTime: 0,
      startTime,
      module: '性能测试',
      method: test.name,
      description: `JMeter性能测试: ${test.name} (并发${test.threads}, 持续${test.duration}秒)`,
    })

    // 模拟测试完成
    setTimeout(() => {
      const tps = Math.floor(Math.random() * 500) + 500
      const errorRate = Math.random() * 2
      const endTime = new Date().toISOString()
      const executionTime = test.duration * 1000 // 转换为毫秒
      const success = errorRate < 1.0 // 错误率低于1%算通过

      setTests((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: success ? 'completed' : 'failed',
                tps,
                errorRate,
              }
            : item
        )
      )

      // 保存执行完成的记录到测试数据管理器
      saveTestExecution({
        id: `jmeter_${id}_${Date.now()}`,
        testType: 'jmeter',
        testName: test.name,
        status: success ? 'passed' : 'failed',
        executionTime,
        startTime,
        endTime,
        module: '性能测试',
        method: test.name,
        description: `JMeter性能测试: ${test.name} (并发${test.threads}, 持续${test.duration}秒, TPS:${tps}, 错误率:${errorRate.toFixed(2)}%)`,
        errorMessage: success ? undefined : `错误率${errorRate.toFixed(2)}%超过1%`,
      })

      message.success(success ? '性能测试执行完成' : '性能测试执行失败')
    }, 5000)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingTest) {
        setTests(tests.map((item) => (item.id === editingTest.id ? { ...item, ...values } : item)))
        message.success('更新成功')
      } else {
        const newTest: JMeterTest = {
          id: Date.now().toString(),
          ...values,
          status: 'draft',
        }
        setTests([...tests, newTest])
        message.success('创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const columns: ColumnsType<JMeterTest> = [
    {
      title: '测试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '并发数',
      dataIndex: 'threads',
      key: 'threads',
    },
    {
      title: '启动时间',
      dataIndex: 'rampUp',
      key: 'rampUp',
      render: (value: number) => `${value}秒`,
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      render: (value: number) => `${value}秒`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          draft: { color: 'default', text: '草稿' },
          running: { color: 'processing', text: '执行中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
        }
        const s = statusMap[status as keyof typeof statusMap]
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: 'TPS',
      dataIndex: 'tps',
      key: 'tps',
      render: (tps?: number) => (tps ? `${tps}` : '-'),
    },
    {
      title: '错误率',
      dataIndex: 'errorRate',
      key: 'errorRate',
      render: (rate?: number) => (rate ? `${rate.toFixed(2)}%` : '-'),
    },
    {
      title: '最后执行时间',
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
      render: (time?: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            disabled={record.status === 'running'}
            onClick={() => handleExecute(record.id)}
          >
            执行
          </Button>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个测试吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建JMETER测试
        </Button>
      </div>
      <Table columns={columns} dataSource={tests} rowKey="id" />

      <Modal
        title={editingTest ? '编辑JMETER性能测试' : '新建JMETER性能测试'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="测试名称" rules={[{ required: true, message: '请输入测试名称' }]}>
            <Input placeholder="请输入测试名称" />
          </Form.Item>
          <Form.Item name="file" label="JMX文件">
            <Upload>
              <Button icon={<UploadOutlined />}>上传JMX文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="threads" label="并发用户数" rules={[{ required: true, message: '请输入并发用户数' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：100" />
          </Form.Item>
          <Form.Item name="rampUp" label="启动时间(秒)" rules={[{ required: true, message: '请输入启动时间' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：60" />
          </Form.Item>
          <Form.Item name="duration" label="持续时间(秒)" rules={[{ required: true, message: '请输入持续时间' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：300" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default JMeterTest
