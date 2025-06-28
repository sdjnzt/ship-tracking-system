import React, { useState, useEffect, useRef } from 'react';
import { ShipData, PortData } from '../data/mockData';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/RealMapComponent.css';

// 导入Leaflet图标资源
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 修复Leaflet图标问题的更安全方式
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 确保这些类型与mockData.ts中的类型匹配
export interface RouteData {
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

export interface WeatherMarker {
  id: string;
  position: {
    longitude: number;
    latitude: number;
  };
  type: 'storm' | 'high_waves' | 'fog' | 'ice' | 'route_deviation' | 'mechanical_failure' | 'cargo_issue' | 'security_alert';
  severity: 'low' | 'medium' | 'high';
}

interface RealMapComponentProps {
  ships: ShipData[];
  ports: PortData[];
  onShipClick: (ship: ShipData) => void;
  routes?: RouteData[];
  weatherMarkers?: WeatherMarker[];
  zoomToFit?: boolean;
  highlightedPorts?: string[];
  mapType?: 'standard' | 'satellite' | 'terrain';
}

// 自定义船舶图标 - 优化版本
const createShipIcon = (status: string, direction: number) => {
  let color;
  switch (status) {
    case 'normal': 
      color = '#52c41a'; // green
      break;
    case 'warning':
      color = '#faad14'; // yellow
      break;
    case 'danger':
      color = '#ff4d4f'; // red
      break;
    default:
      color = '#52c41a';
  }
  
  return L.divIcon({
    html: `
      <div class="ship-icon-container ${status}">
        <svg width="28" height="28" viewBox="0 0 24 24" style="transform: rotate(${direction}deg)">
          <path 
            d="M20,21C18.61,21 17.22,20.53 16,19.67C13.56,21.38 10.44,21.38 8,19.67C6.78,20.53 5.39,21 4,21H2V19H4C5.37,19 6.74,18.41 8,17.27C10.26,19.55 13.74,19.55 16,17.27C17.26,18.41 18.63,19 20,19H22V21H20M8.67,10.5H7V13H8.67C9.96,13 11,11.96 11,10.67C11,9.38 9.96,8.33 8.67,8.33C8.04,8.33 7.44,8.6 7.03,9.03L8.75,10.75L7.33,12.17L5.63,10.47C5.53,10.36 5.44,10.24 5.37,10.12C5.13,9.67 5,9.17 5,8.67C5,7.47 5.9,6.47 7.1,6.47C8.3,6.47 9.3,7.47 9.3,8.67H11.3C11.3,6.36 9.41,4.47 7.1,4.47C4.79,4.47 2.9,6.36 2.9,8.67C2.9,9.83 3.33,10.92 4.13,11.72L7,14.59V10.5H8.67M16.33,10.5H18V13H16.33C15.04,13 14,11.96 14,10.67C14,9.38 15.04,8.33 16.33,8.33C16.96,8.33 17.56,8.6 17.97,9.03L16.25,10.75L17.67,12.17L19.37,10.47C19.47,10.36 19.56,10.24 19.63,10.12C19.87,9.67 20,9.17 20,8.67C20,7.47 19.1,6.47 17.9,6.47C16.7,6.47 15.7,7.47 15.7,8.67H13.7C13.7,6.36 15.59,4.47 17.9,4.47C20.21,4.47 22.1,6.36 22.1,8.67C22.1,9.83 21.67,10.92 20.87,11.72L18,14.59V10.5H16.33Z" 
            fill="${color}"
          />
        </svg>
        <div class="ship-pulse ${status}"></div>
      </div>
    `,
    className: `ship-icon-marker`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// 自定义港口图标 - 优化版本
const createPortIcon = (isHighlighted: boolean = false) => {
  const color = isHighlighted ? '#ff4d4f' : '#1890ff';
  
  return L.divIcon({
    html: `
      <div class="port-icon-container ${isHighlighted ? 'highlighted' : ''}">
        <svg width="28" height="28" viewBox="0 0 24 24">
          <path 
            d="M20,4V6H4V4H20M21,7V19H23V21H1V19H3V7H21M5,9V19H7V9H5M9,9V19H11V9H9M13,9V19H15V9H13M17,9V19H19V9H17Z" 
            fill="${color}"
          />
        </svg>
        ${isHighlighted ? '<div class="port-highlight-ring"></div>' : ''}
      </div>
    `,
    className: `port-icon-marker`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// 自定义天气图标 - 优化版本
const createWeatherIcon = (type: string, severity: string) => {
  let path = '';
  let color = '';
  
  switch (severity) {
    case 'low': color = '#52c41a'; break;
    case 'medium': color = '#faad14'; break;
    case 'high': color = '#ff4d4f'; break;
    default: color = '#1890ff';
  }
  
  switch (type) {
    case 'storm':
      path = 'M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z';
      break;
    case 'fog':
      path = 'M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z';
      break;
    case 'high_waves':
      path = 'M20 20C18.61 20 17.22 19.53 16 18.67C13.56 20.38 10.44 20.38 8 18.67C6.78 19.53 5.39 20 4 20H2V18H4C5.37 18 6.74 17.41 8 16.27C10.26 18.55 13.74 18.55 16 16.27C17.26 17.41 18.63 18 20 18H22V20H20M20 14C18.61 14 17.22 13.53 16 12.67C13.56 14.38 10.44 14.38 8 12.67C6.78 13.53 5.39 14 4 14H2V12H4C5.37 12 6.74 11.41 8 10.27C10.26 12.55 13.74 12.55 16 10.27C17.26 11.41 18.63 12 20 12H22V14H20M22 8H20C18.61 8 17.22 7.53 16 6.67C13.56 8.38 10.44 8.38 8 6.67C6.78 7.53 5.39 8 4 8H2V6H4C5.37 6 6.74 5.41 8 4.27C10.26 6.55 13.74 6.55 16 4.27C17.26 5.41 18.63 6 20 6H22V8Z';
      break;
    case 'ice':
      path = 'M5,20H19V22H5V20M19,9H15V3H9V9H5L12,16L19,9Z';
      break;
    default:
      path = 'M12,2A9,9 0 0,0 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14 21,11A9,9 0 0,0 12,2M8,11A2,2 0 0,1 10,13A2,2 0 0,1 8,15A2,2 0 0,1 6,13A2,2 0 0,1 8,11M16,11A2,2 0 0,1 18,13A2,2 0 0,1 16,15A2,2 0 0,1 14,13A2,2 0 0,1 16,11M12,14L13.5,17H10.5L12,14Z';
  }
  
  return L.divIcon({
    html: `
      <div class="weather-icon-container ${severity}">
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path d="${path}" fill="${color}" />
        </svg>
        <div class="weather-pulse ${severity}"></div>
      </div>
    `,
    className: `weather-icon-marker`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// 地图边界处理组件
const MapBoundsHandler = ({ routes, zoomToFit }: { routes: RouteData[], zoomToFit: boolean }) => {
  const map = useMap();
  
  useEffect(() => {
    if (zoomToFit && routes.length > 0) {
      const allPoints: L.LatLngExpression[] = [];
      
      routes.forEach(route => {
        route.waypoints.forEach(wp => {
          allPoints.push([wp.position.latitude, wp.position.longitude]);
        });
      });
      
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50] as L.PointTuple });
      }
    }
  }, [zoomToFit, routes, map]);
  
  return null;
};

// 地图类型控制组件
const MapTypeControl = ({ mapType, onChange }: { mapType: string, onChange: (type: 'standard' | 'satellite' | 'terrain') => void }) => {
  const map = useMap();
  
  return (
    <div className="map-type-control">
      <div 
        className={`map-type-button ${mapType === 'standard' ? 'active' : ''}`}
        onClick={() => onChange('standard')}
      >
        标准
      </div>
      <div 
        className={`map-type-button ${mapType === 'satellite' ? 'active' : ''}`}
        onClick={() => onChange('satellite')}
      >
        卫星
      </div>
      <div 
        className={`map-type-button ${mapType === 'terrain' ? 'active' : ''}`}
        onClick={() => onChange('terrain')}
      >
        地形
      </div>
    </div>
  );
};

// 缩放控制组件
const CustomZoomControl = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  return (
    <div className="custom-zoom-control">
      <div className="zoom-button zoom-in" onClick={handleZoomIn}>+</div>
      <div className="zoom-button zoom-out" onClick={handleZoomOut}>-</div>
    </div>
  );
};

const RealMapComponent: React.FC<RealMapComponentProps> = ({ 
  ships, 
  ports, 
  onShipClick,
  routes = [],
  weatherMarkers = [],
  zoomToFit = false,
  highlightedPorts = [],
  mapType = 'satellite'
}) => {
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);
  // 山东省中心坐标大约是 (36.3, 118.0)
  const [mapCenter] = useState<[number, number]>([36.3, 118.0]);
  const [currentMapType, setCurrentMapType] = useState<'standard' | 'satellite' | 'terrain'>(mapType);
  const [showWeatherMarkers, setShowWeatherMarkers] = useState(true);
  
  // 更新地图类型
  useEffect(() => {
    setCurrentMapType(mapType);
  }, [mapType]);
  
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
  
  // 处理船舶点击
  const handleShipClick = (ship: ShipData) => {
    setSelectedShipId(ship.id);
    onShipClick(ship);
  };
  
  // 获取船舶轨迹点
  const getShipTrackPoints = (ship: ShipData): [number, number][] => {
    // 简化的轨迹，实际应用中可能需要从API获取
    return [
      [ship.position.latitude - 0.1, ship.position.longitude - 0.1],
      [ship.position.latitude - 0.05, ship.position.longitude - 0.05],
      [ship.position.latitude, ship.position.longitude]
    ];
  };

  // 获取航线点
  const getRoutePoints = (route: RouteData): [number, number][] => {
    return route.waypoints.map(wp => [wp.position.latitude, wp.position.longitude]);
  };

  // 获取航线颜色
  const getRouteColor = (route: RouteData): string => {
    return route.color || '#1890ff';
  };
  
  // 获取船舶方向，这里简化处理，实际应用中可能需要根据航向计算
  const getShipDirection = (ship: ShipData): number => {
    return ship.direction || 0;
  };
  
  // 获取船舶图标
  const getShipIcon = (ship: ShipData) => {
    return createShipIcon(ship.status, getShipDirection(ship));
  };
  
  // 获取港口图标
  const getPortIcon = (port: PortData) => {
    const isHighlighted = highlightedPorts.includes(port.id);
    return createPortIcon(isHighlighted);
  };
  
  // 获取天气图标
  const getWeatherIcon = (marker: WeatherMarker) => {
    return createWeatherIcon(marker.type, marker.severity);
  };

  // 确保地图组件在挂载后加载所有标记
  useEffect(() => {
    console.log('地图组件已加载');
    console.log('船舶数量:', ships.length);
    console.log('港口数量:', ports.length);
    console.log('航线数量:', routes.length);
    console.log('天气标记数量:', weatherMarkers.length);
  }, [ships, ports, routes, weatherMarkers]);

  return (
    <div className="real-map-container">
      <MapContainer 
        center={mapCenter} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
      >
        {/* 地图瓦片层 */}
        <TileLayer
          attribution={getMapAttribution()}
          url={getMapTileUrl()}
        />
        
        {/* 自定义控件 */}
        <CustomZoomControl />
        <MapTypeControl mapType={currentMapType} onChange={setCurrentMapType} />
        
        {/* 船舶标记 */}
        {ships.map(ship => (
          <Marker 
            key={ship.id} 
            position={[ship.position.latitude, ship.position.longitude]}
            icon={getShipIcon(ship)}
            eventHandlers={{
              click: () => handleShipClick(ship)
            }}
          >
            <Popup>
              <div className="ship-popup">
                <h3>{ship.name}</h3>
                <p>类型: {ship.type}</p>
                <p>速度: {ship.speed} 节</p>
                <p>目的地: {ship.destination}</p>
                <p>状态: {ship.status === 'normal' ? '正常' : ship.status === 'warning' ? '警告' : '危险'}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 港口标记 */}
        {ports.map(port => (
          <Marker 
            key={port.id} 
            position={[port.position.latitude, port.position.longitude]}
            icon={getPortIcon(port)}
          >
            <Popup>
              <div className="port-popup">
                <h3>{port.name}</h3>
                <p>国家: {port.country}</p>
                <p>在港船舶: {port.ships.length}</p>
                <p>容量: {port.currentOccupancy}/{port.capacity}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 天气风险标记 */}
        {showWeatherMarkers && weatherMarkers.map(marker => (
          <Marker 
            key={marker.id} 
            position={[marker.position.latitude, marker.position.longitude]}
            icon={getWeatherIcon(marker)}
          >
            <Popup>
              <div className="weather-popup">
                <h3>气象风险</h3>
                <p>类型: {marker.type}</p>
                <p>严重程度: {marker.severity}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* 航线 */}
        {routes.map(route => (
          <Polyline 
            key={route.id}
            positions={getRoutePoints(route)}
            pathOptions={{
              color: getRouteColor(route),
              weight: route.width || 3,
              opacity: 0.7
            }}
          >
            <Popup>
              <div className="route-popup">
                <h3>航线信息</h3>
                <p>类型: {route.type}</p>
                <p>船舶: {ships.find(s => s.id === route.shipId)?.name || '未知'}</p>
              </div>
            </Popup>
          </Polyline>
        ))}
        
        {/* 如果需要自动缩放以适应所有点，使用这个组件 */}
        {routes.length > 0 && <MapBoundsHandler routes={routes} zoomToFit={zoomToFit} />}
      </MapContainer>
    </div>
  );
};

export default RealMapComponent; 