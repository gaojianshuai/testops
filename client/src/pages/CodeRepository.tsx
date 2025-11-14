import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, Switch, message, Drawer, Descriptions, Tooltip } from 'antd'
import {
  CodeOutlined,
  BranchesOutlined,
  CloudSyncOutlined,
  PlusOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Option } = Select

interface Repository {
  id: string
  name: string
  namespace: string
  description?: string
  branch: string
  lastCommit: string
  commitTime: string
  status: 'active' | 'archived'
  visibility: 'private' | 'internal' | 'public'
  pipelineStatus: 'success' | 'failed' | 'running' | 'pending'
  issues: number
  mergeRequests: number
  tags: string[]
  webUrl: string
  sshUrl: string
  enableCi: boolean
  enableMirror: boolean
}

const statusTag: Record<Repository['pipelineStatus'], { color: string; text: string }> = {
  success: { color: 'green', text: '通过' },
  failed: { color: 'red', text: '失败' },
  running: { color: 'processing', text: '执行中' },
  pending: { color: 'default', text: '等待' },
}

const CodeRepository: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([
    {
      id: '1',
      name: 'devops-platform',
      namespace: 'demo/devops',
      description: '平台前端代码仓库',
      branch: 'main',
      lastCommit: 'feat: 集成 Deepseek 智能助手',
      commitTime: '2024-01-16T10:25:00',
      status: 'active',
      visibility: 'private',
      pipelineStatus: 'success',
      issues: 3,
      mergeRequests: 1,
      tags: ['v1.0.0', 'v1.0.1'],
      webUrl: 'https://gitlab.example.com/demo/devops/devops-platform',
      sshUrl: 'git@gitlab.example.com:demo/devops/devops-platform.git',
      enableCi: true,
      enableMirror: false,
    },
    {
      id: '2',
      name: 'devops-backend',
      namespace: 'demo/devops',
      description: '平台后端服务',
      branch: 'develop',
      lastCommit: 'fix: 优化测试计划 API',
      commitTime: '2024-01-15T18:40:00',
      status: 'active',
      visibility: 'internal',
      pipelineStatus: 'running',
      issues: 5,
      mergeRequests: 2,
      tags: ['v0.9.3'],
      webUrl: 'https://gitlab.example.com/demo/devops/devops-backend',
      sshUrl: 'git@gitlab.example.com:demo/devops/devops-backend.git',
      enableCi: true,
      enableMirror: true,
    },
    {
      id: '3',
      name: 'mobile-client',
      namespace: 'demo/mobile',
      description: '移动端应用仓库',
      branch: 'release',
      lastCommit: 'chore: 更新构建脚本',
      commitTime: '2024-01-14T09:10:00',
      status: 'archived',
      visibility: 'public',
      pipelineStatus: 'failed',
      issues: 0,
      mergeRequests: 0,
      tags: ['v2.3.0'],
      webUrl: 'https://gitlab.example.com/demo/mobile/mobile-client',
      sshUrl: 'git@gitlab.example.com:demo/mobile/mobile-client.git',
      enableCi: false,
      enableMirror: false,
    },
  ])
  const [filteredStatus, setFilteredStatus] = useState<'all' | Repository['status']>('all')
  const [filteredPipeline, setFilteredPipeline] = useState<'all' | Repository['pipelineStatus']>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [currentRepo, setCurrentRepo] = useState<Repository | null>(null)
  const [form] = Form.useForm()

  const filteredRepos = repos.filter((repo) => {
    const matchKeyword =
      repo.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      repo.namespace.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      repo.branch.toLowerCase().includes(searchKeyword.toLowerCase())
    const matchStatus = filteredStatus === 'all' || repo.status === filteredStatus
    const matchPipeline = filteredPipeline === 'all' || repo.pipelineStatus === filteredPipeline
    return matchKeyword && matchStatus && matchPipeline
  })

  const handleCreateRepo = () => {
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const newRepo: Repository = {
          id: Date.now().toString(),
          name: values.name,
          namespace: values.namespace,
          description: values.description,
          branch: values.branch || 'main',
          lastCommit: 'Initial commit',
          commitTime: new Date().toISOString(),
          status: values.status,
          visibility: values.visibility,
          pipelineStatus: 'pending',
          issues: 0,
          mergeRequests: 0,
          tags: [],
          webUrl: `https://gitlab.example.com/${values.namespace}/${values.name}`,
          sshUrl: `git@gitlab.example.com:${values.namespace}/${values.name}.git`,
          enableCi: values.enableCi,
          enableMirror: values.enableMirror,
        }
        setRepos([newRepo, ...repos])
        message.success('仓库创建成功')
        setIsModalVisible(false)
      })
      .catch(() => undefined)
  }

  const handleSync = (repo: Repository) => {
    message.loading({ content: `正在同步仓库 ${repo.name}…`, key: repo.id })
    setTimeout(() => {
      message.success({ content: `${repo.name} 同步完成`, key: repo.id, duration: 2 })
    }, 1500)
  }

  const handleOpenDrawer = (repo: Repository) => {
    setCurrentRepo(repo)
    setIsDrawerVisible(true)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    message.success('已复制到剪贴板')
  }

  const columns: ColumnsType<Repository> = [
    {
      title: '仓库名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <CodeOutlined />
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 500 }}>{name}</span>
            <span style={{ fontSize: 12, color: '#999' }}>{record.namespace}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: '默认分支',
      dataIndex: 'branch',
      key: 'branch',
      render: (branch: string) => (
        <Tag icon={<BranchesOutlined />} color="blue">
          {branch}
        </Tag>
      ),
    },
    {
      title: '最后提交',
      dataIndex: 'lastCommit',
      key: 'lastCommit',
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'commitTime',
      key: 'commitTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '流水线',
      dataIndex: 'pipelineStatus',
      key: 'pipelineStatus',
      render: (status: Repository['pipelineStatus']) => (
        <Tag color={statusTag[status].color}>{statusTag[status].text}</Tag>
      ),
    },
    {
      title: '问题',
      dataIndex: 'issues',
      key: 'issues',
      render: (val: number) => <Tag color="volcano">Issue {val}</Tag>,
    },
    {
      title: '合并请求',
      dataIndex: 'mergeRequests',
      key: 'mergeRequests',
      render: (val: number) => <Tag color="purple">MR {val}</Tag>,
    },
    {
      title: '可见性',
      dataIndex: 'visibility',
      key: 'visibility',
      render: (visibility: Repository['visibility']) => {
        const map = {
          private: { color: 'red', text: '私有' },
          internal: { color: 'orange', text: '内部' },
          public: { color: 'green', text: '公开' },
        }
        const item = map[visibility]
        return <Tag color={item.color}>{item.text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Repository['status']) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '活跃' : '已归档'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleOpenDrawer(record)}
            />
          </Tooltip>
          <Tooltip title="同步仓库">
            <Button
              type="link"
              icon={<CloudSyncOutlined />}
              size="small"
              onClick={() => handleSync(record)}
            />
          </Tooltip>
          <Tooltip title="复制 SSH 地址">
            <Button
              type="link"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => handleCopy(record.sshUrl)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Space wrap>
          <Input.Search
            placeholder="搜索仓库名称、命名空间或分支"
            style={{ width: 260 }}
            allowClear
            onSearch={setSearchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Select
            style={{ width: 140 }}
            value={filteredStatus}
            onChange={(value) => setFilteredStatus(value)}
          >
            <Option value="all">全部状态</Option>
            <Option value="active">活跃</Option>
            <Option value="archived">已归档</Option>
          </Select>
          <Select
            style={{ width: 160 }}
            value={filteredPipeline}
            onChange={(value) => setFilteredPipeline(value)}
          >
            <Option value="all">全部流水线</Option>
            <Option value="success">通过</Option>
            <Option value="running">执行中</Option>
            <Option value="pending">等待</Option>
            <Option value="failed">失败</Option>
          </Select>
          <Button icon={<SyncOutlined />} onClick={() => message.success('已刷新仓库列表')}>
            刷新
          </Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRepo}>
          新建仓库
        </Button>
      </div>
      <Table columns={columns} dataSource={filteredRepos} rowKey="id" />

      <Modal
        title="新建仓库"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={520}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'active', visibility: 'private', enableCi: true, enableMirror: false }}>
          <Form.Item name="name" label="仓库名称" rules={[{ required: true, message: '请输入仓库名称' }]}>
            <Input placeholder="例如：project-service" />
          </Form.Item>
          <Form.Item name="namespace" label="命名空间" rules={[{ required: true, message: '请输入命名空间' }]}>
            <Input placeholder="例如：group/subgroup" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="仓库说明（可选）" />
          </Form.Item>
          <Form.Item name="branch" label="默认分支">
            <Input placeholder="例如：main" />
          </Form.Item>
          <Form.Item name="visibility" label="可见性" rules={[{ required: true }]}>
            <Select>
              <Option value="private">私有</Option>
              <Option value="internal">内部</Option>
              <Option value="public">公开</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="仓库状态" rules={[{ required: true }]}>
            <Select>
              <Option value="active">活跃</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>
          <Form.Item label="高级设置">
            <Space direction="vertical">
              <Form.Item name="enableCi" valuePropName="checked" noStyle>
                <Switch checkedChildren="启用CI/CD" unCheckedChildren="禁用CI/CD" />
              </Form.Item>
              <Form.Item name="enableMirror" valuePropName="checked" noStyle>
                <Switch checkedChildren="启用镜像" unCheckedChildren="关闭镜像" />
              </Form.Item>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={currentRepo ? `${currentRepo.namespace}/${currentRepo.name}` : '仓库详情'}
        placement="right"
        width={520}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        {currentRepo && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="描述">{currentRepo.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="默认分支">{currentRepo.branch}</Descriptions.Item>
            <Descriptions.Item label="最新提交">{currentRepo.lastCommit}</Descriptions.Item>
            <Descriptions.Item label="提交时间">
              {dayjs(currentRepo.commitTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="CI/CD">{currentRepo.enableCi ? '已启用' : '未启用'}</Descriptions.Item>
            <Descriptions.Item label="仓库镜像">{currentRepo.enableMirror ? '已启用' : '未启用'}</Descriptions.Item>
            <Descriptions.Item label="Clone (HTTPS)">
              <Space>
                <span>{currentRepo.webUrl}.git</span>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(`${currentRepo.webUrl}.git`)}>
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Clone (SSH)">
              <Space>
                <span>{currentRepo.sshUrl}</span>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(currentRepo.sshUrl)}>
                  复制
                </Button>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="标签">
              <Space>
                {currentRepo.tags.length > 0 ? currentRepo.tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : '暂无标签'}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="统计">
              <Space>
                <Tag color="volcano">Issue {currentRepo.issues}</Tag>
                <Tag color="purple">MR {currentRepo.mergeRequests}</Tag>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </Card>
  )
}

export default CodeRepository

