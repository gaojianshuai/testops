import React from 'react'
import { Card, Row, Col, Statistic, List, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  BugOutlined,
  RocketOutlined,
  TeamOutlined,
  CodeOutlined,
  PlusOutlined,
} from '@ant-design/icons'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const recentActivities = [
    { id: 1, action: '创建了测试方案', user: 'Demo用户', time: '2小时前' },
    { id: 2, action: '执行了接口测试', user: 'Demo用户', time: '3小时前' },
    { id: 3, action: '完成了UI测试', user: 'Demo用户', time: '5小时前' },
    { id: 4, action: '部署了新版本', user: 'Demo用户', time: '1天前' },
  ]

  const handleQuickAction = (path: string) => {
    navigate(path)
  }

  const handleCreate = (type: string) => {
    switch (type) {
      case 'test-plan':
        navigate('/test/plans')
        break
      case 'deployment':
        navigate('/deployment')
        break
      case 'project':
        navigate('/management')
        break
      default:
        break
    }
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="测试用例"
              value={1234}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="通过率"
              value={92.5}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待修复缺陷"
              value={15}
              prefix={<BugOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部署次数"
              value={28}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            title="最近活动"
            extra={
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/collaboration') }}>
                查看更多
              </a>
            }
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <span>
                        <Tag color="blue">{item.user}</Tag>
                        {item.action}
                      </span>
                    }
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="快速入口">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  hoverable
                  onClick={() => handleQuickAction('/collaboration')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <div style={{ marginTop: 8 }}>协作</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  onClick={() => handleQuickAction('/code-repository')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <CodeOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <div style={{ marginTop: 8 }}>代码库</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  onClick={() => handleQuickAction('/test/plans')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <FileTextOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <div style={{ marginTop: 8 }}>测试方案</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  onClick={() => handleQuickAction('/deployment')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <RocketOutlined style={{ fontSize: 32, color: '#f5222d' }} />
                  <div style={{ marginTop: 8 }}>部署</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="快速创建">
            <Row gutter={16}>
              <Col span={6}>
                <Card
                  hoverable
                  onClick={() => handleCreate('test-plan')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div style={{ marginTop: 8, fontWeight: 'bold' }}>创建测试方案</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  hoverable
                  onClick={() => handleCreate('deployment')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <PlusOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <div style={{ marginTop: 8, fontWeight: 'bold' }}>创建部署</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  hoverable
                  onClick={() => handleCreate('project')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <PlusOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <div style={{ marginTop: 8, fontWeight: 'bold' }}>创建项目</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  hoverable
                  onClick={() => navigate('/test/case-design')}
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  <PlusOutlined style={{ fontSize: 24, color: '#f5222d' }} />
                  <div style={{ marginTop: 8, fontWeight: 'bold' }}>创建测试用例</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
