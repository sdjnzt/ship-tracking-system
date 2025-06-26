import React, { useState, useEffect } from 'react';
import { ShipData, PortData } from '../data/mockData';
import '../styles/AMapComponent.css';

interface RouteData {
  id: string;
  shipId: string;
  waypoints: {
    position: {
      longitude: number;
      latitude: number;
    };
    status: 'passed' | 'upcoming' | 'current';
  }[];
  color: string;
  width: number;
  type: 'fastest' | 'safest' | 'economical';
}

interface WeatherMarker {
  id: string;
  position: {
    longitude: number;
    latitude: number;
  };
  type: 'storm' | 'high_waves' | 'fog' | 'ice' | 'route_deviation' | 'mechanical_failure' | 'cargo_issue' | 'security_alert';
  severity: 'low' | 'medium' | 'high';
}

interface AMapComponentProps {
  ships: ShipData[];
  ports: PortData[];
  onShipClick: (ship: ShipData) => void;
  routes?: RouteData[];
  weatherMarkers?: WeatherMarker[];
  zoomToFit?: boolean;
  highlightedPorts?: string[];
}

// 专业的自定义地图组件，使用真实地图背景
const AMapComponent: React.FC<AMapComponentProps> = ({ 
  ships, 
  ports, 
  onShipClick,
  routes = [],
  weatherMarkers = [],
  zoomToFit = false,
  highlightedPorts = []
}) => {
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  
  // 当zoomToFit变化时，自动调整视图
  useEffect(() => {
    if (zoomToFit && routes.length > 0) {
      // 简单实现：增加缩放级别
      setZoom(1.2);
    }
  }, [zoomToFit, routes]);
  
  // 计算地图坐标
  const calculatePosition = (longitude: number, latitude: number) => {
    // 将经纬度转换为地图上的像素位置
    // 使用墨卡托投影算法简化版
    const mapWidth = 1000;
    const mapHeight = 500;
    
    // 调整经纬度范围以适应亚洲区域
    const x = ((longitude - 100) / 50) * mapWidth * zoom;
    const y = mapHeight - ((latitude - 20) / 40) * mapHeight * zoom;
    
    return { x, y };
  };
  
  // 处理船舶点击
  const handleShipClick = (ship: ShipData) => {
    setSelectedShipId(ship.id);
    onShipClick(ship);
  };
  
  // 获取船舶状态颜色
  const getShipStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#52c41a';
      case 'warning':
        return '#faad14';
      case 'danger':
        return '#ff4d4f';
      default:
        return '#52c41a';
    }
  };
  
  // 放大地图
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };
  
  // 缩小地图
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };
  
  // 切换图例显示状态
  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };
  
  // 获取船舶图标
  const getShipIcon = (direction: number, status: string) => {
    // 根据状态选择不同颜色的船舶图标
    const color = getShipStatusColor(status);
    
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ transform: `rotate(${direction}deg)` }}>
        <path 
          d="M20,21C18.61,21 17.22,20.53 16,19.67C13.56,21.38 10.44,21.38 8,19.67C6.78,20.53 5.39,21 4,21H2V19H4C5.37,19 6.74,18.41 8,17.27C10.26,19.55 13.74,19.55 16,17.27C17.26,18.41 18.63,19 20,19H22V21H20M8.67,10.5H7V13H8.67C9.96,13 11,11.96 11,10.67C11,9.38 9.96,8.33 8.67,8.33C8.04,8.33 7.44,8.6 7.03,9.03L8.75,10.75L7.33,12.17L5.63,10.47C5.53,10.36 5.44,10.24 5.37,10.12C5.13,9.67 5,9.17 5,8.67C5,7.47 5.9,6.47 7.1,6.47C8.3,6.47 9.3,7.47 9.3,8.67H11.3C11.3,6.36 9.41,4.47 7.1,4.47C4.79,4.47 2.9,6.36 2.9,8.67C2.9,9.83 3.33,10.92 4.13,11.72L7,14.59V10.5H8.67M16.33,10.5H18V13H16.33C15.04,13 14,11.96 14,10.67C14,9.38 15.04,8.33 16.33,8.33C16.96,8.33 17.56,8.6 17.97,9.03L16.25,10.75L17.67,12.17L19.37,10.47C19.47,10.36 19.56,10.24 19.63,10.12C19.87,9.67 20,9.17 20,8.67C20,7.47 19.1,6.47 17.9,6.47C16.7,6.47 15.7,7.47 15.7,8.67H13.7C13.7,6.36 15.59,4.47 17.9,4.47C20.21,4.47 22.1,6.36 22.1,8.67C22.1,9.83 21.67,10.92 20.87,11.72L18,14.59V10.5H16.33Z" 
          fill={color}
        />
      </svg>
    );
  };
  
  // 获取港口图标
  const getPortIcon = (isHighlighted: boolean = false) => {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path 
          d="M20,4V6H4V4H20M21,7V19H23V21H1V19H3V7H21M5,9V19H7V9H5M9,9V19H11V9H9M13,9V19H15V9H13M17,9V19H19V9H17Z" 
          fill={isHighlighted ? '#ff4d4f' : '#1890ff'}
        />
      </svg>
    );
  };

  // 获取天气风险图标
  const getWeatherIcon = (type: string, severity: string) => {
    // 根据类型和严重程度选择不同的图标和颜色
    let path = '';
    let color = '';
    
    switch (severity) {
      case 'low':
        color = '#52c41a';
        break;
      case 'medium':
        color = '#faad14';
        break;
      case 'high':
        color = '#ff4d4f';
        break;
      default:
        color = '#1890ff';
    }
    
    switch (type) {
      case 'storm':
        path = 'M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z';
        break;
      case 'fog':
        path = 'M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z';
        break;
      case 'high_waves':
        path = 'M8.5,5A1.5,1.5 0 0,0 7,6.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 10,6.5A1.5,1.5 0 0,0 8.5,5M10,2A5,5 0 0,1 15,7C15,8.7 14.15,10.2 12.86,11.1C14.44,11.25 16.22,11.61 18,12.5C21,14 22,12 22,12C22,12 21,21 15,21H9C9,21 4,21 4,16C4,13 7,12 6,10C2,10 2,6.5 2,6.5C3,7 4.24,7 5,6.65C5.19,4.05 7.36,2 10,2Z';
        break;
      case 'ice':
        path = 'M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z';
        break;
      case 'route_deviation':
        path = 'M22,13.5C22,15.26 20.7,16.72 19,16.96V20A2,2 0 0,1 17,22H13.2V21.7A2.7,2.7 0 0,0 10.5,19A2.7,2.7 0 0,0 7.8,21.7V22H4A2,2 0 0,1 2,20V16.2H2.3C4.28,16.2 5.95,14.53 5.95,12.55C5.95,10.57 4.28,8.9 2.3,8.9H2V5A2,2 0 0,1 4,3H7.04C7.28,1.3 8.74,0 10.5,0C12.26,0 13.72,1.3 13.96,3H17A2,2 0 0,1 19,5V8.04C20.7,8.28 22,9.74 22,11.5V13.5M17,15H18.5A1.5,1.5 0 0,0 20,13.5V11.5A1.5,1.5 0 0,0 18.5,10H17V7A1,1 0 0,0 16,6H13V4.5A1.5,1.5 0 0,0 11.5,3A1.5,1.5 0 0,0 10,4.5V6H7A1,1 0 0,0 6,7V10H4.5A1.5,1.5 0 0,0 3,11.5A1.5,1.5 0 0,0 4.5,13H6V16A1,1 0 0,0 7,17H10V18.5A1.5,1.5 0 0,0 11.5,20A1.5,1.5 0 0,0 13,18.5V17H16A1,1 0 0,0 17,16V15Z';
        break;
      case 'mechanical_failure':
        path = 'M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z';
        break;
      case 'cargo_issue':
        path = 'M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z';
        break;
      case 'security_alert':
        path = 'M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.1 14.8,9.5V11C15.4,11 16,11.6 16,12.3V15.8C16,16.4 15.4,17 14.7,17H9.2C8.6,17 8,16.4 8,15.7V12.2C8,11.6 8.6,11 9.2,11V9.5C9.2,8.1 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z';
        break;
      default:
        path = 'M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14 21,11A9,9 0 0,0 12,2M8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11M16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11M12,14L13.5,17H10.5L12,14Z';
    }
    
    return (
      <svg width="28" height="28" viewBox="0 0 24 24">
        <path d={path} fill={color} />
      </svg>
    );
  };
  
  return (
    <div className="custom-map-container">
      <div className="professional-map">
        {/* 经纬度网格 */}
        <div className="grid-lines">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 10}%` }}></div>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 10}%` }}></div>
          ))}
        </div>
        
        {/* 绘制航线 - 先绘制规划的航线 */}
        <svg className="routes-layer" width="100%" height="100%">
          {/* 规划的路线 */}
          {routes.map(route => {
            if (route.waypoints.length < 2) return null;
            
            // 生成路径点
            const points = route.waypoints.map(wp => {
              const { x, y } = calculatePosition(wp.position.longitude, wp.position.latitude);
              return `${x},${y}`;
            }).join(' ');
            
            // 为了更好的可视化效果，我们添加一个渐变效果
            const gradientId = `gradient-${route.id}`;
            
            return (
              <g key={`planned-route-${route.id}`} className="route-path-group">
                {/* 定义渐变 */}
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={route.color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={route.color} stopOpacity="1" />
                  </linearGradient>
                </defs>
                
                {/* 路径阴影 - 增强视觉效果 */}
                <polyline
                  points={points}
                  fill="none"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={route.width + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={route.type === 'economical' ? "5,5" : "none"}
                  strokeOpacity="0.3"
                  className="route-shadow"
                />
                
                {/* 主路径 */}
                <polyline
                  points={points}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth={route.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={route.type === 'economical' ? "5,5" : "none"}
                  className="route-main-path"
                />
                
                {/* 为每个航点添加圆点标记 */}
                {route.waypoints.map((wp, idx) => {
                  const { x, y } = calculatePosition(wp.position.longitude, wp.position.latitude);
                  // 起点和终点使用更大的标记
                  const isEndpoint = idx === 0 || idx === route.waypoints.length - 1;
                  
                  return (
                    <g key={`waypoint-${route.id}-${idx}`}>
                      {/* 外圈光晕效果 */}
                      {isEndpoint && (
                        <circle
                          cx={x}
                          cy={y}
                          r={8}
                          fill="rgba(255,255,255,0.3)"
                          className="waypoint-halo"
                        />
                      )}
                      
                      {/* 主标记 */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isEndpoint ? 6 : 4}
                        fill={route.color}
                        stroke="#fff"
                        strokeWidth="2"
                        className="waypoint-marker"
                      />
                      
                      {/* 当前位置动画效果 */}
                      {wp.status === 'current' && (
                        <circle
                          cx={x}
                          cy={y}
                          r={10}
                          fill="none"
                          stroke={route.color}
                          strokeWidth="2"
                          opacity="0.6"
                          className="current-position-indicator"
                        >
                          <animate
                            attributeName="r"
                            from="6"
                            to="12"
                            dur="1.5s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.6"
                            to="0"
                            dur="1.5s"
                            begin="0s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
                
                {/* 添加方向箭头 */}
                {route.waypoints.length > 1 && route.waypoints.slice(0, -1).map((wp, idx) => {
                  const current = calculatePosition(wp.position.longitude, wp.position.latitude);
                  const next = calculatePosition(
                    route.waypoints[idx + 1].position.longitude, 
                    route.waypoints[idx + 1].position.latitude
                  );
                  
                  // 计算箭头位置（在线段中间）
                  const midX = (current.x + next.x) / 2;
                  const midY = (current.y + next.y) / 2;
                  
                  // 计算方向角度
                  const angle = Math.atan2(next.y - current.y, next.x - current.x) * 180 / Math.PI;
                  
                  return (
                    <polygon
                      key={`arrow-${route.id}-${idx}`}
                      points="0,-3 8,0 0,3"
                      fill={route.color}
                      transform={`translate(${midX}, ${midY}) rotate(${angle})`}
                      className="direction-arrow"
                    />
                  );
                })}
              </g>
            );
          })}
          
          {/* 船舶历史轨迹 */}
          {ships.map(ship => {
            // 模拟船舶轨迹
            const points = [];
            const startPos = calculatePosition(ship.position.longitude - 0.5, ship.position.latitude - 0.3);
            const endPos = calculatePosition(ship.position.longitude, ship.position.latitude);
            
            // 生成路径点，创建一个更自然的曲线
            for (let i = 0; i < 10; i++) {
              const ratio = i / 9;
              const x = startPos.x + (endPos.x - startPos.x) * ratio;
              // 添加一点波动使轨迹看起来更自然
              const waveFactor = Math.sin(ratio * Math.PI) * 5;
              const y = startPos.y + (endPos.y - startPos.y) * ratio + waveFactor;
              points.push(`${x},${y}`);
            }
            
            return (
              <polyline
                key={`route-${ship.id}`}
                points={points.join(' ')}
                fill="none"
                stroke={getShipStatusColor(ship.status)}
                strokeWidth="2"
                strokeDasharray="3,3"
                strokeOpacity="0.7"
                className="ship-history-route"
              />
            );
          })}
        </svg>
        
        {/* 绘制港口 */}
        {ports.map(port => {
          const { x, y } = calculatePosition(port.position.longitude, port.position.latitude);
          const isHighlighted = highlightedPorts.includes(port.id);
          
          return (
            <div 
              key={port.id}
              className={`port-marker ${isHighlighted ? 'highlighted' : ''}`}
              style={{ left: `${x}px`, top: `${y}px` }}
              title={`${port.name} (在港船舶: ${port.ships.length})`}
            >
              <div className="port-icon">
                {getPortIcon(isHighlighted)}
              </div>
              <div className="port-label">{port.name}</div>
            </div>
          );
        })}
        
        {/* 绘制天气风险标记 */}
        {weatherMarkers.map(marker => {
          const { x, y } = calculatePosition(marker.position.longitude, marker.position.latitude);
          
          return (
            <div 
              key={marker.id}
              className={`weather-marker ${marker.severity}`}
              style={{ left: `${x}px`, top: `${y}px` }}
              title={`${marker.type === 'storm' ? '风暴' : 
                     marker.type === 'fog' ? '大雾' : 
                     marker.type === 'high_waves' ? '巨浪' : '冰层'} - ${
                     marker.severity === 'low' ? '低风险' : 
                     marker.severity === 'medium' ? '中风险' : '高风险'}`}
            >
              <div className="weather-icon">
                {getWeatherIcon(marker.type, marker.severity)}
              </div>
            </div>
          );
        })}
        
        {/* 绘制船舶 */}
        {ships.map(ship => {
          const { x, y } = calculatePosition(ship.position.longitude, ship.position.latitude);
          const isSelected = ship.id === selectedShipId;
          
          return (
            <div 
              key={ship.id}
              className={`ship-marker ${isSelected ? 'selected' : ''} ${ship.status}`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onClick={() => handleShipClick(ship)}
              title={`${ship.name} (${ship.type})`}
            >
              <div className="ship-icon">
                {getShipIcon(ship.direction, ship.status)}
              </div>
              <div className="ship-label">{ship.name}</div>
            </div>
          );
        })}
        
        {/* 地图控件 */}
        <div className="map-control-panel">
          <div className="map-compass">
            <div className="compass-north">N</div>
            <div className="compass-east">E</div>
            <div className="compass-south">S</div>
            <div className="compass-west">W</div>
            <div className="compass-needle"></div>
          </div>
          
          <div className="zoom-controls">
            <button className="zoom-button" onClick={handleZoomIn} title="放大">+</button>
            <button className="zoom-button" onClick={handleZoomOut} title="缩小">−</button>
          </div>
        </div>
        
        {/* 比例尺 */}
        <div className="map-scale-container">
          <div className="map-scale">
            <div className="scale-bar"></div>
            <div className="scale-text">500km</div>
          </div>
        </div>
        
        {/* 船舶状态图例按钮 */}
        <div className="legend-button" onClick={toggleLegend}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        
        {/* 船舶状态图例 */}
        {showLegend && (
          <div className="map-legend">
            <div className="legend-header">
              <div className="legend-title">图例</div>
              <div className="legend-close" onClick={toggleLegend}>×</div>
            </div>
            <div className="legend-items">
              <div className="legend-section">
                <div className="legend-section-title">船舶状态</div>
                <div className="legend-item">
                  <div className="legend-icon normal"></div>
                  <div className="legend-text">正常</div>
                </div>
                <div className="legend-item">
                  <div className="legend-icon warning"></div>
                  <div className="legend-text">警告</div>
                </div>
                <div className="legend-item">
                  <div className="legend-icon danger"></div>
                  <div className="legend-text">危险</div>
                </div>
              </div>
              
              {routes.length > 0 && (
                <div className="legend-section">
                  <div className="legend-section-title">航线类型</div>
                  <div className="legend-item">
                    <div className="legend-line" style={{ backgroundColor: '#1890ff' }}></div>
                    <div className="legend-text">最快航线</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-line" style={{ backgroundColor: '#52c41a' }}></div>
                    <div className="legend-text">最安全航线</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-line" style={{ backgroundColor: '#fa8c16', borderStyle: 'dashed' }}></div>
                    <div className="legend-text">经济航线</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AMapComponent; 