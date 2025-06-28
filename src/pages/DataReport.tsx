import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, DatePicker, Button, Select, Tabs, Space, 
  Modal, Form, Checkbox, Radio, message, Spin, Tooltip, Divider } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  FilterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/plots';
import { mockStatistics, mockShips, mockCargos } from '../data/mockData';
import '../styles/DataReport.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const DataReport: React.FC = () => {
  // 船舶运行报表数据
  const initialShipOperationData = [
    { month: '2025-01', totalDistance: 12500, fuelConsumption: 2450, maintenanceCost: 45000 },
    { month: '2025-02', totalDistance: 11800, fuelConsumption: 2280, maintenanceCost: 42000 },
    { month: '2025-03', totalDistance: 13200, fuelConsumption: 2520, maintenanceCost: 47000 },
    { month: '2025-04', totalDistance: 14100, fuelConsumption: 2650, maintenanceCost: 49000 },
    { month: '2025-05', totalDistance: 14800, fuelConsumption: 2830, maintenanceCost: 51000 },
    { month: '2025-06', totalDistance: 14200, fuelConsumption: 2750, maintenanceCost: 50000 },
  ];

  // 货物运输报表数据
  const initialCargoTransportData = [
    { month: '2025-01', volume: 153, revenue: 1530000, onTimeRate: 91.2 },
    { month: '2025-02', volume: 142, revenue: 1420000, onTimeRate: 92.5 },
    { month: '2025-03', volume: 168, revenue: 1680000, onTimeRate: 93.1 },
    { month: '2025-04', volume: 185, revenue: 1850000, onTimeRate: 92.8 },
    { month: '2025-05', volume: 197, revenue: 1970000, onTimeRate: 94.2 },
    { month: '2025-06', volume: 209, revenue: 2090000, onTimeRate: 93.7 },
  ];

  const [timeRange, setTimeRange] = useState<[Date, Date] | null>(null);
  const [reportType, setReportType] = useState<string>('monthly');
  const [loading, setLoading] = useState<boolean>(false);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filterForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState<string>('1');
  const [reportData, setReportData] = useState({
    shipOperationData: initialShipOperationData,
    cargoTransportData: initialCargoTransportData
  });

  // 模拟加载数据
  const loadData = () => {
    setLoading(true);
    message.loading({ content: '正在加载数据...', key: 'dataLoading' });
    
    setTimeout(() => {
      // 随机生成一些数据变化，模拟数据刷新
      const updatedShipData = initialShipOperationData.map(item => ({
        ...item,
        totalDistance: item.totalDistance + Math.floor(Math.random() * 500 - 250),
        fuelConsumption: item.fuelConsumption + Math.floor(Math.random() * 100 - 50),
        maintenanceCost: item.maintenanceCost + Math.floor(Math.random() * 2000 - 1000)
      }));
      
      const updatedCargoData = initialCargoTransportData.map(item => ({
        ...item,
        volume: item.volume + Math.floor(Math.random() * 10 - 5),
        revenue: item.revenue + Math.floor(Math.random() * 50000 - 25000),
        onTimeRate: Math.min(100, Math.max(80, item.onTimeRate + (Math.random() * 2 - 1)))
      }));
      
      // 应用当前选择的报表类型筛选
      const filteredData = filterDataByReportType(updatedShipData, updatedCargoData, reportType);
      
      setReportData({
        shipOperationData: filteredData.shipData,
        cargoTransportData: filteredData.cargoData
      });
      
      setLoading(false);
      message.success({ content: '数据已更新', key: 'dataLoading' });
    }, 1500);
  };

  useEffect(() => {
    loadData();
  }, []);
  
  // 处理报表类型切换
  const handleReportTypeChange = (value: string) => {
    setReportType(value);
    setLoading(true);
    message.loading({ content: '正在切换报表类型...', key: 'reportTypeLoading' });
    
    setTimeout(() => {
      const filteredData = filterDataByReportType(
        reportData.shipOperationData, 
        reportData.cargoTransportData, 
        value
      );
      
      setReportData({
        shipOperationData: filteredData.shipData,
        cargoTransportData: filteredData.cargoData
      });
      
      setLoading(false);
      message.success({ content: `已切换至${getReportTypeName(value)}`, key: 'reportTypeLoading' });
    }, 800);
  };
  
  // 根据报表类型筛选数据
  const filterDataByReportType = (shipData: any[], cargoData: any[], type: string) => {
    // 这里模拟不同报表类型的数据筛选逻辑
    switch (type) {
      case 'daily':
        // 日报表 - 模拟只显示最近的数据
        return {
          shipData: shipData.slice(-2),
          cargoData: cargoData.slice(-2)
        };
      case 'weekly':
        // 周报表 - 模拟只显示最近的数据
        return {
          shipData: shipData.slice(-3),
          cargoData: cargoData.slice(-3)
        };
      case 'quarterly':
        // 季度报表 - 模拟合并一些数据
        return {
          shipData: [
            {
              month: '2025-Q1',
              totalDistance: shipData.slice(0, 3).reduce((sum, item) => sum + item.totalDistance, 0),
              fuelConsumption: shipData.slice(0, 3).reduce((sum, item) => sum + item.fuelConsumption, 0),
              maintenanceCost: shipData.slice(0, 3).reduce((sum, item) => sum + item.maintenanceCost, 0)
            },
            {
              month: '2025-Q2',
              totalDistance: shipData.slice(3, 6).reduce((sum, item) => sum + item.totalDistance, 0),
              fuelConsumption: shipData.slice(3, 6).reduce((sum, item) => sum + item.fuelConsumption, 0),
              maintenanceCost: shipData.slice(3, 6).reduce((sum, item) => sum + item.maintenanceCost, 0)
            }
          ],
          cargoData: [
            {
              month: '2025-Q1',
              volume: cargoData.slice(0, 3).reduce((sum, item) => sum + item.volume, 0),
              revenue: cargoData.slice(0, 3).reduce((sum, item) => sum + item.revenue, 0),
              onTimeRate: cargoData.slice(0, 3).reduce((sum, item) => sum + item.onTimeRate, 0) / 3
            },
            {
              month: '2025-Q2',
              volume: cargoData.slice(3, 6).reduce((sum, item) => sum + item.volume, 0),
              revenue: cargoData.slice(3, 6).reduce((sum, item) => sum + item.revenue, 0),
              onTimeRate: cargoData.slice(3, 6).reduce((sum, item) => sum + item.onTimeRate, 0) / 3
            }
          ]
        };
      case 'yearly':
        // 年报表 - 模拟合并所有数据
        return {
          shipData: [
            {
              month: '2025年',
              totalDistance: shipData.reduce((sum, item) => sum + item.totalDistance, 0),
              fuelConsumption: shipData.reduce((sum, item) => sum + item.fuelConsumption, 0),
              maintenanceCost: shipData.reduce((sum, item) => sum + item.maintenanceCost, 0)
            }
          ],
          cargoData: [
            {
              month: '2025年',
              volume: cargoData.reduce((sum, item) => sum + item.volume, 0),
              revenue: cargoData.reduce((sum, item) => sum + item.revenue, 0),
              onTimeRate: cargoData.reduce((sum, item) => sum + item.onTimeRate, 0) / cargoData.length
            }
          ]
        };
      case 'monthly':
      default:
        // 月报表 - 显示所有月份数据
        return {
          shipData: shipData,
          cargoData: cargoData
        };
    }
  };
  
  // 获取报表类型名称
  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'daily': return '日报表';
      case 'weekly': return '周报表';
      case 'monthly': return '月报表';
      case 'quarterly': return '季度报表';
      case 'yearly': return '年报表';
      default: return '月报表';
    }
  };

  // 处理导出报表
  const handleExport = (format: string) => {
    setExportModalVisible(false);
    message.loading({ content: `正在导出${format}格式报表...`, key: 'exportLoading' });
    
    // 模拟导出延迟
    setTimeout(() => {
      message.success({ content: `报表已成功导出为${format}格式`, key: 'exportLoading' });
    }, 1500);
  };
  
  // 处理筛选
  const handleFilter = (values: any) => {
    setLoading(true);
    message.loading({ content: '正在应用筛选条件...', key: 'filterLoading' });
    
    setTimeout(() => {
      console.log('筛选条件:', values);
      
      // 根据筛选条件过滤数据
      let filteredShipData = [...initialShipOperationData];
      let filteredCargoData = [...initialCargoTransportData];
      
      // 应用日期范围筛选
      if (values.dateRange && values.dateRange.length === 2) {
        const startDate = values.dateRange[0].format('YYYY-MM');
        const endDate = values.dateRange[1].format('YYYY-MM');
        
        filteredShipData = filteredShipData.filter(item => 
          item.month >= startDate && item.month <= endDate
        );
        
        filteredCargoData = filteredCargoData.filter(item => 
          item.month >= startDate && item.month <= endDate
        );
      }
      
      // 应用其他筛选条件
      if (values.dataTypes && values.dataTypes.length > 0) {
        // 这里可以根据选择的数据类型进行更复杂的筛选
      }
      
      setReportData({
        shipOperationData: filteredShipData,
        cargoTransportData: filteredCargoData
      });
      
      setLoading(false);
      setFilterModalVisible(false);
      message.success({ content: '筛选条件已应用', key: 'filterLoading' });
    }, 1000);
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    filterForm.resetFields();
  };

  // 船舶运行表格列
  const shipOperationColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '总航行距离(海里)',
      dataIndex: 'totalDistance',
      key: 'totalDistance',
      sorter: (a: any, b: any) => a.totalDistance - b.totalDistance,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '燃油消耗(吨)',
      dataIndex: 'fuelConsumption',
      key: 'fuelConsumption',
      sorter: (a: any, b: any) => a.fuelConsumption - b.fuelConsumption,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '维护成本(元)',
      dataIndex: 'maintenanceCost',
      key: 'maintenanceCost',
      sorter: (a: any, b: any) => a.maintenanceCost - b.maintenanceCost,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
  ];

  // 货物运输表格列
  const cargoTransportColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '运输量',
      dataIndex: 'volume',
      key: 'volume',
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
    {
      title: '收入(元)',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      title: '准时率(%)',
      dataIndex: 'onTimeRate',
      key: 'onTimeRate',
      sorter: (a: any, b: any) => a.onTimeRate - b.onTimeRate,
      render: (value: number) => (
        <Tag color={value >= 93 ? 'success' : value >= 90 ? 'processing' : 'warning'}>
          {value.toFixed(1)}%
        </Tag>
      )
    },
  ];

  // 月度收入图表配置
  const revenueChartConfig = {
    data: reportData.cargoTransportData,
    xField: 'month',
    yField: 'revenue',
    color: '#1890ff',
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '收入(元)',
      },
      label: {
        formatter: (v: string) => `¥${parseInt(v).toLocaleString()}`,
      },
    },
  };

  // 燃油消耗图表配置
  const fuelConsumptionConfig = {
    data: reportData.shipOperationData,
    xField: 'month',
    yField: 'fuelConsumption',
    columnWidthRatio: 0.6,
    color: '#52c41a',
    xAxis: {
      title: {
        text: '月份',
      },
    },
    yAxis: {
      title: {
        text: '燃油消耗量(吨)',
      },
    },
  };

  // 货物类型分布图配置
  const cargoTypeConfig = {
    data: mockStatistics.cargoByType,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{type}: {percentage}',
    },
    legend: {
      position: 'bottom' as const,
    },
    interactions: [{ type: 'element-active' }],
  };
  
  // 计算总计和平均值
  const calculateSummary = (data: any[], field: string) => {
    const total = data.reduce((sum, item) => sum + item[field], 0);
    const average = total / data.length;
    return { total, average };
  };
  
  // 船舶运行数据总结
  const distanceSummary = calculateSummary(reportData.shipOperationData, 'totalDistance');
  const fuelSummary = calculateSummary(reportData.shipOperationData, 'fuelConsumption');
  const maintenanceSummary = calculateSummary(reportData.shipOperationData, 'maintenanceCost');
  
  // 货物运输数据总结
  const volumeSummary = calculateSummary(reportData.cargoTransportData, 'volume');
  const revenueSummary = calculateSummary(reportData.cargoTransportData, 'revenue');
  const onTimeRateSummary = calculateSummary(reportData.cargoTransportData, 'onTimeRate');

  return (
    <div className="data-report">
      <div className="report-header">
        <div>
          <Title level={2}>数据报表</Title>
          <Text type="secondary">船舶运行和货物运输数据分析报表</Text>
        </div>
        <Space size="large">
          <RangePicker 
            placeholder={['开始日期', '结束日期']}
            onChange={(dates) => {
              if (dates) {
                setTimeRange([dates[0]?.toDate() as Date, dates[1]?.toDate() as Date]);
              } else {
                setTimeRange(null);
              }
            }}
          />
          <Select 
            defaultValue="monthly" 
            style={{ width: 120 }} 
            onChange={handleReportTypeChange}
          >
            <Option value="daily">日报表</Option>
            <Option value="weekly">周报表</Option>
            <Option value="monthly">月报表</Option>
            <Option value="quarterly">季度报表</Option>
            <Option value="yearly">年报表</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            loading={loading}
            onClick={loadData}
          >
            刷新数据
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            onClick={() => setExportModalVisible(true)}
          >
            导出报表
          </Button>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterModalVisible(true)}
          >
            筛选
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总运输量" 
              value={volumeSummary.total} 
              prefix={<BarChartOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总收入" 
              value={revenueSummary.total} 
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="总航行距离" 
              value={distanceSummary.total} 
              suffix="海里"
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="平均准时率" 
              value={onTimeRateSummary.average} 
              precision={1}
              suffix="%" 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" className="report-tabs" activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={<span><LineChartOutlined />收入分析</span>} key="1">
          <Card 
            title={
              <div className="card-title-with-actions">
                <span>月度收入趋势</span>
                <div className="card-actions">
                  <Tooltip title="刷新数据">
                    <Button 
                      type="text" 
                      icon={<ReloadOutlined />} 
                      onClick={() => loadData()} 
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="导出图表">
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      onClick={() => handleExport('PNG')} 
                      size="small"
                    />
                  </Tooltip>
                </div>
              </div>
            } 
            className="chart-card"
          >
            <div className="chart-container">
              <Line {...revenueChartConfig} />
            </div>
          </Card>
          <Card 
            title={
              <div className="card-title-with-actions">
                <span>货物运输报表</span>
                <div className="card-actions">
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleExport('Excel')} 
                    size="small"
                  >
                    导出表格
                  </Button>
                </div>
              </div>
            } 
            className="table-card"
          >
            <Table 
              dataSource={reportData.cargoTransportData} 
              columns={cargoTransportColumns}
              rowKey="month"
              pagination={false}
              loading={loading}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}><strong>总计</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}><strong>{volumeSummary.total}</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}><strong>¥{revenueSummary.total.toLocaleString()}</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Tag color="blue">
                        <strong>{onTimeRateSummary.average.toFixed(1)}%</strong>
                      </Tag>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </TabPane>
        <TabPane tab={<span><BarChartOutlined />运营分析</span>} key="2">
          <Card 
            title={
              <div className="card-title-with-actions">
                <span>燃油消耗趋势</span>
                <div className="card-actions">
                  <Tooltip title="刷新数据">
                    <Button 
                      type="text" 
                      icon={<ReloadOutlined />} 
                      onClick={() => loadData()} 
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="导出图表">
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      onClick={() => handleExport('PNG')} 
                      size="small"
                    />
                  </Tooltip>
                </div>
              </div>
            } 
            className="chart-card"
          >
            <div className="chart-container">
              <Column {...fuelConsumptionConfig} />
            </div>
          </Card>
          <Card 
            title={
              <div className="card-title-with-actions">
                <span>船舶运行报表</span>
                <div className="card-actions">
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleExport('Excel')} 
                    size="small"
                  >
                    导出表格
                  </Button>
                </div>
              </div>
            } 
            className="table-card"
          >
            <Table 
              dataSource={reportData.shipOperationData} 
              columns={shipOperationColumns}
              rowKey="month"
              pagination={false}
              loading={loading}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}><strong>总计</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}><strong>{distanceSummary.total.toLocaleString()}</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}><strong>{fuelSummary.total.toLocaleString()}</strong></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}><strong>¥{maintenanceSummary.total.toLocaleString()}</strong></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </TabPane>
        <TabPane tab={<span><PieChartOutlined />货物分析</span>} key="3">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <div className="card-title-with-actions">
                    <span>货物类型分布</span>
                    <div className="card-actions">
                      <Tooltip title="导出图表">
                        <Button 
                          type="text" 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleExport('PNG')} 
                          size="small"
                        />
                      </Tooltip>
                    </div>
                  </div>
                } 
                className="chart-card"
              >
                <div className="chart-container">
                  <Pie {...cargoTypeConfig} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <div className="card-title-with-actions">
                    <span>港口活动统计</span>
                    <div className="card-actions">
                      <Button 
                        type="text" 
                        icon={<DownloadOutlined />} 
                        onClick={() => handleExport('Excel')} 
                        size="small"
                      >
                        导出表格
                      </Button>
                    </div>
                  </div>
                } 
                className="chart-card"
              >
                <Table 
                  dataSource={mockStatistics.portActivity} 
                  columns={[
                    { title: '港口', dataIndex: 'port', key: 'port' },
                    { title: '到达', dataIndex: 'arrivals', key: 'arrivals' },
                    { title: '出港', dataIndex: 'departures', key: 'departures' },
                    { 
                      title: '总活动量', 
                      key: 'total',
                      render: (_, record: any) => record.arrivals + record.departures
                    },
                  ]}
                  rowKey="port"
                  pagination={false}
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      
      {/* 导出报表模态框 */}
      <Modal
        title="导出报表"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        width={400}
      >
        <div className="export-options">
          <Divider orientation="left">选择导出格式</Divider>
          <Button 
            icon={<FileExcelOutlined />} 
            block 
            onClick={() => handleExport('Excel')}
            style={{ marginBottom: 16 }}
          >
            导出为Excel (.xlsx)
          </Button>
          <Button 
            icon={<FilePdfOutlined />} 
            block 
            onClick={() => handleExport('PDF')}
            style={{ marginBottom: 16 }}
          >
            导出为PDF (.pdf)
          </Button>
          <Button 
            icon={<FileTextOutlined />} 
            block 
            onClick={() => handleExport('CSV')}
          >
            导出为CSV (.csv)
          </Button>
          
          <Divider orientation="left">导出内容</Divider>
          <Checkbox.Group
            style={{ width: '100%' }}
            defaultValue={['charts', 'tables', 'summary']}
          >
            <Row>
              <Col span={24}>
                <Checkbox value="charts">包含图表</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="tables">包含数据表格</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="summary">包含数据摘要</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
      </Modal>
      
      {/* 筛选模态框 */}
      <Modal
        title="数据筛选"
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <Button key="reset" onClick={resetFilters}>
            重置
          </Button>,
          <Button key="cancel" onClick={() => setFilterModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => filterForm.submit()}>
            应用筛选
          </Button>
        ]}
        width={500}
      >
        <Form
          form={filterForm}
          layout="vertical"
          onFinish={handleFilter}
        >
          <Form.Item 
            label="日期范围" 
            name="dateRange"
          >
            <RangePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="数据类型" name="dataTypes">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={12}>
                  <Checkbox value="revenue">收入数据</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="fuel">燃油消耗</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="distance">航行距离</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="maintenance">维护成本</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          
          <Form.Item label="报表类型" name="reportFormat">
            <Radio.Group>
              <Radio value="summary">摘要报表</Radio>
              <Radio value="detailed">详细报表</Radio>
              <Radio value="comparative">对比报表</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item label="数据排序" name="sortOrder">
            <Select placeholder="选择排序方式">
              <Option value="date_asc">按日期升序</Option>
              <Option value="date_desc">按日期降序</Option>
              <Option value="value_asc">按数值升序</Option>
              <Option value="value_desc">按数值降序</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataReport; 