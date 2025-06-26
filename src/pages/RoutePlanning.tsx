import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Button, Descriptions, Steps, Empty, Spin, Divider, Space, message, Radio, Tooltip } from 'antd';
import { EnvironmentOutlined, SwapOutlined, AreaChartOutlined, ClockCircleOutlined, ThunderboltOutlined, SafetyOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons';
import AMapComponent from '../components/AMapComponent';
import { mockShips, mockPorts, RoutePlanData } from '../data/mockData';
import '../styles/RoutePlanning.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const RoutePlanning: React.FC = () => {
  const [origin, setOrigin] = useState<string>('port-001');
  const [destination, setDestination] = useState<string>('port-002');
  const [routeInfo, setRouteInfo] = useState<RoutePlanData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'safest' | 'economical'>('fastest');
  const [selectedShip, setSelectedShip] = useState<string>('ship-001');

  // 航线规划的三种方式
  const routeTypes = [
    { key: 'fastest', name: '最快航线', icon: <ThunderboltOutlined />, description: '优先考虑时间效率，通常是最短距离路线' },
    { key: 'safest', name: '最安全航线', icon: <SafetyOutlined />, description: '避开危险区域和恶劣天气，可能路程更长' },
    { key: 'economical', name: '经济航线', icon: <AreaChartOutlined />, description: '平衡燃油消耗和时间，成本效益最优' },
  ];

  const handlePlanRoute = () => {
    setLoading(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 根据选择的策略生成不同的路线数据
      const originPort = mockPorts.find(port => port.id === origin);
      const destinationPort = mockPorts.find(port => port.id === destination);
      
      if (!originPort || !destinationPort) {
        message.error('无法找到指定港口');
        setLoading(false);
        return;
      }

      // 调整船舶位置到起点港口，以便显示在地图上
      const selectedShipData = mockShips.find(ship => ship.id === selectedShip);
      if (selectedShipData) {
        selectedShipData.position = {
          longitude: originPort.position.longitude,
          latitude: originPort.position.latitude
        };
      }

      // 基于选择的策略创建不同的路线
      const baseRoute: RoutePlanData = {
        id: `route-${Date.now()}`,
        shipId: selectedShip,
        originPort: originPort.name,
        destinationPort: destinationPort.name,
        departureTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
        waypoints: [],
        distance: 0,
        fuelConsumption: 0,
        weatherRisks: []
      };
      
      // 根据选择的路线类型来设置不同的数据
      switch (selectedRoute) {
        case 'fastest':
          // 最快路线: 直接路径，较高油耗，少中转点
          baseRoute.waypoints = [
            {
              position: { longitude: originPort.position.longitude, latitude: originPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              status: 'current'
            },
            {
              position: { 
                longitude: (originPort.position.longitude + destinationPort.position.longitude) / 2, 
                latitude: (originPort.position.latitude + destinationPort.position.latitude) / 2 
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
              status: 'upcoming'
            },
            {
              position: { longitude: destinationPort.position.longitude, latitude: destinationPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
              status: 'upcoming'
            }
          ];
          baseRoute.distance = 820;
          baseRoute.fuelConsumption = 45;
          baseRoute.weatherRisks = [
            {
              position: { 
                longitude: (originPort.position.longitude + destinationPort.position.longitude) / 2 + 0.5, 
                latitude: (originPort.position.latitude + destinationPort.position.latitude) / 2 - 0.3
              },
              type: 'storm',
              severity: 'medium',
              estimatedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString()
            }
          ];
          break;
          
        case 'safest':
          // 最安全路线: 更长路程，避开危险区域
          baseRoute.waypoints = [
            {
              position: { longitude: originPort.position.longitude, latitude: originPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              status: 'current'
            },
            {
              position: { 
                longitude: originPort.position.longitude + 0.5, 
                latitude: originPort.position.latitude + 0.8
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
              status: 'upcoming'
            },
            {
              position: { 
                longitude: (originPort.position.longitude + destinationPort.position.longitude) / 2 + 0.8, 
                latitude: (originPort.position.latitude + destinationPort.position.latitude) / 2 + 0.5
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
              status: 'upcoming'
            },
            {
              position: { longitude: destinationPort.position.longitude, latitude: destinationPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(),
              status: 'upcoming'
            }
          ];
          baseRoute.distance = 980;
          baseRoute.fuelConsumption = 52;
          // 没有天气风险
          baseRoute.weatherRisks = [];
          // 更新到达时间
          baseRoute.estimatedArrival = new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString();
          break;
          
        case 'economical':
          // 经济路线: 平衡距离和油耗，可能多个中转点
          baseRoute.waypoints = [
            {
              position: { longitude: originPort.position.longitude, latitude: originPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
              status: 'current'
            },
            {
              position: { 
                longitude: originPort.position.longitude + 0.3, 
                latitude: originPort.position.latitude + 0.4
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
              status: 'upcoming'
            },
            {
              position: { 
                longitude: (originPort.position.longitude + destinationPort.position.longitude) / 2, 
                latitude: (originPort.position.latitude + destinationPort.position.latitude) / 2
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
              status: 'upcoming'
            },
            {
              position: { 
                longitude: destinationPort.position.longitude - 0.4, 
                latitude: destinationPort.position.latitude - 0.3
              },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
              status: 'upcoming'
            },
            {
              position: { longitude: destinationPort.position.longitude, latitude: destinationPort.position.latitude },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5.5).toISOString(),
              status: 'upcoming'
            }
          ];
          baseRoute.distance = 890;
          baseRoute.fuelConsumption = 38; // 最低的油耗
          baseRoute.weatherRisks = [
            {
              position: { 
                longitude: originPort.position.longitude + 0.3, 
                latitude: originPort.position.latitude + 0.4
              },
              type: 'fog',
              severity: 'low',
              estimatedTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()
            }
          ];
          // 更新到达时间
          baseRoute.estimatedArrival = new Date(Date.now() + 1000 * 60 * 60 * 24 * 5.5).toISOString();
          break;
      }
      
      setRouteInfo(baseRoute);
      setLoading(false);
      message.success('航线规划完成');
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // 创建可视化航线数据
  const visualRoutes = routeInfo ? [{
    id: routeInfo.id,
    shipId: routeInfo.shipId,
    waypoints: routeInfo.waypoints.map(wp => ({
      position: wp.position,
      status: wp.status
    })),
    color: selectedRoute === 'fastest' ? '#1890ff' : 
           selectedRoute === 'safest' ? '#52c41a' : '#fa8c16',
    width: 3,
    type: selectedRoute
  }] : [];

  // 创建风险点标记
  const weatherMarkers = routeInfo ? routeInfo.weatherRisks.map((risk, index) => ({
    id: `risk-${index}`,
    position: risk.position,
    type: risk.type,
    severity: risk.severity
  })) : [];

  // 确保地图显示正确的船舶和港口
  const mapShips = selectedShip ? mockShips.filter(ship => ship.id === selectedShip) : [];
  const highlightedPortIds = routeInfo ? [origin, destination] : [];
  
  // 添加调试信息
  console.log('路线数据:', visualRoutes);
  console.log('船舶数据:', mapShips);
  console.log('港口数据:', mockPorts);
  console.log('高亮港口:', highlightedPortIds);

  return (
    <div className="route-planning-container">
      <Card className="route-planning-card">
        <Title level={3} className="page-title">
          <EnvironmentOutlined /> 航线规划
        </Title>
        
        <Divider />
        
        <Row gutter={[16, 16]} className="route-config-section">
          <Col span={24} lg={12}>
            <Card title="航线配置" className="config-card" bordered={false}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={8}>
                  <Text strong>选择船舶：</Text>
                </Col>
                <Col span={16}>
                  <Select 
                    value={selectedShip} 
                    onChange={setSelectedShip} 
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                  >
                    {mockShips.map(ship => (
                      <Option value={ship.id} key={ship.id} label={ship.name}>
                        <Space>
                          <RocketOutlined />
                          <span>{ship.name}</span>
                          <small style={{ color: '#999' }}>({ship.type})</small>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Col>
                
                <Col span={8}>
                  <Text strong>起点港口：</Text>
                </Col>
                <Col span={16}>
                  <Select 
                    value={origin} 
                    onChange={setOrigin} 
                    style={{ width: '100%' }}
                  >
                    {mockPorts.map(port => (
                      <Option value={port.id} key={port.id}>
                        {port.name} ({port.country})
                      </Option>
                    ))}
                  </Select>
                </Col>
                
                <Col span={8}>
                  <Text strong>终点港口：</Text>
                </Col>
                <Col span={16}>
                  <Select 
                    value={destination} 
                    onChange={setDestination}
                    style={{ width: '100%' }}
                  >
                    {mockPorts.map(port => (
                      <Option value={port.id} key={port.id}>
                        {port.name} ({port.country})
                      </Option>
                    ))}
                  </Select>
                </Col>
                
                <Col span={24}>
                  <Divider orientation="left">航线策略</Divider>
                  <Radio.Group 
                    value={selectedRoute} 
                    onChange={e => setSelectedRoute(e.target.value)}
                    className="route-strategy-group"
                  >
                    {routeTypes.map(type => (
                      <Tooltip title={type.description} key={type.key}>
                        <Radio.Button value={type.key} className="route-strategy-option">
                          {type.icon} {type.name}
                        </Radio.Button>
                      </Tooltip>
                    ))}
                  </Radio.Group>
                </Col>
                
                <Col span={24} style={{ textAlign: 'center', marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    icon={<EnvironmentOutlined />} 
                    onClick={handlePlanRoute} 
                    loading={loading}
                    size="large"
                  >
                    开始规划航线
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col span={24} lg={12}>
            <Card title="航线信息" className="route-info-card" bordered={false}>
              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                  <p>正在规划最优航线...</p>
                </div>
              ) : routeInfo ? (
                <>
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="总航程距离">
                      <Text strong>{routeInfo.distance}</Text> 海里
                    </Descriptions.Item>
                    <Descriptions.Item label="预计出发时间">
                      {formatDate(routeInfo.departureTime)}
                    </Descriptions.Item>
                    <Descriptions.Item label="预计到达时间">
                      {formatDate(routeInfo.estimatedArrival)}
                    </Descriptions.Item>
                    <Descriptions.Item label="预计油耗">
                      {routeInfo.fuelConsumption} 吨
                    </Descriptions.Item>
                  </Descriptions>
                  
                  <Divider orientation="left">航线路径</Divider>
                  
                  <Steps 
                    direction="vertical"
                    size="small"
                    className="route-steps"
                    current={0}
                    items={routeInfo.waypoints.map((wp, idx) => ({
                      title: idx === 0 ? routeInfo.originPort : 
                            idx === routeInfo.waypoints.length - 1 ? routeInfo.destinationPort : 
                            `航点 ${idx}`,
                      description: formatDate(wp.estimatedPassTime),
                      status: wp.status === 'current' ? 'process' : 
                              wp.status === 'passed' ? 'finish' : 'wait'
                    }))}
                  />
                  
                  {routeInfo.weatherRisks.length > 0 && (
                    <>
                      <Divider orientation="left">
                        <InfoCircleOutlined /> 航线风险
                      </Divider>
                      <div className="weather-risks">
                        {routeInfo.weatherRisks.map((risk, idx) => (
                          <div key={idx} className={`weather-risk-item ${risk.severity}`}>
                            <span className="risk-type">
                              {risk.type === 'storm' ? '风暴' : 
                              risk.type === 'fog' ? '大雾' : 
                              risk.type === 'high_waves' ? '巨浪' : '冰层'}
                            </span>
                            <span className="risk-severity">
                              {risk.severity === 'low' ? '低风险' : 
                              risk.severity === 'medium' ? '中风险' : '高风险'}
                            </span>
                            <span className="risk-time">预计时间: {formatDate(risk.estimatedTime)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Empty description="请先选择起止港口并点击规划航线" />
              )}
            </Card>
          </Col>
        </Row>
        
        <Divider orientation="left">航线地图预览</Divider>
        
        <div className={`route-map-container ${routeInfo ? 'has-route' : ''}`}>
          {/* 使用AMapComponent来显示地图 */}
          <AMapComponent 
            ships={mapShips} 
            ports={mockPorts} 
            onShipClick={(ship) => console.log('Ship clicked:', ship)}
            routes={visualRoutes}
            weatherMarkers={weatherMarkers}
            zoomToFit={routeInfo !== null}
            highlightedPorts={highlightedPortIds}
          />
          
          {!routeInfo && !loading && (
            <div className="map-overlay">
              <div className="map-overlay-content">
                <EnvironmentOutlined style={{ fontSize: 48 }} />
                <p>规划航线后显示航线图</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RoutePlanning; 