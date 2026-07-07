import React, { useState, useEffect } from 'react'
import { Layout, Menu, Drawer, Button, Badge, Space } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons'
import Dashboard from './pages/Dashboard'
import Signals from './pages/Signals'
import Settings from './pages/Settings'
import './App.css'

const { Header, Sider, Content } = Layout

type MenuKey = 'dashboard' | 'signals' | 'settings'

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [current, setCurrent] = useState<MenuKey>('dashboard')
  const [unreadSignals, setUnreadSignals] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // 模拟获取未读信号数
    setUnreadSignals(3)
  }, [])

  const renderContent = () => {
    switch (current) {
      case 'dashboard':
        return <Dashboard />
      case 'signals':
        return <Signals />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#1e293b',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="logo" style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3b82f6',
          fontSize: '20px',
          fontWeight: 'bold',
          borderBottom: '1px solid #334155',
        }}>
          {collapsed ? '📈' : '🚀 WEEX Signal'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          onClick={(e) => setCurrent(e.key as MenuKey)}
          style={{ background: '#1e293b', borderRight: 'none' }}
          items={[
            {
              key: 'dashboard',
              icon: <span>📊</span>,
              label: 'Dashboard',
            },
            {
              key: 'signals',
              icon: <BellOutlined />,
              label: 'Signals',
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Settings',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: '#0f172a',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid #334155',
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: '#e2e8f0', fontSize: '16px' }}
          />
          <Space size="large">
            <Badge count={unreadSignals} color="#ef4444">
              <BellOutlined style={{ fontSize: '18px', color: '#3b82f6' }} />
            </Badge>
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              onClick={() => setSettingsOpen(true)}
              style={{ color: '#e2e8f0', fontSize: '16px' }}
            />
          </Space>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: '24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 110px)',
        }}>
          {renderContent()}
        </Content>
      </Layout>
      <Drawer
        title="Quick Settings"
        onClose={() => setSettingsOpen(false)}
        open={settingsOpen}
      >
        <Settings />
      </Drawer>
    </Layout>
  )
}

export default App
