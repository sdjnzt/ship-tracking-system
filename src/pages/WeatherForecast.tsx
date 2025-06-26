import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Row, Col, List, Tag, 
  Statistic, Badge, Switch, Radio, Space, 
  Tooltip, Button, Empty, Spin, Modal, Alert
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { 
  CloudOutlined, CompassOutlined, ThunderboltOutlined, 
  AppstoreOutlined, UnorderedListOutlined, InfoCircleOutlined,
  WarningOutlined, EnvironmentOutlined, SearchOutlined,
  ExclamationCircleOutlined, EyeOutlined, DashboardOutlined,
  RightOutlined, CalendarOutlined
} from '@ant-design/icons';
import AMapComponent from '../components/AMapComponent';
import '../styles/WeatherForecast.css';

const { Title, Text, Paragraph } = Typography;
const { Group: RadioGroup, Button: RadioButton } = Radio;

interface WeatherForecastData {
  id: string;
  location: string;
  position: {
    longitude: number;
    latitude: number;
  };
  date: string;
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  visibility: number;
  forecast: {
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    windSpeed: number;
    windDirection: string;
    waveHeight: number;
    condition: string;
    icon: string;
  }[];
  alerts: {
    type: string;
  severity: 'low' | 'medium' | 'high';
    description: string;
    startTime: string;
    endTime: string;
  }[];
}

// Generate mock weather forecast data
const generateMockWeatherData = (): WeatherForecastData[] => {
  const conditions = ['晴', '多云', '阴', '小雨', '中雨', '大雨', '雷雨', '雾', '大风'];
  const icons = ['sunny', 'cloudy', 'overcast', 'light-rain', 'rain', 'heavy-rain', 'thunderstorm', 'fog', 'windy'];
  
  const locations = [
    { name: '青岛港附近海域', lon: 120.316, lat: 36.088 },
    { name: '上海港附近海域', lon: 121.628, lat: 31.222 },
    { name: '大连港附近海域', lon: 121.628, lat: 38.922 },
    { name: '烟台港附近海域', lon: 121.391, lat: 37.538 },
    { name: '厦门港附近海域', lon: 118.089, lat: 24.479 },
    { name: '深圳港附近海域', lon: 114.264, lat: 22.553 },
    { name: '天津港附近海域', lon: 117.793, lat: 39.13 },
    { name: '宁波港附近海域', lon: 121.844, lat: 29.94 }
  ];
  
  const alertTypes = ['台风预警', '大风预警', '大浪预警', '雾预警', '风暴潮预警', '海啸预警'];
  
  const result: WeatherForecastData[] = [];
  
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    
    // Generate forecasts for the next 7 days
    const forecasts = [];
    for (let j = 0; j < 7; j++) {
      const date = new Date();
      date.setDate(date.getDate() + j);
      
      const conditionIndex = Math.floor(Math.random() * conditions.length);
      
      forecasts.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(Math.random() * 10 + 15),
          max: Math.round(Math.random() * 10 + 20)
        },
        windSpeed: Math.round(Math.random() * 30 + 10),
        windDirection: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'][Math.floor(Math.random() * 8)],
        waveHeight: Math.round(Math.random() * 30 + 10) / 10,
        condition: conditions[conditionIndex],
        icon: icons[conditionIndex]
      });
    }
    
    // Generate alerts (some locations will have alerts, others won't)
    const alerts = [];
    if (Math.random() > 0.6) {
      const alertCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < alertCount; j++) {
        const startDate = new Date();
        startDate.setHours(startDate.getHours() + Math.floor(Math.random() * 12));
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 24) + 12);
        
        alerts.push({
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          description: `预计${startDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}至${endDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}期间，${location.name}附近海域将出现${Math.floor(Math.random() * 3) + 6}级大风和${Math.floor(Math.random() * 2) + 3}米巨浪，请注意航行安全。`,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        });
      }
    }
    
    // Generate current conditions
    const currentDate = new Date();
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    
    result.push({
      id: `weather-${i + 1}`,
      location: location.name,
      position: {
        longitude: location.lon,
        latitude: location.lat
      },
      date: currentDate.toISOString(),
      temperature: Math.round(Math.random() * 10 + 18),
      windSpeed: Math.round(Math.random() * 30 + 10),
      windDirection: ['北', '东北', '东', '东南', '南', '西南', '西', '西北'][Math.floor(Math.random() * 8)],
      waveHeight: Math.round(Math.random() * 30 + 5) / 10,
      visibility: Math.round(Math.random() * 8 + 2),
      forecast: forecasts,
      alerts
    });
  }
  
  return result;
};

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherForecastData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLocation, setSelectedLocation] = useState<WeatherForecastData | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [showOnlyAlerts, setShowOnlyAlerts] = useState<boolean>(false);
  
  useEffect(() => {
    setLoading(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setWeatherData(generateMockWeatherData());
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filter data to show only locations with alerts if the switch is on
  const filteredData = showOnlyAlerts
    ? weatherData.filter(item => item.alerts && item.alerts.length > 0)
    : weatherData;
  
  // Get weather condition icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case '晴': return '☀️';
      case '多云': return '⛅';
      case '阴': return '☁️';
      case '小雨': return '🌦️';
      case '中雨': return '🌧️';
      case '大雨': return '🌧️';
      case '雷雨': return '⛈️';
      case '雾': return '🌫️';
      case '大风': return '💨';
      default: return '🌤️';
    }
  };
  
  // Get alert severity tag
  const getAlertSeverityTag = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <Tag color="red">高风险</Tag>;
      case 'medium':
        return <Tag color="orange">中风险</Tag>;
      case 'low':
        return <Tag color="blue">低风险</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // Get wind scale from speed
  const getWindScale = (speed: number) => {
    if (speed < 6) return '0-1级';
    if (speed < 12) return '2级';
    if (speed < 20) return '3级';
    if (speed < 29) return '4级';
    if (speed < 39) return '5级';
    if (speed < 50) return '6级';
    if (speed < 62) return '7级';
    if (speed < 75) return '8级';
    if (speed < 89) return '9级';
    if (speed < 103) return '10级';
    return '11级以上';
  };

  // Get risk assessment based on conditions
  const getRiskAssessment = (weather: WeatherForecastData) => {
    // Simple algorithm to determine risk level
    let riskScore = 0;
    
    // Add points for wind speed
    if (weather.windSpeed > 60) riskScore += 3;
    else if (weather.windSpeed > 40) riskScore += 2;
    else if (weather.windSpeed > 20) riskScore += 1;
    
    // Add points for wave height
    if (weather.waveHeight > 4) riskScore += 3;
    else if (weather.waveHeight > 2.5) riskScore += 2;
    else if (weather.waveHeight > 1.5) riskScore += 1;
    
    // Add points for visibility
    if (weather.visibility < 1) riskScore += 3;
    else if (weather.visibility < 3) riskScore += 2;
    else if (weather.visibility < 5) riskScore += 1;
    
    // Add points for alerts
    if (weather.alerts && weather.alerts.length > 0) {
      weather.alerts.forEach(alert => {
        if (alert.severity === 'high') riskScore += 3;
        else if (alert.severity === 'medium') riskScore += 2;
        else riskScore += 1;
      });
    }
    
    // Determine risk level
    if (riskScore >= 6) return { level: 'high', text: '高风险', color: '#ff4d4f' };
    if (riskScore >= 3) return { level: 'medium', text: '中风险', color: '#faad14' };
    return { level: 'low', text: '低风险', color: '#52c41a' };
  };

  // Handle opening the detail modal
  const openDetailModal = (weather: WeatherForecastData) => {
    setSelectedLocation(weather);
    setDetailModalVisible(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Render grid view
  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredData.map(weather => {
        const risk = getRiskAssessment(weather);
  
  return (
          <Col xs={24} sm={12} lg={8} xl={6} key={weather.id}>
            <Card 
              className="weather-card"
              hoverable 
              onClick={() => openDetailModal(weather)}
            >
              <div className="weather-card-header">
                <Title level={4} className="location-title">
                  <EnvironmentOutlined /> {weather.location}
                </Title>
                {weather.alerts && weather.alerts.length > 0 && (
                  <Badge count={weather.alerts.length} overflowCount={99}>
                    <WarningOutlined style={{ fontSize: 18, color: '#ff4d4f' }}/>
                  </Badge>
                )}
              </div>
              
              <div className="weather-main">
                <div className="weather-icon">
                  {getWeatherIcon(weather.forecast[0].condition)}
                </div>
                <div className="weather-temp">
                  <span className="current-temp">{weather.temperature}°C</span>
                  <span className="temp-range">{weather.forecast[0].temperature.min}° ~ {weather.forecast[0].temperature.max}°</span>
                </div>
                <div className="weather-condition">
                  {weather.forecast[0].condition}
                </div>
              </div>
              
              <div className="weather-details">
                <div className="detail-item">
                  <CompassOutlined /> 风力: {getWindScale(weather.windSpeed)} ({weather.windDirection})
                </div>
                <div className="detail-item">
                  <CloudOutlined /> 浪高: {weather.waveHeight} 米
                </div>
                <div className="detail-item">
                  <EyeOutlined /> 能见度: {weather.visibility} 公里
                </div>
              </div>
              
              <div className="weather-risk" style={{ background: risk.color }}>
                <div className="risk-badge">航行风险: {risk.text}</div>
                {weather.alerts && weather.alerts.length > 0 && (
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<InfoCircleOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailModal(weather);
                    }}
                  >
                    查看警报
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  // Render list view
  const renderListView = () => (
    <List
      className="weather-list"
      itemLayout="vertical"
      dataSource={filteredData}
      renderItem={weather => {
        const risk = getRiskAssessment(weather);
        
        return (
          <List.Item 
            key={weather.id}
            className="weather-list-item"
            onClick={() => openDetailModal(weather)}
            extra={
              <div className="list-extra">
                <div className="weather-icon-large">
                  {getWeatherIcon(weather.forecast[0].condition)}
                </div>
                <div className="temp-display">
                  {weather.temperature}°C
                </div>
              </div>
            }
          >
            <List.Item.Meta
              title={
                <div className="list-header">
                  <span><EnvironmentOutlined /> {weather.location}</span>
                  {weather.alerts && weather.alerts.length > 0 && (
                    <Badge count={weather.alerts.length} overflowCount={99}>
                      <WarningOutlined style={{ fontSize: 16, color: '#ff4d4f' }}/>
                    </Badge>
                  )}
                </div>
              }
              description={
                <div className="list-details">
                  <Space>
                    <span>
                      <CompassOutlined /> 风力: {getWindScale(weather.windSpeed)} ({weather.windDirection})
                    </span>
                    <span>
                      <CloudOutlined /> 浪高: {weather.waveHeight} 米
                    </span>
                    <span>
                      <EyeOutlined /> 能见度: {weather.visibility} 公里
                    </span>
                    <Tag color={risk.color}>航行风险: {risk.text}</Tag>
                </Space>
                </div>
              }
            />
            
            {weather.alerts && weather.alerts.length > 0 && (
              <div className="list-alerts">
                <Alert
                  message={`${weather.alerts[0].type} (${weather.alerts.length > 1 ? `+${weather.alerts.length - 1}` : '1'})`}
                  description={weather.alerts[0].description}
                  type={weather.alerts[0].severity === 'high' ? 'error' : weather.alerts[0].severity === 'medium' ? 'warning' : 'info'}
                  showIcon
                />
              </div>
            )}
            
            <div className="list-action">
              <Button 
                type="primary" 
                size="small" 
                ghost
                onClick={(e) => {
                  e.stopPropagation();
                  openDetailModal(weather);
                }}
              >
                查看详情 <RightOutlined />
              </Button>
            </div>
          </List.Item>
        );
      }}
    />
  );

  // Render detail modal
  const renderDetailModal = () => {
    if (!selectedLocation) return null;
    
    const risk = getRiskAssessment(selectedLocation);
    
    return (
      <Modal
        title={
          <Space>
            <EnvironmentOutlined />
            {selectedLocation.location}天气详情
            {selectedLocation.alerts && selectedLocation.alerts.length > 0 && (
              <Badge count={selectedLocation.alerts.length} overflowCount={99}>
                <WarningOutlined style={{ fontSize: 16, color: '#ff4d4f' }}/>
              </Badge>
            )}
          </Space>
        }
        open={detailModalVisible}
        width={800}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
      >
        {/* Current Weather Snapshot */}
        <Card className="detail-current-weather">
          <Row>
            <Col span={8}>
              <div className="detail-weather-icon">
                {getWeatherIcon(selectedLocation.forecast[0].condition)}
              </div>
              <div className="detail-current-temp">
                {selectedLocation.temperature}°C
              </div>
              <div className="detail-condition">{selectedLocation.forecast[0].condition}</div>
            </Col>
            <Col span={16}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic 
                    title={<div><CompassOutlined /> 风力</div>} 
                    value={getWindScale(selectedLocation.windSpeed)}
                    suffix={selectedLocation.windDirection}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title={<div><CloudOutlined /> 浪高</div>} 
                    value={selectedLocation.waveHeight}
                    suffix="米"
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title={<div><EyeOutlined /> 能见度</div>} 
                    value={selectedLocation.visibility}
                    suffix="公里"
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title={<div><DashboardOutlined /> 航行风险</div>} 
                    value={risk.text}
                    valueStyle={{ color: risk.color }}
                  />
                </Col>
              </Row>
        </Col>
      </Row>
        </Card>

        {/* Weather Alerts */}
        {selectedLocation.alerts && selectedLocation.alerts.length > 0 && (
          <div className="detail-alerts">
            <Title level={4}><WarningOutlined /> 气象预警</Title>
            <List
              dataSource={selectedLocation.alerts}
              renderItem={alert => (
                <List.Item className="alert-item">
                  <Card className="alert-card" bordered={false}>
                    <div className="alert-header">
                      <span className="alert-type">{alert.type}</span>
                      {getAlertSeverityTag(alert.severity)}
                    </div>
                    <div className="alert-time">
                      有效期: {new Date(alert.startTime).toLocaleString()} - {new Date(alert.endTime).toLocaleString()}
                    </div>
                    <div className="alert-description">{alert.description}</div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {/* 7-Day Forecast */}
        <div className="detail-forecast">
          <Title level={4}><CalendarOutlined /> 七天预报</Title>
          <div className="forecast-scrollable">
            <Row>
              {selectedLocation.forecast.map((day, index) => (
                <Col key={day.date} className="forecast-day">
                  <div className="forecast-date">
                    {index === 0 ? '今天' : formatDate(day.date)}
                  </div>
                  <div className="forecast-icon">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="forecast-condition">{day.condition}</div>
                  <div className="forecast-temp">
                    {day.temperature.min}° ~ {day.temperature.max}°
                  </div>
                  <div className="forecast-wind">
                    {day.windDirection} {getWindScale(day.windSpeed)}
                  </div>
                  <div className="forecast-wave">
                    浪高: {day.waveHeight} 米
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Map with location */}
        <div className="detail-map">
          <Title level={4}><EnvironmentOutlined /> 位置</Title>
          <div className="map-container" style={{ height: 300 }}>
            <AMapComponent 
              ships={[]}
              ports={[]}
              onShipClick={() => {}}
              weatherMarkers={[{
                id: selectedLocation.id,
                position: selectedLocation.position,
                type: 'fog',
                severity: 'medium'
              }]}
              zoomToFit={true}
              routes={[]}
            />
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="weather-forecast-container">
      <div className="page-header">
        <div>
          <Title level={3}><CloudOutlined /> 天气预报</Title>
          <Text type="secondary">提供港口和航线沿途的气象数据、海况信息和天气预警</Text>
        </div>
        
        <div className="controls">
          <Space size="large">
            <RadioGroup 
              value={viewMode} 
              onChange={(e: RadioChangeEvent) => setViewMode(e.target.value as 'grid' | 'list')}
              buttonStyle="solid"
            >
              <RadioButton value="grid"><AppstoreOutlined /> 网格视图</RadioButton>
              <RadioButton value="list"><UnorderedListOutlined /> 列表视图</RadioButton>
            </RadioGroup>
            
            <Space>
              <Switch 
                checkedChildren="只看预警" 
                unCheckedChildren="全部"
                checked={showOnlyAlerts}
                onChange={setShowOnlyAlerts}
              />
              <Text type="secondary">
                {filteredData.length} 个气象点
              </Text>
            </Space>
            
            <Button 
              icon={<SearchOutlined />}
              type="primary"
            >
              搜索区域
            </Button>
          </Space>
        </div>
      </div>
      
      {/* Weather Risk Stats */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic 
              title={<span className="stat-title"><ThunderboltOutlined /> 高风险区域</span>}
              value={filteredData.filter(item => getRiskAssessment(item).level === 'high').length}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={`/ ${filteredData.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic 
              title={<span className="stat-title"><WarningOutlined /> 气象预警</span>}
              value={filteredData.reduce((count, item) => count + (item.alerts?.length || 0), 0)}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic 
              title={<span className="stat-title"><CompassOutlined /> 平均风力</span>}
              value={Math.round(filteredData.reduce((sum, item) => sum + item.windSpeed, 0) / filteredData.length)}
              suffix="km/h"
            />
          </Card>
        </Col>
      </Row>
      
      {/* Weather warning alert */}
      {filteredData.some(item => 
        item.alerts && 
        item.alerts.some(alert => alert.severity === 'high')
      ) && (
        <Alert
          message="高风险天气警告"
          description={
            <div>
              <p>当前有{filteredData.filter(item => 
                item.alerts && 
                item.alerts.some(alert => alert.severity === 'high')
              ).length}个港口海域存在高风险天气状况，请相关船只注意航行安全，避开恶劣天气区域。</p>
              <Button type="primary" danger size="small">
                查看详细警报
              </Button>
                </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {/* Main content */}
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
                <p>加载天气数据中...</p>
              </div>
      ) : filteredData.length > 0 ? (
        <div className="weather-content">
          {viewMode === 'grid' ? renderGridView() : renderListView()}
                        </div>
                ) : (
        <Empty 
          description="没有找到符合条件的天气数据" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
                )}
      
      {/* Weather Detail Modal */}
      {renderDetailModal()}
    </div>
  );
};

export default WeatherForecast; 