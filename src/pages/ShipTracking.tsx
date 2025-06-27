import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Select, Button, Tag, Drawer, Typography, Descriptions, Tabs, Empty, Tooltip } from 'antd';
import { SearchOutlined, InfoCircleOutlined, EnvironmentOutlined, CompassOutlined, BarChartOutlined, 
  FilterOutlined, ReloadOutlined, FullscreenOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { mockShips, mockPorts, getShipTrack, ShipData, mockRoutes, weatherMarkers } from '../data/mockData';
import RealMapComponent from '../components/RealMapComponent';
import '../styles/ShipTracking.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ShipTracking: React.FC = () => {
  const [ships, setShips] = useState(mockShips);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedShip, setSelectedShip] = useState<ShipData | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mapMode, setMapMode] = useState<'terrain' | 'satellite' | 'standard'>('satellite');
  const [isTracking, setIsTracking] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 每2秒更新一次船舶位置
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isTracking) {
        setLastUpdate(new Date());
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [isTracking]);

  // 处理搜索和筛选
  const handleSearch = () => {
    let filtered = mockShips;
    
    if (searchText) {
      filtered = filtered.filter(ship => 
        ship.name.toLowerCase().includes(searchText.toLowerCase()) ||
        ship.destination.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(ship => ship.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ship => ship.status === filterStatus);
    }
    
    setShips(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setFilterType('all');
    setFilterStatus('all');
    setShips(mockShips);
  };

  const showShipDetails = (ship: ShipData) => {
    setSelectedShip(ship);
    setDrawerVisible(true);
  };

  const shipTypes = Array.from(new Set(mockShips.map(ship => ship.type)));

  // 获取船舶状态文本
  const getStatusText = (status: string) => {
    switch(status) {
      case 'normal': return '正常';
      case 'warning': return '警告';
      case 'danger': return '危险';
      default: return '未知';
    }
  };

  // 获取船舶状态颜色
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'normal': return 'green';
      case 'warning': return 'orange';
      case 'danger': return 'red';
      default: return 'default';
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '船名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ShipData, b: ShipData) => a.name.localeCompare(b.name),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: shipTypes.map(type => ({ text: type, value: type })),
      onFilter: (value: any, record: ShipData) => record.type === value,
    },
    {
      title: '速度 (节)',
      dataIndex: 'speed',
      key: 'speed',
      sorter: (a: ShipData, b: ShipData) => a.speed - b.speed,
      render: (speed: number) => <span>{speed} 节</span>,
    },
    {
      title: '位置',
      key: 'position',
      render: (record: ShipData) => (
        <span>
          {record.position.longitude.toFixed(2)}°E, {record.position.latitude.toFixed(2)}°N
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: '正常', value: 'normal' },
        { text: '警告', value: 'warning' },
        { text: '危险', value: 'danger' },
      ],
      onFilter: (value: any, record: ShipData) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ShipData) => (
        <Button 
          type="link" 
          icon={<InfoCircleOutlined />} 
          onClick={() => showShipDetails(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="ship-tracking-container">
      {/* 顶部控制栏 */}
      <div className="tracking-header">
        <div className="header-left">
          <Title level={4} className="page-title">船舶实时定位</Title>
          <div className="tracking-status">
            <span className={`status-dot ${isTracking ? 'active' : ''}`}></span>
            <span className="status-text">{isTracking ? '实时跟踪中' : '已暂停'}</span>
            <span className="update-time">最后更新: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Input 
              placeholder="搜索船名或目的地" 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              onPressEnter={handleSearch}
            />
            <Select
              style={{ width: 120 }}
              placeholder="船舶类型"
              value={filterType}
              onChange={value => setFilterType(value)}
            >
              <Option value="all">全部类型</Option>
              {shipTypes.map((type, index) => (
                <Option value={type} key={index}>{type}</Option>
              ))}
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="船舶状态"
              value={filterStatus}
              onChange={value => setFilterStatus(value)}
            >
              <Option value="all">全部状态</Option>
              <Option value="normal">正常</Option>
              <Option value="warning">警告</Option>
              <Option value="danger">危险</Option>
            </Select>
            <Button type="primary" icon={<FilterOutlined />} onClick={handleSearch}>
              筛选
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="tracking-content">
        {/* 左侧地图区域 */}
        <div className="map-container">
          <div className="map-wrapper">
            <RealMapComponent 
              ships={ships}
              ports={mockPorts}
              onShipClick={showShipDetails}
              mapType={mapMode}
              weatherMarkers={weatherMarkers}
              routes={mockRoutes}
              zoomToFit={false}
              highlightedPorts={selectedShip ? [mockPorts.find(port => port.name === selectedShip.destination)?.id || ''] : []}
            />
          </div>
          
          {/* 地图控制按钮组 */}
          <div className="map-controls">
            <div className="control-group map-mode">
              <Tooltip title="标准地图">
                <Button
                  type={mapMode === 'standard' ? 'primary' : 'default'}
                  onClick={() => setMapMode('standard')}
                >
                  标准
                </Button>
              </Tooltip>
              <Tooltip title="地形地图">
                <Button
                  type={mapMode === 'terrain' ? 'primary' : 'default'}
                  onClick={() => setMapMode('terrain')}
                >
                  地形
                </Button>
              </Tooltip>
              <Tooltip title="卫星地图">
                <Button
                  type={mapMode === 'satellite' ? 'primary' : 'default'}
                  onClick={() => setMapMode('satellite')}
                >
                  卫星
                </Button>
              </Tooltip>
            </div>

            <div className="control-group display-controls">
              <Tooltip title={showLabels ? "隐藏标签" : "显示标签"}>
                <Button
                  icon={<EnvironmentOutlined />}
                  type={showLabels ? 'primary' : 'default'}
                  onClick={() => setShowLabels(!showLabels)}
                />
              </Tooltip>
              <Tooltip title={showWeather ? "隐藏气象" : "显示气象"}>
                <Button
                  icon={<CloudOutlined />}
                  type={showWeather ? 'primary' : 'default'}
                  onClick={() => setShowWeather(!showWeather)}
                />
              </Tooltip>
              <Tooltip title={showLegend ? "隐藏图例" : "显示图例"}>
                <Button
                  icon={<BarsOutlined />}
                  type={showLegend ? 'primary' : 'default'}
                  onClick={() => setShowLegend(!showLegend)}
                />
              </Tooltip>
              <Tooltip title={isTracking ? "暂停跟踪" : "开始跟踪"}>
                <Button
                  icon={isTracking ? <PauseOutlined /> : <PlayCircleOutlined />}
                  type={isTracking ? 'primary' : 'default'}
                  onClick={() => setIsTracking(!isTracking)}
                />
              </Tooltip>
            </div>
          </div>
        </div>
        
        {/* 右侧船舶列表 */}
        <div className="ships-panel">
          <div className="panel-header">
            <h3>船舶列表</h3>
            <div className="ship-count">共 {ships.length} 艘</div>
          </div>
          
          <div className="ship-list">
            {ships.map(ship => (
              <div 
                key={ship.id}
                className={`ship-item ${ship.id === selectedShip?.id ? 'selected' : ''} ${ship.status}`}
                onClick={() => showShipDetails(ship)}
              >
                <div className="ship-item-header">
                  <div className="ship-name">{ship.name}</div>
                  <div className={`ship-status ${ship.status}`}>
                    {getStatusText(ship.status)}
                  </div>
                </div>
                <div className="ship-item-details">
                  <div className="detail-line">
                    <span className="detail-label">类型:</span>
                    <span className="detail-value">{ship.type}</span>
                  </div>
                  <div className="detail-line">
                    <span className="detail-label">速度:</span>
                    <span className="detail-value">{ship.speed} 节</span>
                  </div>
                  <div className="detail-line">
                    <span className="detail-label">位置:</span>
                    <span className="detail-value">
                      {ship.position.longitude.toFixed(2)}°E, {ship.position.latitude.toFixed(2)}°N
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 船舶详情抽屉 */}
      <Drawer
        title={`船舶详情 - ${selectedShip?.name || ''}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={480}
        className="ship-detail-drawer"
      >
        {selectedShip && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <Descriptions bordered column={1} className="ship-details">
                <Descriptions.Item label="船舶ID">{selectedShip.id}</Descriptions.Item>
                <Descriptions.Item label="船舶类型">{selectedShip.type}</Descriptions.Item>
                <Descriptions.Item label="目的地">{selectedShip.destination}</Descriptions.Item>
                <Descriptions.Item label="当前位置">
                  经度: {selectedShip.position.longitude.toFixed(4)}, 
                  纬度: {selectedShip.position.latitude.toFixed(4)}
                </Descriptions.Item>
                <Descriptions.Item label="当前速度">{selectedShip.speed} 节</Descriptions.Item>
                <Descriptions.Item label="航行方向">{selectedShip.direction}°</Descriptions.Item>
                <Descriptions.Item label="预计到达时间">
                  {new Date(selectedShip.estimatedArrival).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedShip.status)}>
                    {getStatusText(selectedShip.status)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="货物信息" key="2">
              {selectedShip.cargoInfo ? (
                <Descriptions bordered column={1} className="ship-details">
                  <Descriptions.Item label="货物类型">{selectedShip.cargoInfo.type}</Descriptions.Item>
                  <Descriptions.Item label="货物重量">{selectedShip.cargoInfo.weight} 吨</Descriptions.Item>
                  {selectedShip.cargoInfo.containers && (
                    <Descriptions.Item label="集装箱数量">{selectedShip.cargoInfo.containers}</Descriptions.Item>
                  )}
                </Descriptions>
              ) : (
                <Empty description="暂无货物信息" />
              )}
            </TabPane>
            <TabPane tab="航行轨迹" key="3">
              <div className="track-info">
                <Text>最近 24 小时航行轨迹</Text>
                <div className="track-points">
                  {getShipTrack(selectedShip.id).map((point, index) => (
                    <div className="track-point" key={index}>
                      <div>时间: {new Date(point.timestamp).toLocaleString()}</div>
                      <div>位置: 经度 {point.position.longitude.toFixed(4)}, 纬度 {point.position.latitude.toFixed(4)}</div>
                      <div>速度: {point.speed} 节</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

// 自定义图标
const CloudOutlined = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
  </svg>
);

const BarsOutlined = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const PauseOutlined = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const PlayCircleOutlined = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

export default ShipTracking; 