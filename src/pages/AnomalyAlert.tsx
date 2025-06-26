import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Table, Tag, Badge, Button, 
  Space, Tabs, Row, Col, Statistic, Alert, 
  Timeline, Dropdown, Menu, Tooltip, Modal, Form, Input, Select, DatePicker, Empty
} from 'antd';
import { 
  WarningOutlined, BellOutlined, ClockCircleOutlined, 
  CheckCircleOutlined, ExclamationCircleOutlined, 
  StopOutlined, SyncOutlined, EyeOutlined, 
  MessageOutlined, MoreOutlined, FilterOutlined,
  SearchOutlined, PlusOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { mockShips, mockPorts, AnomalyEvent } from '../data/mockData';
import '../styles/AnomalyAlert.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟异常事件数据
const mockAnomalyEvents: AnomalyEvent[] = [
  {
    id: 'anomaly-001',
    type: 'route_deviation',
    severity: 'high',
    shipId: 'ship-002',
    position: { longitude: 122.86, latitude: 37.98 },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
    description: '船舶偏离计划航线超过5海里',
    status: 'detected'
  },
  {
    id: 'anomaly-002',
    type: 'cargo_issue',
    severity: 'medium',
    shipId: 'ship-005',
    position: { longitude: 121.89, latitude: 37.21 },
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2小时前
    description: '冷藏集装箱温度异常上升',
    status: 'investigating'
  },
  {
    id: 'anomaly-003',
    type: 'mechanical_failure',
    severity: 'high',
    shipId: 'ship-003',
    position: { longitude: 123.12, latitude: 38.05 },
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3小时前
    description: '主引擎故障，需要紧急维修',
    status: 'investigating'
  },
  {
    id: 'anomaly-004',
    type: 'weather_alert',
    severity: 'medium',
    shipId: 'ship-001',
    position: { longitude: 122.45, latitude: 37.65 },
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4小时前
    description: '前方海域有强风暴预警',
    status: 'investigating'
  },
  {
    id: 'anomaly-005',
    type: 'security_alert',
    severity: 'low',
    shipId: 'ship-004',
    position: { longitude: 124.35, latitude: 38.72 },
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5小时前
    description: '船舶安全系统检测到未授权访问尝试',
    status: 'resolved'
  },
  {
    id: 'anomaly-006',
    type: 'route_deviation',
    severity: 'low',
    shipId: 'ship-002',
    position: { longitude: 122.76, latitude: 37.88 },
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6小时前
    description: '船舶轻微偏离计划航线',
    status: 'resolved'
  },
  {
    id: 'anomaly-007',
    type: 'cargo_issue',
    severity: 'high',
    shipId: 'ship-005',
    position: { longitude: 121.79, latitude: 37.11 },
    timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7小时前
    description: '危险品集装箱泄漏警报',
    status: 'resolved'
  }
];

// 异常事件处理历史记录
const mockHandlingHistory = [
  { 
    id: 'history-001', 
    anomalyId: 'anomaly-007', 
    time: new Date(Date.now() - 1000 * 60 * 360).toISOString(), 
    action: '确认泄漏警报', 
    operator: '张工程师', 
    result: '确认为误报，传感器故障' 
  },
  { 
    id: 'history-002', 
    anomalyId: 'anomaly-007', 
    time: new Date(Date.now() - 1000 * 60 * 390).toISOString(), 
    action: '派遣应急小组检查', 
    operator: '李主管', 
    result: '检查完成，确认安全' 
  },
  { 
    id: 'history-003', 
    anomalyId: 'anomaly-007', 
    time: new Date(Date.now() - 1000 * 60 * 410).toISOString(), 
    action: '系统自动报警', 
    operator: '系统', 
    result: '触发危险品泄漏预警' 
  }
];

const AnomalyAlert: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [anomalyEvents, setAnomalyEvents] = useState<AnomalyEvent[]>(mockAnomalyEvents);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyEvent | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [handlingHistory, setHandlingHistory] = useState<any[]>(mockHandlingHistory);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  
  // 获取船舶信息
  const getShipInfo = (shipId: string) => {
    return mockShips.find(ship => ship.id === shipId) || null;
  };
  
  // 格式化时间
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // 计算时间差
  const getTimeDiff = (timeString: string) => {
    const now = new Date();
    const eventTime = new Date(timeString);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}小时前`;
    } else {
      return `${Math.floor(diffMins / 1440)}天前`;
    }
  };
  
  // 获取异常类型标签
  const getTypeTag = (type: string) => {
    switch (type) {
      case 'route_deviation':
        return <Tag color="blue">航线偏离</Tag>;
      case 'weather_alert':
        return <Tag color="purple">天气预警</Tag>;
      case 'mechanical_failure':
        return <Tag color="orange">机械故障</Tag>;
      case 'cargo_issue':
        return <Tag color="red">货物异常</Tag>;
      case 'security_alert':
        return <Tag color="cyan">安全警报</Tag>;
      default:
        return <Tag>未知类型</Tag>;
    }
  };
  
  // 获取严重程度标签
  const getSeverityTag = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Tag color="green">低风险</Tag>;
      case 'medium':
        return <Tag color="orange">中风险</Tag>;
      case 'high':
        return <Tag color="red">高风险</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };
  
  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'detected':
        return <Badge status="error" text="待处理" />;
      case 'investigating':
        return <Badge status="processing" text="处理中" />;
      case 'resolved':
        return <Badge status="success" text="已解决" />;
      default:
        return <Badge status="default" text="未知" />;
    }
  };
  
  // 处理标签过滤
  useEffect(() => {
    let filteredEvents = mockAnomalyEvents;
    
    if (activeTab !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.status === activeTab);
    }
    
    if (filterStatus.length > 0) {
      filteredEvents = filteredEvents.filter(event => filterStatus.includes(event.status));
    }
    
    if (filterSeverity.length > 0) {
      filteredEvents = filteredEvents.filter(event => filterSeverity.includes(event.severity));
    }
    
    if (filterType.length > 0) {
      filteredEvents = filteredEvents.filter(event => filterType.includes(event.type));
    }
    
    setAnomalyEvents(filteredEvents);
  }, [activeTab, filterStatus, filterSeverity, filterType]);
  
  // 表格列定义
  const columns = [
    {
      title: '异常ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <a>{text.replace('anomaly-', 'A')}</a>,
    },
    {
      title: '船舶',
      dataIndex: 'shipId',
      key: 'shipId',
      render: (shipId: string) => {
        const ship = getShipInfo(shipId);
        return ship ? ship.name : shipId;
      },
    },
    {
      title: '异常类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => getSeverityTag(severity),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '发生时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Tooltip title={formatTime(timestamp)}>
          {getTimeDiff(timestamp)}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: AnomalyEvent) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => {
              setSelectedAnomaly(record);
              setDetailVisible(true);
            }}
          >
            详情
          </Button>
          <Dropdown 
            overlay={
              <Menu>
                <Menu.Item key="1" icon={<MessageOutlined />}>
                  发送通知
                </Menu.Item>
                <Menu.Item key="2" icon={<CheckCircleOutlined />}>
                  标记为已解决
                </Menu.Item>
                <Menu.Item key="3" icon={<StopOutlined />}>
                  忽略此警报
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];
  
  // 获取统计数据
  const getStatistics = () => {
    const totalCount = mockAnomalyEvents.length;
    const highCount = mockAnomalyEvents.filter(e => e.severity === 'high').length;
    const mediumCount = mockAnomalyEvents.filter(e => e.severity === 'medium').length;
    const lowCount = mockAnomalyEvents.filter(e => e.severity === 'low').length;
    const detectedCount = mockAnomalyEvents.filter(e => e.status === 'detected').length;
    const investigatingCount = mockAnomalyEvents.filter(e => e.status === 'investigating').length;
    const resolvedCount = mockAnomalyEvents.filter(e => e.status === 'resolved').length;
    
    return {
      totalCount,
      highCount,
      mediumCount,
      lowCount,
      detectedCount,
      investigatingCount,
      resolvedCount
    };
  };
  
  const stats = getStatistics();
  
  // 处理添加新预警
  const handleAddAlert = (values: any) => {
    console.log('添加新预警:', values);
    setAddModalVisible(false);
    // 实际项目中这里会调用API添加预警
  };
  
  return (
    <div className="anomaly-alert-container">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="header-card">
            <div className="header-content">
              <div>
                <Title level={3} className="page-title">
                  <WarningOutlined /> 异常预警中心
                </Title>
                <Text type="secondary">实时监控船舶异常情况，及时处理各类预警</Text>
              </div>
              <div className="header-actions">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setAddModalVisible(true)}
                >
                  添加预警
                </Button>
                <Button icon={<FilterOutlined />}>筛选</Button>
                <Button icon={<SearchOutlined />}>搜索</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="总预警数" 
              value={stats.totalCount} 
              valueStyle={{ color: '#1890ff' }}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="高风险预警" 
              value={stats.highCount} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="待处理预警" 
              value={stats.detectedCount} 
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic 
              title="已解决预警" 
              value={stats.resolvedCount} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card className="table-card">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              className="anomaly-tabs"
            >
              <TabPane 
                tab={
                  <span>
                    <BellOutlined />
                    全部预警 ({stats.totalCount})
                  </span>
                } 
                key="all"
              />
              <TabPane 
                tab={
                  <span>
                    <ExclamationCircleOutlined />
                    待处理 ({stats.detectedCount})
                  </span>
                } 
                key="detected"
              />
              <TabPane 
                tab={
                  <span>
                    <SyncOutlined spin />
                    处理中 ({stats.investigatingCount})
                  </span>
                } 
                key="investigating"
              />
              <TabPane 
                tab={
                  <span>
                    <CheckCircleOutlined />
                    已解决 ({stats.resolvedCount})
                  </span>
                } 
                key="resolved"
              />
            </Tabs>
            
            <div className="filter-section">
              <Space wrap>
                <Select
                  mode="multiple"
                  placeholder="按状态筛选"
                  style={{ width: 150 }}
                  onChange={setFilterStatus}
                  allowClear
                >
                  <Option value="detected">待处理</Option>
                  <Option value="investigating">处理中</Option>
                  <Option value="resolved">已解决</Option>
                </Select>
                
                <Select
                  mode="multiple"
                  placeholder="按严重程度筛选"
                  style={{ width: 150 }}
                  onChange={setFilterSeverity}
                  allowClear
                >
                  <Option value="high">高风险</Option>
                  <Option value="medium">中风险</Option>
                  <Option value="low">低风险</Option>
                </Select>
                
                <Select
                  mode="multiple"
                  placeholder="按类型筛选"
                  style={{ width: 180 }}
                  onChange={setFilterType}
                  allowClear
                >
                  <Option value="route_deviation">航线偏离</Option>
                  <Option value="weather_alert">天气预警</Option>
                  <Option value="mechanical_failure">机械故障</Option>
                  <Option value="cargo_issue">货物异常</Option>
                  <Option value="security_alert">安全警报</Option>
                </Select>
                
                <RangePicker placeholder={['开始时间', '结束时间']} />
              </Space>
            </div>
            
            <Table 
              dataSource={anomalyEvents} 
              columns={columns} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className="anomaly-table"
            />
          </Card>
        </Col>
      </Row>
      
      {/* 异常详情弹窗 */}
      <Modal
        title="异常详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => setDetailVisible(false)}
          >
            标记为已解决
          </Button>,
        ]}
        width={800}
      >
        {selectedAnomaly && (
          <div className="anomaly-detail">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Alert
                  message={`${getSeverityTag(selectedAnomaly.severity)} ${getTypeTag(selectedAnomaly.type)} ${selectedAnomaly.description}`}
                  type={
                    selectedAnomaly.severity === 'high' ? 'error' :
                    selectedAnomaly.severity === 'medium' ? 'warning' : 'info'
                  }
                  showIcon
                />
              </Col>
              
              <Col span={12}>
                <Card title="基本信息" size="small">
                  <p><strong>异常ID:</strong> {selectedAnomaly.id.replace('anomaly-', 'A')}</p>
                  <p>
                    <strong>船舶:</strong> {getShipInfo(selectedAnomaly.shipId)?.name || selectedAnomaly.shipId}
                  </p>
                  <p><strong>发生时间:</strong> {formatTime(selectedAnomaly.timestamp)}</p>
                  <p><strong>当前状态:</strong> {getStatusBadge(selectedAnomaly.status)}</p>
                  <p>
                    <strong>位置:</strong> 
                    <span className="location-text">
                      <EnvironmentOutlined /> 
                      经度: {selectedAnomaly.position.longitude.toFixed(4)}, 
                      纬度: {selectedAnomaly.position.latitude.toFixed(4)}
                    </span>
                  </p>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="处理历史" size="small" className="history-card">
                  <Timeline mode="left">
                    {handlingHistory
                      .filter(h => h.anomalyId === selectedAnomaly.id)
                      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                      .map(history => (
                        <Timeline.Item key={history.id}>
                          <p className="timeline-title">{history.action}</p>
                          <p className="timeline-content">{history.result}</p>
                          <p className="timeline-meta">
                            <span>{history.operator}</span>
                            <span>{formatTime(history.time)}</span>
                          </p>
                        </Timeline.Item>
                      ))}
                    {handlingHistory.filter(h => h.anomalyId === selectedAnomaly.id).length === 0 && (
                      <Empty description="暂无处理记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </Timeline>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="添加处理记录" size="small">
                  <Form layout="inline">
                    <Form.Item name="action" style={{ width: '30%' }}>
                      <Input placeholder="处理动作" />
                    </Form.Item>
                    <Form.Item name="result" style={{ width: '50%' }}>
                      <Input placeholder="处理结果" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">添加</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
      
      {/* 添加预警弹窗 */}
      <Modal
        title="添加预警"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddAlert}>
          <Form.Item 
            name="shipId" 
            label="船舶" 
            rules={[{ required: true, message: '请选择船舶' }]}
          >
            <Select placeholder="选择船舶">
              {mockShips.map(ship => (
                <Option key={ship.id} value={ship.id}>{ship.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="type" 
            label="异常类型" 
            rules={[{ required: true, message: '请选择异常类型' }]}
          >
            <Select placeholder="选择异常类型">
              <Option value="route_deviation">航线偏离</Option>
              <Option value="weather_alert">天气预警</Option>
              <Option value="mechanical_failure">机械故障</Option>
              <Option value="cargo_issue">货物异常</Option>
              <Option value="security_alert">安全警报</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="severity" 
            label="严重程度" 
            rules={[{ required: true, message: '请选择严重程度' }]}
          >
            <Select placeholder="选择严重程度">
              <Option value="low">低风险</Option>
              <Option value="medium">中风险</Option>
              <Option value="high">高风险</Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="描述" 
            rules={[{ required: true, message: '请输入异常描述' }]}
          >
            <Input.TextArea rows={3} placeholder="输入异常描述" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              添加预警
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AnomalyAlert; 