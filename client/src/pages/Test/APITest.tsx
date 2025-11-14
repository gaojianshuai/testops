import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, Tabs, message, Popconfirm, Divider, Descriptions, Drawer } from 'antd'
import {
  PlusOutlined,
  PlayCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { TabsProps } from 'antd'
import dayjs from 'dayjs'
import { saveTestExecution } from '../../utils/testDataManager'

const { TextArea } = Input

interface APITest {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  status: 'draft' | 'running' | 'completed' | 'failed'
  lastRunTime?: string
  responseTime?: number
  headers?: string
  body?: string
  assertions?: string
  parameters?: Array<{ key: string; value: string; description?: string }>
}

interface TestReport {
  id: string
  testId: string
  testName: string
  startTime: string
  endTime: string
  duration: number
  status: 'passed' | 'failed'
  responseTime: number
  statusCode?: number
  responseBody?: string
  errorMessage?: string
}

const APITest: React.FC = () => {
  const [tests, setTests] = useState<APITest[]>([
    {
      id: '1',
      name: '用户登录接口',
      method: 'POST',
      url: 'https://api.example.com/login',
      status: 'completed',
      lastRunTime: '2024-01-15T10:30:00',
      responseTime: 120,
      parameters: [
        { key: 'username', value: 'test_user', description: '用户名' },
        { key: 'password', value: 'test123', description: '密码' },
      ],
    },
    {
      id: '2',
      name: '获取用户信息',
      method: 'GET',
      url: 'https://api.example.com/user/info',
      status: 'running',
      lastRunTime: '2024-01-15T14:20:00',
      parameters: [{ key: 'userId', value: '{{userId}}', description: '用户ID（参数化）' }],
    },
    {
      id: '3',
      name: '更新用户信息',
      method: 'PUT',
      url: 'https://api.example.com/user/update',
      status: 'draft',
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false)
  const [isReportDrawerVisible, setIsReportDrawerVisible] = useState(false)
  const [editingTest, setEditingTest] = useState<APITest | null>(null)
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [testReports, setTestReports] = useState<TestReport[]>([])
  const [currentReport, setCurrentReport] = useState<TestReport | null>(null)
  const [form] = Form.useForm()
  const [batchForm] = Form.useForm()

  const handleCreate = () => {
    setEditingTest(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: APITest) => {
    setEditingTest(record)
    form.setFieldsValue({
      ...record,
      parameters: record.parameters || [],
    })
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
    message.success('开始执行测试')

    // 保存执行中的记录
    saveTestExecution({
      id: `api_${id}_${Date.now()}`,
      testType: 'api',
      testName: test.name,
      status: 'running',
      executionTime: 0,
      startTime,
      module: test.url,
      method: test.method,
      description: `接口测试: ${test.name}`,
    })

    // 模拟测试完成
    setTimeout(() => {
      const responseTime = Math.floor(Math.random() * 200) + 50
      const success = Math.random() > 0.2 // 80%成功率
      const endTime = new Date().toISOString()

      setTests((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: success ? 'completed' : 'failed',
                responseTime,
              }
            : item
        )
      )

      // 生成测试报告
      const report: TestReport = {
        id: Date.now().toString(),
        testId: id,
        testName: test.name,
        startTime,
        endTime,
        duration: responseTime,
        status: success ? 'passed' : 'failed',
        responseTime,
        statusCode: success ? 200 : 400,
        responseBody: success ? '{"success": true, "data": {...}}' : undefined,
        errorMessage: success ? undefined : '请求失败：参数错误',
      }
      setTestReports([report, ...testReports])

      // 保存执行完成的记录到测试数据管理器
      saveTestExecution({
        id: `api_${id}_${Date.now()}`,
        testType: 'api',
        testName: test.name,
        status: success ? 'passed' : 'failed',
        executionTime: responseTime,
        startTime,
        endTime,
        module: test.url,
        method: test.method,
        description: `接口测试: ${test.name}`,
        responseTime,
        statusCode: success ? 200 : 400,
        errorMessage: success ? undefined : '请求失败：参数错误',
      })

      message.success(success ? '测试执行完成' : '测试执行失败')
    }, 2000)
  }

  const handleBatchTest = () => {
    if (selectedTests.length === 0) {
      message.warning('请至少选择一个测试')
      return
    }
    setIsBatchModalVisible(true)
  }

  const handleBatchExecute = () => {
    batchForm.validateFields().then(() => {
      const testIds = selectedTests
      message.info(`开始批量执行 ${testIds.length} 个测试`)

      testIds.forEach((id, index) => {
        setTimeout(() => {
          handleExecute(id)
        }, index * 1000)
      })

      setIsBatchModalVisible(false)
      setSelectedTests([])
    })
  }

  const handleViewReport = (testId: string) => {
    const report = testReports.find((r) => r.testId === testId)
    if (report) {
      setCurrentReport(report)
      setIsReportDrawerVisible(true)
    } else {
      message.info('暂无测试报告')
    }
  }

  const handleDownloadReport = () => {
    if (!currentReport) return
    const reportContent = JSON.stringify(currentReport, null, 2)
    const blob = new Blob([reportContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `测试报告_${currentReport.testName}_${dayjs().format('YYYYMMDDHHmmss')}.json`
    a.click()
    URL.revokeObjectURL(url)
    message.success('报告下载成功')
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingTest) {
        setTests(tests.map((item) => (item.id === editingTest.id ? { ...item, ...values } : item)))
        message.success('更新成功')
      } else {
        const newTest: APITest = {
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

  const rowSelection = {
    selectedRowKeys: selectedTests,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedTests(selectedRowKeys as string[])
    },
  }

  const columns: ColumnsType<APITest> = [
    {
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => {
        const colorMap = {
          GET: 'blue',
          POST: 'green',
          PUT: 'orange',
          DELETE: 'red',
          PATCH: 'purple',
        }
        return <Tag color={colorMap[method as keyof typeof colorMap]}>{method}</Tag>
      },
    },
    {
      title: '请求URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
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
      title: '响应时间',
      dataIndex: 'responseTime',
      key: 'responseTime',
      render: (time?: number) => (time ? `${time}ms` : '-'),
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
          <Button
            type="default"
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => handleViewReport(record.id)}
          >
            报告
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

  const tabItems: TabsProps['items'] = [
    {
      key: 'headers',
      label: '请求头',
      children: (
        <Form.Item name="headers">
          <TextArea rows={4} placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}' />
        </Form.Item>
      ),
    },
    {
      key: 'body',
      label: '请求体',
      children: (
        <Form.Item name="body">
          <TextArea rows={6} placeholder='{"key": "value"}' />
        </Form.Item>
      ),
    },
    {
      key: 'parameters',
      label: '参数化',
      children: (
        <Form.List name="parameters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[{ required: true, message: '参数名' }]}
                  >
                    <Input placeholder="参数名" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '参数值' }]}
                  >
                    <Input placeholder="参数值（支持{{变量名}}）" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'description']}>
                    <Input placeholder="描述" />
                  </Form.Item>
                  <Button onClick={() => remove(name)}>删除</Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加参数
                </Button>
              </Form.Item>
              <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
                <p>参数化说明：</p>
                <ul>
                  <li>使用 {'{{变量名}}'} 格式进行参数化，如 {'{{userId}}'}</li>
                  <li>批量测试时会自动替换参数值</li>
                  <li>支持从CSV文件导入参数数据</li>
                </ul>
              </div>
            </>
          )}
        </Form.List>
      ),
    },
    {
      key: 'assertions',
      label: '断言',
      children: (
        <Form.Item name="assertions">
          <TextArea rows={6} placeholder='设置断言规则，例如：\nstatusCode === 200\nresponse.body.success === true\nresponse.body.data.id > 0' />
        </Form.Item>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建接口测试
          </Button>
          <Button
            type="default"
            icon={<ThunderboltOutlined />}
            onClick={handleBatchTest}
            disabled={selectedTests.length === 0}
          >
            批量测试 ({selectedTests.length})
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={tests}
        rowKey="id"
        rowSelection={rowSelection}
      />

      <Modal
        title={editingTest ? '编辑接口测试' : '新建接口测试'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
        width={900}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="接口名称" rules={[{ required: true, message: '请输入接口名称' }]}>
            <Input placeholder="请输入接口名称" />
          </Form.Item>
          <Form.Item name="method" label="请求方法" rules={[{ required: true, message: '请选择请求方法' }]}>
            <Select placeholder="请选择请求方法">
              <Select.Option value="GET">GET</Select.Option>
              <Select.Option value="POST">POST</Select.Option>
              <Select.Option value="PUT">PUT</Select.Option>
              <Select.Option value="DELETE">DELETE</Select.Option>
              <Select.Option value="PATCH">PATCH</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="url" label="请求URL" rules={[{ required: true, message: '请输入请求URL' }]}>
            <Input placeholder="https://api.example.com/endpoint" />
          </Form.Item>
          <Tabs items={tabItems} />
        </Form>
      </Modal>

      <Modal
        title="批量测试配置"
        open={isBatchModalVisible}
        onOk={handleBatchExecute}
        onCancel={() => {
          setIsBatchModalVisible(false)
          batchForm.resetFields()
        }}
      >
        <Form form={batchForm} layout="vertical">
          <Form.Item label="已选择测试" name="selectedTests">
            <div>
              {selectedTests.map((id) => {
                const test = tests.find((t) => t.id === id)
                return test ? <Tag key={id}>{test.name}</Tag> : null
              })}
            </div>
          </Form.Item>
          <Form.Item name="concurrent" label="并发数" initialValue={1}>
            <Input type="number" min={1} max={10} placeholder="同时执行的测试数量" />
          </Form.Item>
          <Form.Item name="delay" label="延迟时间(ms)" initialValue={0}>
            <Input type="number" min={0} placeholder="每个测试之间的延迟" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="测试报告"
        placement="right"
        width={600}
        open={isReportDrawerVisible}
        onClose={() => setIsReportDrawerVisible(false)}
        extra={
          <Button icon={<DownloadOutlined />} onClick={handleDownloadReport}>
            下载报告
          </Button>
        }
      >
        {currentReport && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="测试名称">{currentReport.testName}</Descriptions.Item>
              <Descriptions.Item label="执行状态">
                <Tag color={currentReport.status === 'passed' ? 'green' : 'red'}>
                  {currentReport.status === 'passed' ? '通过' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">
                {dayjs(currentReport.startTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="结束时间">
                {dayjs(currentReport.endTime).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="响应时间">{currentReport.responseTime}ms</Descriptions.Item>
              <Descriptions.Item label="状态码">{currentReport.statusCode || '-'}</Descriptions.Item>
              {currentReport.errorMessage && (
                <Descriptions.Item label="错误信息">
                  <Tag color="red">{currentReport.errorMessage}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
            {currentReport.responseBody && (
              <>
                <Divider>响应内容</Divider>
                <TextArea
                  rows={10}
                  value={currentReport.responseBody}
                  readOnly
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
              </>
            )}
          </div>
        )}
      </Drawer>
    </Card>
  )
}

export default APITest
