import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm } from 'antd'
import { PlusOutlined, PlayCircleOutlined, EditOutlined, DeleteOutlined, CodeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { saveTestExecution } from '../../utils/testDataManager'

const { TextArea } = Input

interface UITest {
  id: string
  name: string
  type: 'selenium' | 'playwright' | 'cypress'
  status: 'draft' | 'running' | 'completed' | 'failed'
  lastRunTime?: string
  passRate?: number
  script?: string
}

const UITest: React.FC = () => {
  const [tests, setTests] = useState<UITest[]>([
    {
      id: '1',
      name: '登录页面UI测试',
      type: 'selenium',
      status: 'completed',
      lastRunTime: '2024-01-15T10:30:00',
      passRate: 95,
      script: `from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com/login")
driver.find_element(By.ID, "username").send_keys("test")
driver.find_element(By.ID, "password").send_keys("test123")
driver.find_element(By.ID, "login-btn").click()
assert "Dashboard" in driver.title
driver.quit()`,
    },
    {
      id: '2',
      name: '首页加载测试',
      type: 'playwright',
      status: 'running',
      lastRunTime: '2024-01-15T14:20:00',
      script: `from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com")
    assert page.title() == "Home Page"
    browser.close()`,
    },
    {
      id: '3',
      name: '表单提交测试',
      type: 'cypress',
      status: 'draft',
      script: `describe('Form Test', () => {
  it('should submit form', () => {
    cy.visit('https://example.com/form')
    cy.get('#name').type('Test User')
    cy.get('#email').type('test@example.com')
    cy.get('button[type="submit"]').click()
    cy.contains('Success').should('be.visible')
  })
})`,
    },
  ])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isScriptModalVisible, setIsScriptModalVisible] = useState(false)
  const [editingTest, setEditingTest] = useState<UITest | null>(null)
  const [currentScript, setCurrentScript] = useState('')
  const [form] = Form.useForm()

  const getDefaultScript = (type: string) => {
    const scripts: Record<string, string> = {
      selenium: `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
try:
    driver.get("https://example.com")
    # 添加你的测试步骤
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "element-id"))
    )
    # 执行操作
finally:
    driver.quit()`,
      playwright: `from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        page.goto("https://example.com")
        # 添加你的测试步骤
        page.click("#button-id")
        # 添加断言
        assert page.title() == "Expected Title"
    finally:
        browser.close()`,
      cypress: `describe('UI Test', () => {
  beforeEach(() => {
    cy.visit('https://example.com')
  })

  it('should perform test', () => {
    // 添加你的测试步骤
    cy.get('#element-id').click()
    cy.contains('Expected Text').should('be.visible')
  })
})`,
    }
    return scripts[type] || ''
  }

  const handleCreate = () => {
    setEditingTest(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: UITest) => {
    setEditingTest(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleEditScript = (record: UITest) => {
    setEditingTest(record)
    setCurrentScript(record.script || getDefaultScript(record.type))
    setIsScriptModalVisible(true)
  }

  const handleSaveScript = () => {
    if (editingTest) {
      setTests(tests.map((item) => (item.id === editingTest.id ? { ...item, script: currentScript } : item)))
      message.success('脚本保存成功')
      setIsScriptModalVisible(false)
      setCurrentScript('')
    }
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
      id: `ui_${id}_${Date.now()}`,
      testType: 'ui',
      testName: test.name,
      status: 'running',
      executionTime: 0,
      startTime,
      module: test.type,
      method: test.name,
      description: `UI测试: ${test.name} (${test.type})`,
    })

    // 模拟测试完成
    setTimeout(() => {
      const passRate = Math.floor(Math.random() * 20) + 80
      const endTime = new Date().toISOString()
      const executionTime = 3000 // 3秒执行时间
      const success = passRate >= 85 // 85%以上算通过

      setTests((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: success ? 'completed' : 'failed',
                passRate,
              }
            : item
        )
      )

      // 保存执行完成的记录到测试数据管理器
      saveTestExecution({
        id: `ui_${id}_${Date.now()}`,
        testType: 'ui',
        testName: test.name,
        status: success ? 'passed' : 'failed',
        executionTime,
        startTime,
        endTime,
        module: test.type,
        method: test.name,
        description: `UI测试: ${test.name} (${test.type})`,
        passRate,
        errorMessage: success ? undefined : `通过率${passRate}%低于85%`,
      })

      message.success(success ? '测试执行完成' : '测试执行失败')
    }, 3000)
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingTest) {
        setTests(tests.map((item) => (item.id === editingTest.id ? { ...item, ...values } : item)))
        message.success('更新成功')
      } else {
        const newTest: UITest = {
          id: Date.now().toString(),
          ...values,
          status: 'draft',
          script: getDefaultScript(values.type),
        }
        setTests([...tests, newTest])
        message.success('创建成功')
      }
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const columns: ColumnsType<UITest> = [
    {
      title: '测试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '测试类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          selenium: 'Selenium',
          playwright: 'Playwright',
          cypress: 'Cypress',
        }
        return typeMap[type as keyof typeof typeMap] || type
      },
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
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (rate?: number) => (rate ? `${rate}%` : '-'),
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
            icon={<CodeOutlined />}
            size="small"
            onClick={() => handleEditScript(record)}
          >
            编辑脚本
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

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建UI测试
        </Button>
      </div>
      <Table columns={columns} dataSource={tests} rowKey="id" />

      <Modal
        title={editingTest ? '编辑UI测试' : '新建UI测试'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false)
          form.resetFields()
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="测试名称" rules={[{ required: true, message: '请输入测试名称' }]}>
            <Input placeholder="请输入测试名称" />
          </Form.Item>
          <Form.Item name="type" label="测试类型" rules={[{ required: true, message: '请选择测试类型' }]}>
            <Select placeholder="请选择测试类型">
              <Select.Option value="selenium">Selenium</Select.Option>
              <Select.Option value="playwright">Playwright</Select.Option>
              <Select.Option value="cypress">Cypress</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑自动化脚本"
        open={isScriptModalVisible}
        onOk={handleSaveScript}
        onCancel={() => {
          setIsScriptModalVisible(false)
          setCurrentScript('')
        }}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <TextArea
            rows={20}
            value={currentScript}
            onChange={(e) => setCurrentScript(e.target.value)}
            placeholder="在此编写自动化测试脚本..."
            style={{ fontFamily: 'monospace', fontSize: 14 }}
          />
        </div>
        <div style={{ color: '#999', fontSize: 12 }}>
          <p>提示：</p>
          <ul>
            <li>Selenium: 使用Python编写，支持WebDriver API</li>
            <li>Playwright: 使用Python编写，支持同步和异步API</li>
            <li>Cypress: 使用JavaScript编写，支持端到端测试</li>
          </ul>
        </div>
      </Modal>
    </Card>
  )
}

export default UITest
