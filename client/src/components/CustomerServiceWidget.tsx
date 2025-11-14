import { useState } from 'react'
import { FloatButton, Modal, Tabs, Form, Input, Button, List, Avatar, Space, Tag, message } from 'antd'
import { CustomerServiceOutlined, MessageOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'

const { TextArea } = Input

const faqList = [
  {
    id: 1,
    question: '如何创建新的测试计划？',
    answer: '在左侧导航中前往“测试 → 测试方案”，点击右上角“创建”按钮即可新建测试计划。',
  },
  {
    id: 2,
    question: '如何配置接口测试的参数化？',
    answer: '在接口测试详情中，打开“参数化”标签页，添加参数名、参数值以及描述即可。',
  },
  {
    id: 3,
    question: '部署失败如何排查？',
    answer: '可在部署记录中查看最新日志，或联系运维人员，提供部署名称与时间便于排查。',
  },
]

const CustomerServiceWidget: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('客服留言', values)
        message.success('留言已提交，我们会尽快联系您！')
        form.resetFields()
        setOpen(false)
      })
      .catch(() => undefined)
  }

  return (
    <>
      <FloatButton
        icon={<CustomerServiceOutlined />}
        type="primary"
        tooltip="联系在线客服"
        onClick={() => setOpen(true)}
        style={{ right: 24, bottom: 24, zIndex: 1000 }}
      />
      <Modal
        open={open}
        title={
          <Space>
            <CustomerServiceOutlined />
            <span>在线客服</span>
            <Tag color="green">工作日 9:00-18:00</Tag>
          </Space>
        }
        width={520}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Tabs
          defaultActiveKey="faq"
          items={[
            {
              key: 'faq',
              label: '常见问题',
              children: (
                <List
                  itemLayout="vertical"
                  dataSource={faqList}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.question}
                        avatar={<Avatar icon={<MessageOutlined />} />}
                      />
                      <div>{item.answer}</div>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'contact',
              label: '联系专员',
              children: (
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                  <Form.Item
                    name="name"
                    label="您的姓名"
                    rules={[{ required: true, message: '请输入姓名' }]}
                  >
                    <Input placeholder="请输入您的姓名" />
                  </Form.Item>
                  <Form.Item
                    name="contact"
                    label="联系方式"
                    rules={[{ required: true, message: '请输入联系方式' }]}
                  >
                    <Input placeholder="邮箱或手机号" />
                  </Form.Item>
                  <Form.Item
                    name="issue"
                    label="问题描述"
                    rules={[{ required: true, message: '请描述您遇到的问题' }]}
                  >
                    <TextArea rows={4} placeholder="请详细描述您遇到的问题..." />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" block htmlType="submit">
                      提交工单
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'channel',
              label: '其他渠道',
              children: (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Space>
                    <PhoneOutlined style={{ color: '#1890ff' }} />
                    <span>电话：13152027756</span>
                  </Space>
                  <Space>
                    <MailOutlined style={{ color: '#52c41a' }} />
                    <span>邮箱：testops_jianshuai@126.com</span>
                  </Space>
                  <Space>
                    <MessageOutlined style={{ color: '#faad14' }} />
                    <span>QQ：1170527913</span>
                  </Space>
                </Space>
              ),
            },
          ]}
        />
      </Modal>
    </>
  )
}

export default CustomerServiceWidget
