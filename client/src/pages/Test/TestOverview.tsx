import React from 'react'
import { Card, Row, Col, Statistic, Progress } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  BugOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const TestOverview: React.FC = () => {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="测试用例总数"
              value={1234}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已执行用例"
              value={856}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待执行用例"
              value={378}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="发现缺陷数"
              value={45}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="测试执行进度">
            <Progress
              percent={69.4}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <div style={{ marginTop: 16 }}>
              <p>已执行: 856 / 1234</p>
              <p>通过率: 92.3%</p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="缺陷统计">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="严重" value={5} valueStyle={{ color: '#f5222d' }} />
              </Col>
              <Col span={8}>
                <Statistic title="一般" value={25} valueStyle={{ color: '#faad14' }} />
              </Col>
              <Col span={8}>
                <Statistic title="轻微" value={15} valueStyle={{ color: '#1890ff' }} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default TestOverview

