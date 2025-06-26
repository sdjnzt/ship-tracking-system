import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col,
  Table, 
  Tag, 
  Steps, 
  Input, 
  Button,
  Modal,
  Descriptions,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  FileTextOutlined, 
  ShoppingOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { mockCargos, CargoTrackingData } from '../data/mockData';
import '../styles/CargoTracking.css';

const { Title, Text } = Typography;
const { Step } = Steps;

// 统计卡片组件
const CargoStats: React.FC<{ cargos: CargoTrackingData[] }> = ({ cargos }) => {
  const total = cargos.length;
  const shipping = cargos.filter(c => c.status === 'shipped').length;
  const arrived = cargos.filter(c => c.status === 'arrived').length;
  const delayed = cargos.filter(c => c.status === 'delayed').length;
  const coldChain = cargos.filter(c => c.type.includes('冷冻') || c.temperature !== undefined).length;

  return (
    <Row gutter={16} className="cargo-stats-row" style={{ marginBottom: 20 }}>
      <Col><Card className="stat-card" bordered={false}><div className="stat-title">总货物数</div><div className="stat-value">{total}</div></Card></Col>
      <Col><Card className="stat-card" bordered={false}><div className="stat-title">运输中</div><div className="stat-value">{shipping}</div></Card></Col>
      <Col><Card className="stat-card" bordered={false}><div className="stat-title">已到达</div><div className="stat-value">{arrived}</div></Card></Col>
      <Col><Card className="stat-card" bordered={false}><div className="stat-title">延误</div><div className="stat-value">{delayed}</div></Card></Col>
      <Col><Card className="stat-card" bordered={false}><div className="stat-title">冷链货物</div><div className="stat-value">{coldChain}</div></Card></Col>
    </Row>
  );
};

const CargoTracking: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredCargos, setFilteredCargos] = useState<CargoTrackingData[]>(mockCargos);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<CargoTrackingData | null>(null);

  const handleSearch = () => {
    if (!searchText) {
      setFilteredCargos(mockCargos);
      return;
    }

    const filtered = mockCargos.filter(cargo => 
      cargo.id.toLowerCase().includes(searchText.toLowerCase()) ||
      cargo.name.toLowerCase().includes(searchText.toLowerCase()) || 
      cargo.client.toLowerCase().includes(searchText.toLowerCase()) ||
      cargo.containerId?.toLowerCase().includes(searchText.toLowerCase())
    );
    
    setFilteredCargos(filtered);
  };

  const showCargoDetails = (cargo: CargoTrackingData) => {
    setSelectedCargo(cargo);
    setModalVisible(true);
  };

  const getStepStatus = (status: string) => {
    switch(status) {
      case 'loading': return 'process';
      case 'shipped': return 'process';
      case 'arrived': return 'process';
      case 'delivered': return 'finish';
      case 'delayed': return 'error';
      default: return 'wait';
    }
  };

  const getCurrentStep = (status: string) => {
    switch(status) {
      case 'loading': return 0;
      case 'shipped': return 1;
      case 'arrived': return 2;
      case 'delivered': return 3;
      case 'delayed': return 1; // 假设延迟发生在运输阶段
      default: return 0;
    }
  };

  const getStatusTag = (status: string) => {
    switch(status) {
      case 'loading':
        return <Tag color="blue">装货中</Tag>;
      case 'shipped':
        return <Tag color="purple">运输中</Tag>;
      case 'arrived':
        return <Tag color="cyan">已到达</Tag>;
      case 'delivered':
        return <Tag color="green">已交付</Tag>;
      case 'delayed':
        return <Tag color="red">延误</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const columns = [
    {
      title: '货物ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '货物名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '货物类型',
      dataIndex: 'type',
      key: 'type',
    },
    // {
    //   title: '价值(元)',
    //   dataIndex: 'value',
    //   key: 'value',
    //   render: (v: number) => v ? v.toLocaleString() : '-',
    // },
    {
      title: '运输方式',
      dataIndex: 'transportMode',
      key: 'transportMode',
    },
    // {
    //   title: '运输公司',
    //   dataIndex: 'carrier',
    //   key: 'carrier',
    // },
    {
      title: '体积(m³)',
      dataIndex: 'volume',
      key: 'volume',
      render: (v: number) => v ? v : '-',
    },
    {
      title: '包装',
      dataIndex: 'packageType',
      key: 'packageType',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (v: string) => v ? <Tag color={v === '高' ? 'red' : v === '中' ? 'orange' : 'green'}>{v}</Tag> : '-',
    },
    {
      title: '预计送达',
      dataIndex: 'estimatedDelivery',
      key: 'estimatedDelivery',
      render: (v: string) => v ? new Date(v).toLocaleDateString() : '-',
    },
    // {
    //   title: '条码',
    //   dataIndex: 'barcode',
    //   key: 'barcode',
    //   render: (v: string) => v ? <span title={v}>{v.slice(0, 6)}...{v.slice(-3)}</span> : '-',
    // },
    // {
    //   title: '司机/船长',
    //   dataIndex: 'driverName',
    //   key: 'driverName',
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (v: string) => v ? <span title={v}>{v.length > 8 ? v.slice(0, 8) + '...' : v}</span> : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CargoTrackingData) => (
        <Button 
          type="link" 
          onClick={() => showCargoDetails(record)}
          icon={<FileTextOutlined />}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="cargo-tracking">
      <Title level={2}>货物追踪</Title>
      <CargoStats cargos={filteredCargos} />
      
      <Card className="search-card">
        <Row gutter={16} align="middle">
          <Col xs={24} sm={16} md={18} lg={20}>
            <Input 
              placeholder="请输入货物ID、名称、集装箱号或客户名称进行搜索" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Button type="primary" onClick={handleSearch} block>
              查询
            </Button>
          </Col>
        </Row>
      </Card>
      
      <Card title="货物列表" className="cargo-list-card">
        <Table 
          dataSource={filteredCargos}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title={`货物详情 - ${selectedCargo?.name}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        {selectedCargo && (
          <>
            {/* 货物基础信息 */}
            <Descriptions bordered column={2} className="cargo-details" title="基础信息">
              <Descriptions.Item label="货物ID" span={2}>{selectedCargo.id}</Descriptions.Item>
              <Descriptions.Item label="货物名称">{selectedCargo.name}</Descriptions.Item>
              <Descriptions.Item label="货物类型">{selectedCargo.type}</Descriptions.Item>
              <Descriptions.Item label="重量">{selectedCargo.weight} 吨</Descriptions.Item>
              {selectedCargo.volume && <Descriptions.Item label="体积">{selectedCargo.volume} m³</Descriptions.Item>}
              {selectedCargo.packageType && <Descriptions.Item label="包装类型">{selectedCargo.packageType}</Descriptions.Item>}
              {selectedCargo.dangerLevel && <Descriptions.Item label="危险品等级">{selectedCargo.dangerLevel}</Descriptions.Item>}
              {selectedCargo.insurance && <Descriptions.Item label="保险信息">{selectedCargo.insurance}</Descriptions.Item>}
              <Descriptions.Item label="出发地">{selectedCargo.origin}</Descriptions.Item>
              <Descriptions.Item label="目的地">{selectedCargo.destination}</Descriptions.Item>
              <Descriptions.Item label="客户">{selectedCargo.client}</Descriptions.Item>
              <Descriptions.Item label="运输船舶">{selectedCargo.shipId}</Descriptions.Item>
              {selectedCargo.containerId && <Descriptions.Item label="集装箱编号">{selectedCargo.containerId}</Descriptions.Item>}
              {selectedCargo.temperature !== undefined && <Descriptions.Item label="温度">{selectedCargo.temperature} °C</Descriptions.Item>}
              {selectedCargo.humidity !== undefined && <Descriptions.Item label="湿度">{selectedCargo.humidity} %</Descriptions.Item>}
              <Descriptions.Item label="预计送达时间">{new Date(selectedCargo.estimatedDelivery).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedCargo.status)}</Descriptions.Item>
            </Descriptions>

            {/* 实时状态与运输相关 */}
            <Descriptions bordered column={2} className="cargo-details" title="运输与实时状态">
              {selectedCargo.currentLocation && (
                <Descriptions.Item label="当前位置" span={2}>
                  {selectedCargo.currentLocation.port ? `${selectedCargo.currentLocation.port}（${selectedCargo.currentLocation.desc}）` : `${selectedCargo.currentLocation.longitude}, ${selectedCargo.currentLocation.latitude}`}
                </Descriptions.Item>
              )}
              {selectedCargo.transportMode && <Descriptions.Item label="运输方式">{selectedCargo.transportMode}</Descriptions.Item>}
              {selectedCargo.transitPorts && <Descriptions.Item label="中转港口">{selectedCargo.transitPorts.join('、')}</Descriptions.Item>}
              {selectedCargo.remainingTime && <Descriptions.Item label="预计剩余时间">{selectedCargo.remainingTime}</Descriptions.Item>}
              {selectedCargo.transportFee && <Descriptions.Item label="运输费用">￥{selectedCargo.transportFee.toLocaleString()}</Descriptions.Item>}
            </Descriptions>

            {/* 收发货人信息 */}
            <Descriptions bordered column={2} className="cargo-details" title="收发货人信息">
              {selectedCargo.sender && <Descriptions.Item label="发货人">{selectedCargo.sender}</Descriptions.Item>}
              {selectedCargo.senderContact && <Descriptions.Item label="发货人联系方式">{selectedCargo.senderContact}</Descriptions.Item>}
              {selectedCargo.receiver && <Descriptions.Item label="收货人">{selectedCargo.receiver}</Descriptions.Item>}
              {selectedCargo.receiverContact && <Descriptions.Item label="收货人联系方式">{selectedCargo.receiverContact}</Descriptions.Item>}
            </Descriptions>

            {/* 费用明细 */}
            {selectedCargo.feeDetail && (
              <Card title="费用明细" size="small" style={{ marginBottom: 16 }}>
                <Table
                  dataSource={selectedCargo.feeDetail.map((f, i) => ({ ...f, key: i }))}
                  columns={[
                    { title: '项目', dataIndex: 'item', key: 'item' },
                    { title: '金额', dataIndex: 'amount', key: 'amount', render: (v: number) => `￥${v.toLocaleString()}` }
                  ]}
                  size="small"
                  pagination={false}
                />
              </Card>
            )}

            {/* 异常历史 */}
            {selectedCargo.abnormalHistory && selectedCargo.abnormalHistory.length > 0 && (
              <Card title="异常历史" size="small" style={{ marginBottom: 16 }}>
                <ul style={{ paddingLeft: 16 }}>
                  {selectedCargo.abnormalHistory.map((ab, idx) => (
                    <li key={idx} style={{ marginBottom: 8 }}>
                      <b>{ab.type}</b>（{new Date(ab.time).toLocaleString()}）：{ab.desc}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* 追踪进度 */}
            <div className="tracking-progress">
              <Title level={4}>追踪进度</Title>
              <Steps 
                current={getCurrentStep(selectedCargo.status)}
                status={getStepStatus(selectedCargo.status) as "wait" | "process" | "finish" | "error"}
              >
                <Step title="装货" icon={<ShoppingOutlined />} />
                <Step title="运输中" icon={<RocketOutlined />} />
                <Step title="到达目的地" icon={<ClockCircleOutlined />} />
                <Step title="交付完成" icon={<CheckCircleOutlined />} />
              </Steps>
            </div>

            {/* 追踪历史 */}
            <div className="tracking-history">
              <Title level={4}>追踪历史</Title>
              <ul className="history-list">
                {selectedCargo.trackingHistory.map((history, index) => (
                  <li key={index} className="history-item">
                    <Badge status={index === 0 ? "processing" : "default"} />
                    <div className="history-content">
                      <div className="history-time">{new Date(history.timestamp).toLocaleString()}</div>
                      <div className="history-info">
                        <strong>{history.status}</strong> - {history.location}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {selectedCargo.status === 'delayed' && (
              <div className="delay-warning">
                <ExclamationCircleOutlined /> 
                <Text strong>延误警告:</Text> 该货物当前处于延误状态，请联系调度中心了解详情。
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default CargoTracking; 