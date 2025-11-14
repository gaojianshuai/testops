import { useState } from 'react'
import { Card, Table, Tag, Button, DatePicker, Space, message } from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

interface HistoricalReport {
  id: string
  planName: string
  version: string
  totalCases: number
  passed: number
  failed: number
  passRate: number
  createTime: string
}

const HistoricalReports: React.FC = () => {
  const [reports] = useState<HistoricalReport[]>([
    {
      id: '1',
      planName: 'COM-CTest测试方案',
      version: 'v3.2.0.13',
      totalCases: 62,
      passed: 57,
      failed: 5,
      passRate: 91.94,
      createTime: '2024-01-15T12:24:29',
    },
    {
      id: '2',
      planName: 'DOM-cTest测试方案',
      version: 'v3.2.0.12',
      totalCases: 60,
      passed: 58,
      failed: 2,
      passRate: 96.67,
      createTime: '2024-01-14T12:24:29',
    },
    {
      id: '3',
      planName: '【5.0】测试方案',
      version: 'v5.0.0',
      totalCases: 62,
      passed: 60,
      failed: 2,
      passRate: 96.77,
      createTime: '2024-01-13T12:24:29',
    },
  ])

  const handleView = (id: string) => {
    message.info(`查看报告 ${id}`)
  }

  const handleDownload = (id: string) => {
    message.success(`下载报告 ${id}`)
  }

  const columns: ColumnsType<HistoricalReport> = [
    {
      title: '测试计划',
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '总用例数',
      dataIndex: 'totalCases',
      key: 'totalCases',
    },
    {
      title: '通过',
      dataIndex: 'passed',
      key: 'passed',
      render: (value) => <Tag color="green">{value}</Tag>,
    },
    {
      title: '失败',
      dataIndex: 'failed',
      key: 'failed',
      render: (value) => <Tag color="red">{value}</Tag>,
    },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: '生成时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} size="small" onClick={() => handleView(record.id)}>
            查看
          </Button>
          <Button type="link" icon={<DownloadOutlined />} size="small" onClick={() => handleDownload(record.id)}>
            下载
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <RangePicker />
        </Space>
      </div>
      <Table columns={columns} dataSource={reports} rowKey="id" />
    </Card>
  )
}

export default HistoricalReports
