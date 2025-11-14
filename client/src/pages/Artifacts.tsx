import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Input } from 'antd'
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Artifact {
  id: string
  name: string
  version: string
  type: 'jar' | 'war' | 'docker' | 'npm'
  size: string
  createTime: string
}

const Artifacts: React.FC = () => {
  const [artifacts] = useState<Artifact[]>([])

  const columns: ColumnsType<Artifact> = [
    {
      title: '制品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          jar: { color: 'blue', text: 'JAR' },
          war: { color: 'green', text: 'WAR' },
          docker: { color: 'cyan', text: 'Docker' },
          npm: { color: 'orange', text: 'NPM' },
        }
        const t = typeMap[type as keyof typeof typeMap]
        return <Tag color={t.color}>{t.text}</Tag>
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<DownloadOutlined />} size="small">
            下载
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="搜索制品"
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={artifacts} rowKey="id" />
    </Card>
  )
}

export default Artifacts

