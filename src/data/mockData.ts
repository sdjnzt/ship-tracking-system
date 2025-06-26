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
    estimatedArrival: '2025-06-30T14:00:00',
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
    estimatedArrival: '2025-07-02T08:30:00',
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
    estimatedArrival: '2025-06-28T10:15:00',
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
    estimatedArrival: '2025-07-05T18:45:00',
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
    estimatedArrival: '2025-06-29T06:20:00',
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
  volume?: number; // 体积 m³
  packageType?: string; // 包装类型
  dangerLevel?: string; // 危险品等级
  insurance?: string; // 保险信息
  receiver?: string; // 收货人
  receiverContact?: string; // 收货人联系方式
  sender?: string; // 发货人
  senderContact?: string; // 发货人联系方式
  currentLocation?: {
    longitude: number;
    latitude: number;
    port?: string;
    desc?: string;
  };
  transportMode?: string; // 运输方式
  transitPorts?: string[]; // 中转港口
  remainingTime?: string; // 预计剩余时间
  transportFee?: number; // 运输费用
  abnormalHistory?: {
    time: string;
    type: string;
    desc: string;
  }[];
  feeDetail?: {
    item: string;
    amount: number;
  }[];
  imageUrl?: string;
  barcode?: string;
  value?: number;
  remark?: string;
  orderId?: string;
  contractId?: string;
  carrier?: string;
  driverName?: string;
  driverContact?: string;
  riskLevel?: '低' | '中' | '高';
  onTimeRate?: number;
  transportCount?: number;
  abnormalCount?: number;
  extraFields?: Record<string, string>;
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
    volume: 32,
    packageType: '集装箱',
    dangerLevel: '普通',
    insurance: '中国人保-货运险',
    receiver: '王伟',
    receiverContact: '13812345678',
    sender: '深圳华强电子',
    senderContact: '0755-12345678',
    currentLocation: { longitude: 121.5, latitude: 37.2, port: '黄海', desc: '航行中' },
    transportMode: '海运',
    transitPorts: ['上海港'],
    remainingTime: '2天4小时',
    transportFee: 12000,
    feeDetail: [
      { item: '基础运费', amount: 10000 },
      { item: '保险费', amount: 1200 },
      { item: '港口杂费', amount: 800 }
    ],
    abnormalHistory: [
      { time: '2025-06-21T10:00:00', type: '气象预警', desc: '遇7级大风，航速降低' }
    ],
    client: '山西焦煤集团',
    estimatedDelivery: '2025-07-05T14:00:00',
    trackingHistory: [
      { status: '已装货', location: '深圳港', timestamp: '2025-06-20T08:30:00' },
      { status: '已发运', location: '深圳港', timestamp: '2025-06-20T15:45:00' },
      { status: '在途中', location: '黄海', timestamp: '2025-06-22T09:15:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '1234567890123',
    value: 1200000,
    remark: '需防潮，严禁倒置',
    orderId: 'ORD-20250620-001',
    contractId: 'CON-202506-001',
    carrier: '中远海运',
    driverName: '赵师傅',
    driverContact: '13900001111',
    riskLevel: '中',
    onTimeRate: 98.5,
    transportCount: 12,
    abnormalCount: 1,
    extraFields: { '特殊要求': '到港后优先卸货' }
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
    volume: 40,
    packageType: '集装箱',
    dangerLevel: '普通',
    insurance: '太平洋保险-冷链险',
    receiver: '李娜',
    receiverContact: '13987654321',
    sender: '大连冷链食品公司',
    senderContact: '0411-87654321',
    currentLocation: { longitude: 121.89, latitude: 37.21, port: '渤海', desc: '温度异常' },
    transportMode: '海运',
    transitPorts: ['烟台港'],
    remainingTime: '1天12小时',
    transportFee: 15000,
    feeDetail: [
      { item: '基础运费', amount: 12000 },
      { item: '冷链附加费', amount: 2000 },
      { item: '保险费', amount: 1000 }
    ],
    abnormalHistory: [
      { time: '2025-06-22T03:15:00', type: '温度异常', desc: '冷藏集装箱温度上升到-15°C' }
    ],
    client: '浩宇集团',
    estimatedDelivery: '2025-06-30T10:00:00',
    trackingHistory: [
      { status: '已装货', location: '大连港', timestamp: '2025-06-18T10:20:00' },
      { status: '已发运', location: '大连港', timestamp: '2025-06-18T16:30:00' },
      { status: '在途中', location: '渤海', timestamp: '2025-06-20T11:45:00' },
      { status: '温度异常', location: '黄海', timestamp: '2025-06-22T03:15:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '9876543210987',
    value: 800000,
    remark: '全程冷链，温度不得高于-18°C',
    orderId: 'ORD-20250618-002',
    contractId: 'CON-202506-002',
    carrier: '中外运',
    driverName: '钱师傅',
    driverContact: '13800002222',
    riskLevel: '高',
    onTimeRate: 95.2,
    transportCount: 8,
    abnormalCount: 2,
    extraFields: { '特殊要求': '温度实时监控' }
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
    volume: 55,
    packageType: '托盘',
    dangerLevel: '普通',
    insurance: '平安保险-货运险',
    receiver: '张强',
    receiverContact: '13711112222',
    sender: '上海重工',
    senderContact: '021-22223333',
    currentLocation: { longitude: 123.12, latitude: 38.05, port: '东海', desc: '延误' },
    transportMode: '海运',
    transitPorts: ['青岛港'],
    remainingTime: '3天8小时',
    transportFee: 18000,
    feeDetail: [
      { item: '基础运费', amount: 15000 },
      { item: '保险费', amount: 1800 },
      { item: '港口杂费', amount: 1200 }
    ],
    abnormalHistory: [
      { time: '2025-06-19T14:50:00', type: '延误', desc: '主引擎故障，船舶暂时停航' }
    ],
    client: '中国重工',
    estimatedDelivery: '2025-07-10T09:00:00',
    trackingHistory: [
      { status: '已装货', location: '上海港', timestamp: '2025-06-15T09:40:00' },
      { status: '已发运', location: '上海港', timestamp: '2025-06-15T17:20:00' },
      { status: '在途中', location: '东海', timestamp: '2025-06-17T10:30:00' },
      { status: '延误', location: '黄海', timestamp: '2025-06-19T14:50:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '2468135791357',
    value: 2000000,
    remark: '设备需加固，防震',
    orderId: 'ORD-20250615-003',
    contractId: 'CON-202506-003',
    carrier: '招商轮船',
    driverName: '孙师傅',
    driverContact: '13700003333',
    riskLevel: '低',
    onTimeRate: 99.1,
    transportCount: 15,
    abnormalCount: 1,
    extraFields: { '特殊要求': '需专人押运' }
  },
  {
    id: 'cargo-004',
    name: '进口葡萄酒批次D',
    type: '酒类',
    origin: '法国马赛',
    destination: '上海',
    status: 'arrived',
    shipId: 'ship-002',
    containerId: 'CONT-D11223',
    weight: 12000,
    volume: 60,
    packageType: '木箱',
    dangerLevel: '低',
    insurance: '中国平安-进口险',
    receiver: '王芳',
    receiverContact: '13688889999',
    sender: '法国葡萄酒庄',
    senderContact: '+33-123456789',
    currentLocation: { longitude: 121.499, latitude: 31.238, port: '上海港', desc: '已到港' },
    transportMode: '海运',
    transitPorts: ['广州港'],
    remainingTime: '0天',
    transportFee: 22000,
    feeDetail: [
      { item: '基础运费', amount: 18000 },
      { item: '保险费', amount: 2500 },
      { item: '港口杂费', amount: 1500 }
    ],
    abnormalHistory: [],
    client: '上海酒业集团',
    estimatedDelivery: '2025-06-28T10:00:00',
    trackingHistory: [
      { status: '已装货', location: '马赛港', timestamp: '2025-06-10T09:00:00' },
      { status: '已发运', location: '马赛港', timestamp: '2025-06-10T18:00:00' },
      { status: '在途中', location: '地中海', timestamp: '2025-06-15T12:00:00' },
      { status: '已到达', location: '上海港', timestamp: '2025-06-28T10:00:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '3216549870123',
    value: 3500000,
    remark: '避免阳光直射',
    orderId: 'ORD-20250610-004',
    contractId: 'CON-202506-004',
    carrier: '达飞轮船',
    driverName: '李船长',
    driverContact: '13500004444',
    riskLevel: '低',
    onTimeRate: 97.8,
    transportCount: 6,
    abnormalCount: 0,
    extraFields: { '特殊要求': '需恒温运输' }
  },
  {
    id: 'cargo-005',
    name: '高精密仪器批次E',
    type: '精密仪器',
    origin: '北京',
    destination: '新加坡',
    status: 'shipped',
    shipId: 'ship-004',
    containerId: 'CONT-E33445',
    weight: 3000,
    volume: 18,
    packageType: '定制箱',
    dangerLevel: '中',
    insurance: '中国人保-高端仪器险',
    receiver: '新加坡科技公司',
    receiverContact: '+65-88887777',
    sender: '北京精仪科技',
    senderContact: '010-88889999',
    currentLocation: { longitude: 124.35, latitude: 38.72, port: '大连港', desc: '已出港' },
    transportMode: '空运',
    transitPorts: ['香港机场'],
    remainingTime: '1天8小时',
    transportFee: 48000,
    feeDetail: [
      { item: '基础运费', amount: 40000 },
      { item: '保险费', amount: 5000 },
      { item: '机场杂费', amount: 3000 }
    ],
    abnormalHistory: [
      { time: '2025-06-27T15:00:00', type: '震动报警', desc: '运输途中发生剧烈震动' }
    ],
    client: '新加坡科技公司',
    estimatedDelivery: '2025-07-01T16:00:00',
    trackingHistory: [
      { status: '已装货', location: '北京', timestamp: '2025-06-25T08:00:00' },
      { status: '已发运', location: '北京', timestamp: '2025-06-25T12:00:00' },
      { status: '在途中', location: '大连港', timestamp: '2025-06-27T10:00:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '5556667778881',
    value: 5000000,
    remark: '运输全程需防震',
    orderId: 'ORD-20250625-005',
    contractId: 'CON-202506-005',
    carrier: '中国国际航空',
    driverName: '王机长',
    driverContact: '13600005555',
    riskLevel: '中',
    onTimeRate: 96.3,
    transportCount: 3,
    abnormalCount: 1,
    extraFields: { '特殊要求': '需全程监控' }
  },
  {
    id: 'cargo-006',
    name: '危险化学品批次F',
    type: '化学品',
    origin: '天津',
    destination: '广州',
    status: 'delayed',
    shipId: 'ship-001',
    containerId: 'CONT-F55667',
    weight: 9000,
    volume: 25,
    packageType: '铁桶',
    dangerLevel: '高',
    insurance: '太平洋保险-危险品险',
    receiver: '广州化工集团',
    receiverContact: '020-66668888',
    sender: '天津化工厂',
    senderContact: '022-55556666',
    currentLocation: { longitude: 120.316, latitude: 36.088, port: '青岛港', desc: '延误' },
    transportMode: '海运',
    transitPorts: ['青岛港'],
    remainingTime: '2天20小时',
    transportFee: 35000,
    feeDetail: [
      { item: '基础运费', amount: 30000 },
      { item: '保险费', amount: 3000 },
      { item: '危险品附加费', amount: 2000 }
    ],
    abnormalHistory: [
      { time: '2025-06-28T09:00:00', type: '延误', desc: '港口安检未通过' }
    ],
    client: '广州化工集团',
    estimatedDelivery: '2025-07-03T12:00:00',
    trackingHistory: [
      { status: '已装货', location: '天津港', timestamp: '2025-06-24T07:00:00' },
      { status: '已发运', location: '天津港', timestamp: '2025-06-24T13:00:00' },
      { status: '在途中', location: '青岛港', timestamp: '2025-06-28T09:00:00' },
      { status: '延误', location: '青岛港', timestamp: '2025-06-28T09:00:00' }
    ],
    imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    barcode: '1122334455667',
    value: 1800000,
    remark: '危险品运输，需专人押运',
    orderId: 'ORD-20250624-006',
    contractId: 'CON-202506-006',
    carrier: '中远海运',
    driverName: '刘师傅',
    driverContact: '13700006666',
    riskLevel: '高',
    onTimeRate: 92.1,
    transportCount: 5,
    abnormalCount: 2,
    extraFields: { '特殊要求': '需双人押运' }
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
    timestamp: '2025-06-25T04:32:15',
    description: '船舶偏离计划航线超过5海里',
    status: 'investigating'
  },
  {
    id: 'anomaly-002',
    type: 'cargo_issue',
    severity: 'high',
    shipId: 'ship-005',
    position: { longitude: 121.89, latitude: 37.21 },
    timestamp: '2025-06-25T02:18:43',
    description: '冷藏集装箱温度上升到-15°C，超出安全范围',
    status: 'detected'
  },
  {
    id: 'anomaly-003',
    type: 'mechanical_failure',
    severity: 'high',
    shipId: 'ship-003',
    position: { longitude: 123.12, latitude: 38.05 },
    timestamp: '2025-06-24T23:45:12',
    description: '主引擎故障，船舶暂时停航',
    status: 'investigating'
  },
  {
    id: 'anomaly-004',
    type: 'weather_alert',
    severity: 'medium',
    shipId: 'ship-001',
    position: { longitude: 122.25, latitude: 37.45 },
    timestamp: '2025-06-25T05:10:32',
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
    departureTime: '2025-06-20T15:45:00',
    estimatedArrival: '2025-06-30T14:00:00',
    waypoints: [
      {
        position: { longitude: 114.26, latitude: 22.53 },
        estimatedPassTime: '2025-06-20T15:45:00',
        status: 'passed'
      },
      {
        position: { longitude: 118.14, latitude: 28.93 },
        estimatedPassTime: '2025-06-23T10:30:00',
        status: 'passed'
      },
      {
        position: { longitude: 122.25, latitude: 37.45 },
        estimatedPassTime: '2025-06-25T08:15:00',
        status: 'current'
      },
      {
        position: { longitude: 120.316, latitude: 36.088 },
        estimatedPassTime: '2025-06-30T14:00:00',
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
        estimatedTime: '2025-06-26T12:00:00'
      }
    ]
  },
  {
    id: 'route-002',
    shipId: 'ship-005',
    originPort: '大连港',
    destinationPort: '烟台港',
    departureTime: '2025-06-18T16:30:00',
    estimatedArrival: '2025-06-29T06:20:00',
    waypoints: [
      {
        position: { longitude: 121.628, latitude: 38.922 },
        estimatedPassTime: '2025-06-18T16:30:00',
        status: 'passed'
      },
      {
        position: { longitude: 122.15, latitude: 38.35 },
        estimatedPassTime: '2025-06-22T11:45:00',
        status: 'passed'
      },
      {
        position: { longitude: 121.89, latitude: 37.21 },
        estimatedPassTime: '2025-06-25T18:30:00',
        status: 'current'
      },
      {
        position: { longitude: 121.391, latitude: 37.538 },
        estimatedPassTime: '2025-06-29T06:20:00',
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
        estimatedTime: '2025-06-27T05:00:00'
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
    { month: '2025-01', value: 153 },
    { month: '2025-02', value: 142 },
    { month: '2025-03', value: 168 },
    { month: '2025-04', value: 185 },
    { month: '2025-05', value: 197 },
    { month: '2025-06', value: 209 }
  ],
  portActivity: [
    { port: '青岛港', arrivals: 45, departures: 42 },
    { port: '上海港', arrivals: 78, departures: 75 },
    { port: '济宁港', arrivals: 23, departures: 25 },
    { port: '大连港', arrivals: 35, departures: 32 },
    { port: '烟台港', arrivals: 30, departures: 28 }
  ],
  fuelConsumption: [
    { date: '2025-01', value: 2450 },
    { date: '2025-02', value: 2280 },
    { date: '2025-03', value: 2520 },
    { date: '2025-04', value: 2650 },
    { date: '2025-05', value: 2830 },
    { date: '2025-06', value: 2750 }
  ],
  onTimeDelivery: 92.5,
  totalDistance: 287650
};

// 用户管理相关数据结构
export interface UserData {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastLoginTime: string;
  createTime: string;
  permissions: string[];
  assignedShips?: string[];
  assignedPorts?: string[];
  loginCount: number;
  lastLoginIp?: string;
  remark?: string;
}

// 角色权限配置
export interface RolePermission {
  role: string;
  permissions: string[];
  description: string;
}

// 部门信息
export interface DepartmentData {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  level: number;
  manager?: string;
  memberCount: number;
  description?: string;
}

// 模拟用户数据
export const mockUsers: UserData[] = [
  {
    id: 'user-001',
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@shipping.com',
    phone: '13800138001',
    role: 'admin',
    department: '信息技术部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    lastLoginTime: '2025-06-25T08:30:00',
    createTime: '2025-01-15T10:00:00',
    permissions: ['all'],
    loginCount: 156,
    lastLoginIp: '192.168.1.100',
    remark: '系统超级管理员'
  },
  {
    id: 'user-002',
    username: 'zhang.manager',
    realName: '张经理',
    email: 'zhang.manager@shipping.com',
    phone: '13800138002',
    role: 'manager',
    department: '运营管理部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    lastLoginTime: '2025-06-25T09:15:00',
    createTime: '2025-02-20T14:30:00',
    permissions: ['ship_manage', 'cargo_manage', 'route_manage', 'report_view'],
    assignedShips: ['ship-001', 'ship-002', 'ship-003'],
    assignedPorts: ['青岛港', '上海港'],
    loginCount: 89,
    lastLoginIp: '192.168.1.101',
    remark: '负责船舶运营管理'
  },
  {
    id: 'user-003',
    username: 'li.operator',
    realName: '李操作员',
    email: 'li.operator@shipping.com',
    phone: '13800138003',
    role: 'operator',
    department: '船舶调度部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshMvIwjTceG.png',
    lastLoginTime: '2025-06-24T16:45:00',
    createTime: '2025-03-10T11:20:00',
    permissions: ['ship_track', 'cargo_track', 'route_view'],
    assignedShips: ['ship-004', 'ship-005'],
    assignedPorts: ['大连港', '烟台港'],
    loginCount: 67,
    lastLoginIp: '192.168.1.102',
    remark: '负责船舶实时监控'
  },
  {
    id: 'user-004',
    username: 'wang.viewer',
    realName: '王查看员',
    email: 'wang.viewer@shipping.com',
    phone: '13800138004',
    role: 'viewer',
    department: '客户服务部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.png',
    lastLoginTime: '2025-06-25T10:20:00',
    createTime: '2025-04-05T09:15:00',
    permissions: ['cargo_track', 'report_view'],
    loginCount: 34,
    lastLoginIp: '192.168.1.103',
    remark: '负责客户查询服务'
  },
  {
    id: 'user-005',
    username: 'chen.manager',
    realName: '陈经理',
    email: 'chen.manager@shipping.com',
    phone: '13800138005',
    role: 'manager',
    department: '财务部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    lastLoginTime: '2025-06-24T14:30:00',
    createTime: '2025-02-28T16:45:00',
    permissions: ['finance_manage', 'report_view', 'cost_analysis'],
    loginCount: 78,
    lastLoginIp: '192.168.1.104',
    remark: '负责财务管理和成本分析'
  },
  {
    id: 'user-006',
    username: 'zhao.operator',
    realName: '赵操作员',
    email: 'zhao.operator@shipping.com',
    phone: '13800138006',
    role: 'operator',
    department: '船舶调度部',
    status: 'inactive',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tXlLQhLvkEelMstLyHiN.png',
    lastLoginTime: '2025-06-20T11:15:00',
    createTime: '2025-03-15T13:20:00',
    permissions: ['ship_track', 'cargo_track'],
    assignedShips: ['ship-001'],
    loginCount: 23,
    lastLoginIp: '192.168.1.105',
    remark: '临时停用账号'
  },
  {
    id: 'user-007',
    username: 'sun.viewer',
    realName: '孙查看员',
    email: 'sun.viewer@shipping.com',
    phone: '13800138007',
    role: 'viewer',
    department: '市场部',
    status: 'suspended',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    lastLoginTime: '2025-06-18T09:45:00',
    createTime: '2025-04-20T10:30:00',
    permissions: ['report_view'],
    loginCount: 12,
    lastLoginIp: '192.168.1.106',
    remark: '账号被暂停使用'
  },
  {
    id: 'user-008',
    username: 'wu.operator',
    realName: '吴操作员',
    email: 'wu.operator@shipping.com',
    phone: '13800138008',
    role: 'operator',
    department: '船舶调度部',
    status: 'active',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
    lastLoginTime: '2025-06-25T07:30:00',
    createTime: '2025-05-10T15:20:00',
    permissions: ['ship_track', 'cargo_track', 'route_view'],
    assignedShips: ['ship-002', 'ship-003'],
    assignedPorts: ['济宁港'],
    loginCount: 45,
    lastLoginIp: '192.168.1.107',
    remark: '新入职操作员'
  }
];

// 角色权限配置
export const rolePermissions: RolePermission[] = [
  {
    role: 'admin',
    permissions: ['all'],
    description: '系统管理员，拥有所有权限'
  },
  {
    role: 'manager',
    permissions: ['ship_manage', 'cargo_manage', 'route_manage', 'report_view', 'finance_manage', 'cost_analysis'],
    description: '部门经理，拥有部门管理权限'
  },
  {
    role: 'operator',
    permissions: ['ship_track', 'cargo_track', 'route_view', 'anomaly_alert'],
    description: '操作员，负责日常操作和监控'
  },
  {
    role: 'viewer',
    permissions: ['cargo_track', 'report_view'],
    description: '查看员，只能查看基本信息和报表'
  }
];

// 部门数据
export const mockDepartments: DepartmentData[] = [
  {
    id: 'dept-001',
    name: '信息技术部',
    code: 'IT',
    level: 1,
    manager: 'admin',
    memberCount: 5,
    description: '负责系统开发和维护'
  },
  {
    id: 'dept-002',
    name: '运营管理部',
    code: 'OPS',
    level: 1,
    manager: 'zhang.manager',
    memberCount: 12,
    description: '负责船舶运营管理'
  },
  {
    id: 'dept-003',
    name: '船舶调度部',
    code: 'DISP',
    level: 1,
    manager: 'li.operator',
    memberCount: 8,
    description: '负责船舶调度和监控'
  },
  {
    id: 'dept-004',
    name: '客户服务部',
    code: 'CS',
    level: 1,
    manager: 'wang.viewer',
    memberCount: 6,
    description: '负责客户服务和查询'
  },
  {
    id: 'dept-005',
    name: '财务部',
    code: 'FIN',
    level: 1,
    manager: 'chen.manager',
    memberCount: 4,
    description: '负责财务管理和成本分析'
  },
  {
    id: 'dept-006',
    name: '市场部',
    code: 'MKT',
    level: 1,
    manager: 'sun.viewer',
    memberCount: 3,
    description: '负责市场推广和客户开发'
  }
];

// 用户登录历史
export interface LoginHistory {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  location?: string;
}

export const mockLoginHistory: LoginHistory[] = [
  {
    id: 'login-001',
    userId: 'user-001',
    loginTime: '2025-06-25T08:30:00',
    logoutTime: '2025-06-25T18:00:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    location: '北京市朝阳区'
  },
  {
    id: 'login-002',
    userId: 'user-002',
    loginTime: '2025-06-25T09:15:00',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    status: 'success',
    location: '上海市浦东新区'
  },
  {
    id: 'login-003',
    userId: 'user-003',
    loginTime: '2025-06-24T16:45:00',
    logoutTime: '2025-06-24T23:30:00',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'success',
    location: '青岛市市南区'
  }
]; 