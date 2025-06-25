// 模拟船舶数据
export interface ShipData {
  id: string;
  name: string;
  type: string;
  position: {
    longitude: number;
    latitude: number;
  };
  speed: number;
  direction: number;
  destination: string;
  estimatedArrival: string;
  status: 'normal' | 'warning' | 'danger';
  cargoInfo?: {
    type: string;
    weight: number;
    containers?: number;
  };
}

// 模拟船舶位置数据
export const mockShips: ShipData[] = [
  {
    id: 'ship-001',
    name: '润杨物流-001',
    type: '集装箱船',
    position: { longitude: 122.25, latitude: 37.45 },
    speed: 18.5,
    direction: 135,
    destination: '青岛港',
    estimatedArrival: '2023-06-30T14:00:00',
    status: 'normal',
    cargoInfo: {
      type: '电子产品',
      weight: 8500,
      containers: 120
    }
  },
  {
    id: 'ship-002',
    name: '润杨物流-002',
    type: '散货船',
    position: { longitude: 122.56, latitude: 37.78 },
    speed: 15.2,
    direction: 90,
    destination: '上海港',
    estimatedArrival: '2023-07-02T08:30:00',
    status: 'normal',
    cargoInfo: {
      type: '矿石',
      weight: 25000
    }
  },
  {
    id: 'ship-003',
    name: '润杨物流-003',
    type: '集装箱船',
    position: { longitude: 123.12, latitude: 38.05 },
    speed: 0,
    direction: 0,
    destination: '济宁港',
    estimatedArrival: '2023-06-28T10:15:00',
    status: 'warning',
    cargoInfo: {
      type: '机械设备',
      weight: 12000,
      containers: 85
    }
  },
  {
    id: 'ship-004',
    name: '润杨物流-004',
    type: '油轮',
    position: { longitude: 124.35, latitude: 38.72 },
    speed: 12.8,
    direction: 225,
    destination: '大连港',
    estimatedArrival: '2023-07-05T18:45:00',
    status: 'normal',
    cargoInfo: {
      type: '石油',
      weight: 35000
    }
  },
  {
    id: 'ship-005',
    name: '润杨物流-005',
    type: '集装箱船',
    position: { longitude: 121.89, latitude: 37.21 },
    speed: 5.3,
    direction: 315,
    destination: '烟台港',
    estimatedArrival: '2023-06-29T06:20:00',
    status: 'danger',
    cargoInfo: {
      type: '冷冻食品',
      weight: 9800,
      containers: 110
    }
  }
];

// 模拟历史轨迹数据
export interface TrackPoint {
  timestamp: string;
  position: {
    longitude: number;
    latitude: number;
  };
  speed: number;
}

export const getShipTrack = (shipId: string): TrackPoint[] => {
  // 这里根据船舶ID返回模拟的历史轨迹数据
  const basePoints = [
    { longitude: 120.5, latitude: 36.8, speed: 18.2 },
    { longitude: 121.0, latitude: 37.0, speed: 17.8 },
    { longitude: 121.5, latitude: 37.2, speed: 18.5 },
    { longitude: 122.0, latitude: 37.4, speed: 18.0 },
    { longitude: 122.5, latitude: 37.6, speed: 17.5 }
  ];
  
  // 生成过去24小时的轨迹点
  return basePoints.map((point, index) => {
    // 根据船舶ID做一些微调，使每艘船的轨迹略有不同
    const idNum = parseInt(shipId.replace('ship-', ''));
    const offset = idNum * 0.1;
    
    return {
      timestamp: new Date(Date.now() - (24 - index * 6) * 3600000).toISOString(),
      position: {
        longitude: point.longitude + offset,
        latitude: point.latitude + (offset / 2)
      },
      speed: point.speed + (Math.random() * 2 - 1) // 添加一点随机变化
    };
  });
};

// 模拟气象数据
export interface WeatherData {
  position: {
    longitude: number;
    latitude: number;
  };
  windSpeed: number;
  windDirection: number;
  temperature: number;
  waveHeight: number;
}

export const mockWeatherData: WeatherData[] = [
  {
    position: { longitude: 122.0, latitude: 37.5 },
    windSpeed: 15,
    windDirection: 90,
    temperature: 22,
    waveHeight: 1.2
  },
  {
    position: { longitude: 122.5, latitude: 38.0 },
    windSpeed: 18,
    windDirection: 95,
    temperature: 21.5,
    waveHeight: 1.5
  },
  {
    position: { longitude: 123.0, latitude: 38.5 },
    windSpeed: 20,
    windDirection: 100,
    temperature: 21,
    waveHeight: 1.8
  },
  {
    position: { longitude: 123.5, latitude: 37.5 },
    windSpeed: 12,
    windDirection: 85,
    temperature: 23,
    waveHeight: 0.9
  },
  {
    position: { longitude: 122.5, latitude: 37.0 },
    windSpeed: 10,
    windDirection: 80,
    temperature: 24,
    waveHeight: 0.7
  }
];

// 模拟港口数据
export interface PortData {
  id: string;
  name: string;
  position: {
    longitude: number;
    latitude: number;
  };
  country: string;
  capacity: number;
  currentOccupancy: number;
  ships: string[];
  waitingTime: number; // 平均等待时间（小时）
}

export const mockPorts: PortData[] = [
  {
    id: 'port-001',
    name: '青岛港',
    position: { longitude: 120.316, latitude: 36.088 },
    country: '中国',
    capacity: 200,
    currentOccupancy: 145,
    ships: ['ship-001'],
    waitingTime: 2.5
  },
  {
    id: 'port-002',
    name: '上海港',
    position: { longitude: 121.499, latitude: 31.238 },
    country: '中国',
    capacity: 350,
    currentOccupancy: 310,
    ships: ['ship-002'],
    waitingTime: 5.2
  },
  {
    id: 'port-003',
    name: '济宁港',
    position: { longitude: 116.601, latitude: 35.414 },
    country: '中国',
    capacity: 80,
    currentOccupancy: 45,
    ships: ['ship-003'],
    waitingTime: 1.0
  },
  {
    id: 'port-004',
    name: '大连港',
    position: { longitude: 121.628, latitude: 38.922 },
    country: '中国',
    capacity: 180,
    currentOccupancy: 120,
    ships: ['ship-004'],
    waitingTime: 3.5
  },
  {
    id: 'port-005',
    name: '烟台港',
    position: { longitude: 121.391, latitude: 37.538 },
    country: '中国',
    capacity: 150,
    currentOccupancy: 95,
    ships: ['ship-005'],
    waitingTime: 2.0
  }
];

// 模拟货物追踪数据
export interface CargoTrackingData {
  id: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  status: 'loading' | 'shipped' | 'arrived' | 'delivered' | 'delayed';
  shipId: string;
  containerId?: string;
  temperature?: number; // 对于温控货物
  humidity?: number; // 对于需要湿度控制的货物
  weight: number;
  client: string;
  estimatedDelivery: string;
  trackingHistory: {
    status: string;
    location: string;
    timestamp: string;
  }[];
}

export const mockCargos: CargoTrackingData[] = [
  {
    id: 'cargo-001',
    name: '电子设备批次A',
    type: '电子产品',
    origin: '深圳',
    destination: '济宁',
    status: 'shipped',
    shipId: 'ship-001',
    containerId: 'CONT-A12345',
    weight: 2500,
    client: '山西焦煤集团',
    estimatedDelivery: '2023-07-05T14:00:00',
    trackingHistory: [
      {
        status: '已装货',
        location: '深圳港',
        timestamp: '2023-06-20T08:30:00'
      },
      {
        status: '已发运',
        location: '深圳港',
        timestamp: '2023-06-20T15:45:00'
      },
      {
        status: '在途中',
        location: '黄海',
        timestamp: '2023-06-22T09:15:00'
      }
    ]
  },
  {
    id: 'cargo-002',
    name: '冷冻食品批次B',
    type: '冷冻食品',
    origin: '大连',
    destination: '青岛',
    status: 'shipped',
    shipId: 'ship-005',
    containerId: 'CONT-B67890',
    temperature: -18.5,
    humidity: 60,
    weight: 3500,
    client: '浩宇集团',
    estimatedDelivery: '2023-06-30T10:00:00',
    trackingHistory: [
      {
        status: '已装货',
        location: '大连港',
        timestamp: '2023-06-18T10:20:00'
      },
      {
        status: '已发运',
        location: '大连港',
        timestamp: '2023-06-18T16:30:00'
      },
      {
        status: '在途中',
        location: '渤海',
        timestamp: '2023-06-20T11:45:00'
      },
      {
        status: '温度异常',
        location: '黄海',
        timestamp: '2023-06-22T03:15:00'
      }
    ]
  },
  {
    id: 'cargo-003',
    name: '机械设备批次C',
    type: '机械设备',
    origin: '上海',
    destination: '威海',
    status: 'delayed',
    shipId: 'ship-003',
    containerId: 'CONT-C24680',
    weight: 8500,
    client: '中国重工',
    estimatedDelivery: '2023-07-10T09:00:00',
    trackingHistory: [
      {
        status: '已装货',
        location: '上海港',
        timestamp: '2023-06-15T09:40:00'
      },
      {
        status: '已发运',
        location: '上海港',
        timestamp: '2023-06-15T17:20:00'
      },
      {
        status: '在途中',
        location: '东海',
        timestamp: '2023-06-17T10:30:00'
      },
      {
        status: '延误',
        location: '黄海',
        timestamp: '2023-06-19T14:50:00'
      }
    ]
  }
];

// 模拟异常事件数据
export interface AnomalyEvent {
  id: string;
  type: 'route_deviation' | 'weather_alert' | 'mechanical_failure' | 'cargo_issue' | 'security_alert';
  severity: 'low' | 'medium' | 'high';
  shipId: string;
  position: {
    longitude: number;
    latitude: number;
  };
  timestamp: string;
  description: string;
  status: 'detected' | 'investigating' | 'resolved';
}

export const mockAnomalies: AnomalyEvent[] = [
  {
    id: 'anomaly-001',
    type: 'route_deviation',
    severity: 'medium',
    shipId: 'ship-002',
    position: { longitude: 122.56, latitude: 37.78 },
    timestamp: '2023-06-25T04:32:15',
    description: '船舶偏离计划航线超过5海里',
    status: 'investigating'
  },
  {
    id: 'anomaly-002',
    type: 'cargo_issue',
    severity: 'high',
    shipId: 'ship-005',
    position: { longitude: 121.89, latitude: 37.21 },
    timestamp: '2023-06-25T02:18:43',
    description: '冷藏集装箱温度上升到-15°C，超出安全范围',
    status: 'detected'
  },
  {
    id: 'anomaly-003',
    type: 'mechanical_failure',
    severity: 'high',
    shipId: 'ship-003',
    position: { longitude: 123.12, latitude: 38.05 },
    timestamp: '2023-06-24T23:45:12',
    description: '主引擎故障，船舶暂时停航',
    status: 'investigating'
  },
  {
    id: 'anomaly-004',
    type: 'weather_alert',
    severity: 'medium',
    shipId: 'ship-001',
    position: { longitude: 122.25, latitude: 37.45 },
    timestamp: '2023-06-25T05:10:32',
    description: '航线前方将有7级大风，建议调整航线',
    status: 'detected'
  }
];

// 模拟航线规划数据
export interface RoutePlanData {
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

export const mockRoutes: RoutePlanData[] = [
  {
    id: 'route-001',
    shipId: 'ship-001',
    originPort: '深圳港',
    destinationPort: '青岛港',
    departureTime: '2023-06-20T15:45:00',
    estimatedArrival: '2023-06-30T14:00:00',
    waypoints: [
      {
        position: { longitude: 114.26, latitude: 22.53 },
        estimatedPassTime: '2023-06-20T15:45:00',
        status: 'passed'
      },
      {
        position: { longitude: 118.14, latitude: 28.93 },
        estimatedPassTime: '2023-06-23T10:30:00',
        status: 'passed'
      },
      {
        position: { longitude: 122.25, latitude: 37.45 },
        estimatedPassTime: '2023-06-25T08:15:00',
        status: 'current'
      },
      {
        position: { longitude: 120.316, latitude: 36.088 },
        estimatedPassTime: '2023-06-30T14:00:00',
        status: 'upcoming'
      }
    ],
    distance: 1250,
    fuelConsumption: 125,
    weatherRisks: [
      {
        position: { longitude: 122.8, latitude: 37.9 },
        type: 'storm',
        severity: 'medium',
        estimatedTime: '2023-06-26T12:00:00'
      }
    ]
  },
  {
    id: 'route-002',
    shipId: 'ship-005',
    originPort: '大连港',
    destinationPort: '烟台港',
    departureTime: '2023-06-18T16:30:00',
    estimatedArrival: '2023-06-29T06:20:00',
    waypoints: [
      {
        position: { longitude: 121.628, latitude: 38.922 },
        estimatedPassTime: '2023-06-18T16:30:00',
        status: 'passed'
      },
      {
        position: { longitude: 122.15, latitude: 38.35 },
        estimatedPassTime: '2023-06-22T11:45:00',
        status: 'passed'
      },
      {
        position: { longitude: 121.89, latitude: 37.21 },
        estimatedPassTime: '2023-06-25T18:30:00',
        status: 'current'
      },
      {
        position: { longitude: 121.391, latitude: 37.538 },
        estimatedPassTime: '2023-06-29T06:20:00',
        status: 'upcoming'
      }
    ],
    distance: 380,
    fuelConsumption: 42,
    weatherRisks: [
      {
        position: { longitude: 121.7, latitude: 37.4 },
        type: 'fog',
        severity: 'high',
        estimatedTime: '2023-06-27T05:00:00'
      }
    ]
  }
];

// 模拟统计数据
export interface StatisticsData {
  totalShips: number;
  activeShips: number;
  totalPorts: number;
  totalCargo: number;
  cargoByType: { type: string; value: number }[];
  monthlyShipments: { month: string; value: number }[];
  portActivity: { port: string; arrivals: number; departures: number }[];
  fuelConsumption: { date: string; value: number }[];
  onTimeDelivery: number; // 百分比
  totalDistance: number; // 总航行距离（海里）
}

export const mockStatistics: StatisticsData = {
  totalShips: 22,
  activeShips: 18,
  totalPorts: 12,
  totalCargo: 245,
  cargoByType: [
    { type: '电子产品', value: 58 },
    { type: '机械设备', value: 45 },
    { type: '冷冻食品', value: 65 },
    { type: '矿石', value: 32 },
    { type: '石油', value: 28 },
    { type: '其他', value: 17 }
  ],
  monthlyShipments: [
    { month: '2023-01', value: 153 },
    { month: '2023-02', value: 142 },
    { month: '2023-03', value: 168 },
    { month: '2023-04', value: 185 },
    { month: '2023-05', value: 197 },
    { month: '2023-06', value: 209 }
  ],
  portActivity: [
    { port: '青岛港', arrivals: 45, departures: 42 },
    { port: '上海港', arrivals: 78, departures: 75 },
    { port: '济宁港', arrivals: 23, departures: 25 },
    { port: '大连港', arrivals: 35, departures: 32 },
    { port: '烟台港', arrivals: 30, departures: 28 }
  ],
  fuelConsumption: [
    { date: '2023-01', value: 2450 },
    { date: '2023-02', value: 2280 },
    { date: '2023-03', value: 2520 },
    { date: '2023-04', value: 2650 },
    { date: '2023-05', value: 2830 },
    { date: '2023-06', value: 2750 }
  ],
  onTimeDelivery: 92.5,
  totalDistance: 287650
}; 