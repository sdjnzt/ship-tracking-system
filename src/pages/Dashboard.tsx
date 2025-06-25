import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, List, Progress } from 'antd';
import { 
  RocketOutlined, 
  EnvironmentOutlined, 
  InboxOutlined,
  ClockCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { mockShips, mockPorts, mockAnomalies, mockCargos, mockStatistics } from '../data/mockData';
import '../styles/Dashboard.css';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [latestShips, setLatestShips] = useState<any[]>([]);
  const [latestAnomalies, setLatestAnomalies] = useState<any[]>([]);

  useEffect(() => {
    // 模拟获取最新的船舶数据
    setLatestShips(mockShips.slice(0, 4));
    
    // 模拟获取最新异常事件
    setLatestAnomalies(mockAnomalies.slice(0, 3));
  }, []);

  const recentShipsColumns = [
    {
      title: '船名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let text = '正常';
        
        if (status === 'warning') {
          color = 'orange';
          text = '警告';
        } else if (status === 'danger') {
          color = 'red';
          text = '危险';
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '预计到达',
      dataIndex: 'estimatedArrival',
      key: 'estimatedArrival',
      render: (time: string) => {
        const date = new Date(time);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      }
    }
  ];

  // 货物类型分布图配置
  const cargoTypeConfig = {
    data: mockStatistics.cargoByType,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  // 月度装运量图表配置
  const monthlyShipmentsConfig = {
    data: mockStatistics.monthlyShipments,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    point: {
      size: 3,
      shape: 'circle',
    },
    yAxis: {
      title: {
        text: '装运量',
      },
    },
    xAxis: {
      title: {
        text: '月份',
      },
    },
  };

  return (
    <div className="dashboard">
      <Title level={2}>船舶物流追踪系统 - 总览</Title>
      
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总船舶数量" 
              value={mockStatistics.totalShips} 
              prefix={<RocketOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="stat-footer">
              <Tag color="green">运行中: {mockStatistics.activeShips}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="覆盖港口" 
              value={mockStatistics.totalPorts} 
              prefix={<EnvironmentOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
            <div className="stat-footer">
              <Tag color="blue">国内: {mockPorts.length}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="在运货物" 
              value={mockStatistics.totalCargo} 
              prefix={<InboxOutlined />} 
              valueStyle={{ color: '#fa8c16' }}
            />
            <div className="stat-footer">
              <Tag color="orange">集装箱: {mockCargos.filter(c => c.containerId).length}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="准时交付率" 
              value={mockStatistics.onTimeDelivery} 
              precision={1}
              prefix={<ClockCircleOutlined />} 
              suffix="%" 
              valueStyle={{ color: '#722ed1' }}
            />
            <div className="stat-footer">
              <Progress percent={mockStatistics.onTimeDelivery} size="small" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="content-row">
        <Col xs={24} lg={12}>
          <Card title="近期船舶动态" className="table-card">
            <Table 
              dataSource={latestShips} 
              columns={recentShipsColumns} 
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="预警信息" className="alert-card">
            <List
              dataSource={latestAnomalies}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<WarningOutlined className={`alert-icon ${item.severity}`} />}
                    title={<span className={item.severity}>{item.description}</span>}
                    description={
                      <>
                        <div>船舶: {mockShips.find(s => s.id === item.shipId)?.name}</div>
                        <div>时间: {new Date(item.timestamp).toLocaleString()}</div>
                      </>
                    }
                  />
                  <Tag color={item.severity === 'high' ? 'red' : item.severity === 'medium' ? 'orange' : 'blue'}>
                    {item.status === 'detected' ? '已检测' : item.status === 'investigating' ? '调查中' : '已解决'}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="chart-row">
        <Col xs={24} lg={12}>
          <Card title="货物类型分布">
            <Pie {...cargoTypeConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="月度装运量趋势">
            <Line {...monthlyShipmentsConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="port-activity-row">
        <Col span={24}>
          <Card title="港口活动统计">
            <Row gutter={16}>
              {mockStatistics.portActivity.map((port, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4.8} key={index}>
                  <Card className="port-activity-card">
                    <Statistic title={port.port} value={port.arrivals + port.departures} />
                    <div className="port-activity-details">
                      <div>到达: {port.arrivals}</div>
                      <div>出港: {port.departures}</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 