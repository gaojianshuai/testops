import { useState, useEffect, useMemo } from 'react'
import { Card, Row, Col, Table, Tag, Button, Space, Select, Descriptions, Statistic, Switch } from 'antd'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts'
import { getTestStatistics, getHistoricalBuilds, subscribeToTestData } from '../../utils/testDataManager'
import dayjs from 'dayjs'

const { Option } = Select

interface TestCaseDetail {
  id: string
  module: string
  method: string
  description: string
  executionTime: number
  result: 'passed' | 'failed' | 'error' | 'skipped'
  testType: string
  testName: string
}

const TestReport: React.FC = () => {
  const [moduleFilter, setModuleFilter] = useState('all')
  const [resultFilter, setResultFilter] = useState('all')
  const [testTypeFilter, setTestTypeFilter] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval] = useState(5000) // 5秒刷新一次
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(new Date().toISOString())

  // 获取统计数据
  const [testData, setTestData] = useState(() => getTestStatistics())
  const [historicalBuilds, setHistoricalBuilds] = useState(() => getHistoricalBuilds())

  // 加载数据
  const loadData = () => {
    const stats = getTestStatistics()
    const history = getHistoricalBuilds()
    setTestData(stats)
    setHistoricalBuilds(history)
    setLastUpdateTime(new Date().toISOString())
  }

  // 初始化加载
  useEffect(() => {
    loadData()
  }, [])

  // 实时刷新
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // 监听localStorage变化（跨标签页同步）
  useEffect(() => {
    const unsubscribe = subscribeToTestData(() => {
      loadData()
    })

    return unsubscribe
  }, [])

  // 转换执行记录为测试用例详情
  const testCaseDetails: TestCaseDetail[] = useMemo(() => {
    return testData.executions
      .filter((exec) => exec.status !== 'running') // 过滤掉运行中的状态
      .map((exec) => ({
        id: exec.id,
        module: exec.module || `${exec.testType}/${exec.testName}`,
        method: exec.method || exec.testName,
        description: exec.description || `${exec.testType}测试`,
        executionTime: exec.executionTime / 1000, // 转换为秒
        result: exec.status as TestCaseDetail['result'],
        testType: exec.testType,
        testName: exec.testName,
      }))
  }, [testData.executions])

  // 执行结果柱状图数据
  const executionResultData = [
    { name: '通过用例', value: testData.passed, label: `${testData.passed}条`, fill: '#52c41a' },
    { name: '失败用例', value: testData.failed, label: `${testData.failed}条`, fill: '#ff4d4f' },
    { name: '错误用例', value: testData.error, label: `${testData.error}条`, fill: '#faad14' },
    { name: '跳过用例', value: testData.skipped, label: `${testData.skipped}条`, fill: '#d9d9d9' },
  ]

  // 成功占比饼图数据
  const pieData = [
    { name: '通过', value: testData.passed, color: '#52c41a' },
    { name: '失败', value: testData.failed, color: '#ff4d4f' },
    { name: '错误', value: testData.error, color: '#faad14' },
    { name: '跳过', value: testData.skipped, color: '#d9d9d9' },
  ]

  const COLORS = ['#52c41a', '#ff4d4f', '#faad14', '#d9d9d9']

  // 通过率趋势数据
  const trendData = historicalBuilds
    .slice()
    .reverse()
    .map((build) => ({
      date: build.executionTime.split(' ')[0],
      passRate: build.passRate,
      time: build.executionTime,
    }))

  // 过滤后的测试用例
  const filteredTestCases = testCaseDetails.filter((item) => {
    if (moduleFilter !== 'all' && !item.module.includes(moduleFilter)) {
      return false
    }
    if (resultFilter !== 'all' && item.result !== resultFilter) {
      return false
    }
    if (testTypeFilter !== 'all' && item.testType !== testTypeFilter) {
      return false
    }
    return true
  })

  // 获取所有模块列表
  const modules = Array.from(new Set(testCaseDetails.map((item) => item.module.split('/')[0])))

  // 获取测试类型列表
  const testTypes = Array.from(new Set(testCaseDetails.map((item) => item.testType)))

  const detailColumns: ColumnsType<TestCaseDetail> = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '测试类型',
      dataIndex: 'testType',
      key: 'testType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          api: '接口测试',
          ui: 'UI测试',
          case: '用例测试',
          jmeter: '性能测试',
        }
        return <Tag color="blue">{typeMap[type] || type}</Tag>
      },
    },
    {
      title: '用例模块',
      dataIndex: 'module',
      key: 'module',
      width: 250,
      filterDropdown: () => (
        <Select
          value={moduleFilter}
          onChange={setModuleFilter}
          style={{ width: 120, padding: 8 }}
        >
          <Option value="all">所有</Option>
          {modules.map((module) => (
            <Option key={module} value={module}>
              {module}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '测试方法',
      dataIndex: 'method',
      key: 'method',
      width: 200,
    },
    {
      title: '用例描述',
      dataIndex: 'description',
      key: 'description',
      width: 150,
    },
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      key: 'executionTime',
      width: 120,
      render: (time: number) => `${time.toFixed(3)} S`,
    },
    {
      title: '执行结果',
      dataIndex: 'result',
      key: 'result',
      width: 120,
      filterDropdown: () => (
        <Select
          value={resultFilter}
          onChange={setResultFilter}
          style={{ width: 120, padding: 8 }}
        >
          <Option value="all">所有</Option>
          <Option value="passed">通过</Option>
          <Option value="failed">失败</Option>
          <Option value="error">错误</Option>
          <Option value="skipped">跳过</Option>
        </Select>
      ),
      render: (result: string) => {
        const resultMap: Record<string, { color: string; text: string }> = {
          passed: { color: 'success', text: '通过' },
          failed: { color: 'error', text: '失败' },
          error: { color: 'warning', text: '错误' },
          skipped: { color: 'default', text: '跳过' },
          running: { color: 'processing', text: '执行中' },
        }
        const r = resultMap[result] || { color: 'default', text: result }
        return <Tag color={r.color}>{r.text}</Tag>
      },
    },
    {
      title: '详细信息',
      key: 'action',
      width: 120,
      render: () => (
        <Button type="link" size="small">
          查看详情
        </Button>
      ),
    },
  ]

  const historyColumns: ColumnsType<typeof historicalBuilds[0]> = [
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      key: 'executionTime',
    },
    {
      title: '用例总数',
      dataIndex: 'totalCases',
      key: 'totalCases',
    },
    {
      title: '成功用例数',
      dataIndex: 'successfulCases',
      key: 'successfulCases',
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (rate: number) => `${rate}%`,
    },
  ]

  const handleDownload = () => {
    const reportData = {
      statistics: testData,
      historicalBuilds,
      testCaseDetails: filteredTestCases,
      generateTime: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `测试报告_${dayjs().format('YYYYMMDDHHmmss')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 获取当前用户信息
  const getCurrentUser = () => {
    try {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const user = JSON.parse(userInfo)
        return user.username || 'Demo用户'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
    return 'Demo用户'
  }

  return (
    <div style={{ background: '#001529', minHeight: '100vh', padding: '24px', color: '#fff' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', marginBottom: 8 }}>每日构建测试报告</h1>
        <Space>
          <span style={{ color: '#999', fontSize: 12 }}>
            最后更新: {dayjs(lastUpdateTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          <Switch
            checked={autoRefresh}
            onChange={setAutoRefresh}
            checkedChildren="自动刷新"
            unCheckedChildren="手动刷新"
          />
          <Button icon={<ReloadOutlined />} onClick={loadData}>
            手动刷新
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        {/* 左侧：执行结果和成功占比 */}
        <Col span={8}>
          <Card
            title="执行结果"
            style={{ background: '#001529', border: '1px solid #434343', marginBottom: 16 }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={executionResultData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#434343" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ background: '#001529', border: '1px solid #434343', color: '#fff' }} />
                <Bar dataKey="value" fill="#1890ff">
                  {executionResultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card
            title="成功占比"
            style={{ background: '#001529', border: '1px solid #434343' }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#001529', border: '1px solid #434343', color: '#fff' }} />
                <Legend wrapperStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 中间：运行信息和通过率趋势 */}
        <Col span={8}>
          <Card
            title="运行信息"
            style={{ background: '#001529', border: '1px solid #434343', marginBottom: 16 }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="开始时间">
                {testData.startTime ? dayjs(testData.startTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="运行时长">
                {testData.totalDuration.toFixed(3)} S
              </Descriptions.Item>
              <Descriptions.Item label="成功用例">{testData.passed}</Descriptions.Item>
              <Descriptions.Item label="用例总数">{testData.total}</Descriptions.Item>
              <Descriptions.Item label="测试人员">{getCurrentUser()}</Descriptions.Item>
              <Descriptions.Item label="通过率">
                <Statistic value={testData.passRate} suffix="%" valueStyle={{ color: '#52c41a' }} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card
            title="通过率趋势图"
            style={{ background: '#001529', border: '1px solid #434343' }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#434343" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: '#001529', border: '1px solid #434343', color: '#fff' }}
                  formatter={(value: number) => `${value}%`}
                />
                <Line
                  type="monotone"
                  dataKey="passRate"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot={{ fill: '#52c41a', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 右侧：历史构建结果 */}
        <Col span={8}>
          <Card
            title="历史构建结果"
            style={{ background: '#001529', border: '1px solid #434343' }}
            styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
          >
            <Table
              columns={historyColumns}
              dataSource={historicalBuilds}
              rowKey="executionTime"
              pagination={false}
              size="small"
              style={{ color: '#fff' }}
              className="dark-table"
            />
          </Card>
        </Col>
      </Row>

      {/* 底部：本次运行详情 */}
      <Card
        title="本次运行详情"
        style={{ background: '#001529', border: '1px solid #434343' }}
        styles={{ header: { color: '#fff', borderBottom: '1px solid #434343' }, body: { color: '#fff' } }}
        extra={
          <Space>
            <Select
              value={testTypeFilter}
              onChange={setTestTypeFilter}
              style={{ width: 120 }}
            >
              <Option value="all">所有类型</Option>
              {testTypes.map((type) => {
                const typeMap: Record<string, string> = {
                  api: '接口测试',
                  ui: 'UI测试',
                  case: '用例测试',
                  jmeter: '性能测试',
                }
                return (
                  <Option key={type} value={type}>
                    {typeMap[type] || type}
                  </Option>
                )
              })}
            </Select>
            <Button icon={<DownloadOutlined />} onClick={handleDownload}>
              下载报告
            </Button>
          </Space>
        }
      >
        <Table
          columns={detailColumns}
          dataSource={filteredTestCases}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={{ color: '#fff' }}
          className="dark-table"
        />
      </Card>
    </div>
  )
}

export default TestReport
