import React, { useState, useEffect } from 'react'
import { Table, Card, Space, Button, Input, Select, Tag, Spin, Empty } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

interface Signal {
  id: string
  coin: string
  type: 'BUY' | 'SELL'
  price: number
  timestamp: string
  confidence: number
  indicators: Record<string, number>
}

const Signals: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchSignals()
  }, [])

  const fetchSignals = async () => {
    setLoading(true)
    try {
      // TODO: 替换为实际的API调用
      const mockSignals: Signal[] = [
        {
          id: '1',
          coin: 'BTC',
          type: 'BUY',
          price: 42000,
          timestamp: new Date().toISOString(),
          confidence: 85,
          indicators: { ema50: 41500, ema200: 40000, rsi: 55 },
        },
        {
          id: '2',
          coin: 'ETH',
          type: 'SELL',
          price: 2200,
          timestamp: new Date().toISOString(),
          confidence: 78,
          indicators: { ema50: 2250, ema200: 2100, rsi: 72 },
        },
        {
          id: '3',
          coin: 'SOL',
          type: 'BUY',
          price: 98,
          timestamp: new Date().toISOString(),
          confidence: 92,
          indicators: { ema50: 95, ema200: 90, rsi: 45 },
        },
      ]
      setSignals(mockSignals)
    } catch (error) {
      console.error('Failed to fetch signals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSignals = signals.filter(signal => {
    const matchFilter = filter === 'ALL' || signal.type === filter
    const matchSearch = signal.coin.toLowerCase().includes(searchText.toLowerCase())
    return matchFilter && matchSearch
  })

  const columns = [
    {
      title: 'Coin',
      dataIndex: 'coin',
      key: 'coin',
      width: 100,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Signal',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'BUY' ? 'green' : 'red'}>{type}</Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 120,
      render: (confidence: number) => (
        <div style={{
          background: `rgba(59, 130, 246, ${confidence / 100})`,
          padding: '4px 8px',
          borderRadius: '4px',
          textAlign: 'center',
        }}>
          {confidence}%
        </div>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ]

  return (
    <Card
      title="Trading Signals"
      bordered={false}
      style={{
        background: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
      }}
    >
      <Space style={{ marginBottom: '16px', display: 'flex' }} direction="vertical">
        <Space>
          <Input
            placeholder="Search coin..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 120 }}
            options={[
              { label: 'All Signals', value: 'ALL' },
              { label: 'Buy Only', value: 'BUY' },
              { label: 'Sell Only', value: 'SELL' },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchSignals}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </Space>

      <Spin spinning={loading}>
        {filteredSignals.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredSignals}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            style={{ color: '#e2e8f0' }}
          />
        ) : (
          <Empty description="No signals found" />
        )}
      </Spin>
    </Card>
  )
}

export default Signals
