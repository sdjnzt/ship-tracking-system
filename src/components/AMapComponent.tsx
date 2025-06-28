import React, { useState, useEffect, useRef } from 'react';
import { ShipData, PortData } from '../data/mockData';
import '../styles/AMapComponent.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';

// 修复Leaflet默认图标问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 自定义船舶图标
const createShipIcon = (status: string, direction: number) => {
  const color = status === 'normal' ? '#52c41a' : 
                status === 'warning' ? '#faad14' : '#ff4d4f';
  
  return L.divIcon({
    className: `ship-marker-icon ${status}`,
    html: `<div class="ship-icon-container" style="transform: rotate(${direction}deg)">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M20,21C18.61,21 17.22,20.53 16,19.67C13.56,21.38 10.44,21.38 8,19.67C6.78,20.53 5.39,21 4,21H2V19H4C5.37,19 6.74,18.41 8,17.27C10.26,19.55 13.74,19.55 16,17.27C17.26,18.41 18.63,19 20,19H22V21H20Z" fill="${color}" />
            </svg>
           </div>
           <div class="ship-label">${status === 'normal' ? '正常' : status === 'warning' ? '警告' : '危险'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// 自定义港口图标
const createPortIcon = (isHighlighted: boolean = false) => {
  return L.divIcon({
    className: `port-marker-icon ${isHighlighted ? 'highlighted' : ''}`,
    html: `<svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M20,4V6H4V4H20M21,7V19H23V21H1V19H3V7H21M5,9V19H7V9H5M9,9V19H11V9H9M13,9V19H15V9H13M17,9V19H19V9H17Z" 
                  fill="${isHighlighted ? '#ff4d4f' : '#1890ff'}" />
           </svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// 自定义天气图标
const createWeatherIcon = (type: string, severity: string) => {
  let color = '';
  switch (severity) {
    case 'low': color = '#52c41a'; break;
    case 'medium': color = '#faad14'; break;
    case 'high': color = '#ff4d4f'; break;
    default: color = '#1890ff';
  }
  
  let path = '';
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
    default:
      path = 'M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14 21,11A9,9 0 0,0 12,2M8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11M16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11M12,14L13.5,17H10.5L12,14Z';
  }
  
  return L.divIcon({
    className: `weather-marker-icon ${severity}`,
    html: `<svg width="28" height="28" viewBox="0 0 24 24">
            <path d="${path}" fill="${color}" />
           </svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

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
  mapType?: 'standard' | 'satellite' | 'terrain';
}

// 地图类型切换组件
const MapTypeControl = ({ mapType, onChange }: { mapType: string, onChange: (type: string) => void }) => {
  return (
    <div className="map-type-control">
      <button 
        className={`map-type-button ${mapType === 'standard' ? 'active' : ''}`}
        onClick={() => onChange('standard')}
      >
        标准
      </button>
      <button 
        className={`map-type-button ${mapType === 'satellite' ? 'active' : ''}`}
        onClick={() => onChange('satellite')}
      >
        卫星
      </button>
      <button 
        className={`map-type-button ${mapType === 'terrain' ? 'active' : ''}`}
        onClick={() => onChange('terrain')}
      >
        地形
      </button>
    </div>
  );
};

// 地图自动缩放组件
const FitBounds = ({ ships, ports, routes, weatherMarkers }: { 
  ships: ShipData[], 
  ports: PortData[], 
  routes?: RouteData[],
  weatherMarkers?: WeatherMarker[]
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (ships.length === 0 && ports.length === 0 && (!routes || routes.length === 0) && (!weatherMarkers || weatherMarkers.length === 0)) {
      // 默认视图：中国海域
      map.setView([30, 120], 5);
      return;
    }
    
    const bounds = L.latLngBounds([]);
    
    // 添加船舶位置
    ships.forEach(ship => {
      bounds.extend([ship.position.latitude, ship.position.longitude]);
    });
    
    // 添加港口位置
    ports.forEach(port => {
      bounds.extend([port.position.latitude, port.position.longitude]);
    });
    
    // 添加航线位置
    if (routes && routes.length > 0) {
      routes.forEach(route => {
        route.waypoints.forEach(wp => {
          bounds.extend([wp.position.latitude, wp.position.longitude]);
        });
      });
    }
    
    // 添加天气标记位置
    if (weatherMarkers && weatherMarkers.length > 0) {
      weatherMarkers.forEach(marker => {
        bounds.extend([marker.position.latitude, marker.position.longitude]);
      });
    }
    
    // 如果有有效边界，则缩放地图
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, ships, ports, routes, weatherMarkers]);
  
  return null;
};

// 专业的Leaflet地图组件，使用真实地图背景
const AMapComponent: React.FC<AMapComponentProps> = ({ 
  ships, 
  ports, 
  onShipClick,
  routes = [],
  weatherMarkers = [],
  zoomToFit = false,
  highlightedPorts = [],
  mapType = 'standard'
}) => {
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  const [currentMapType, setCurrentMapType] = useState<string>(mapType);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  
  useEffect(() => {
    setCurrentMapType(mapType);
  }, [mapType]);
  
  // 处理船舶点击
  const handleShipClick = (ship: ShipData) => {
    setSelectedShipId(ship.id);
    onShipClick(ship);
  };
  
  // 切换图例显示状态
  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };
  
  // 获取地图瓦片URL
  const getMapTileUrl = () => {
    switch (currentMapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg';
      case 'standard':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };
  
  // 获取地图归属信息
  const getMapAttribution = () => {
    switch (currentMapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>';
      case 'standard':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };
  
  return (
    <div className="leaflet-map-container">
      <MapContainer 
        center={[30, 120]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={getMapTileUrl()}
          attribution={getMapAttribution()}
        />
        
        {/* 自动缩放到合适的视图 */}
        {zoomToFit && <FitBounds ships={ships} ports={ports} routes={routes} weatherMarkers={weatherMarkers} />}
        
        {/* 绘制航线 */}
          {routes.map(route => {
            if (route.waypoints.length < 2) return null;
            
          const positions = route.waypoints.map(wp => [wp.position.latitude, wp.position.longitude] as [number, number]);
            
            return (
            <React.Fragment key={`route-${route.id}`}>
              {/* 主航线 */}
              <Polyline
                positions={positions}
                pathOptions={{ 
                  color: route.color,
                  weight: route.width,
                  dashArray: route.type === 'economical' ? '5,5' : undefined,
                  opacity: 0.8
                }}
              />
              
              {/* 航点标记 */}
              {route.waypoints.map((wp, idx) => (
                <CircleMarker
                  key={`waypoint-${route.id}-${idx}`}
                  center={[wp.position.latitude, wp.position.longitude]}
                  radius={idx === 0 || idx === route.waypoints.length - 1 ? 6 : 4}
                  pathOptions={{
                    color: '#fff',
                    weight: 2,
                    fillColor: route.color,
                    fillOpacity: 1
                  }}
                >
                  <Popup>
                    <div>
                      <strong>{idx === 0 ? '起点' : idx === route.waypoints.length - 1 ? '终点' : `航点 ${idx}`}</strong>
                      <div>经度: {wp.position.longitude.toFixed(4)}°E</div>
                      <div>纬度: {wp.position.latitude.toFixed(4)}°N</div>
                      <div>状态: {wp.status === 'passed' ? '已通过' : wp.status === 'current' ? '当前位置' : '未到达'}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </React.Fragment>
            );
          })}
        
        {/* 绘制港口 */}
        {ports.map(port => (
          <Marker
            key={`port-${port.id}`}
            position={[port.position.latitude, port.position.longitude]}
            icon={createPortIcon(highlightedPorts.includes(port.id))}
          >
            <Popup>
              <div className="port-info">
                <h4>{port.name}</h4>
                <p><strong>国家/地区:</strong> {port.country}</p>
                <p><strong>容量:</strong> {port.capacity} 船位</p>
                <p><strong>当前船舶:</strong> {port.ships.length} 艘</p>
                <p><strong>等待时间:</strong> {port.waitingTime} 小时</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 绘制天气标记 */}
        {weatherMarkers.map(marker => (
          <Marker
            key={`weather-${marker.id}`}
            position={[marker.position.latitude, marker.position.longitude]}
            icon={createWeatherIcon(marker.type, marker.severity)}
          >
            <Popup>
              <div className="weather-info">
                <h4>{
                  marker.type === 'storm' ? '风暴' : 
                     marker.type === 'fog' ? '大雾' : 
                  marker.type === 'high_waves' ? '巨浪' : '异常天气'
                }</h4>
                <p><strong>风险等级:</strong> {
                  marker.severity === 'high' ? '高风险' : 
                  marker.severity === 'medium' ? '中风险' : '低风险'
                }</p>
                <p><strong>位置:</strong> {marker.position.longitude.toFixed(2)}°E, {marker.position.latitude.toFixed(2)}°N</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 绘制船舶 */}
        {ships.map(ship => (
          <Marker
            key={`ship-${ship.id}`}
            position={[ship.position.latitude, ship.position.longitude]}
            icon={createShipIcon(ship.status, ship.direction)}
            eventHandlers={{
              click: () => handleShipClick(ship)
            }}
          >
            <Popup>
              <div className="ship-info">
                <h4>{ship.name}</h4>
                <p><strong>类型:</strong> {ship.type}</p>
                <p><strong>状态:</strong> {
                  ship.status === 'normal' ? '正常航行' : 
                  ship.status === 'warning' ? '警告状态' : '危险状态'
                }</p>
                <p><strong>速度:</strong> {ship.speed} 节</p>
                <p><strong>航向:</strong> {ship.direction}°</p>
                <p><strong>位置:</strong> {ship.position.longitude.toFixed(4)}°E, {ship.position.latitude.toFixed(4)}°N</p>
                <button 
                  className="ship-detail-btn"
              onClick={() => handleShipClick(ship)}
            >
                  查看详情
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* 地图类型切换控件 */}
      <MapTypeControl 
        mapType={currentMapType} 
        onChange={(type) => setCurrentMapType(type)} 
      />
        
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
  );
};

export default AMapComponent; 