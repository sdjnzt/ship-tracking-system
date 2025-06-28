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
    name: '远洋号',
    type: '集装箱船',
    position: { longitude: 122.5, latitude: 31.0 },
    speed: 18.5,
    direction: 45,
    destination: '青岛港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '电子产品',
      weight: 15000,
      containers: 1200
    }
  },
  {
    id: 'ship-002',
    name: '海洋之星',
    type: '油轮',
    position: { longitude: 119.8, latitude: 35.9 },
    speed: 15.2,
    direction: 180,
    destination: '上海港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '原油',
      weight: 120000
    }
  },
  {
    id: 'ship-003',
    name: '蓝鲸号',
    type: '散货船',
    position: { longitude: 121.8, latitude: 30.9 },
    speed: 12.8,
    direction: 210,
    destination: '深圳港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    status: 'warning',
    cargoInfo: {
      type: '铁矿石',
      weight: 85000
    }
  },
  {
    id: 'ship-004',
    name: '东方明珠',
    type: '集装箱船',
    position: { longitude: 113.8, latitude: 22.2 },
    speed: 17.5,
    direction: 15,
    destination: '宁波港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 30).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '服装',
      weight: 12000,
      containers: 950
    }
  },
  {
    id: 'ship-005',
    name: '海上巨人',
    type: '集装箱船',
    position: { longitude: 121.3, latitude: 29.5 },
    speed: 19.2,
    direction: 225,
    destination: '广州港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 40).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '机械设备',
      weight: 18000,
      containers: 1500
    }
  },
  {
    id: 'ship-006',
    name: '南海勇士',
    type: '油轮',
    position: { longitude: 113.5, latitude: 22.8 },
    speed: 14.8,
    direction: 0,
    destination: '天津港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    status: 'danger',
    cargoInfo: {
      type: '液化天然气',
      weight: 95000
    }
  },
  {
    id: 'ship-007',
    name: '北方之星',
    type: '散货船',
    position: { longitude: 118.1, latitude: 38.9 },
    speed: 13.5,
    direction: 135,
    destination: '厦门港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 55).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '煤炭',
      weight: 70000
    }
  },
  {
    id: 'ship-008',
    name: '龙腾号',
    type: '集装箱船',
    position: { longitude: 121.9, latitude: 38.7 },
    speed: 18.0,
    direction: 180,
    destination: '上海港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    status: 'warning',
    cargoInfo: {
      type: '汽车零部件',
      weight: 14000,
      containers: 1100
    }
  },
  {
    id: 'ship-009',
    name: '和平使者',
    type: '滚装船',
    position: { longitude: 128.8, latitude: 35.0 },
    speed: 16.5,
    direction: 270,
    destination: '大连港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 32).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '汽车',
      weight: 25000
    }
  },
  {
    id: 'ship-010',
    name: '东方之光',
    type: '集装箱船',
    position: { longitude: 139.5, latitude: 35.5 },
    speed: 19.8,
    direction: 270,
    destination: '上海港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 45).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '电子产品',
      weight: 16000,
      containers: 1300
    }
  },
  {
    id: 'ship-011',
    name: '齐鲁号',
    type: '集装箱船',
    position: { longitude: 120.3, latitude: 36.1 },
    speed: 16.8,
    direction: 90,
    destination: '威海港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '机械设备',
      weight: 13500,
      containers: 980
    }
  },
  {
    id: 'ship-012',
    name: '泰山号',
    type: '散货船',
    position: { longitude: 121.4, latitude: 36.9 },
    speed: 14.2,
    direction: 215,
    destination: '日照港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '煤炭',
      weight: 65000
    }
  },
  {
    id: 'ship-013',
    name: '黄海明珠',
    type: '油轮',
    position: { longitude: 119.5, latitude: 35.4 },
    speed: 13.8,
    direction: 45,
    destination: '烟台港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'warning',
    cargoInfo: {
      type: '原油',
      weight: 110000
    }
  },
  {
    id: 'ship-014',
    name: '鲁能号',
    type: '集装箱船',
    position: { longitude: 122.1, latitude: 37.5 },
    speed: 17.6,
    direction: 270,
    destination: '青岛港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '电子产品',
      weight: 14200,
      containers: 1050
    }
  },
  {
    id: 'ship-015',
    name: '渤海之星',
    type: '滚装船',
    position: { longitude: 120.7, latitude: 37.8 },
    speed: 15.5,
    direction: 180,
    destination: '威海港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 10).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '汽车',
      weight: 18000
    }
  },
  {
    id: 'ship-016',
    name: '胶东之光',
    type: '集装箱船',
    position: { longitude: 121.0, latitude: 36.5 },
    speed: 18.2,
    direction: 135,
    destination: '烟台港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    status: 'normal',
    cargoInfo: {
      type: '服装',
      weight: 9500,
      containers: 780
    }
  },
  {
    id: 'ship-017',
    name: '海洋卫士',
    type: '油轮',
    position: { longitude: 119.2, latitude: 35.0 },
    speed: 12.5,
    direction: 0,
    destination: '日照港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    status: 'danger',
    cargoInfo: {
      type: '液化天然气',
      weight: 85000
    }
  },
  {
    id: 'ship-018',
    name: '蓬莱号',
    type: '散货船',
    position: { longitude: 120.8, latitude: 37.1 },
    speed: 14.0,
    direction: 60,
    destination: '烟台港',
    estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 15).toISOString(),
    status: 'warning',
    cargoInfo: {
      type: '铁矿石',
      weight: 72000
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
  },
  {
    position: { longitude: 120.5, latitude: 36.2 },
    windSpeed: 14,
    windDirection: 75,
    temperature: 23.5,
    waveHeight: 1.1
  },
  {
    position: { longitude: 121.0, latitude: 37.0 },
    windSpeed: 16,
    windDirection: 85,
    temperature: 22.5,
    waveHeight: 1.3
  },
  {
    position: { longitude: 119.5, latitude: 35.5 },
    windSpeed: 12,
    windDirection: 70,
    temperature: 24.0,
    waveHeight: 0.8
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
    name: '上海港',
    country: '中国',
    position: { longitude: 121.4737, latitude: 31.2304 },
    ships: ['ship-001', 'ship-003'],
    capacity: 350,
    currentOccupancy: 280,
    waitingTime: 4.5
  },
  {
    id: 'port-002',
    name: '青岛港',
    country: '中国',
    position: { longitude: 120.3162, latitude: 36.0839 },
    ships: ['ship-002', 'ship-011', 'ship-014'],
    capacity: 280,
    currentOccupancy: 210,
    waitingTime: 3.5
  },
  {
    id: 'port-003',
    name: '深圳港',
    country: '中国',
    position: { longitude: 114.0579, latitude: 22.5431 },
    ships: ['ship-004'],
    capacity: 320,
    currentOccupancy: 260,
    waitingTime: 3.8
  },
  {
    id: 'port-004',
    name: '宁波港',
    country: '中国',
    position: { longitude: 121.5504, latitude: 29.8683 },
    ships: ['ship-005'],
    capacity: 280,
    currentOccupancy: 220,
    waitingTime: 3.2
  },
  {
    id: 'port-005',
    name: '广州港',
    country: '中国',
    position: { longitude: 113.2644, latitude: 23.1291 },
    ships: ['ship-006'],
    capacity: 250,
    currentOccupancy: 190,
    waitingTime: 2.8
  },
  {
    id: 'port-006',
    name: '天津港',
    country: '中国',
    position: { longitude: 117.7912, latitude: 39.0042 },
    ships: ['ship-007'],
    capacity: 230,
    currentOccupancy: 180,
    waitingTime: 3.0
  },
  {
    id: 'port-007',
    name: '厦门港',
    country: '中国',
    position: { longitude: 118.0894, latitude: 24.4798 },
    ships: [],
    capacity: 180,
    currentOccupancy: 120,
    waitingTime: 2.0
  },
  {
    id: 'port-008',
    name: '大连港',
    country: '中国',
    position: { longitude: 121.6147, latitude: 38.9140 },
    ships: ['ship-008'],
    capacity: 200,
    currentOccupancy: 150,
    waitingTime: 2.5
  },
  {
    id: 'port-009',
    name: '釜山港',
    country: '韩国',
    position: { longitude: 129.0403, latitude: 35.1142 },
    ships: ['ship-009'],
    capacity: 300,
    currentOccupancy: 240,
    waitingTime: 3.5
  },
  {
    id: 'port-010',
    name: '东京港',
    country: '日本',
    position: { longitude: 139.7690, latitude: 35.6804 },
    ships: ['ship-010'],
    capacity: 280,
    currentOccupancy: 220,
    waitingTime: 3.2
  },
  {
    id: 'port-011',
    name: '烟台港',
    country: '中国',
    position: { longitude: 121.3913, latitude: 37.5382 },
    ships: ['ship-013', 'ship-016', 'ship-018'],
    capacity: 180,
    currentOccupancy: 135,
    waitingTime: 2.8
  },
  {
    id: 'port-012',
    name: '威海港',
    country: '中国',
    position: { longitude: 122.1193, latitude: 37.5129 },
    ships: ['ship-015'],
    capacity: 120,
    currentOccupancy: 85,
    waitingTime: 1.5
  },
  {
    id: 'port-013',
    name: '日照港',
    country: '中国',
    position: { longitude: 119.5269, latitude: 35.4162 },
    ships: ['ship-012', 'ship-017'],
    capacity: 150,
    currentOccupancy: 110,
    waitingTime: 2.2
  },
  {
    id: 'port-014',
    name: '龙口港',
    country: '中国',
    position: { longitude: 120.4782, latitude: 37.6431 },
    ships: [],
    capacity: 100,
    currentOccupancy: 65,
    waitingTime: 1.2
  },
  {
    id: 'port-015',
    name: '滨州港',
    country: '中国',
    position: { longitude: 118.0165, latitude: 37.9813 },
    ships: [],
    capacity: 90,
    currentOccupancy: 45,
    waitingTime: 1.0
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
  },
  {
    id: 'anomaly-005',
    type: 'route_deviation',
    severity: 'low',
    shipId: 'ship-011',
    position: { longitude: 120.85, latitude: 36.65 },
    timestamp: '2025-06-25T15:22:10',
    description: '船舶偏离计划航线3海里',
    status: 'detected'
  },
  {
    id: 'anomaly-006',
    type: 'weather_alert',
    severity: 'high',
    shipId: 'ship-013',
    position: { longitude: 120.55, latitude: 36.85 },
    timestamp: '2025-06-25T18:05:45',
    description: '前方海域有8级大风，建议紧急调整航线',
    status: 'investigating'
  },
  {
    id: 'anomaly-007',
    type: 'mechanical_failure',
    severity: 'medium',
    shipId: 'ship-018',
    position: { longitude: 120.85, latitude: 37.15 },
    timestamp: '2025-06-25T14:38:22',
    description: '辅助发动机故障，船舶减速行驶',
    status: 'investigating'
  }
];

// 修改mockRoutes数据结构，使其符合RouteData类型
export const mockRoutes = [
  {
    id: 'route-001',
    shipId: 'ship-001',
    waypoints: [
      {
        position: { longitude: 114.26, latitude: 22.53 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 118.14, latitude: 28.93 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 122.25, latitude: 37.45 },
        status: 'current' as 'current'
      },
      {
        position: { longitude: 120.316, latitude: 36.088 },
        status: 'upcoming' as 'upcoming'
      }
    ],
    color: '#1890ff',
    width: 3,
    type: 'fastest' as 'fastest'
  },
  {
    id: 'route-002',
    shipId: 'ship-005',
    waypoints: [
      {
        position: { longitude: 121.628, latitude: 38.922 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 122.15, latitude: 38.35 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 121.89, latitude: 37.21 },
        status: 'current' as 'current'
      },
      {
        position: { longitude: 121.391, latitude: 37.538 },
        status: 'upcoming' as 'upcoming'
      }
    ],
    color: '#52c41a',
    width: 3,
    type: 'safest' as 'safest'
  },
  // 添加山东地区的航线
  {
    id: 'route-003',
    shipId: 'ship-011',
    waypoints: [
      {
        position: { longitude: 120.316, latitude: 36.084 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 120.8, latitude: 36.6 },
        status: 'current' as 'current'
      },
      {
        position: { longitude: 121.5, latitude: 37.1 },
        status: 'upcoming' as 'upcoming'
      },
      {
        position: { longitude: 122.119, latitude: 37.513 },
        status: 'upcoming' as 'upcoming'
      }
    ],
    color: '#722ed1',
    width: 3,
    type: 'economical' as 'economical'
  },
  {
    id: 'route-004',
    shipId: 'ship-013',
    waypoints: [
      {
        position: { longitude: 119.527, latitude: 35.416 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 119.8, latitude: 36.0 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 120.5, latitude: 36.8 },
        status: 'current' as 'current'
      },
      {
        position: { longitude: 121.391, latitude: 37.538 },
        status: 'upcoming' as 'upcoming'
      }
    ],
    color: '#fa8c16',
    width: 3,
    type: 'fastest' as 'fastest'
  },
  {
    id: 'route-005',
    shipId: 'ship-016',
    waypoints: [
      {
        position: { longitude: 120.316, latitude: 36.084 },
        status: 'passed' as 'passed'
      },
      {
        position: { longitude: 120.7, latitude: 36.5 },
        status: 'current' as 'current'
      },
      {
        position: { longitude: 121.0, latitude: 37.0 },
        status: 'upcoming' as 'upcoming'
      },
      {
        position: { longitude: 121.391, latitude: 37.538 },
        status: 'upcoming' as 'upcoming'
      }
    ],
    color: '#13c2c2',
    width: 3,
    type: 'economical' as 'economical'
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
  manager: string;
  description: string;
  memberCount: number;
  createTime: string;
}

// 模拟用户数据
export const mockUsers: UserData[] = [
  {
    id: 'user-001',
    username: 'zhangwei',
    realName: '张伟',
    email: 'zhangwei@example.com',
    phone: '13812345678',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'admin',
    department: '系统管理部',
    status: 'active',
    lastLoginTime: '2023-06-10T08:23:12Z',
    createTime: '2022-01-15T00:00:00Z',
    permissions: ['system:all', 'user:all', 'ship:all', 'port:all', 'report:all'],
    loginCount: 286,
    lastLoginIp: '192.168.1.100',
    remark: '系统管理员，负责整体系统维护'
  },
  {
    id: 'user-002',
    username: 'liming',
    realName: '李明',
    email: 'liming@example.com',
    phone: '13987654321',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'manager',
    department: '运营管理部',
    status: 'active',
    lastLoginTime: '2023-06-09T16:45:22Z',
    createTime: '2022-02-18T00:00:00Z',
    permissions: ['ship:view', 'ship:edit', 'port:view', 'port:edit', 'report:view', 'report:export'],
    loginCount: 178,
    lastLoginIp: '192.168.1.101',
    remark: '运营部门经理，负责船舶调度'
  },
  {
    id: 'user-003',
    username: 'wangjing',
    realName: '王静',
    email: 'wangjing@example.com',
    phone: '13765432198',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    role: 'operator',
    department: '物流部',
    status: 'active',
    lastLoginTime: '2023-06-10T09:12:45Z',
    createTime: '2022-03-20T00:00:00Z',
    permissions: ['ship:view', 'port:view', 'cargo:view', 'cargo:edit'],
    loginCount: 145,
    lastLoginIp: '192.168.1.102',
    remark: '物流部操作员，负责货物跟踪'
  },
  {
    id: 'user-004',
    username: 'zhaolei',
    realName: '赵雷',
    email: 'zhaolei@example.com',
    phone: '13612345678',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    role: 'operator',
    department: '船舶管理部',
    status: 'active',
    lastLoginTime: '2023-06-09T14:30:00Z',
    createTime: '2022-04-05T00:00:00Z',
    permissions: ['ship:view', 'ship:edit', 'route:view', 'route:edit'],
    loginCount: 132,
    lastLoginIp: '192.168.1.103',
    remark: '船舶管理员，负责船舶维护'
  },
  {
    id: 'user-005',
    username: 'chenxin',
    realName: '陈欣',
    email: 'chenxin@example.com',
    phone: '13598765432',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    role: 'viewer',
    department: '财务部',
    status: 'inactive',
    lastLoginTime: '2023-05-20T10:15:30Z',
    createTime: '2022-05-12T00:00:00Z',
    permissions: ['report:view', 'finance:view'],
    loginCount: 56,
    lastLoginIp: '192.168.1.104',
    remark: '财务部查看员，负责查看财务报表'
  },
  {
    id: 'user-006',
    username: 'liuyang',
    realName: '刘洋',
    email: 'liuyang@example.com',
    phone: '13712345678',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    role: 'manager',
    department: '客户服务部',
    status: 'active',
    lastLoginTime: '2023-06-08T16:20:15Z',
    createTime: '2022-06-01T00:00:00Z',
    permissions: ['customer:all', 'report:view', 'report:export'],
    loginCount: 98,
    lastLoginIp: '192.168.1.105',
    remark: '客户服务部经理，负责客户关系维护'
  },
  {
    id: 'user-007',
    username: 'sunfei',
    realName: '孙飞',
    email: 'sunfei@example.com',
    phone: '13898765432',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    role: 'operator',
    department: '技术支持部',
    status: 'suspended',
    lastLoginTime: '2023-04-15T09:45:12Z',
    createTime: '2022-07-10T00:00:00Z',
    permissions: ['system:view', 'system:edit'],
    loginCount: 65,
    lastLoginIp: '192.168.1.106',
    remark: '技术支持工程师，负责系统维护'
  },
  {
    id: 'user-008',
    username: 'yangmei',
    realName: '杨梅',
    email: 'yangmei@example.com',
    phone: '13512345678',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    role: 'viewer',
    department: '市场部',
    status: 'active',
    lastLoginTime: '2023-06-07T11:30:45Z',
    createTime: '2022-08-15T00:00:00Z',
    permissions: ['report:view', 'market:view'],
    loginCount: 42,
    lastLoginIp: '192.168.1.107',
    remark: '市场部分析员，负责市场数据分析'
  }
];

// 模拟部门数据
export const mockDepartments: DepartmentData[] = [
  {
    id: 'dept-001',
    name: '系统管理部',
    code: 'SYS',
    manager: 'zhangwei',
    description: '负责系统整体管理和维护',
    memberCount: 3,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-002',
    name: '运营管理部',
    code: 'OPS',
    manager: 'liming',
    description: '负责日常运营和调度管理',
    memberCount: 8,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-003',
    name: '物流部',
    code: 'LOG',
    manager: 'wangjing',
    description: '负责物流和货物运输管理',
    memberCount: 12,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-004',
    name: '船舶管理部',
    code: 'SHIP',
    manager: 'zhaolei',
    description: '负责船舶维护和管理',
    memberCount: 15,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-005',
    name: '财务部',
    code: 'FIN',
    manager: 'chenxin',
    description: '负责财务管理和报表',
    memberCount: 6,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-006',
    name: '客户服务部',
    code: 'CS',
    manager: 'liuyang',
    description: '负责客户关系维护和服务',
    memberCount: 10,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-007',
    name: '技术支持部',
    code: 'TECH',
    manager: 'sunfei',
    description: '负责技术支持和系统维护',
    memberCount: 8,
    createTime: '2022-01-01T00:00:00Z'
  },
  {
    id: 'dept-008',
    name: '市场部',
    code: 'MKT',
    manager: 'yangmei',
    description: '负责市场分析和推广',
    memberCount: 7,
    createTime: '2022-01-01T00:00:00Z'
  }
];

// 模拟角色权限数据
export const rolePermissions: RolePermission[] = [
  {
    role: 'admin',
    description: '系统管理员，拥有所有权限',
    permissions: [
      'system:all', 'user:all', 'ship:all', 'port:all', 
      'cargo:all', 'route:all', 'report:all', 'finance:all',
      'customer:all', 'market:all', 'log:all'
    ]
  },
  {
    role: 'manager',
    description: '部门经理，拥有部门内所有权限',
    permissions: [
      'user:view', 'user:edit', 
      'ship:view', 'ship:edit', 'ship:add',
      'port:view', 'port:edit',
      'cargo:view', 'cargo:edit',
      'route:view', 'route:edit',
      'report:view', 'report:export'
    ]
  },
  {
    role: 'operator',
    description: '操作员，拥有基本操作权限',
    permissions: [
      'ship:view', 'ship:edit',
      'port:view',
      'cargo:view', 'cargo:edit',
      'route:view', 'route:edit',
      'report:view'
    ]
  },
  {
    role: 'viewer',
    description: '查看员，只有查看权限',
    permissions: [
      'ship:view',
      'port:view',
      'cargo:view',
      'route:view',
      'report:view'
    ]
  }
];

// 模拟登录历史数据
export const mockLoginHistory = [
  {
    id: 'login-001',
    userId: 'user-001',
    loginTime: '2023-06-10T08:23:12Z',
    ipAddress: '192.168.1.100',
    location: '上海市',
    device: 'Chrome / Windows 10',
    status: 'success'
  },
  {
    id: 'login-002',
    userId: 'user-002',
    loginTime: '2023-06-09T16:45:22Z',
    ipAddress: '192.168.1.101',
    location: '北京市',
    device: 'Firefox / macOS',
    status: 'success'
  },
  {
    id: 'login-003',
    userId: 'user-003',
    loginTime: '2023-06-10T09:12:45Z',
    ipAddress: '192.168.1.102',
    location: '广州市',
    device: 'Chrome / Windows 11',
    status: 'success'
  },
  {
    id: 'login-004',
    userId: 'user-004',
    loginTime: '2023-06-09T14:30:00Z',
    ipAddress: '192.168.1.103',
    location: '深圳市',
    device: 'Safari / macOS',
    status: 'success'
  },
  {
    id: 'login-005',
    userId: 'user-001',
    loginTime: '2023-06-08T10:15:30Z',
    ipAddress: '192.168.1.100',
    location: '上海市',
    device: 'Chrome / Windows 10',
    status: 'success'
  },
  {
    id: 'login-006',
    userId: 'user-005',
    loginTime: '2023-05-20T10:15:30Z',
    ipAddress: '192.168.1.104',
    location: '武汉市',
    device: 'Edge / Windows 10',
    status: 'success'
  },
  {
    id: 'login-007',
    userId: 'user-007',
    loginTime: '2023-04-15T09:45:12Z',
    ipAddress: '192.168.1.106',
    location: '成都市',
    device: 'Chrome / Ubuntu',
    status: 'failed'
  },
  {
    id: 'login-008',
    userId: 'user-006',
    loginTime: '2023-06-08T16:20:15Z',
    ipAddress: '192.168.1.105',
    location: '南京市',
    device: 'Chrome / Windows 10',
    status: 'success'
  },
  {
    id: 'login-009',
    userId: 'user-008',
    loginTime: '2023-06-07T11:30:45Z',
    ipAddress: '192.168.1.107',
    location: '杭州市',
    device: 'Safari / iOS',
    status: 'success'
  },
  {
    id: 'login-010',
    userId: 'user-001',
    loginTime: '2023-06-06T14:22:18Z',
    ipAddress: '192.168.1.100',
    location: '上海市',
    device: 'Chrome / Windows 10',
    status: 'success'
  }
];

// 修改weatherMarkers数据结构，使其符合WeatherMarker类型
export const weatherMarkers = [
  {
    id: 'weather-001',
    position: {
      longitude: 122.8,
      latitude: 37.9
    },
    type: 'storm' as 'storm',
    severity: 'medium' as 'medium'
  },
  {
    id: 'weather-002',
    position: {
      longitude: 121.7,
      latitude: 37.4
    },
    type: 'fog' as 'fog',
    severity: 'high' as 'high'
  },
  {
    id: 'weather-003',
    position: {
      longitude: 123.2,
      latitude: 38.1
    },
    type: 'mechanical_failure' as 'mechanical_failure',
    severity: 'high' as 'high'
  },
  {
    id: 'weather-004',
    position: {
      longitude: 122.3,
      latitude: 37.5
    },
    type: 'route_deviation' as 'route_deviation',
    severity: 'medium' as 'medium'
  },
  {
    id: 'weather-005',
    position: {
      longitude: 120.8,
      latitude: 36.7
    },
    type: 'high_waves' as 'high_waves',
    severity: 'medium' as 'medium'
  },
  {
    id: 'weather-006',
    position: {
      longitude: 119.8,
      latitude: 35.8
    },
    type: 'storm' as 'storm',
    severity: 'high' as 'high'
  },
  {
    id: 'weather-007',
    position: {
      longitude: 121.2,
      latitude: 37.3
    },
    type: 'fog' as 'fog',
    severity: 'medium' as 'medium'
  },
  {
    id: 'weather-008',
    position: {
      longitude: 122.5,
      latitude: 37.6
    },
    type: 'ice' as 'ice',
    severity: 'low' as 'low'
  }
]; 