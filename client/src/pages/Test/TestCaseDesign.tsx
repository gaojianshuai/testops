import { useState } from 'react'
import { Table, Button, Space, Tag, Input, Card, Modal, Form, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface TestCase {
  id: string
  name: string
  type: string
  priority: 'high' | 'medium' | 'low'
  status: 'designing' | 'reviewed' | 'approved'
  creator: string
  createTime: string
}

const TestCaseDesign: React.FC = () => {
  const [cases, setCases] = useState<TestCase[]>([
    {
      id: '1',
      name: '用户登录功能测试',
      type: '功能测试',
      priority: 'high',
      status: 'approved',
      creator: 'Demo用户',
      createTime: '2024-01-15T10:30:00',
    },
    {
      id: '2',
      name: '数据查询接口测试',
      type: '接口测试',
      priority: 'medium',
      status: 'reviewed',
      creator: 'Demo用户',
      createTime: '2024-01-14T14:20:00',
    },
    {
      id: '3',
      name: '页面加载性能测试',
      type: '性能测试',
      priority: 'low',
      status: 'designing',
      creator: 'Demo用户',
      createTime: '2024-01-13T09:15:00',
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingCase, setEditingCase] = useState<TestCase | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [form] = Form.useForm()

  const filteredCases = cases.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.type.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  })

  const handleCreate = () => {
    setEditingCase(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: TestCase) => {
    setEditingCase(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setCases(cases.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingCase) {
        setCases(cases.map((item) =>
          item.id === editingCase.id
            ? { ...item, ...values, createTime: item.createTime }
            : item
        ))
        message.success('更新成功')
      } else {
        const newCase: TestCase = {
          id: Date.now().toString(),
          ...values,
          creator: 'Demo用户',
          createTime: new Date().toISOString(),
        }
        setCases([...cases, newCase])
        message.success('创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const columns: ColumnsType<TestCase> = [
    {
      title: '用例名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '用例类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colorMap = {
          high: 'red',
          medium: 'orange',
          low: 'blue',
        }
        const textMap = {
          high: '高',
          medium: '中',
          low: '低',
        }
        return <Tag color={colorMap[priority as keyof typeof colorMap]}>{textMap[priority as keyof typeof textMap]}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          designing: { color: 'default', text: '设计中' },
          reviewed: { color: 'processing', text: '已评审' },
          approved: { color: 'success', text: '已批准' },
        }
        const s = statusMap[status as keyof typeof statusMap]
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用例吗？"
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
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建用例
          </Button>
          <Input.Search
            placeholder="搜索用例"
            style={{ width: 300 }}
            onSearch={setSearchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </Space>
      </div>
      <Table columns={columns} dataSource={filteredCases} rowKey="id" />

      <Modal
        title={editingCase ? '编辑用例' : '新建用例'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="用例名称" rules={[{ required: true, message: '请输入用例名称' }]}>
            <Input placeholder="请输入用例名称" />
          </Form.Item>
          <Form.Item name="type" label="用例类型" rules={[{ required: true, message: '请选择用例类型' }]}>
            <Select placeholder="请选择用例类型">
              <Select.Option value="功能测试">功能测试</Select.Option>
              <Select.Option value="接口测试">接口测试</Select.Option>
              <Select.Option value="性能测试">性能测试</Select.Option>
              <Select.Option value="UI测试">UI测试</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true, message: '请选择优先级' }]}>
            <Select placeholder="请选择优先级">
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态">
              <Select.Option value="designing">设计中</Select.Option>
              <Select.Option value="reviewed">已评审</Select.Option>
              <Select.Option value="approved">已批准</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default TestCaseDesign
