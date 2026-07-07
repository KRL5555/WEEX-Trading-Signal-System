import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Statistic, List, Tag, Space, Empty, Spin } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Signal {
  id: string
  coin: string
  type: 'BUY' | 'SELL'
  price: number
  timestamp: string
  confidence: number
}

const Dashboard: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalSignals: 0,
    buySignals: 0,
    sellSignals: 0,
    avgConfidence: 0,
    successRate: 0,
  })

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000) // 每5秒刷新
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // TODO: 替换为实际的API调用
      const mockSignals: Signal[] = [
        { id: '1', coin: 'BTC', type: 'BUY', price: 42000, timestamp: new Date().toISOString(), confidence: 85 },
        { id: '2', coin: 'ETH', type: 'SELL', price: 2200, timestamp: new Date().toISOString(), confidence: 78 },
        { id: '3', coin: 'SOL', type: 'BUY', price: 98, timestamp: new Date().toISOString(), confidence: 92 },
      ]
      setSignals(mockSignals)
      
      const buyCount = mockSignals.filter(s => s.type === 'BUY').length
      const sellCount = mockSignals.filter(s => s.type === 'SELL').length
      const avgConf = (mockSignals.reduce((sum, s) => sum + s.confidence, 0) / mockSignals.length)
      
      setStats({
        totalSignals: mockSignals.length,
        buySignals: buyCount,
        sellSignals: sellCount,
        avgConfidence: avgConf,
        successRate: 68,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'BTC', value: 42000 },
    { name: 'ETH', value: 2200 },
    { name: 'SOL', value: 98 },
  ]

  const colors = ['#3b82f6', '#10b981', '#f59e0b']

  return (
    <div style={{ width: '100%' }}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              bordered={false}
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                borderRadius: '8px',
              }}
            >
              <Statistic
                title="Total Signals"
                value={stats.totalSignals}
                suffix=""
                valueStyle={{ color: '#3b82f6', fontSize: '24px' }}
                prefix="📊"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #0d3e3a 100%)',
                borderRadius: '8px',
              }}
            >
              <Statistic
                title="Buy Signals"
                value={stats.buySignals}
                suffix=""
                valueStyle={{ color: '#10b981', fontSize: '24px' }}
                prefix="📈"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: 'linear-gradient(135deg, #7c2d12 0%, #5a1e0a 100%)',
                borderRadius: '8px',
              }}
            >
              <Statistic
                title="Sell Signals"
                value={stats.sellSignals}
                suffix=""
                valueStyle={{ color: '#f97316', fontSize: '24px' }}
                prefix="📉"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              bordered={false}
              style={{
                background: 'linear-gradient(135deg, #4c1d95 0%, #3b0764 100%)',
                borderRadius: '8px',
              }}
            >
              <Statistic
                title="Avg Confidence"
                value={stats.avgConfidence.toFixed(1)}
                suffix="%"
                valueStyle={{ color: '#a855f7', fontSize: '24px' }}
                prefix="🎯"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card 
              title="Recent Signals" 
              bordered={false}
              style={{
                background: '#1e293b',
                borderRadius: '8px',
                border: '1px solid #334155',
              }}
            >
              <List
                dataSource={signals}
                renderItem={(signal) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={signal.type === 'BUY' ? '📈' : '📉'}
                      title={
                        <Space>
                          <span>{signal.coin}</span>
                          <Tag color={signal.type === 'BUY' ? 'green' : 'red'}>
                            {signal.type}
                          </Tag>
                          <span style={{ color: '#94a3b8' }}>
                            Confidence: {signal.confidence}%
                          </span>
                        </Space>
                      }
                      description={`$${signal.price.toFixed(2)}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Signal Distribution"
              bordered={false}
              style={{
                background: '#1e293b',
                borderRadius: '8px',
                border: '1px solid #334155',
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {colors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  )
}

export default Dashboard
