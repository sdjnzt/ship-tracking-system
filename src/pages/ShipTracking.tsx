import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Input, Select, Button, Tag, Drawer, Typography, Descriptions, Tabs } from 'antd';
import { SearchOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { mockShips, mockPorts, getShipTrack, ShipData } from '../data/mockData';
import '../styles/ShipTracking.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ShipTracking: React.FC = () => {
  const [ships, setShips] = useState(mockShips);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedShip, setSelectedShip] = useState<any>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

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
    
    setShips(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setFilterType('all');
    setShips(mockShips);
  };

  const showShipDetails = (ship: any) => {
    setSelectedShip(ship);
    setDrawerVisible(true);
  };

  const shipTypes = Array.from(new Set(mockShips.map(ship => ship.type)));

  const columns = [
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
      title: '速度 (节)',
      dataIndex: 'speed',
      key: 'speed',
      sorter: (a: ShipData, b: ShipData) => a.speed - b.speed,
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
      },
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
    <div className="ship-tracking">
      <Title level={2}>船舶实时定位</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="map-card">
            <div className="map-placeholder">
              <div className="map-overlay">
                <Title level={3}>地图加载中...</Title>
                <Text type="secondary">此处将显示实时船舶定位地图，包含船舶位置、航线和港口信息。</Text>
                <Text type="secondary">在实际项目中，可以集成高德地图、百度地图或 Mapbox 等地图服务。</Text>
              </div>
              <div className="port-markers">
                {mockPorts.map(port => (
                  <div 
                    className="port-marker" 
                    key={port.id}
                    style={{ 
                      left: `${(port.position.longitude - 115) * 30}px`, 
                      top: `${400 - (port.position.latitude - 30) * 30}px`
                    }}
                    title={`${port.name} (在港船舶: ${port.ships.length})`}
                  >
                    <div className="port-icon">
                      <EnvironmentOutlined />
                    </div>
                    <div className="port-name">{port.name}</div>
                  </div>
                ))}
              </div>
              <div className="ship-markers">
                {ships.map(ship => (
                  <div 
                    className={`ship-marker ${ship.status}`} 
                    key={ship.id}
                    style={{ 
                      left: `${(ship.position.longitude - 115) * 30}px`, 
                      top: `${400 - (ship.position.latitude - 30) * 30}px`
                    }}
                    onClick={() => showShipDetails(ship)}
                    title={ship.name}
                  >
                    <div className="ship-icon">⚓</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} className="filter-row">
        <Col xs={24} sm={8} md={6}>
          <Input 
            placeholder="搜索船名或目的地" 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            style={{ width: '100%' }}
            placeholder="选择船舶类型"
            value={filterType}
            onChange={value => setFilterType(value)}
          >
            <Option value="all">全部类型</Option>
            {shipTypes.map((type, index) => (
              <Option value={type} key={index}>{type}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={12} sm={4} md={3}>
          <Button type="primary" onClick={handleSearch} block>
            筛选
          </Button>
        </Col>
        <Col xs={12} sm={4} md={3}>
          <Button onClick={handleReset} block>
            重置
          </Button>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="船舶列表" className="ship-table-card">
            <Table 
              dataSource={ships} 
              columns={columns} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
      
      <Drawer
        title={`船舶详情 - ${selectedShip?.name || ''}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={480}
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
                  <Tag color={
                    selectedShip.status === 'normal' ? 'green' : 
                    selectedShip.status === 'warning' ? 'orange' : 'red'
                  }>
                    {selectedShip.status === 'normal' ? '正常' : 
                     selectedShip.status === 'warning' ? '警告' : '危险'}
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
                <Text>无货物信息</Text>
              )}
            </TabPane>
            <TabPane tab="历史轨迹" key="3">
              <div className="track-info">
                <Text>过去24小时航行轨迹点:</Text>
                <div className="track-points">
                  {getShipTrack(selectedShip.id).map((point, index) => (
                    <div key={index} className="track-point">
                      <div>时间: {new Date(point.timestamp).toLocaleString()}</div>
                      <div>位置: 经度 {point.position.longitude.toFixed(4)}, 纬度 {point.position.latitude.toFixed(4)}</div>
                      <div>速度: {point.speed.toFixed(1)} 节</div>
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

export default ShipTracking; 