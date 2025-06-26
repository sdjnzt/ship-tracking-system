import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Row, Col, Table, Statistic, 
  Input, Button, Tag, Tabs, Space, Spin, 
  Tooltip, Badge, Progress, Divider, List, Avatar,
  Empty, Radio, RadioChangeEvent
} from 'antd';
import { 
  SearchOutlined, EnvironmentOutlined, ClockCircleOutlined, 
  ShopOutlined, BarChartOutlined, InfoCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined,
  FileTextOutlined, CaretUpOutlined, CaretDownOutlined,
  GlobalOutlined, AppstoreOutlined, UnorderedListOutlined,
  FilterOutlined, RightOutlined
} from '@ant-design/icons';
import AMapComponent from '../components/AMapComponent';
import { mockShips, mockPorts, PortData } from '../data/mockData';
import '../styles/PortInformation.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Group: RadioGroup, Button: RadioButton } = Radio;

const PortInformation: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredPorts, setFilteredPorts] = useState<PortData[]>(mockPorts);
  const [loading, setLoading] = useState(false);
  const [selectedPort, setSelectedPort] = useState<PortData | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // 初始加载效果
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 处理搜索
  const handleSearch = () => {
    if (!searchText) {
      setFilteredPorts(mockPorts);
      return;
    }

    const filtered = mockPorts.filter(port => 
      port.name.toLowerCase().includes(searchText.toLowerCase()) || 
      port.id.toLowerCase().includes(searchText.toLowerCase()) || 
      port.country.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setFilteredPorts(filtered);
  };

  // 获取港口状态
  const getPortStatus = (port: PortData) => {
    const occupancyRate = (port.currentOccupancy / port.capacity) * 100;
    if (occupancyRate >= 90) return 'high';
    if (occupancyRate >= 70) return 'medium';
    return 'low';
  };

  // 获取港口状态标签
  const getPortStatusTag = (port: PortData) => {
    const status = getPortStatus(port);
    switch (status) {
      case 'high':
        return <Tag color="error">繁忙</Tag>;
      case 'medium':
        return <Tag color="warning">适中</Tag>;
      case 'low':
        return <Tag color="success">空闲</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 获取等待时间标签
  const getWaitingTimeTag = (waitingTime: number) => {
    if (waitingTime > 4) {
      return (
        <Tag color="red">
          <ClockCircleOutlined /> {waitingTime}小时
        </Tag>
      );
    } else if (waitingTime > 2) {
      return (
        <Tag color="orange">
          <ClockCircleOutlined /> {waitingTime}小时
        </Tag>
      );
    } else {
      return (
        <Tag color="green">
          <ClockCircleOutlined /> {waitingTime}小时
        </Tag>
      );
    }
  };

  // 获取容量进度条状态
  const getCapacityProgressStatus = (port: PortData): "success" | "exception" | "normal" => {
    const occupancyRate = (port.currentOccupancy / port.capacity) * 100;
    if (occupancyRate >= 90) return 'exception';
    if (occupancyRate >= 70) return 'normal';
    return 'success';
  };

  // 获取表格列定义
  const columns = [
    {
      title: '港口名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: PortData) => (
        <a onClick={() => setSelectedPort(record)}>{text}</a>
      ),
    },
    {
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      render: (position: {longitude: number, latitude: number}, record: PortData) => (
        <span>
          <EnvironmentOutlined /> {position.longitude.toFixed(3)}°, {position.latitude.toFixed(3)}°
          <Tooltip title={record.country}>
            <Tag color="blue" style={{ marginLeft: 8 }}>
              <GlobalOutlined /> {record.country}
            </Tag>
          </Tooltip>
        </span>
      ),
    },
    {
      title: '容量利用率',
      key: 'occupancy',
      render: (text: string, record: PortData) => {
        const percent = Math.round((record.currentOccupancy / record.capacity) * 100);
        return (
          <Tooltip title={`${record.currentOccupancy}/${record.capacity} (${percent}%)`}>
            <Progress 
              percent={percent} 
              size="small" 
              status={getCapacityProgressStatus(record)} 
              style={{ width: 120 }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: '停靠船只',
      dataIndex: 'ships',
      key: 'ships',
      render: (ships: string[]) => <Badge count={ships.length} showZero color="#1890ff" />,
    },
    {
      title: '等待时间',
      dataIndex: 'waitingTime',
      key: 'waitingTime',
      render: (waitingTime: number) => getWaitingTimeTag(waitingTime),
      sorter: (a: PortData, b: PortData) => a.waitingTime - b.waitingTime,
    },
    {
      title: '状态',
      key: 'status',
      render: (text: string, record: PortData) => getPortStatusTag(record),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: PortData) => (
        <Button 
          type="link" 
          onClick={() => setSelectedPort(record)}
          icon={<InfoCircleOutlined />}
        >
          详情
        </Button>
      ),
    },
  ];

  // 获取港口统计数据
  const getPortsStatistics = () => {
    const totalPorts = mockPorts.length;
    const busyPorts = mockPorts.filter(port => {
      const occupancyRate = (port.currentOccupancy / port.capacity) * 100;
      return occupancyRate >= 90;
    }).length;
    const totalCapacity = mockPorts.reduce((sum, port) => sum + port.capacity, 0);
    const totalOccupancy = mockPorts.reduce((sum, port) => sum + port.currentOccupancy, 0);
    const avgWaitingTime = mockPorts.reduce((sum, port) => sum + port.waitingTime, 0) / totalPorts;
    
    return {
      totalPorts,
      busyPorts,
      busyPortsPercent: Math.round((busyPorts / totalPorts) * 100),
      totalCapacity,
      totalOccupancy,
      occupancyRate: Math.round((totalOccupancy / totalCapacity) * 100),
      avgWaitingTime
    };
  };

  const stats = getPortsStatistics();

  // 根据状态筛选港口
  const filterPortsByStatus = (status: string) => {
    if (status === 'all') {
      setFilteredPorts(mockPorts);
      return;
    }

    const filtered = mockPorts.filter(port => {
      const portStatus = getPortStatus(port);
      return portStatus === status;
    });

    setFilteredPorts(filtered);
  };

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    filterPortsByStatus(key);
  };

  // 渲染港口详情
  const renderPortDetails = () => {
    if (!selectedPort) return null;

    const occupancyRate = (selectedPort.currentOccupancy / selectedPort.capacity) * 100;
    const shipsInPort = mockShips.filter(ship => selectedPort.ships.includes(ship.id));
    const portStatus = getPortStatus(selectedPort);

    return (
      <Card className="port-detail-card">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className="port-header">
              <div>
                <Title level={4}>
                  <EnvironmentOutlined /> {selectedPort.name}
                  <Tag color="blue" className="port-country">{selectedPort.country}</Tag>
                  {getPortStatusTag(selectedPort)}
                </Title>
                <Text type="secondary">
                  位置: {selectedPort.position.longitude.toFixed(3)}°, {selectedPort.position.latitude.toFixed(3)}°
                </Text>
              </div>
              <Button onClick={() => setSelectedPort(null)} icon={<CloseCircleOutlined />}>
                返回列表
              </Button>
            </div>
          </Col>
          
          <Col xs={24} lg={16}>
            <Card size="small" title="港口位置" className="map-card">
              <div style={{ height: 350 }}>
                <AMapComponent 
                  ships={shipsInPort}
                  ports={[selectedPort]}
                  onShipClick={() => {}}
                  highlightedPorts={[selectedPort.id]}
                  weatherMarkers={[]}
                  routes={[]}
                  zoomToFit={true}
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card size="small" title="港口容量" className="stat-detail-card">
                  <Statistic 
                    title="容量利用率" 
                    value={occupancyRate} 
                    precision={1} 
                    suffix="%" 
                    valueStyle={{ 
                      color: occupancyRate > 90 ? '#ff4d4f' : occupancyRate > 70 ? '#faad14' : '#52c41a',
                      fontSize: '24px'
                    }}
                  />
                  <Paragraph>
                    当前使用: {selectedPort.currentOccupancy}/{selectedPort.capacity}
                  </Paragraph>
                  <Progress 
                    percent={occupancyRate} 
                    status={getCapacityProgressStatus(selectedPort)}
                    strokeWidth={10}
                    showInfo={false}
                  />
                  <div className="port-status-indicator">
                    <Tag 
                      color={
                        portStatus === 'high' ? 'red' : 
                        portStatus === 'medium' ? 'orange' : 'green'
                      }
                      style={{ marginTop: 8, padding: '2px 12px' }}
                    >
                      {portStatus === 'high' ? '繁忙' : portStatus === 'medium' ? '适中' : '空闲'}
                    </Tag>
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" title="等待时间" className="stat-detail-card">
                  <Statistic 
                    title="平均等待时间" 
                    value={selectedPort.waitingTime} 
                    suffix="小时" 
                    valueStyle={{ 
                      color: selectedPort.waitingTime > 4 ? '#ff4d4f' : selectedPort.waitingTime > 2 ? '#faad14' : '#52c41a',
                      fontSize: '24px'
                    }}
                    prefix={<ClockCircleOutlined />}
                  />
                  <div className="waiting-time-indicators" style={{ marginTop: 8 }}>
                    {selectedPort.waitingTime < 2 ? (
                      <Tag color="success">等待时间短</Tag>
                    ) : selectedPort.waitingTime < 4 ? (
                      <Tag color="warning">等待时间适中</Tag>
                    ) : (
                      <Tag color="error">等待时间长</Tag>
                    )}
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" title="停靠船只" className="stat-detail-card">
                  <Statistic 
                    title="当前船只数量" 
                    value={selectedPort.ships.length} 
                    prefix={<ShopOutlined />}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <div className="ships-status" style={{ marginTop: 8 }}>
                    <Tag color="blue">集装箱船: {shipsInPort.filter(ship => ship.type === '集装箱船').length}</Tag>
                    <Tag color="cyan">散货船: {shipsInPort.filter(ship => ship.type === '散货船').length}</Tag>
                    <Tag color="purple">油轮: {shipsInPort.filter(ship => ship.type === '油轮').length}</Tag>
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
          
          <Col span={24}>
            <Card 
              size="small" 
              title="当前停靠船只" 
              className="ships-list-card"
              extra={<Badge count={shipsInPort.length} showZero style={{ backgroundColor: '#1890ff' }} />}
            >
              {shipsInPort.length > 0 ? (
                <List
                  dataSource={shipsInPort}
                  renderItem={ship => (
                    <List.Item key={ship.id} className="ship-list-item">
                      <List.Item.Meta
                        avatar={<Avatar icon={<ShopOutlined />} style={{ 
                          backgroundColor: ship.status === 'normal' ? '#52c41a' : ship.status === 'warning' ? '#faad14' : '#ff4d4f' 
                        }} />}
                        title={<Space>
                          <Text strong>{ship.name}</Text>
                          <Tag color="blue">{ship.type}</Tag>
                          <Tag color={ship.status === 'normal' ? 'green' : ship.status === 'warning' ? 'orange' : 'red'}>
                            {ship.status === 'normal' ? '正常' : ship.status === 'warning' ? '警告' : '危险'}
                          </Tag>
                        </Space>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text>目的地: {ship.destination}</Text>
                            <Text type="secondary">预计抵达: {new Date(ship.estimatedArrival).toLocaleString()}</Text>
                          </Space>
                        }
                      />
                      <Button type="link" icon={<RightOutlined />}>详情</Button>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无船只停靠" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染网格视图
  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredPorts.map(port => {
        const occupancyRate = Math.round((port.currentOccupancy / port.capacity) * 100);
        const portStatus = getPortStatus(port);
        const statusColors = {
          high: '#ff4d4f',
          medium: '#faad14',
          low: '#52c41a'
        };
        
        return (
          <Col xs={24} sm={12} lg={8} xl={6} key={port.id}>
            <Card 
              className="port-card"
              hoverable
              onClick={() => setSelectedPort(port)}
            >
              <div className="port-card-header">
                <Title level={4} className="port-name">
                  <EnvironmentOutlined /> {port.name}
                </Title>
                <Tag color="blue"><GlobalOutlined /> {port.country}</Tag>
              </div>
              
              <div className="port-card-body">
                <div className="port-occupancy">
                  <div className="occupancy-stat">
                    <span className="occupancy-label">容量利用率</span>
                    <span className="occupancy-value" style={{ color: statusColors[portStatus] }}>
                      {occupancyRate}%
                    </span>
                  </div>
                  <Progress 
                    percent={occupancyRate} 
                    status={getCapacityProgressStatus(port)}
                    showInfo={false}
                  />
                </div>
                
                <div className="port-stats">
                  <div className="port-stat-item">
                    <ShopOutlined /> 停靠船只: <Badge count={port.ships.length} showZero color="#1890ff" />
                  </div>
                  <div className="port-stat-item">
                    <ClockCircleOutlined /> 等待时间: {port.waitingTime} 小时
                  </div>
                </div>
                
                <div className="port-footer">
                  <div className="port-status">
                    {getPortStatusTag(port)}
                  </div>
                  <Button 
                    size="small"
                    type="link" 
                    icon={<InfoCircleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPort(port);
                    }}
                  >
                    详情
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div className="port-information-container">
      <div className="page-header">
        <div>
          <Title level={3}><EnvironmentOutlined /> 港口信息</Title>
          <Text type="secondary">提供全球港口实时信息、容量利用率、等待时间和停靠船只数据</Text>
        </div>
        
        <div className="controls">
          <Space size="large">
            <RadioGroup 
              value={viewMode} 
              onChange={(e) => setViewMode((e.target as HTMLInputElement).value as 'grid' | 'list')}
              buttonStyle="solid"
            >
              <RadioButton value="grid"><AppstoreOutlined /> 网格视图</RadioButton>
              <RadioButton value="list"><UnorderedListOutlined /> 列表视图</RadioButton>
            </RadioGroup>
            
            <Button 
              icon={<FilterOutlined />}
              type="primary"
            >
              筛选
            </Button>
          </Space>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title={<div className="stat-title"><EnvironmentOutlined /> 港口总数</div>}
              value={stats.totalPorts} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title={<div className="stat-title"><BarChartOutlined /> 繁忙港口</div>}
              value={stats.busyPorts} 
              suffix={`/ ${stats.totalPorts}`}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title={<div className="stat-title"><ClockCircleOutlined /> 平均等待时间</div>}
              value={stats.avgWaitingTime} 
              precision={1}
              suffix="小时" 
              valueStyle={{ 
                color: stats.avgWaitingTime > 4 ? '#ff4d4f' : stats.avgWaitingTime > 2 ? '#faad14' : '#52c41a' 
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic 
              title={<div className="stat-title"><BarChartOutlined /> 总体使用率</div>}
              value={stats.occupancyRate} 
              suffix="%" 
              valueStyle={{ 
                color: stats.occupancyRate > 90 ? '#ff4d4f' : stats.occupancyRate > 70 ? '#faad14' : '#52c41a' 
              }}
            />
          </Card>
        </Col>
      </Row>
      
      {!selectedPort && (
        <>
          {/* 搜索栏 */}
          <Card className="search-card">
            <Row gutter={16} align="middle">
              <Col xs={24} md={8} lg={10}>
                <Input 
                  placeholder="请输入港口名称或所在国家/地区" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                  onPressEnter={handleSearch}
                />
              </Col>
              <Col xs={24} md={8} lg={6}>
                <Space>
                  <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                    查询
                  </Button>
                  <Button 
                    onClick={() => { 
                      setSearchText(''); 
                      setFilteredPorts(mockPorts); 
                    }} 
                    icon={<ReloadOutlined />}
                  >
                    重置
                  </Button>
                </Space>
              </Col>
              <Col xs={0} md={8} lg={8} style={{ textAlign: 'right' }}>
                <Text type="secondary">
                  已找到 {filteredPorts.length} 个港口
                </Text>
              </Col>
            </Row>
          </Card>
          
          {/* 港口列表 */}
          <Card className="port-list-card">
            <Tabs activeKey={activeTab} onChange={handleTabChange} className="port-tabs">
              <TabPane tab="全部港口" key="all" />
              <TabPane tab={<span><Badge color="red" />繁忙港口</span>} key="high" />
              <TabPane tab={<span><Badge color="orange" />适中港口</span>} key="medium" />
              <TabPane tab={<span><Badge color="green" />空闲港口</span>} key="low" />
            </Tabs>
            
            <Divider style={{ margin: '0 0 16px 0' }} />
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>加载港口数据中...</p>
              </div>
            ) : filteredPorts.length > 0 ? (
              viewMode === 'grid' ? (
                renderGridView()
              ) : (
                <Table 
                  dataSource={filteredPorts} 
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  className="ports-table"
                  rowClassName="port-row"
                />
              )
            ) : (
              <Empty 
                description="没有找到符合条件的港口" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </>
      )}
      
      {/* 港口详情 */}
      {selectedPort && renderPortDetails()}
    </div>
  );
};

export default PortInformation; 