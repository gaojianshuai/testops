import { useMemo, useState } from 'react'
import {
  Card,
  Tabs,
  Tag,
  Avatar,
  Button,
  Space,
  Select,
  Timeline,
  List,
  Modal,
  Form,
  Input,
  DatePicker,
  Badge,
  Progress,
  Drawer,
  message,
  Row,
  Col,
} from 'antd'
import {
  UserOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  HighlightOutlined,
  BugOutlined,
  ExperimentOutlined,
  ClusterOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'

const { Option } = Select
const { TextArea } = Input

interface ActivityItem {
  time: string
  content: string
}

interface WorkItem {
  id: string
  title: string
  type: 'requirement' | 'design' | 'test' | 'bug' | 'research'
  status: 'planning' | 'developing' | 'in-progress' | 'review' | 'done'
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  owner: string
  assignee: string
  createdAt: string
  dueDate?: string
  description: string
  progress: number
  tags: string[]
  notes?: string
  activity: ActivityItem[]
}

const typeMeta: Record<WorkItem['type'], { label: string; icon: React.ReactNode; color: string }> = {
  requirement: { label: '需求', icon: <HighlightOutlined />, color: 'blue' },
  design: { label: '设计', icon: <ClusterOutlined />, color: 'purple' },
  test: { label: '测试', icon: <ExperimentOutlined />, color: 'geekblue' },
  bug: { label: '缺陷', icon: <BugOutlined />, color: 'red' },
  research: { label: '调研', icon: <ThunderboltOutlined />, color: 'volcano' },
}

const statusMeta: Record<WorkItem['status'], { label: string; color: string }> = {
  planning: { label: '规划中', color: 'default' },
  developing: { label: '开发中', color: 'blue' },
  'in-progress': { label: '测试中', color: 'processing' },
  review: { label: '评审中', color: 'gold' },
  done: { label: '已完成', color: 'green' },
}

const priorityMeta: Record<WorkItem['priority'], { label: string; color: string }> = {
  P0: { label: 'P0 - 紧急', color: 'red' },
  P1: { label: 'P1 - 高', color: 'volcano' },
  P2: { label: 'P2 - 中', color: 'gold' },
  P3: { label: 'P3 - 低', color: 'blue' },
}

const initialItems: WorkItem[] = [
  {
    id: 'WK-1001',
    title: '登录模块升级多因素认证',
    type: 'requirement',
    status: 'developing',
    priority: 'P0',
    owner: '产品-王敏',
    assignee: '研发-李强',
    createdAt: '2024-01-10T09:30:00',
    dueDate: '2024-01-18',
    description: '为提升安全性，引入短信验证码与邮箱验证码组合校验，需要前后端联动实现。',
    progress: 60,
    tags: ['安全', '版本1.0', '里程碑'],
    notes: '风险：短信服务稳定性 / 邮件频控策略待确认',
    activity: [
      { time: '2024-01-12 10:30', content: '后端完成接口设计评审' },
      { time: '2024-01-11 16:00', content: '产品更新需求原型' },
      { time: '2024-01-10 09:30', content: '创建任务并指派给研发-李强' },
    ],
  },
  {
    id: 'WK-1002',
    title: '交互稿评审——测试报告页视觉升级',
    type: 'design',
    status: 'review',
    priority: 'P1',
    owner: '设计-陈晨',
    assignee: '测试-刘颖',
    createdAt: '2024-01-09T14:10:00',
    dueDate: '2024-01-17',
    description: '针对测试报告页面进行全新视觉升级，需要设计与测试共同评审交互稿和验收标准。',
    progress: 80,
    tags: ['视觉升级', '易用性'],
    activity: [
      { time: '2024-01-12 15:45', content: '发起评审会议，并记录评审意见' },
      { time: '2024-01-10 09:50', content: '输出高保真交互稿' },
    ],
  },
  {
    id: 'WK-1003',
    title: '接口自动化测试用例套件构建',
    type: 'test',
    status: 'planning',
    priority: 'P1',
    owner: '测试-刘颖',
    assignee: '测试-王乐',
    createdAt: '2024-01-08T11:20:00',
    dueDate: '2024-01-20',
    description: '围绕账户服务、订单服务构建自动化回归套件，覆盖核心接口用例。',
    progress: 30,
    tags: ['自动化', '回归'],
    activity: [
      { time: '2024-01-09 17:10', content: '整理接口清单，梳理用例优先级' },
      { time: '2024-01-08 11:20', content: '创建任务并整理人力排期' },
    ],
  },
  {
    id: 'WK-1004',
    title: '修复CI流水线随机失败问题',
    type: 'bug',
    status: 'in-progress',
    priority: 'P0',
    owner: '研发-李强',
    assignee: '运维-张斌',
    createdAt: '2024-01-12T08:45:00',
    description: '近期CI流水线出现随机失败，需要排查Runner资源、缓存配置以及脚本超时。',
    progress: 45,
    tags: ['CI/CD', '稳定性'],
    activity: [
      { time: '2024-01-13 11:40', content: '定位到缓存命中率低问题，准备优化策略' },
      { time: '2024-01-12 08:45', content: '提交缺陷并转交运维处理' },
    ],
  },
  {
    id: 'WK-1005',
    title: 'DevOps趋势调研报告',
    type: 'research',
    status: 'done',
    priority: 'P2',
    owner: '产品-王敏',
    assignee: '研发-李强',
    createdAt: '2024-01-01T09:00:00',
    dueDate: '2024-01-10',
    description: '完成对行业DevOps工具实践的调研报告，用于高层汇报与路线规划。',
    progress: 100,
    tags: ['调研', '战略'],
    activity: [
      { time: '2024-01-07 15:30', content: '形成调研报告初稿并提交' },
      { time: '2024-01-02 10:20', content: '与利益相关方确定调研范围' },
    ],
  },
]

const Collaboration: React.FC = () => {
  const [workItems, setWorkItems] = useState<WorkItem[]>(initialItems)
  const [statusFilter, setStatusFilter] = useState<'all' | WorkItem['status']>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | WorkItem['type']>('all')
  const [search, setSearch] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [drawerItem, setDrawerItem] = useState<WorkItem | null>(null)
  const [drawerForm] = Form.useForm()
  const [laneDrawerStatus, setLaneDrawerStatus] = useState<WorkItem['status'] | null>(null)

  const filteredItems = useMemo(() => {
    return workItems.filter((item) => {
      const matchStatus = statusFilter === 'all' || item.status === statusFilter
      const matchType = typeFilter === 'all' || item.type === typeFilter
      const keyword = search.toLowerCase().trim()
      const matchKeyword =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.owner.toLowerCase().includes(keyword) ||
        item.assignee.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword)
      return matchStatus && matchType && matchKeyword
    })
  }, [workItems, statusFilter, typeFilter, search])

  const groupedByStatus = useMemo(() => {
    return filteredItems.reduce<Record<WorkItem['status'], WorkItem[]>>(
      (acc, item) => {
        acc[item.status].push(item)
        return acc
      },
      { planning: [], developing: [], 'in-progress': [], review: [], done: [] },
    )
  }, [filteredItems])

  const openLaneDrawer = (status: WorkItem['status']) => {
    setLaneDrawerStatus(status)
  }

  const closeLaneDrawer = () => {
    setLaneDrawerStatus(null)
  }

  const openDrawer = (item: WorkItem) => {
    setDrawerItem(item)
    drawerForm.setFieldsValue({
      ...item,
      dueDate: item.dueDate ? dayjs(item.dueDate) : undefined,
      tags: item.tags.join(', '),
    })
  }

  const updateDrawerItem = () => {
    drawerForm
      .validateFields()
      .then((values) => {
        if (!drawerItem) return
        const nextItem: WorkItem = {
          ...drawerItem,
          ...values,
          dueDate: (values.dueDate as Dayjs | undefined)?.format('YYYY-MM-DD'),
          tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
          progress: Number(values.progress ?? 0),
        }
        const nextList = workItems.map((item) => (item.id === nextItem.id ? nextItem : item))
        setWorkItems(nextList)
        setDrawerItem(nextItem)
        message.success('已更新事务信息')
      })
      .catch(() => undefined)
  }

  const handleCreate = () => {
    form.resetFields()
    setCreateModalVisible(true)
  }

  const submitCreate = () => {
    form
      .validateFields()
      .then((values) => {
        const newItem: WorkItem = {
          id: `WK-${Math.floor(Math.random() * 9000) + 1000}`,
          title: values.title,
          type: values.type,
          status: values.status,
          priority: values.priority,
          owner: values.owner,
          assignee: values.assignee,
          createdAt: new Date().toISOString(),
          dueDate: (values.dueDate as Dayjs | undefined)?.format('YYYY-MM-DD'),
          description: values.description,
          progress: Number(values.progress ?? (values.status === 'done' ? 100 : 10)),
          tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
          notes: values.notes,
          activity: [{ time: dayjs().format('YYYY-MM-DD HH:mm'), content: '创建任务并完成指派' }],
        }
        setWorkItems((prev) => [newItem, ...prev])
        message.success('已创建新的协作事务')
        setCreateModalVisible(false)
      })
      .catch(() => undefined)
  }

  return (
    <div>
      <Tabs
        defaultActiveKey="board"
        items={[
          {
            key: 'board',
            label: '协同看板',
            children: (
              <div style={{ background: '#f5f6f8', padding: 24, borderRadius: 12 }}>
                <Space wrap style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                  <Space wrap>
                    <Select style={{ width: 160 }} value={statusFilter} onChange={(value) => setStatusFilter(value)}>
                      <Option value="all">全部状态</Option>
                      <Option value="planning">规划中</Option>
                      <Option value="developing">开发中</Option>
                      <Option value="in-progress">测试中</Option>
                      <Option value="review">评审中</Option>
                      <Option value="done">已完成</Option>
                    </Select>
                    <Select style={{ width: 160 }} value={typeFilter} onChange={(value) => setTypeFilter(value)}>
                      <Option value="all">全部类型</Option>
                      <Option value="requirement">需求</Option>
                      <Option value="design">设计</Option>
                      <Option value="test">测试</Option>
                      <Option value="bug">缺陷</Option>
                      <Option value="research">调研</Option>
                    </Select>
                    <Input
                      placeholder="搜索标题、负责人、指派人或编号"
                      allowClear
                      style={{ width: 280 }}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    新建事务
                  </Button>
                </Space>

                <Row
                  gutter={[32, 24]}
                  style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch' }}
                >
                  {(['planning', 'developing', 'in-progress', 'review', 'done'] as WorkItem['status'][]).map((status) => (
                    <Col
                      key={status}
                      style={{ flex: '1 1 380px', minWidth: 360, maxWidth: 420, display: 'flex' }}
                    >
                      <Card
                        title={
                          <Space size="small">
                            <span>{statusMeta[status].label}</span>
                            <Badge count={groupedByStatus[status].length} style={{ backgroundColor: statusMeta[status].color }} />
                          </Space>
                        }
                        extra={
                          <Button type="link" size="small" onClick={() => openLaneDrawer(status)}>
                            管理
                          </Button>
                        }
                        bodyStyle={{ padding: 16, maxHeight: 560, overflowY: 'auto' }}
                        style={{
                          borderRadius: 14,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 10px 24px rgba(15, 35, 95, 0.08)',
                          background: '#fff',
                        }}
                      >
                        <List
                          dataSource={groupedByStatus[status]}
                          locale={{ emptyText: '暂无事项' }}
                          renderItem={(item) => (
                            <List.Item
                              style={{
                                marginBottom: 14,
                                background: '#fdfdfd',
                                borderRadius: 12,
                                padding: 14,
                                boxShadow: '0 4px 14px rgba(31, 56, 88, 0.08)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                              }}
                              onClick={() => openDrawer(item)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(31,56,88,0.12)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(31,56,88,0.08)'
                              }}
                              actions={[
                                <Button
                                  key="detail"
                                  type="link"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openDrawer(item)
                                  }}
                                >
                                  详情编辑
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                title={
                                  <Space direction="vertical" size={6} style={{ width: '100%' }}>
                                    <Space>
                                      <Tag color={priorityMeta[item.priority].color}>{priorityMeta[item.priority].label}</Tag>
                                      <Tag color={typeMeta[item.type].color} icon={typeMeta[item.type].icon}>
                                        {typeMeta[item.type].label}
                                      </Tag>
                                    </Space>
                                    <span style={{ fontWeight: 600, fontSize: 16 }}>{item.title}</span>
                                  </Space>
                                }
                                description={
                                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <Progress
                                      percent={item.progress}
                                      size="small"
                                      status={item.status === 'done' ? 'success' : 'active'}
                                    />
                                    <Space size="large">
                                      <span style={{ fontSize: 12, color: '#666' }}>
                                        负责人：<strong>{item.owner}</strong>
                                      </span>
                                      <span style={{ fontSize: 12, color: '#666' }}>
                                        指派给：<strong>{item.assignee}</strong>
                                      </span>
                                    </Space>
                                    <Space size="large">
                                      <span style={{ fontSize: 12, color: '#999' }}>
                                        创建：{dayjs(item.createdAt).format('MM-DD HH:mm')}
                                      </span>
                                      {item.dueDate && (
                                        <span style={{ fontSize: 12, color: item.status === 'done' ? '#999' : '#fa541c' }}>
                                          截止：{dayjs(item.dueDate).format('MM-DD')}
                                        </span>
                                      )}
                                    </Space>
                                  </Space>
                                }
                                avatar={<Avatar icon={<UserOutlined />} />}
                              />
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ),
          },
          {
            key: 'timeline',
            label: '协同动态',
            children: (
              <Card>
                <Timeline mode="left" style={{ marginLeft: 12 }}>
                  {workItems
                    .flatMap((item) =>
                      item.activity.map((act) => ({
                        time: act.time,
                        content: `${item.id} · ${item.title}：${act.content}`,
                        type: item.type,
                      })),
                    )
                    .sort((a, b) => (dayjs(a.time).isAfter(b.time) ? -1 : 1))
                    .map((log, index) => (
                      <Timeline.Item key={index} color={typeMeta[log.type].color} dot={typeMeta[log.type].icon}>
                        <Space direction="vertical" size={4}>
                          <span style={{ color: '#999', fontSize: 12 }}>{log.time}</span>
                          <span>{log.content}</span>
                        </Space>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            ),
          },
        ]}
      />

      <Modal
        open={createModalVisible}
        title="新建协作事务"
        onOk={submitCreate}
        onCancel={() => setCreateModalVisible(false)}
        width={660}
        okText="创建"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'requirement', status: 'planning', priority: 'P2', progress: 10 }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="例如：新增测试报告导出功能" />
          </Form.Item>
          <Space size="large" align="start" style={{ display: 'flex' }}>
            <Form.Item name="type" label="类型" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}>
                <Option value="requirement">需求</Option>
                <Option value="design">设计</Option>
                <Option value="test">测试</Option>
                <Option value="bug">缺陷</Option>
                <Option value="research">调研</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}>
                <Option value="planning">规划中</Option>
                <Option value="developing">开发中</Option>
                <Option value="in-progress">进行中</Option>
                <Option value="review">评审中</Option>
                <Option value="done">已完成</Option>
              </Select>
            </Form.Item>
            <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}>
                <Option value="P0">P0 - 紧急</Option>
                <Option value="P1">P1 - 高</Option>
                <Option value="P2">P2 - 中</Option>
                <Option value="P3">P3 - 低</Option>
              </Select>
            </Form.Item>
          </Space>
          <Space size="large" align="start" style={{ display: 'flex' }}>
            <Form.Item name="owner" label="负责人" rules={[{ required: true, message: '请输入负责人' }]}>
              <Input placeholder="例如：产品-张三" style={{ width: 220 }} />
            </Form.Item>
            <Form.Item name="assignee" label="指派给" rules={[{ required: true, message: '请输入指派人' }]}>
              <Input placeholder="例如：研发-李四" style={{ width: 220 }} />
            </Form.Item>
            <Form.Item name="dueDate" label="截止日期">
              <DatePicker style={{ width: 180 }} />
            </Form.Item>
          </Space>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请描述协作事项' }]}>
            <TextArea rows={4} placeholder="请详细描述需求、目标与验收标准" />
          </Form.Item>
          <Form.Item name="tags" label="标签" extra="多个标签用英文逗号分隔">
            <Input placeholder="例如：版本2.0, 体验优化" />
          </Form.Item>
          <Form.Item name="notes" label="备注">
            <TextArea rows={2} placeholder="额外说明或跨团队协作要求（可选）" />
          </Form.Item>
          <Form.Item name="progress" label="当前进度(%)">
            <Input type="number" min={0} max={100} placeholder="例如：30" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        width={620}
        open={!!drawerItem}
        onClose={() => setDrawerItem(null)}
        title={drawerItem ? (
          <Space>
            <Tag color={typeMeta[drawerItem.type].color} icon={typeMeta[drawerItem.type].icon}>
              {typeMeta[drawerItem.type].label}
            </Tag>
            <span>{drawerItem.title}</span>
          </Space>
        ) : undefined}
        extra={
          <Button type="primary" onClick={updateDrawerItem}>
            保存修改
          </Button>
        }
      >
        {drawerItem && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Form
              form={drawerForm}
              layout="vertical"
              initialValues={{ ...drawerItem, dueDate: drawerItem.dueDate ? dayjs(drawerItem.dueDate) : undefined, tags: drawerItem.tags.join(', ') }}
            >
              <Space size="large" align="start" style={{ display: 'flex' }}>
                <Form.Item label="编号" style={{ marginBottom: 0 }}>
                  <Badge color={statusMeta[drawerItem.status].color} text={drawerItem.id} />
                </Form.Item>
                <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                  <Select style={{ width: 160 }}>
                    <Option value="planning">规划中</Option>
                    <Option value="developing">开发中</Option>
                    <Option value="in-progress">进行中</Option>
                    <Option value="review">评审中</Option>
                    <Option value="done">已完成</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
                  <Select style={{ width: 160 }}>
                    <Option value="P0">P0 - 紧急</Option>
                    <Option value="P1">P1 - 高</Option>
                    <Option value="P2">P2 - 中</Option>
                    <Option value="P3">P3 - 低</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="progress" label="进度(%)" rules={[{ required: true }]}
                  tooltip="保存时自动调整至0-100范围">
                  <Input type="number" min={0} max={100} style={{ width: 120 }} />
                </Form.Item>
              </Space>
              <Space size="large" align="start" style={{ display: 'flex' }}>
                <Form.Item name="owner" label="负责人" rules={[{ required: true }]}>
                  <Input style={{ width: 220 }} />
                </Form.Item>
                <Form.Item name="assignee" label="指派给" rules={[{ required: true }]}>
                  <Input style={{ width: 220 }} />
                </Form.Item>
                <Form.Item name="dueDate" label="截止日期">
                  <DatePicker style={{ width: 160 }} />
                </Form.Item>
              </Space>
              <Form.Item name="tags" label="标签">
                <Input placeholder="多个标签用英文逗号分隔" />
              </Form.Item>
              <Form.Item name="description" label="详细描述" rules={[{ required: true }]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item name="notes" label="备注">
                <TextArea rows={3} placeholder="说明风险、依赖或跨团队事项" />
              </Form.Item>
            </Form>
            <Card title="最新动态" bordered>
              <Timeline>
                {drawerItem.activity.map((act, idx) => (
                  <Timeline.Item key={idx} color={typeMeta[drawerItem.type].color}>
                    <Space direction="vertical" size={4}>
                      <span style={{ color: '#999', fontSize: 12 }}>{act.time}</span>
                      <span>{act.content}</span>
                    </Space>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Space>
        )}
      </Drawer>

      <Drawer
        width={500}
        open={laneDrawerStatus !== null}
        onClose={closeLaneDrawer}
        title={laneDrawerStatus ? `${statusMeta[laneDrawerStatus].label} · 事务列表` : undefined}
      >
        {laneDrawerStatus && (
          <List
            dataSource={workItems.filter((item) => item.status === laneDrawerStatus)}
            locale={{ emptyText: '暂无事项' }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button type="link" size="small" onClick={() => openDrawer(item)}>
                    编辑
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <Space size="small">
                      <Tag color={priorityMeta[item.priority].color}>{priorityMeta[item.priority].label}</Tag>
                      <span>{typeMeta[item.type].label}</span>
                      <span>负责人：{item.owner}</span>
                      <span>指派给：{item.assignee}</span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </div>
  )
}

export default Collaboration

