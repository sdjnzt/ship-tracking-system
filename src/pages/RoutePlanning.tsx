import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Select, Button, Descriptions, Steps, Empty, Spin, Divider, Space, message, Radio, Tooltip } from 'antd';
import { EnvironmentOutlined, SwapOutlined, AreaChartOutlined, ClockCircleOutlined, ThunderboltOutlined, SafetyOutlined, InfoCircleOutlined, RocketOutlined } from '@ant-design/icons';
import RealMapComponent from '../components/RealMapComponent';
import { mockShips, mockPorts } from '../data/mockData';
import '../styles/RoutePlanning.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

// 定义RoutePlanData接口，替代从mockData中导入
interface RoutePlanData {
  id: string;
  shipId: string;
  originPort: string;
  destinationPort: string;
  departureTime: string;
  estimatedArrival: string;
  waypoints: {
    position: {
      longitude: number;
      latitude: number;
    };
    estimatedPassTime: string;
    status: 'passed' | 'upcoming' | 'current';
  }[];
  distance: number; // 海里
  fuelConsumption: number; // 吨
  weatherRisks: {
    position: {
      longitude: number;
      latitude: number;
    };
    type: 'storm' | 'high_waves' | 'fog' | 'ice';
    severity: 'low' | 'medium' | 'high';
    estimatedTime: string;
  }[];
}

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
      
      // 获取两个港口之间的大致距离（海里）
      const getDistanceInNauticalMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // 地球半径，单位为公里
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c;
        return distance * 0.539957; // 转换为海里
      };
      
      // 计算两点之间的直线距离
      const distance = getDistanceInNauticalMiles(
        originPort.position.latitude, 
        originPort.position.longitude, 
        destinationPort.position.latitude, 
        destinationPort.position.longitude
      );
      
      // 根据距离计算航行时间（天）
      const getEstimatedDays = (distance: number, speed: number) => {
        return distance / (speed * 24); // 速度为节（海里/小时）
      };
      
      // 生成航线中间点，考虑海岸线和航道
      const generateWaypoints = (
        origin: { longitude: number; latitude: number }, 
        destination: { longitude: number; latitude: number },
        routeType: string,
        numPoints: number
      ) => {
        const waypoints = [];
        
        // 添加起点
        waypoints.push({
          position: { longitude: origin.longitude, latitude: origin.latitude },
          estimatedPassTime: baseRoute.departureTime,
          status: 'current' as 'current'
        });
        
        // 根据不同航线类型生成中间点
        switch(routeType) {
        case 'fastest':
            // 最快路线：较直接但避开主要陆地
            // 在中国沿海，需要考虑山东半岛、长江口等地形
            if (
              (origin.latitude < 35 && destination.latitude > 37) || 
              (origin.latitude > 37 && destination.latitude < 35)
            ) {
              // 如果航线需要绕过山东半岛
              const midPoint1 = {
                longitude: 122.8, // 向东偏移到海上
                latitude: (origin.latitude + destination.latitude) * 0.4,
              };
              
              const midPoint2 = {
                longitude: 123.2,
                latitude: (origin.latitude + destination.latitude) * 0.6,
              };
              
              waypoints.push({
                position: midPoint1,
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
              
              waypoints.push({
                position: midPoint2,
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
            } else {
              // 添加一个稍微偏离的中间点，使路线不是完全直线
              for (let i = 1; i < numPoints - 1; i++) {
                const ratio = i / numPoints;
                // 添加一些随机偏移，但保持路线相对直接
                const offsetLon = (Math.random() - 0.5) * 0.3;
                const offsetLat = (Math.random() - 0.5) * 0.3;
                
                waypoints.push({
              position: { 
                    longitude: origin.longitude + (destination.longitude - origin.longitude) * ratio + offsetLon,
                    latitude: origin.latitude + (destination.latitude - origin.latitude) * ratio + offsetLat
                  },
                  estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + ratio * 4)).toISOString(),
                  status: 'upcoming' as 'upcoming'
                });
              }
            }
            break;
            
          case 'safest':
            // 最安全路线：远离危险区域，可能更加弯曲
            // 通常会远离海岸线和已知的危险区域
            if (
              (origin.latitude < 35 && destination.latitude > 37) || 
              (origin.latitude > 37 && destination.latitude < 35)
            ) {
              // 如果需要绕过山东半岛，走更外海的路线
              waypoints.push({
                position: { longitude: 123.5, latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.25 },
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1.5).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
              
              waypoints.push({
                position: { longitude: 124.2, latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.5 },
              estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
              
              waypoints.push({
                position: { longitude: 123.8, latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.75 },
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4.5).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
            } else {
              // 生成更多的中间点，使路线更加平滑
              for (let i = 1; i < numPoints; i++) {
                const ratio = i / numPoints;
                // 添加较大的随机偏移，使路线更加弯曲
                const offsetLon = (Math.random() - 0.5) * 0.8;
                // 确保偏移向海洋方向
                const offsetLat = (Math.random() - 0.5) * 0.8;
                
                waypoints.push({
                  position: {
                    longitude: origin.longitude + (destination.longitude - origin.longitude) * ratio + offsetLon,
                    latitude: origin.latitude + (destination.latitude - origin.latitude) * ratio + offsetLat
                  },
                  estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + ratio * 5)).toISOString(),
                  status: 'upcoming' as 'upcoming'
                });
              }
            }
            break;
            
          case 'economical':
            // 经济路线：考虑洋流和风向，可能会有更多的中间点
            // 尽量靠近海岸线，但保持安全距离
            if (
              (origin.latitude < 35 && destination.latitude > 37) || 
              (origin.latitude > 37 && destination.latitude < 35)
            ) {
              // 如果需要绕过山东半岛，选择最经济的路线
              // 这通常意味着更接近海岸线，但不会太近
              waypoints.push({
                position: { longitude: 122.2, latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.2 },
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1.2).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
              
              // 添加烟台港作为可能的中转点
              const yantaiPort = mockPorts.find(p => p.name === '烟台港');
              if (yantaiPort) {
                waypoints.push({
                  position: { 
                    longitude: yantaiPort.position.longitude, 
                    latitude: yantaiPort.position.latitude 
                  },
                  estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2.5).toISOString(),
                  status: 'upcoming' as 'upcoming'
                });
              }
              
              waypoints.push({
                position: { longitude: 122.5, latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.7 },
                estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
                status: 'upcoming' as 'upcoming'
              });
            } else {
              // 沿着海岸线生成更多的点
              for (let i = 1; i < numPoints + 1; i++) {
                const ratio = i / (numPoints + 1);
                // 添加适量的随机偏移，使路线看起来更自然
                const offsetLon = (Math.random() - 0.5) * 0.5;
                const offsetLat = (Math.random() - 0.5) * 0.5;
                
                // 尝试找到附近的港口作为可能的中转点
                const nearbyPort = mockPorts.find(p => 
                  Math.abs(p.position.longitude - (origin.longitude + (destination.longitude - origin.longitude) * ratio)) < 0.5 &&
                  Math.abs(p.position.latitude - (origin.latitude + (destination.latitude - origin.latitude) * ratio)) < 0.5
                );
                
                if (nearbyPort && Math.random() > 0.5) {
                  // 有50%的几率将附近港口添加为中转点
                  waypoints.push({
                    position: { 
                      longitude: nearbyPort.position.longitude, 
                      latitude: nearbyPort.position.latitude 
                    },
                    estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + ratio * 4.5)).toISOString(),
                    status: 'upcoming' as 'upcoming'
                  });
                } else {
                  waypoints.push({
              position: { 
                      longitude: origin.longitude + (destination.longitude - origin.longitude) * ratio + offsetLon,
                      latitude: origin.latitude + (destination.latitude - origin.latitude) * ratio + offsetLat
                    },
                    estimatedPassTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * (1 + ratio * 4.5)).toISOString(),
                    status: 'upcoming' as 'upcoming'
                  });
                }
              }
            }
            break;
        }
        
        // 添加终点
        waypoints.push({
          position: { longitude: destination.longitude, latitude: destination.latitude },
          estimatedPassTime: baseRoute.estimatedArrival,
          status: 'upcoming' as 'upcoming'
        });
        
        return waypoints;
      };
      
      // 根据选择的路线类型来设置不同的数据
      let speed = 0;
      let fuelRate = 0;
      let weatherRisks = [];
      let numWaypoints = 0;
      
      switch (selectedRoute) {
        case 'fastest':
          // 最快路线: 高速度，较高油耗
          speed = 22; // 节
          fuelRate = 0.06; // 每海里消耗的燃油（吨）
          numWaypoints = 3; // 较少的中间点
          break;
          
        case 'safest':
          // 最安全路线: 中等速度，较高油耗（因为可能路程更长）
          speed = 18; // 节
          fuelRate = 0.055; // 每海里消耗的燃油（吨）
          numWaypoints = 5; // 更多的中间点以避开危险区域
          break;
          
        case 'economical':
          // 经济路线: 较低速度，最低油耗
          speed = 15; // 节
          fuelRate = 0.045; // 每海里消耗的燃油（吨）
          numWaypoints = 4; // 平衡的中间点数量
          break;
      }
      
      // 生成航线点
      baseRoute.waypoints = generateWaypoints(
        originPort.position, 
        destinationPort.position, 
        selectedRoute,
        numWaypoints
      );
      
      // 计算实际航线距离（考虑中间点）
      let totalDistance = 0;
      for (let i = 0; i < baseRoute.waypoints.length - 1; i++) {
        const point1 = baseRoute.waypoints[i].position;
        const point2 = baseRoute.waypoints[i + 1].position;
        totalDistance += getDistanceInNauticalMiles(
          point1.latitude, point1.longitude, 
          point2.latitude, point2.longitude
        );
      }
      
      // 设置航线信息
      baseRoute.distance = Math.round(totalDistance);
      baseRoute.fuelConsumption = Math.round(totalDistance * fuelRate);
      
      // 估算航行时间并更新到达时间
      const travelDays = getEstimatedDays(totalDistance, speed);
      baseRoute.estimatedArrival = new Date(Date.now() + 1000 * 60 * 60 * 24 * travelDays).toISOString();
      
      // 更新中间点的预计通过时间
      for (let i = 1; i < baseRoute.waypoints.length; i++) {
        const distanceToThisPoint = baseRoute.waypoints.slice(0, i+1).reduce((acc, curr, idx, arr) => {
          if (idx === 0) return 0;
          const prev = arr[idx-1].position;
          const curr_pos = curr.position;
          return acc + getDistanceInNauticalMiles(
            prev.latitude, prev.longitude, 
            curr_pos.latitude, curr_pos.longitude
          );
        }, 0);
        
        const daysToThisPoint = getEstimatedDays(distanceToThisPoint, speed);
        baseRoute.waypoints[i].estimatedPassTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * daysToThisPoint).toISOString();
      }
      
      // 生成天气风险
      if (selectedRoute !== 'safest') {
        // 安全路线避开了所有风险
        const numRisks = selectedRoute === 'fastest' ? 2 : 1;
        
        for (let i = 0; i < numRisks; i++) {
          // 随机选择一个中间点附近作为风险点
          const waypointIdx = Math.floor(Math.random() * (baseRoute.waypoints.length - 2)) + 1;
          const waypoint = baseRoute.waypoints[waypointIdx];
          
          // 添加一些随机偏移
          const offsetLon = (Math.random() - 0.5) * 0.8;
          const offsetLat = (Math.random() - 0.5) * 0.8;
          
          // 风险类型
          const riskTypes = ['storm', 'high_waves', 'fog', 'ice'] as const;
          const riskType = riskTypes[Math.floor(Math.random() * riskTypes.length)];
          
          // 风险严重程度
          const severityLevels = ['low', 'medium', 'high'] as const;
          const severity = selectedRoute === 'fastest' ? 
            severityLevels[Math.floor(Math.random() * 3)] : 
            severityLevels[Math.floor(Math.random() * 2)]; // 经济路线避开高风险
          
          baseRoute.weatherRisks.push({
            position: {
              longitude: waypoint.position.longitude + offsetLon,
              latitude: waypoint.position.latitude + offsetLat
            },
            type: riskType,
            severity: severity,
            estimatedTime: waypoint.estimatedPassTime
          });
        }
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
    waypoints: routeInfo.waypoints.map((wp: {
      position: {
        longitude: number;
        latitude: number;
      };
      status: 'passed' | 'upcoming' | 'current';
      estimatedPassTime: string;
    }) => ({
      position: wp.position,
      status: wp.status
    })),
    color: selectedRoute === 'fastest' ? '#1890ff' : 
           selectedRoute === 'safest' ? '#52c41a' : '#fa8c16',
    width: 3,
    type: selectedRoute
  }] : [];

  // 创建风险点标记
  const weatherMarkers = routeInfo ? routeInfo.weatherRisks.map((risk: {
    position: {
      longitude: number;
      latitude: number;
    };
    type: 'storm' | 'high_waves' | 'fog' | 'ice';
    severity: 'low' | 'medium' | 'high';
    estimatedTime: string;
  }, index: number) => ({
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
                    items={routeInfo.waypoints.map((wp: {
                      position: {
                        longitude: number;
                        latitude: number;
                      };
                      estimatedPassTime: string;
                      status: 'passed' | 'upcoming' | 'current';
                    }, idx: number) => {
                      // 计算到下一个点的距离（如果不是最后一个点）
                      let distanceToNext = '';
                      let timeToNext = '';
                      if (idx < routeInfo.waypoints.length - 1) {
                        const nextWp = routeInfo.waypoints[idx + 1];
                        // 使用之前定义的距离计算函数
                        const getDistanceInNauticalMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                          const R = 6371; // 地球半径，单位为公里
                          const dLat = (lat2 - lat1) * Math.PI / 180;
                          const dLon = (lon2 - lon1) * Math.PI / 180;
                          const a = 
                            Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                            Math.sin(dLon/2) * Math.sin(dLon/2); 
                          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                          const distance = R * c;
                          return distance * 0.539957; // 转换为海里
                        };
                        
                        const distance = getDistanceInNauticalMiles(
                          wp.position.latitude, 
                          wp.position.longitude, 
                          nextWp.position.latitude, 
                          nextWp.position.longitude
                        );
                        
                        distanceToNext = `距离下一点: ${distance.toFixed(1)} 海里`;
                        
                        // 计算到下一个点的时间
                        const wpTime = new Date(wp.estimatedPassTime).getTime();
                        const nextWpTime = new Date(nextWp.estimatedPassTime).getTime();
                        const hoursDiff = (nextWpTime - wpTime) / (1000 * 60 * 60);
                        timeToNext = `航行时间: ${hoursDiff.toFixed(1)} 小时`;
                      }
                      
                      // 确定航点类型和名称
                      let waypointType = '';
                      if (idx === 0) {
                        waypointType = '起点港口';
                      } else if (idx === routeInfo.waypoints.length - 1) {
                        waypointType = '终点港口';
                      } else {
                        // 检查是否接近某个港口
                        const nearbyPort = mockPorts.find(port => 
                          Math.abs(port.position.longitude - wp.position.longitude) < 0.2 &&
                          Math.abs(port.position.latitude - wp.position.latitude) < 0.2
                        );
                        
                        if (nearbyPort) {
                          waypointType = `途经港口 (${nearbyPort.name})`;
                        } else {
                          waypointType = '海上航点';
                        }
                      }
                      
                      return {
                        title: idx === 0 ? `${waypointType}: ${routeInfo.originPort}` : 
                              idx === routeInfo.waypoints.length - 1 ? `${waypointType}: ${routeInfo.destinationPort}` : 
                              `${waypointType} (${wp.position.longitude.toFixed(2)}°E, ${wp.position.latitude.toFixed(2)}°N)`,
                        description: (
                          <div>
                            <div>预计时间: {formatDate(wp.estimatedPassTime)}</div>
                            {distanceToNext && <div>{distanceToNext}</div>}
                            {timeToNext && <div>{timeToNext}</div>}
                          </div>
                        ),
                      status: wp.status === 'current' ? 'process' : 
                              wp.status === 'passed' ? 'finish' : 'wait'
                      };
                    })}
                  />
                  
                  {routeInfo.weatherRisks.length > 0 && (
                    <>
                      <Divider orientation="left">
                        <InfoCircleOutlined /> 航线风险
                      </Divider>
                      <div className="weather-risks">
                        {routeInfo.weatherRisks.map((risk: {
                          position: {
                            longitude: number;
                            latitude: number;
                          };
                          type: 'storm' | 'high_waves' | 'fog' | 'ice';
                          severity: 'low' | 'medium' | 'high';
                          estimatedTime: string;
                        }, idx: number) => (
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
          {/* 使用RealMapComponent来显示地图 */}
          <RealMapComponent 
            ships={mapShips} 
            ports={mockPorts} 
            onShipClick={(ship) => console.log('Ship clicked:', ship)}
            routes={visualRoutes}
            weatherMarkers={weatherMarkers}
            zoomToFit={routeInfo !== null}
            highlightedPorts={highlightedPortIds}
            mapType="standard"
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