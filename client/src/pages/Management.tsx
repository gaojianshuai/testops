import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  createTime: string
}

const Management: React.FC = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Demo-产品研发',
      description: '产品研发项目',
      status: 'active',
      createTime: '2024-01-10T10:00:00',
    },
    {
      id: '2',
      name: '测试项目A',
      description: '测试项目描述',
      status: 'active',
      createTime: '2024-01-12T14:30:00',
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form] = Form.useForm()

  const handleCreate = () => {
    setEditingProject(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: Project) => {
    setEditingProject(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter((item) => item.id !== id))
    message.success('删除成功')
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingProject) {
        setProjects(projects.map((item) => (item.id === editingProject.id ? { ...item, ...values } : item)))
        message.success('更新成功')
      } else {
        const newProject: Project = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toISOString(),
        }
        setProjects([...projects, newProject])
        message.success('创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const handleView = (project: Project) => {
    // 跳转到项目详情或相关页面
    navigate(`/management?project=${project.id}`)
    message.info(`查看项目: ${project.name}`)
  }

  const columns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Project) => (
        <a onClick={() => handleView(record)} style={{ cursor: 'pointer' }}>
          {name}
        </a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
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
            title="确定要删除这个项目吗？"
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
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建项目
        </Button>
      </div>
      <Table columns={columns} dataSource={projects} rowKey="id" />

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入项目描述' }]}>
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Input placeholder="active 或 inactive" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Management
