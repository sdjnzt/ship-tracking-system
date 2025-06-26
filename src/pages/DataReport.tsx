import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, DatePicker, Button, Select, Tabs, Space } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { mockStatistics, mockShips, mockCargos } from '../data/mockData';
import '../styles/DataReport.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const DataReport: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[Date, Date] | null>(null);
  const [reportType, setReportType] = useState<string>('monthly');
  const [loading, setLoading] = useState<boolean>(false);

  // 模拟加载数据
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 船舶运行报表数据
  const shipOperationData = [
    { month: '2025-01', totalDistance: 12500, fuelConsumption: 2450, maintenanceCost: 45000 },
    { month: '2025-02', totalDistance: 11800, fuelConsumption: 2280, maintenanceCost: 42000 },
    { month: '2025-03', totalDistance: 13200, fuelConsumption: 2520, maintenanceCost: 47000 },
    { month: '2025-04', totalDistance: 14100, fuelConsumption: 2650, maintenanceCost: 49000 },
    { month: '2025-05', totalDistance: 14800, fuelConsumption: 2830, maintenanceCost: 51000 },
    { month: '2025-06', totalDistance: 14200, fuelConsumption: 2750, maintenanceCost: 50000 },
  ];

  // 船舶运行表格列
  const shipOperationColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '总航行距离(海里)',
      dataIndex: 'totalDistance',
      key: 'totalDistance',
      sorter: (a: any, b: any) => a.totalDistance - b.totalDistance,
    },
    {
      title: '燃油消耗(吨)',
      dataIndex: 'fuelConsumption',
      key: 'fuelConsumption',
      sorter: (a: any, b: any) => a.fuelConsumption - b.fuelConsumption,
    },
    {
      title: '维护成本(元)',
      dataIndex: 'maintenanceCost',
      key: 'maintenanceCost',
      sorter: (a: any, b: any) => a.maintenanceCost - b.maintenanceCost,
    },
  ];

  // 货物运输报表数据
  const cargoTransportData = [
    { month: '2025-01', volume: 153, revenue: 1530000, onTimeRate: 91.2 },
    { month: '2025-02', volume: 142, revenue: 1420000, onTimeRate: 92.5 },
    { month: '2025-03', volume: 168, revenue: 1680000, onTimeRate: 93.1 },
    { month: '2025-04', volume: 185, revenue: 1850000, onTimeRate: 92.8 },
    { month: '2025-05', volume: 197, revenue: 1970000, onTimeRate: 94.2 },
    { month: '2025-06', volume: 209, revenue: 2090000, onTimeRate: 93.7 },
  ];

  // 货物运输表格列
  const cargoTransportColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '运输量',
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
    {
      title: '收入(元)',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      title: '准时率(%)',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      sorter: (a: any, b: any) => a.onTimeRate - b.onTimeRate,
      render: (value: number) => (
        <Tag color={value >= 93 ? 'success' : value >= 90 ? 'processing' : 'warning'}>
          {value}%
        </Tag>
      )
    },
  ];

  // 月度收入图表配置
  const revenueChartConfig = {
    data: cargoTransportData,
    xField: 'month',
    yField: 'revenue',
    color: '#1890ff',
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '收入(元)',
      },
      label: {
        formatter: (v: string) => `¥${parseInt(v).toLocaleString()}`,
      },
    },
  };

  // 燃油消耗图表配置
  const fuelConsumptionConfig = {
    data: shipOperationData,
    xField: 'month',
    yField: 'fuelConsumption',
    columnWidthRatio: 0.6,
    color: '#52c41a',
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '燃油消耗量(吨)',
      },
    },
  };

  // 货物类型分布图配置
  const cargoTypeConfig = {
    data: mockStatistics.cargoByType,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{type}: {percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div className="data-report">
      <div className="report-header">
        <Title level={2}>数据报表</Title>
        <Space size="large">
          <RangePicker 
            placeholder={['开始日期', '结束日期']}
            onChange={(dates) => {
              if (dates) {
                setTimeRange([dates[0]?.toDate() as Date, dates[1]?.toDate() as Date]);
              } else {
                setTimeRange(null);
              }
            }}
          />
          <Select 
            defaultValue="monthly" 
            style={{ width: 120 }} 
            onChange={(value) => setReportType(value)}
          >
            <Option value="daily">日报表</Option>
            <Option value="weekly">周报表</Option>
            <Option value="monthly">月报表</Option>
            <Option value="quarterly">季度报表</Option>
            <Option value="yearly">年报表</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            loading={loading}
            onClick={loadData}
          >
            刷新数据
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => alert('报表已导出')}
          >
            导出报表
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总运输量" 
              value={1054} 
              prefix={<BarChartOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总收入" 
              value={10540000} 
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总航行距离" 
              value={80600} 
              suffix="海里"
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="平均准时率" 
              value={92.9} 
              precision={1}
              suffix="%" 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" className="report-tabs">
        <TabPane tab={<span><LineChartOutlined />收入分析</span>} key="1">
          <Card title="月度收入趋势" className="chart-card">
            <div className="chart-container">
              <Line {...revenueChartConfig} />
            </div>
          </Card>
          <Card title="货物运输报表" className="table-card">
            <Table 
              dataSource={cargoTransportData} 
              columns={cargoTransportColumns}
              rowKey="month"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab={<span><BarChartOutlined />运营分析</span>} key="2">
          <Card title="燃油消耗趋势" className="chart-card">
            <div className="chart-container">
              <Column {...fuelConsumptionConfig} />
            </div>
          </Card>
          <Card title="船舶运行报表" className="table-card">
            <Table 
              dataSource={shipOperationData} 
              columns={shipOperationColumns}
              rowKey="month"
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab={<span><PieChartOutlined />货物分析</span>} key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="货物类型分布" className="chart-card">
                <div className="chart-container">
                  <Pie {...cargoTypeConfig} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="港口活动统计" className="chart-card">
                <Table 
                  dataSource={mockStatistics.portActivity} 
                  columns={[
                    { title: '港口', dataIndex: 'port', key: 'port' },
                    { title: '到达', dataIndex: 'arrivals', key: 'arrivals' },
                    { title: '出港', dataIndex: 'departures', key: 'departures' },
                    { 
                      title: '总活动量', 
                      key: 'total',
                      render: (_, record: any) => record.arrivals + record.departures
                    },
                  ]}
                  rowKey="port"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DataReport; 