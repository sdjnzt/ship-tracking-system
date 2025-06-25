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
    {
      title: '客户',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: '出发地',
      dataIndex: 'origin',
      key: 'origin',
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
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
        width={800}
      >
        {selectedCargo && (
          <>
            <Descriptions bordered column={2} className="cargo-details">
              <Descriptions.Item label="货物ID" span={2}>{selectedCargo.id}</Descriptions.Item>
              <Descriptions.Item label="货物类型">{selectedCargo.type}</Descriptions.Item>
              <Descriptions.Item label="重量">{selectedCargo.weight} 吨</Descriptions.Item>
              <Descriptions.Item label="出发地">{selectedCargo.origin}</Descriptions.Item>
              <Descriptions.Item label="目的地">{selectedCargo.destination}</Descriptions.Item>
              <Descriptions.Item label="客户">{selectedCargo.client}</Descriptions.Item>
              <Descriptions.Item label="运输船舶">{selectedCargo.shipId}</Descriptions.Item>
              {selectedCargo.containerId && (
                <Descriptions.Item label="集装箱编号">{selectedCargo.containerId}</Descriptions.Item>
              )}
              {selectedCargo.temperature && (
                <Descriptions.Item label="温度">{selectedCargo.temperature} °C</Descriptions.Item>
              )}
              {selectedCargo.humidity && (
                <Descriptions.Item label="湿度">{selectedCargo.humidity} %</Descriptions.Item>
              )}
              <Descriptions.Item label="预计送达时间">
                {new Date(selectedCargo.estimatedDelivery).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedCargo.status)}
              </Descriptions.Item>
            </Descriptions>

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