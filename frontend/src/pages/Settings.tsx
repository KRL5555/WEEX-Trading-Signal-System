import React, { useState } from 'react'
import { Form, Input, InputNumber, Select, Switch, Button, Card, Row, Col, Space, message, Divider } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

interface SettingsForm {
  emailAddress: string
  emailAuthCode: string
  smsProvider: string
  smsAccessKey: string
  smsSecretKey: string
  wechatWebhook: string
  dingtalkWebhook: string
  telegramToken: string
  telegramChatId: string
  monitorInterval: number
  maxCoins: number
  notifications: {
    email: boolean
    sms: boolean
    app: boolean
    wechat: boolean
    dingtalk: boolean
    telegram: boolean
  }
}

const Settings: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SettingsForm>({
    emailAddress: '1127819222@qq.com',
    emailAuthCode: '',
    smsProvider: 'aliyun',
    smsAccessKey: '',
    smsSecretKey: '',
    wechatWebhook: '',
    dingtalkWebhook: '',
    telegramToken: '',
    telegramChatId: '',
    monitorInterval: 3600,
    maxCoins: 500,
    notifications: {
      email: true,
      sms: false,
      app: true,
      wechat: false,
      dingtalk: false,
      telegram: false,
    },
  })

  const handleSave = async (values: any) => {
    setLoading(true)
    try {
      // TODO: 调用API保存设置
      console.log('Settings to save:', values)
      message.success('Settings saved successfully!')
      setSettings(values)
    } catch (error) {
      message.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={settings}
      >
        {/* Email Settings */}
        <Card 
          title="📧 Email Notification"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="emailAddress"
                rules={[{ required: true, message: 'Please input email address!' }]}
              >
                <Input placeholder="your@email.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Auth Code (from QQ Mail)"
                name="emailAuthCode"
                tooltip="Get from QQ Mail settings"
              >
                <Input.Password placeholder="16-digit auth code" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['notifications', 'email']} valuePropName="checked">
            <Space>
              <Switch />
              <span>Enable Email Notifications</span>
            </Space>
          </Form.Item>
        </Card>

        {/* SMS Settings */}
        <Card
          title="📱 SMS Notification"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="SMS Provider" name="smsProvider">
                <Select
                  options={[
                    { label: 'Aliyun', value: 'aliyun' },
                    { label: 'Tencent Cloud', value: 'tencent' },
                    { label: 'AWS SNS', value: 'aws' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Access Key" name="smsAccessKey">
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Secret Key" name="smsSecretKey">
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['notifications', 'sms']} valuePropName="checked">
            <Space>
              <Switch />
              <span>Enable SMS Notifications</span>
            </Space>
          </Form.Item>
        </Card>

        {/* WeChat Settings */}
        <Card
          title="💬 WeChat Notification"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Form.Item
            label="WeChat Webhook URL"
            name="wechatWebhook"
            tooltip="Get from WeChat Bot settings"
          >
            <Input placeholder="https://qyapi.weixin.qq.com/cgi-bin/..." />
          </Form.Item>
          <Form.Item name={['notifications', 'wechat']} valuePropName="checked">
            <Space>
              <Switch />
              <span>Enable WeChat Notifications</span>
            </Space>
          </Form.Item>
        </Card>

        {/* DingTalk Settings */}
        <Card
          title="🔔 DingTalk Notification"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Form.Item
            label="DingTalk Webhook URL"
            name="dingtalkWebhook"
            tooltip="Get from DingTalk Bot settings"
          >
            <Input placeholder="https://oapi.dingtalk.com/robot/send?..." />
          </Form.Item>
          <Form.Item name={['notifications', 'dingtalk']} valuePropName="checked">
            <Space>
              <Switch />
              <span>Enable DingTalk Notifications</span>
            </Space>
          </Form.Item>
        </Card>

        {/* Telegram Settings */}
        <Card
          title="🤖 Telegram Notification"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Bot Token"
                name="telegramToken"
                tooltip="Get from @BotFather"
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Chat ID"
                name="telegramChatId"
                tooltip="Your Telegram Chat ID"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name={['notifications', 'telegram']} valuePropName="checked">
            <Space>
              <Switch />
              <span>Enable Telegram Notifications</span>
            </Space>
          </Form.Item>
        </Card>

        <Divider />

        {/* Monitor Settings */}
        <Card
          title="⚙️ Monitor Settings"
          bordered={false}
          style={{
            background: '#1e293b',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '1px solid #334155',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Check Interval (seconds)"
                name="monitorInterval"
              >
                <InputNumber min={60} max={86400} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Max Coins to Monitor"
                name="maxCoins"
              >
                <InputNumber min={1} max={5000} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Settings
