import { useState } from 'react'
import { Button, Modal, List, Avatar, Input, Space, Typography, Tag } from 'antd'
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { TextArea } = Input

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const welcomeTips = [
  '如何快速创建一条接口测试用例？',
  '帮我生成一个UI自动化脚本示例',
  '如何配置流水线完成自动部署？',
]

const DeepseekAssistant: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: '您好，我是 Deepseek 智能助手，可以为您解答 DevOps 平台相关问题，或生成测试脚本、接口参数示例。',
      timestamp: dayjs().format('HH:mm:ss'),
    },
  ])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: dayjs().format('HH:mm:ss'),
    }
    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: `已收到您的问题：“${input.trim()}”。我会根据 Deepseek 模型给出优化建议与示例，稍候请在“帮助中心”查看详细说明。`,
      timestamp: dayjs().add(2, 'second').format('HH:mm:ss'),
    }
    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
  }

  return (
    <>
      <Button
        type="default"
        icon={<RobotOutlined />}
        onClick={() => setOpen(true)}
      >
        Deepseek 助手
      </Button>
      <Modal
        open={open}
        title={
          <Space>
            <RobotOutlined />
            <span>Deepseek 智能助手</span>
            <Tag color="blue">Beta</Tag>
          </Space>
        }
        width={640}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
            试试这些问题：
          </Typography.Paragraph>
          <Space wrap>
            {welcomeTips.map((tip) => (
              <Tag
                key={tip}
                color="geekblue"
                style={{ cursor: 'pointer' }}
                onClick={() => setInput(tip)}
              >
                {tip}
              </Tag>
            ))}
          </Space>
        </div>
        <div
          style={{
            height: 320,
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: 6,
            padding: 12,
            marginBottom: 16,
            background: '#fafafa',
          }}
        >
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ padding: '8px 0' }}>
                <List.Item.Meta
                  avatar={
                    item.role === 'assistant' ? (
                      <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#4096ff' }} />
                    ) : (
                      <Avatar icon={<UserOutlined />} />
                    )
                  }
                  title={
                    <Space size="small">
                      <Typography.Text strong>
                        {item.role === 'assistant' ? 'Deepseek' : '我'}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {item.timestamp}
                      </Typography.Text>
                    </Space>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </div>
        <Space.Compact direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={3}
            placeholder="输入问题，例如：请帮我生成一个针对登录接口的测试用例…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
            发送
          </Button>
        </Space.Compact>
      </Modal>
    </>
  )
}

export default DeepseekAssistant
