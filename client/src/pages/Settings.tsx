import { Card, Form, Input, Button, Switch, Divider } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const Settings: React.FC = () => {
  const [form] = Form.useForm()

  return (
    <Card title="系统设置">
      <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
        <Form.Item label="系统名称" name="systemName" initialValue="DevOps平台">
          <Input />
        </Form.Item>
        <Form.Item label="系统描述" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Divider />
        <Form.Item label="启用邮件通知" name="emailNotification" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="启用短信通知" name="smsNotification" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Settings

