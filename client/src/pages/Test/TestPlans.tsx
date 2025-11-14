import { useState, useEffect, useMemo } from 'react'
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Tabs,
  Card,
  Modal,
  Form,
  Select,
  DatePicker,
  TextArea,
  Descriptions,
  Divider,
  Row,
  Col,
  Badge,
  Tooltip,
  Drawer,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  FullscreenOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { Dayjs } from 'dayjs'
import { testPlanApi } from '../../api/testPlan'

const { Search } = Input
const { Option } = Select
const { TextArea: AntTextArea } = Input

interface TestPlan {
  id: string
  title: string
  status: 'draft' | 'completed' | 'in-progress'
  creator: string
  createTime: string
  finalizer?: string
  finalizeTime?: string
  description?: string
  version?: string
  project?: string
}

interface TestPlanItem {
  id: string
  planId: string
  name: string
  type: string
  status: string
  assignee: string
  startDate: string
  endDate: string
  progress: number
}

interface TestScope {
  id: string
  module: string
  function: string
  priority: string
  testType: string
  description: string
}

interface TestEnvironment {
  id: string
  name: string
  type: string
  url: string
  status: string
  description: string
  createTime: string
}

const TestPlans: React.FC = () => {
  const [plans, setPlans] = useState<TestPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [selectedPlan, setSelectedPlan] = useState<TestPlan | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [taskDrawerVisible, setTaskDrawerVisible] = useState(false)

  // 测试计划数据
  const [testPlans, setTestPlans] = useState<TestPlanItem[]>([
    {
      id: '1',
      planId: '1',
      name: '用户登录功能测试',
      type: '功能测试',
      status: 'in-progress',
      assignee: '测试工程师A',
      startDate: '2024-12-20',
      endDate: '2024-12-25',
      progress: 65,
    },
    {
      id: '2',
      planId: '1',
      name: 'API接口测试',
      type: '接口测试',
      status: 'pending',
      assignee: '测试工程师B',
      startDate: '2024-12-21',
      endDate: '2024-12-26',
      progress: 0,
    },
    {
      id: '3',
      planId: '1',
      name: '性能测试',
      type: '性能测试',
      status: 'completed',
      assignee: '测试工程师C',
      startDate: '2024-12-15',
      endDate: '2024-12-19',
      progress: 100,
    },
  ])

  // 测试范围数据
  const [testScopes, setTestScopes] = useState<TestScope[]>([
    {
      id: '1',
      module: '用户管理',
      function: '用户登录',
      priority: '高',
      testType: '功能测试',
      description: '测试用户登录功能的正确性和安全性',
    },
    {
      id: '2',
      module: '用户管理',
      function: '用户注册',
      priority: '高',
      testType: '功能测试',
      description: '测试用户注册流程的完整性',
    },
    {
      id: '3',
      module: '订单管理',
      function: '订单创建',
      priority: '中',
      testType: '功能测试',
      description: '测试订单创建流程',
    },
  ])

  // 测试环境数据
  const [testEnvironments, setTestEnvironments] = useState<TestEnvironment[]>([
    {
      id: '1',
      name: 'SIT测试环境',
      type: 'SIT',
      url: 'https://sit.example.com',
      status: 'active',
      description: '系统集成测试环境',
      createTime: '2024-12-01',
    },
    {
      id: '2',
      name: 'UAT测试环境',
      type: 'UAT',
      url: 'https://uat.example.com',
      status: 'active',
      description: '用户验收测试环境',
      createTime: '2024-12-01',
    },
    {
      id: '3',
      name: '性能测试环境',
      type: 'Performance',
      url: 'https://perf.example.com',
      status: 'maintenance',
      description: '性能测试专用环境',
      createTime: '2024-12-01',
    },
  ])

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    setLoading(true)
    try {
      const data = await testPlanApi.getList(searchKeyword)
      setPlans(data)
    } catch (error: any) {
      // 使用模拟数据
      const mockData: TestPlan[] = [
        {
          id: '1',
          title: 'COM-CTest测试方案',
          status: 'completed',
          creator: 'Demo用户',
          createTime: '2022-11-16T16:57:30',
          finalizer: 'Demo用户',
          finalizeTime: '2022-11-16T16:59:52',
          description: 'COM组件测试方案',
          version: '5.0.1',
          project: '产品研发',
        },
        {
          id: '2',
          title: 'DOM-cTest测试方案',
          status: 'draft',
          creator: 'Demo用户',
          createTime: '2022-11-16T16:57:08',
          description: 'DOM组件测试方案',
          version: '5.0.0',
          project: '产品研发',
        },
        {
          id: '3',
          title: '【5.0】测试方案',
          status: 'completed',
          creator: 'Demo用户',
          createTime: '2022-11-16T15:47:53',
          finalizer: 'Demo用户',
          finalizeTime: '2022-11-16T16:57:38',
          description: '5.0版本完整测试方案',
          version: '5.0.0',
          project: '产品研发',
        },
      ]
      setPlans(mockData)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    const filtered = plans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(value.toLowerCase()) ||
        plan.creator.toLowerCase().includes(value.toLowerCase())
    )
    setPlans(filtered)
    if (!value) {
      loadPlans()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await testPlanApi.delete(id)
      message.success('删除成功')
      loadPlans()
    } catch (error: any) {
      setPlans(plans.filter((plan) => plan.id !== id))
      message.success('删除成功')
    }
  }

  const handleCreate = () => {
    setCreateModalVisible(true)
    createForm.resetFields()
  }

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      const newPlan: TestPlan = {
        id: Date.now().toString(),
        title: values.title,
        status: 'draft',
        creator: 'Demo用户',
        createTime: new Date().toISOString(),
        description: values.description,
        version: values.version,
        project: values.project,
      }
      setPlans([newPlan, ...plans])
      message.success('创建成功')
      setCreateModalVisible(false)
      createForm.resetFields()
    } catch (error) {
      console.error('创建失败:', error)
    }
  }

  const handleFinalize = (plan: TestPlan) => {
    Modal.confirm({
      title: '确认定稿',
      content: `确定要将"${plan.title}"定稿吗？定稿后将无法修改。`,
      onOk: () => {
        const updated = plans.map((p) =>
          p.id === plan.id
            ? {
                ...p,
                status: 'completed' as const,
                finalizer: 'Demo用户',
                finalizeTime: new Date().toISOString(),
              }
            : p
        )
        setPlans(updated)
        message.success('定稿成功')
      },
    })
  }

  const columns: ColumnsType<TestPlan> = [
    {
      title: '序号',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '方案标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedPlan(record)
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          draft: { color: 'default', text: '草稿' },
          'in-progress': { color: 'processing', text: '进行中' },
          completed: { color: 'success', text: '完成' },
        }
        const statusInfo = statusMap[status] || statusMap.draft
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
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
      title: '定稿人',
      dataIndex: 'finalizer',
      key: 'finalizer',
      render: (text: string) => text || '/',
    },
    {
      title: '定稿时间',
      dataIndex: 'finalizeTime',
      key: 'finalizeTime',
      render: (time: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '/'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedPlan(record)}
          >
            查看
          </Button>
          {record.status === 'draft' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleFinalize(record)}
            >
              定稿
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个测试方案吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 测试计划列
  const planColumns: ColumnsType<TestPlanItem> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'default', text: '待开始' },
          'in-progress': { color: 'processing', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
        }
        const statusInfo = statusMap[status] || statusMap.pending
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Badge
          count={progress}
          showZero
          style={{ backgroundColor: progress === 100 ? '#52c41a' : '#1890ff' }}
        />
      ),
    },
  ]

  // 测试范围列
  const scopeColumns: ColumnsType<TestScope> = [
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
    },
    {
      title: '功能',
      dataIndex: 'function',
      key: 'function',
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colorMap: Record<string, string> = {
          高: 'red',
          中: 'orange',
          低: 'default',
        }
        return <Tag color={colorMap[priority] || 'default'}>{priority}</Tag>
      },
    },
    {
      title: '测试类型',
      dataIndex: 'testType',
      key: 'testType',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  // 测试环境列
  const environmentColumns: ColumnsType<TestEnvironment> = [
    {
      title: '环境名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '环境类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '访问地址',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          active: { color: 'success', text: '运行中' },
          maintenance: { color: 'warning', text: '维护中' },
          offline: { color: 'error', text: '已下线' },
        }
        const statusInfo = statusMap[status] || statusMap.active
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const tabItems = useMemo(
    () => [
      {
        key: 'management',
        label: '方案管理',
        children: (
          <Card>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                  创建
                </Button>
                <Search
                  placeholder="输入关键字按Enter进行搜索"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                />
              </Space>
            </div>
            <Table
              columns={columns}
              dataSource={plans}
              rowKey="id"
              loading={loading}
              pagination={{
                total: plans.length,
                pageSize: 20,
                showTotal: (total) => `共计${total}条`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
            />
          </Card>
        ),
      },
      {
        key: 'plan',
        label: '测试计划',
        children: (
          <Card
            title="测试计划"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => message.info('创建新测试计划')}
              >
                新建计划
              </Button>
            }
          >
            <Table
              columns={planColumns}
              dataSource={testPlans}
              rowKey="id"
              pagination={false}
            />
          </Card>
        ),
      },
      {
        key: 'scope',
        label: '测试范围',
        children: (
          <Card
            title="测试范围"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => message.info('添加测试范围')}
              >
                添加范围
              </Button>
            }
          >
            <Table
              columns={scopeColumns}
              dataSource={testScopes}
              rowKey="id"
              pagination={false}
            />
          </Card>
        ),
      },
      {
        key: 'environment',
        label: '测试环境',
        children: (
          <Card
            title="测试环境"
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => message.info('创建新测试环境')}
                >
                  新建环境
                </Button>
                <Button icon={<SettingOutlined />} onClick={() => message.info('环境配置')}>
                  环境配置
                </Button>
              </Space>
            }
          >
            <Table
              columns={environmentColumns}
              dataSource={testEnvironments}
              rowKey="id"
              pagination={false}
            />
          </Card>
        ),
      },
    ],
    [plans, loading, testPlans, testScopes, testEnvironments]
  )

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建 Ctest5.0.1 SIT测试计划
          </Button>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => setTaskDrawerVisible(true)}
          >
            + 任务
          </Button>
          <Button
            icon={<UnorderedListOutlined />}
            onClick={() => setTaskDrawerVisible(true)}
          >
            任务列表
          </Button>
          <Tooltip title={fullscreen ? '退出全屏' : '全屏'}>
            <Button
              icon={<FullscreenOutlined />}
              onClick={() => setFullscreen(!fullscreen)}
            />
          </Tooltip>
        </Space>
      </div>

      <Tabs defaultActiveKey="management" items={tabItems} />

      {/* 创建测试方案模态框 */}
      <Modal
        title="创建测试方案"
        open={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => {
          setCreateModalVisible(false)
          createForm.resetFields()
        }}
        width={600}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="title"
            label="方案标题"
            rules={[{ required: true, message: '请输入方案标题' }]}
          >
            <Input placeholder="请输入方案标题" />
          </Form.Item>
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="例如：5.0.1" />
          </Form.Item>
          <Form.Item
            name="project"
            label="所属项目"
            rules={[{ required: true, message: '请选择所属项目' }]}
          >
            <Select placeholder="请选择项目">
              <Option value="产品研发">产品研发</Option>
              <Option value="产品优化">产品优化</Option>
              <Option value="系统升级">系统升级</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="方案描述">
            <AntTextArea rows={4} placeholder="请输入方案描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 方案详情抽屉 */}
      {selectedPlan && (
        <Drawer
          title="测试方案详情"
          placement="right"
          width={600}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="方案标题">{selectedPlan.title}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={
                  selectedPlan.status === 'completed'
                    ? 'green'
                    : selectedPlan.status === 'in-progress'
                    ? 'blue'
                    : 'default'
                }
              >
                {selectedPlan.status === 'completed'
                  ? '完成'
                  : selectedPlan.status === 'in-progress'
                  ? '进行中'
                  : '草稿'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="版本号">{selectedPlan.version || '/'}</Descriptions.Item>
            <Descriptions.Item label="所属项目">{selectedPlan.project || '/'}</Descriptions.Item>
            <Descriptions.Item label="创建人">{selectedPlan.creator}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(selectedPlan.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="定稿人">{selectedPlan.finalizer || '/'}</Descriptions.Item>
            <Descriptions.Item label="定稿时间">
              {selectedPlan.finalizeTime
                ? dayjs(selectedPlan.finalizeTime).format('YYYY-MM-DD HH:mm:ss')
                : '/'}
            </Descriptions.Item>
            <Descriptions.Item label="方案描述">
              {selectedPlan.description || '暂无描述'}
            </Descriptions.Item>
          </Descriptions>
        </Drawer>
      )}

      {/* 任务列表抽屉 */}
      <Drawer
        title="任务列表"
        placement="right"
        width={800}
        open={taskDrawerVisible}
        onClose={() => setTaskDrawerVisible(false)}
      >
        <Table
          columns={planColumns}
          dataSource={testPlans}
          rowKey="id"
          pagination={false}
        />
      </Drawer>
    </div>
  )
}

export default TestPlans
