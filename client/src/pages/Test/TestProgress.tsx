import { useState } from 'react'
import { Card, Progress, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface ProgressItem {
  id: string
  phase: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
  startTime: string
  endTime?: string
}

const TestProgress: React.FC = () => {
  const [progressItems] = useState<ProgressItem[]>([
    {
      id: '1',
      phase: '需求分析',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-01T09:00:00',
      endTime: '2024-01-05T18:00:00',
    },
    {
      id: '2',
      phase: '测试设计',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-06T09:00:00',
      endTime: '2024-01-10T18:00:00',
    },
    {
      id: '3',
      phase: '用例编写',
      status: 'in-progress',
      progress: 75,
      startTime: '2024-01-11T09:00:00',
    },
    {
      id: '4',
      phase: '测试执行',
      status: 'pending',
      progress: 0,
      startTime: '',
    },
    {
      id: '5',
      phase: '报告生成',
      status: 'pending',
      progress: 0,
      startTime: '',
    },
  ])

  const totalProgress = Math.round(
    progressItems.reduce((sum, item) => sum + item.progress, 0) / progressItems.length
  )

  const columns: ColumnsType<ProgressItem> = [
    {
      title: '阶段',
      dataIndex: 'phase',
      key: 'phase',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          completed: { color: 'success', text: '已完成' },
          'in-progress': { color: 'processing', text: '进行中' },
          pending: { color: 'default', text: '待开始' },
        }
        const s = statusMap[status as keyof typeof statusMap]
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time?: string) => (time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
  ]

  return (
    <div>
      <Card title="测试进度总览" style={{ marginBottom: 24 }}>
        <Progress
          percent={totalProgress}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>{totalProgress}%</span>
        </div>
      </Card>

      <Card title="阶段进度">
        <Table columns={columns} dataSource={progressItems} rowKey="id" />
      </Card>
    </div>
  )
}

export default TestProgress
