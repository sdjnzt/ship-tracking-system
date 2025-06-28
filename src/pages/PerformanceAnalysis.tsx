import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Table, Statistic, 
  Select, Button, DatePicker, Tabs, Progress,
  Space, Spin, Divider, Tag, Radio, Tooltip, Modal, Checkbox, Form, message, Descriptions
} from 'antd';
import {
  LineChartOutlined, BarChartOutlined, UserOutlined, 
  RocketOutlined, CheckCircleOutlined, ClockCircleOutlined,
  DollarOutlined, CalendarOutlined, AimOutlined, FireOutlined,
  ThunderboltOutlined, InfoCircleOutlined, SyncOutlined,
  FilterOutlined, TeamOutlined, GlobalOutlined,
  RiseOutlined, FallOutlined, PieChartOutlined, ToolOutlined
} from '@ant-design/icons';
import { mockStatistics } from '../data/mockData';
import { Line, Bar, Pie } from '@ant-design/plots';
import type { SortOrder } from 'antd/es/table/interface';

import '../styles/PerformanceAnalysis.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface PerformanceData {
  shipId: string;
  shipName: string;
  captain: string;
  shipType: string;
  completedTasks: number;
  onTimeRate: number;
  fuelEfficiency: number;
  safetyScore: number;
  customerSatisfaction: number;
  averageSpeed: number;
  loadCapacityUsage: number;
  totalDistanceTraveled: number;
  maintenanceIndex: number;
}

const PerformanceAnalysis: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'year'>('month');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [shipTypeFilter, setShipTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filterForm] = Form.useForm();
  const [sortField, setSortField] = useState<string>('compositeScore');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [currentShip, setCurrentShip] = useState<PerformanceData | null>(null);
  
  // 生成模拟的绩效数据
  const generateMockPerformanceData = () => {
    const shipPrefixes = ['润杨物流-', '海丰航运-', '远洋集团-', '中远海运-', '中海集团-'];
    const captainFirstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '吴', '黄', '周', '孙', '林', '郑', '徐', '马', '朱'];
    const captainLastNames = ['伟', '强', '磊', '军', '明', '建国', '建华', '国强', '志强', '志明', '鹏', '宇', '浩', '勇', '杰', '涛', '超', '龙', '辉', '峰'];
    const shipTypes = ['集装箱船', '散货船', '油轮', '滚装船', '多用途船'];
    
    const data: PerformanceData[] = [];
    
    // 根据不同周期设置不同的数据范围
    let onTimeRateBase = 0;
    let fuelEfficiencyBase = 0;
    let safetyScoreBase = 0;
    let customerSatisfactionBase = 0;
    
    switch (periodType) {
      case 'month':
        onTimeRateBase = 70; // 月度准时率基准值较低
        fuelEfficiencyBase = 65;
        safetyScoreBase = 72;
        customerSatisfactionBase = 75;
        break;
      case 'quarter':
        onTimeRateBase = 80; // 季度准时率基准值中等
        fuelEfficiencyBase = 78;
        safetyScoreBase = 82;
        customerSatisfactionBase = 85;
        break;
      case 'year':
        onTimeRateBase = 90; // 年度准时率基准值较高
        fuelEfficiencyBase = 88;
        safetyScoreBase = 92;
        customerSatisfactionBase = 95;
        break;
      default:
        onTimeRateBase = 70;
        fuelEfficiencyBase = 65;
        safetyScoreBase = 72;
        customerSatisfactionBase = 75;
    }
    
    for (let i = 1; i <= 15; i++) {
      const prefixIndex = Math.floor(Math.random() * shipPrefixes.length);
      const shipId = (i < 10) ? `00${i}` : `0${i}`;
      const firstNameIndex = Math.floor(Math.random() * captainFirstNames.length);
      const lastNameIndex = Math.floor(Math.random() * captainLastNames.length);
      const shipTypeIndex = Math.floor(Math.random() * shipTypes.length);
      
      data.push({
        shipId: `ship-${shipId}`,
        shipName: `${shipPrefixes[prefixIndex]}${shipId}`,
        captain: `${captainFirstNames[firstNameIndex]}${captainLastNames[lastNameIndex]} 船长`,
        shipType: shipTypes[shipTypeIndex],
        completedTasks: Math.floor(Math.random() * 50) + 20,
        onTimeRate: Math.round((Math.random() * 15) + onTimeRateBase),
        fuelEfficiency: Math.round((Math.random() * 15) + fuelEfficiencyBase),
        safetyScore: Math.round((Math.random() * 10) + safetyScoreBase),
        customerSatisfaction: Math.round((Math.random() * 8) + customerSatisfactionBase),
        averageSpeed: Math.round((Math.random() * 10) + 15),
        loadCapacityUsage: Math.round((Math.random() * 30) + 70),
        totalDistanceTraveled: Math.floor(Math.random() * 15000) + 5000,
        maintenanceIndex: Math.round((Math.random() * 20) + 80),
      });
    }
    
    // 按绩效得分排序（综合得分）
    return data.sort((a, b) => {
      const scoreA = (a.onTimeRate + a.fuelEfficiency + a.safetyScore + a.customerSatisfaction) / 4;
      const scoreB = (b.onTimeRate + b.fuelEfficiency + b.safetyScore + b.customerSatisfaction) / 4;
      return scoreB - scoreA;
    });
  };
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPerformanceData(generateMockPerformanceData());
      setLoading(false);
    }, 1000);
  }, [periodType]);
  
  // 处理筛选
  const handleFilter = (values: any) => {
    setLoading(true);
    message.loading({
      content: '正在应用筛选条件...',
      key: 'filterLoading'
    });
    
    setTimeout(() => {
      let filteredData = generateMockPerformanceData();
      
      // 应用船舶类型筛选
      if (values.shipType && values.shipType !== 'all') {
        filteredData = filteredData.filter(item => item.shipType === values.shipType);
      }
      
      // 应用绩效等级筛选
      if (values.performanceLevel && values.performanceLevel.length > 0) {
        filteredData = filteredData.filter(item => {
          const score = getCompositeScore(item);
          const level = getPerformanceLevel(score).level;
          return values.performanceLevel.includes(level);
        });
      }
      
      // 应用指标范围筛选
      if (values.onTimeRateRange) {
        const [min, max] = values.onTimeRateRange;
        filteredData = filteredData.filter(item => item.onTimeRate >= min && item.onTimeRate <= max);
      }
      
      if (values.fuelEfficiencyRange) {
        const [min, max] = values.fuelEfficiencyRange;
        filteredData = filteredData.filter(item => item.fuelEfficiency >= min && item.fuelEfficiency <= max);
      }
      
      setPerformanceData(filteredData);
      setLoading(false);
      setFilterModalVisible(false);
      message.success({
        content: '筛选条件已应用',
        key: 'filterLoading'
      });
    }, 800);
  };
  
  // 处理排序
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
    }
  };
  
  // 处理船舶类型筛选
  const handleShipTypeChange = (value: string) => {
    setShipTypeFilter(value);
    setLoading(true);
    
    setTimeout(() => {
      if (value === 'all') {
        setPerformanceData(generateMockPerformanceData());
      } else {
        const filtered = generateMockPerformanceData().filter(item => item.shipType === value);
        setPerformanceData(filtered);
      }
      setLoading(false);
    }, 500);
  };
  
  // 处理时间周期切换
  const handlePeriodChange = (e: any) => {
    const newPeriodType = e.target.value;
    setPeriodType(newPeriodType);
    message.loading({
      content: `正在加载${getPeriodName(newPeriodType)}绩效数据...`,
      key: 'periodLoading'
    });
    
    setLoading(true);
    setTimeout(() => {
      setPerformanceData(generateMockPerformanceData());
      setLoading(false);
      message.success({
        content: `已切换至${getPeriodName(newPeriodType)}绩效数据`,
        key: 'periodLoading'
      });
    }, 1000);
  };
  
  // 获取时间周期名称
  const getPeriodName = (period: string) => {
    switch (period) {
      case 'month': return '月度';
      case 'quarter': return '季度';
      case 'year': return '年度';
      default: return '月度';
    }
  };
  
  // 获取加权的综合得分
  const getCompositeScore = (record: PerformanceData) => {
    return Math.round(
      (record.onTimeRate * 0.25) + 
      (record.fuelEfficiency * 0.25) + 
      (record.safetyScore * 0.25) + 
      (record.customerSatisfaction * 0.25)
    );
  };
  
  // 获取绩效等级
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'A', color: '#52c41a' };
    if (score >= 80) return { level: 'B', color: '#1890ff' };
    if (score >= 70) return { level: 'C', color: '#faad14' };
    return { level: 'D', color: '#ff4d4f' };
  };
  
  // 表格列定义
  const columns = [
    {
      title: '排名',
      key: 'ranking',
      width: 60,
      render: (_: any, __: any, index: number) => {
        let className = 'rank-number-other';
        if (index === 0) className = 'rank-number-1';
        if (index === 1) className = 'rank-number-2';
        if (index === 2) className = 'rank-number-3';
        
        return <div className={`rank-number ${className}`}>{index + 1}</div>;
      },
    },
    {
      title: '船舶信息',
      dataIndex: 'shipName',
      key: 'shipName',
      width: 180,
      render: (text: string, record: PerformanceData) => (
        <div className="ship-info">
          <div className="ship-avatar">
            {text.slice(0, 1)}
          </div>
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.shipId}</Text>
        </Space>
        </div>
      ),
    },
    {
      title: '船长',
      dataIndex: 'captain',
      key: 'captain',
      width: 80,
    },
    {
      title: '综合评分',
      key: 'compositeScore',
      width: 100,
      render: (text: any, record: PerformanceData) => {
        const score = getCompositeScore(record);
        const { level, color } = getPerformanceLevel(score);
        return (
          <div className="composite-score">
            <span className="composite-score-number" style={{ color }}>{score}</span>
            <span className="level-tag" style={{ backgroundColor: color, color: '#fff' }}>{level}</span>
          </div>
        );
      },
      sorter: (a: PerformanceData, b: PerformanceData) => getCompositeScore(a) - getCompositeScore(b),
      defaultSortOrder: 'descend' as SortOrder,
    },
    {
      title: (
        <div className="performance-column-header">
          <span>准时率</span>
          <Tooltip title="船舶按计划时间到达目的地的比率">
            <InfoCircleOutlined style={{ color: '#aaa' }} />
          </Tooltip>
        </div>
      ),
      key: 'onTimeRate',
      width: 150,
      render: (text: any, record: PerformanceData) => (
        <div className="performance-progress">
          <div className="performance-progress-bar">
          <Progress 
            percent={record.onTimeRate} 
            size="small" 
              strokeColor={record.onTimeRate >= 90 ? '#52c41a' : record.onTimeRate >= 75 ? '#1890ff' : '#ff4d4f'} 
              showInfo={false}
          />
          </div>
          <div className="performance-progress-text">{`${record.onTimeRate.toFixed(1)}%`}</div>
        </div>
      ),
      sorter: (a: PerformanceData, b: PerformanceData) => a.onTimeRate - b.onTimeRate,
    },
    {
      title: (
        <div className="performance-column-header">
          <span>燃油效率</span>
          <Tooltip title="船舶单位航行距离的燃油消耗率">
            <InfoCircleOutlined style={{ color: '#aaa' }} />
          </Tooltip>
        </div>
      ),
      key: 'fuelEfficiency',
      width: 150,
      render: (text: any, record: PerformanceData) => (
        <div className="performance-progress">
          <div className="performance-progress-bar">
          <Progress 
            percent={record.fuelEfficiency} 
            size="small" 
              strokeColor={record.fuelEfficiency >= 90 ? '#52c41a' : record.fuelEfficiency >= 75 ? '#1890ff' : '#ff4d4f'} 
              showInfo={false}
          />
          </div>
          <div className="performance-progress-text">{`${record.fuelEfficiency.toFixed(1)}%`}</div>
        </div>
      ),
      sorter: (a: PerformanceData, b: PerformanceData) => a.fuelEfficiency - b.fuelEfficiency,
    },
    {
      title: (
        <div className="performance-column-header">
          <span>安全指数</span>
          <Tooltip title="综合考量航行事故、险情应对、安全合规等因素">
            <InfoCircleOutlined style={{ color: '#aaa' }} />
          </Tooltip>
        </div>
      ),
      key: 'safetyScore',
      width: 150,
      render: (text: any, record: PerformanceData) => (
        <div className="performance-progress">
          <div className="performance-progress-bar">
          <Progress 
            percent={record.safetyScore} 
            size="small" 
              strokeColor={record.safetyScore >= 90 ? '#52c41a' : record.safetyScore >= 75 ? '#1890ff' : '#ff4d4f'} 
              showInfo={false}
          />
          </div>
          <div className="performance-progress-text">{`${record.safetyScore.toFixed(1)}%`}</div>
        </div>
      ),
      sorter: (a: PerformanceData, b: PerformanceData) => a.safetyScore - b.safetyScore,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: any, record: PerformanceData) => (
        <div className="hover-buttons">
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setCurrentShip(record);
              setDetailModalVisible(true);
            }}
          >
            详情
          </Button>
        </div>
      ),
    },
  ];
  
  // 生成图表数据
  const generateChartData = () => {
    // 按月绩效趋势数据
    const monthlyData = [];
    const currentDate = new Date();
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    const quarters = ['第一季度', '第二季度', '第三季度', '第四季度'];
    const years = ['2020年', '2021年', '2022年', '2023年', '2024年', '2025年'];
    
    // 根据不同周期设置不同的数据范围和标签
    let labels: string[] = [];
    let dataPoints = 6; // 默认显示6个数据点
    let onTimeRateBase = 0;
    let fuelEfficiencyBase = 0;
    let safetyScoreBase = 0;
    let customerSatisfactionBase = 0;
    
    switch (periodType) {
      case 'month':
        labels = months;
        dataPoints = 6;
        onTimeRateBase = 70;
        fuelEfficiencyBase = 65;
        safetyScoreBase = 72;
        customerSatisfactionBase = 75;
        break;
      case 'quarter':
        labels = quarters;
        dataPoints = 4;
        onTimeRateBase = 80;
        fuelEfficiencyBase = 78;
        safetyScoreBase = 82;
        customerSatisfactionBase = 85;
        break;
      case 'year':
        labels = years;
        dataPoints = 6;
        onTimeRateBase = 90;
        fuelEfficiencyBase = 88;
        safetyScoreBase = 92;
        customerSatisfactionBase = 95;
        break;
      default:
        labels = months;
        dataPoints = 6;
        onTimeRateBase = 70;
        fuelEfficiencyBase = 65;
        safetyScoreBase = 72;
        customerSatisfactionBase = 75;
    }
    
    // 生成趋势数据
    for (let i = 0; i < dataPoints; i++) {
      let labelIndex;
      
      if (periodType === 'month') {
        // 月度数据：显示最近6个月
        labelIndex = (currentDate.getMonth() - (dataPoints - 1 - i) + 12) % 12;
      } else if (periodType === 'quarter') {
        // 季度数据：显示4个季度
        labelIndex = i;
      } else {
        // 年度数据：显示最近6年
        labelIndex = i;
      }
      
      monthlyData.push({
        month: labels[labelIndex],
        '准时率': Math.round(Math.random() * 15 + onTimeRateBase),
        '燃油效率': Math.round(Math.random() * 15 + fuelEfficiencyBase),
        '安全指数': Math.round(Math.random() * 10 + safetyScoreBase),
        '客户满意度': Math.round(Math.random() * 8 + customerSatisfactionBase),
      });
    }
    
    // 船舶绩效分布数据
    const performanceLevelData = [
      { level: 'A (90-100分)', value: performanceData.filter(item => getCompositeScore(item) >= 90).length },
      { level: 'B (80-89分)', value: performanceData.filter(item => getCompositeScore(item) >= 80 && getCompositeScore(item) < 90).length },
      { level: 'C (70-79分)', value: performanceData.filter(item => getCompositeScore(item) >= 70 && getCompositeScore(item) < 80).length },
      { level: 'D (<70分)', value: performanceData.filter(item => getCompositeScore(item) < 70).length }
    ];
    
    return {
      monthlyData,
      performanceLevelData
    };
  };
  
  const chartData = generateChartData();
  
  return (
    <div className="performance-analysis">
      <div className="page-header">
        <div>
          <Title level={3}><LineChartOutlined /> 绩效分析</Title>
          <Text type="secondary">船舶和船员绩效分析评估系统，提供多维度的绩效指标和数据可视化</Text>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="performance-tabs">
        <TabPane tab={<span><BarChartOutlined /> 绩效概览</span>} key="overview">
          <div className="control-panel">
            <Space size="large" wrap>
              <Radio.Group 
                value={periodType} 
                onChange={handlePeriodChange} 
                buttonStyle="solid"
              >
                <Radio.Button value="month">月度</Radio.Button>
                <Radio.Button value="quarter">季度</Radio.Button>
                <Radio.Button value="year">年度</Radio.Button>
              </Radio.Group>
              
              <RangePicker 
                placeholder={['开始日期', '结束日期']}
                style={{ width: 280 }}
              />
              
              <Button 
                type="primary" 
                icon={<SyncOutlined />}
                onClick={() => {
                  setLoading(true);
                  message.loading({
                    content: '正在刷新数据...',
                    key: 'refreshLoading'
                  });
                  setTimeout(() => {
                    setPerformanceData(generateMockPerformanceData());
                    setLoading(false);
                    message.success({
                      content: '数据已刷新',
                      key: 'refreshLoading'
                    });
                  }, 800);
                }}
              >
                刷新数据
              </Button>
              
              <Select 
                defaultValue="all" 
                style={{ width: 150 }} 
                placeholder="选择船舶类型"
                value={shipTypeFilter}
                onChange={handleShipTypeChange}
              >
                <Option value="all">全部船舶</Option>
                <Option value="集装箱船">集装箱船</Option>
                <Option value="散货船">散货船</Option>
                <Option value="油轮">油轮</Option>
                <Option value="滚装船">滚装船</Option>
                <Option value="多用途船">多用途船</Option>
              </Select>
            </Space>
          </div>
          
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><CheckCircleOutlined /> 平均准时率</div>}
                  value={92.5}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div className="stat-footer">
                  <Tag color="green">
                    <RiseOutlined /> 较上期增长2.3%
                  </Tag>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><FireOutlined /> 平均燃油效率</div>}
                  value={85.2}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="stat-footer">
                  <Tag color="green">
                    <RiseOutlined /> 较上期增长1.8%
                  </Tag>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><AimOutlined /> 安全绩效指数</div>}
                  value={94.3}
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div className="stat-footer">
                  <Tag color="green">
                    <RiseOutlined /> 较上期增长0.7%
                  </Tag>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><UserOutlined /> 客户满意度</div>}
                  value={87.6}
                  precision={1}
                  suffix="分"
                  valueStyle={{ color: '#1890ff' }}
                />
                <div className="stat-footer">
                  <Tag color="red">
                    <FallOutlined /> 较上期下降0.5%
                  </Tag>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title={<Space><LineChartOutlined /> 绩效指标月度趋势</Space>} className="chart-card">
                <Line 
                  data={chartData.monthlyData.flatMap(item => [
                    { month: item.month, value: item['准时率'], category: '准时率' },
                    { month: item.month, value: item['燃油效率'], category: '燃油效率' },
                    { month: item.month, value: item['安全指数'], category: '安全指数' },
                    { month: item.month, value: item['客户满意度'], category: '客户满意度' }
                  ])}
                  xField="month"
                  yField="value"
                  seriesField="category"
                  yAxis={{
                    min: 60,
                    max: 100,
                  }}
                  legend={{ position: 'top' }}
                  smooth={true}
                  point={{ size: 4, shape: 'circle' }}
                  tooltip={{ showTitle: false }}
                  height={300}
                  meta={{
                    value: {
                      min: 60,
                      max: 100,
                    }
                  }}
                  annotations={[
                    {
                      type: 'line',
                      start: ['min', 90],
                      end: ['max', 90],
                      style: {
                        stroke: '#52c41a',
                        lineDash: [3, 3],
                      },
                    },
                    {
                      type: 'line',
                      start: ['min', 80],
                      end: ['max', 80],
                      style: {
                        stroke: '#faad14',
                        lineDash: [3, 3],
                      },
                    },
                    {
                      type: 'line',
                      start: ['min', 70],
                      end: ['max', 70],
                      style: {
                        stroke: '#ff4d4f',
                        lineDash: [3, 3],
                      },
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={18}>
              <Card 
                title={<Space><BarChartOutlined /> 船舶绩效排行榜</Space>} 
                className="rank-card"
                bodyStyle={{ padding: '12px 24px' }}
              >
                {loading ? (
                  <div className="loading-container">
                    <Spin size="large" />
                    <p>加载绩效数据中...</p>
                  </div>
                ) : (
                  <Table 
                    dataSource={performanceData} 
                    columns={columns} 
                    rowKey="shipId"
                    pagination={{ 
                      pageSize: 8,
                      showQuickJumper: true,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '8', '10', '15'],
                      showTotal: (total) => `共 ${total} 条记录`
                    }}
                    size="large"
                    className="performance-rank-table"
                    scroll={{ x: 1000 }}
                    rowClassName={() => 'performance-table-row show-buttons'}
                    onChange={handleTableChange}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={6}>
              <Card title={<Space><PieChartOutlined /> 绩效等级分布</Space>} className="chart-card">
                <Pie 
                  data={chartData.performanceLevelData}
                  angleField="value"
                  colorField="level"
                  radius={0.8}
                  innerRadius={0.5}
                  label={{
                    type: 'outer',
                    content: '{name} {percentage}',
                  }}
                  legend={{ position: 'bottom' }}
                  height={300}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab={<span><ThunderboltOutlined /> 效率分析</span>} key="efficiency">
          <div className="control-panel">
            <Space size="large" wrap>
              <Radio.Group 
                value={periodType} 
                onChange={handlePeriodChange} 
                buttonStyle="solid"
              >
                <Radio.Button value="month">月度</Radio.Button>
                <Radio.Button value="quarter">季度</Radio.Button>
                <Radio.Button value="year">年度</Radio.Button>
              </Radio.Group>
              
              <Button 
                type="primary" 
                icon={<SyncOutlined />}
                onClick={() => {
                  setLoading(true);
                  message.loading({
                    content: '正在刷新数据...',
                    key: 'refreshLoading'
                  });
                  setTimeout(() => {
                    setPerformanceData(generateMockPerformanceData());
                    setLoading(false);
                    message.success({
                      content: '数据已刷新',
                      key: 'refreshLoading'
                    });
                  }, 800);
                }}
              >
                刷新数据
              </Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="船舶效率指标分析" className="chart-card">
                <div style={{ marginBottom: 20 }}>
                  <Text>本页面展示船舶运营效率相关指标的详细分析，包括燃油效率、航行速度、装载效率等关键指标。</Text>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="平均航行速度分布" size="small">
                      <Bar 
                        data={performanceData.map(ship => ({
                          ship: ship.shipName,
                          speed: ship.averageSpeed
                        }))}
                        xField="speed"
                        yField="ship"
                        seriesField="ship"
                        legend={{ position: 'top-left' }}
                        barBackground={{ style: { fill: 'rgba(0,0,0,0.05)' } }}
                        height={300}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="载重利用率对比" size="small">
                      <Bar 
                        data={performanceData.map(ship => ({
                          ship: ship.shipName,
                          usage: ship.loadCapacityUsage
                        }))}
                        xField="usage"
                        yField="ship"
                        seriesField="ship"
                        legend={{ position: 'top-left' }}
                        barBackground={{ style: { fill: 'rgba(0,0,0,0.05)' } }}
                        height={300}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab={<span><DollarOutlined /> 成本分析</span>} key="cost">
          <div className="control-panel">
            <Space size="large" wrap>
              <Radio.Group 
                value={periodType} 
                onChange={handlePeriodChange} 
                buttonStyle="solid"
              >
                <Radio.Button value="month">月度</Radio.Button>
                <Radio.Button value="quarter">季度</Radio.Button>
                <Radio.Button value="year">年度</Radio.Button>
              </Radio.Group>
              
              <Button 
                type="primary" 
                icon={<SyncOutlined />}
                onClick={() => {
                  setLoading(true);
                  message.loading({
                    content: '正在刷新数据...',
                    key: 'refreshLoading'
                  });
                  setTimeout(() => {
                    setPerformanceData(generateMockPerformanceData());
                    setLoading(false);
                    message.success({
                      content: '数据已刷新',
                      key: 'refreshLoading'
                    });
                  }, 800);
                }}
              >
                刷新数据
              </Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="船舶运营成本分析" className="chart-card">
                <div style={{ marginBottom: 20 }}>
                  <Text>本页面分析船舶运营相关的各项成本指标，帮助管理层优化成本结构，提高经济效益。</Text>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card className="stat-card">
                      <Statistic
                        title="平均燃油成本"
                        value={12500}
                        prefix="¥"
                        suffix="/月"
                        valueStyle={{ color: '#cf1322' }}
                      />
                      <div className="stat-footer">
                        <Tag color="red">
                          <RiseOutlined /> 较上期增长5.2%
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="stat-card">
                      <Statistic
                        title="平均维护成本"
                        value={8750}
                        prefix="¥"
                        suffix="/月"
                        valueStyle={{ color: '#1890ff' }}
                      />
                      <div className="stat-footer">
                        <Tag color="green">
                          <FallOutlined /> 较上期下降2.1%
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className="stat-card">
                      <Statistic
                        title="平均人工成本"
                        value={15200}
                        prefix="¥"
                        suffix="/月"
                        valueStyle={{ color: '#faad14' }}
                      />
                      <div className="stat-footer">
                        <Tag color="orange">
                          <RiseOutlined /> 较上期增长1.5%
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab={<span><TeamOutlined /> 人员绩效</span>} key="personnel">
          <div className="control-panel">
            <Space size="large" wrap>
              <Radio.Group 
                value={periodType} 
                onChange={handlePeriodChange} 
                buttonStyle="solid"
              >
                <Radio.Button value="month">月度</Radio.Button>
                <Radio.Button value="quarter">季度</Radio.Button>
                <Radio.Button value="year">年度</Radio.Button>
              </Radio.Group>
              
              <Button 
                type="primary" 
                icon={<SyncOutlined />}
                onClick={() => {
                  setLoading(true);
                  message.loading({
                    content: '正在刷新数据...',
                    key: 'refreshLoading'
                  });
                  setTimeout(() => {
                    setPerformanceData(generateMockPerformanceData());
                    setLoading(false);
                    message.success({
                      content: '数据已刷新',
                      key: 'refreshLoading'
                    });
                  }, 800);
                }}
              >
                刷新数据
              </Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="船员绩效评估" className="chart-card">
                <div style={{ marginBottom: 20 }}>
                  <Text>本页面展示船员的绩效评估结果，包括船长、轮机长等关键岗位的绩效指标。</Text>
                </div>
                <Table
                  dataSource={[
                    { id: '001', name: '张船长', position: '船长', performance: 95, safetyScore: 98, teamwork: 92, experience: 8 },
                    { id: '002', name: '李轮机长', position: '轮机长', performance: 93, safetyScore: 95, teamwork: 90, experience: 10 },
                    { id: '003', name: '王大副', position: '大副', performance: 88, safetyScore: 92, teamwork: 85, experience: 5 },
                    { id: '004', name: '刘二副', position: '二副', performance: 86, safetyScore: 90, teamwork: 88, experience: 4 },
                    { id: '005', name: '陈三副', position: '三副', performance: 82, safetyScore: 85, teamwork: 90, experience: 3 },
                  ]}
                  columns={[
                    { title: '编号', dataIndex: 'id', key: 'id' },
                    { title: '姓名', dataIndex: 'name', key: 'name' },
                    { title: '职位', dataIndex: 'position', key: 'position' },
                    { 
                      title: '综合绩效', 
                      dataIndex: 'performance', 
                      key: 'performance',
                      render: (value) => (
                        <Progress 
                          percent={value} 
                          size="small" 
                          status={value >= 90 ? "success" : value >= 80 ? "normal" : "exception"} 
                        />
                      )
                    },
                    { 
                      title: '安全评分', 
                      dataIndex: 'safetyScore', 
                      key: 'safetyScore',
                      render: (value) => (
                        <Progress 
                          percent={value} 
                          size="small" 
                          status={value >= 90 ? "success" : value >= 80 ? "normal" : "exception"} 
                        />
                      )
                    },
                    { 
                      title: '团队协作', 
                      dataIndex: 'teamwork', 
                      key: 'teamwork',
                      render: (value) => (
                        <Progress 
                          percent={value} 
                          size="small" 
                          status={value >= 90 ? "success" : value >= 80 ? "normal" : "exception"} 
                        />
                      )
                    },
                    { title: '工作经验(年)', dataIndex: 'experience', key: 'experience' },
                  ]}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab={<span><GlobalOutlined /> 地域分析</span>} key="region">
          <div className="control-panel">
            <Space size="large" wrap>
              <Radio.Group 
                value={periodType} 
                onChange={handlePeriodChange} 
                buttonStyle="solid"
              >
                <Radio.Button value="month">月度</Radio.Button>
                <Radio.Button value="quarter">季度</Radio.Button>
                <Radio.Button value="year">年度</Radio.Button>
              </Radio.Group>
              
              <Button 
                type="primary" 
                icon={<SyncOutlined />}
                onClick={() => {
                  setLoading(true);
                  message.loading({
                    content: '正在刷新数据...',
                    key: 'refreshLoading'
                  });
                  setTimeout(() => {
                    setPerformanceData(generateMockPerformanceData());
                    setLoading(false);
                    message.success({
                      content: '数据已刷新',
                      key: 'refreshLoading'
                    });
                  }, 800);
                }}
              >
                刷新数据
              </Button>
            </Space>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="地域绩效分布" className="chart-card">
                <div style={{ marginBottom: 20 }}>
                  <Text>本页面展示不同航线和港口的绩效数据，帮助分析地域因素对船舶绩效的影响。</Text>
                </div>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Table
                      dataSource={[
                        { route: '上海-新加坡', distance: 2800, onTimeRate: 94.5, fuelEfficiency: 92.1, portDelay: 1.2 },
                        { route: '青岛-釜山', distance: 840, onTimeRate: 96.2, fuelEfficiency: 94.5, portDelay: 0.8 },
                        { route: '深圳-马尼拉', distance: 1200, onTimeRate: 92.8, fuelEfficiency: 90.2, portDelay: 1.5 },
                        { route: '宁波-洛杉矶', distance: 10200, onTimeRate: 88.5, fuelEfficiency: 85.7, portDelay: 2.3 },
                        { route: '天津-温哥华', distance: 9500, onTimeRate: 90.1, fuelEfficiency: 87.3, portDelay: 1.9 },
                      ]}
                      columns={[
                        { title: '航线', dataIndex: 'route', key: 'route' },
                        { title: '距离(海里)', dataIndex: 'distance', key: 'distance' },
                        { 
                          title: '准时率(%)', 
                          dataIndex: 'onTimeRate', 
                          key: 'onTimeRate',
                          render: (value) => (
                            <Tag color={value >= 95 ? 'green' : value >= 90 ? 'blue' : 'orange'}>
                              {value}%
                            </Tag>
                          )
                        },
                        { 
                          title: '燃油效率(%)', 
                          dataIndex: 'fuelEfficiency', 
                          key: 'fuelEfficiency',
                          render: (value) => (
                            <Tag color={value >= 92 ? 'green' : value >= 88 ? 'blue' : 'orange'}>
                              {value}%
                            </Tag>
                          )
                        },
                        { 
                          title: '平均港口延误(天)', 
                          dataIndex: 'portDelay', 
                          key: 'portDelay',
                          render: (value) => (
                            <Tag color={value <= 1.0 ? 'green' : value <= 1.8 ? 'blue' : 'red'}>
                              {value}
                            </Tag>
                          )
                        },
                      ]}
                      rowKey="route"
                      pagination={false}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card
            title="绩效说明"
            className="info-card"
          >
            <Row gutter={16}>
              <Col xs={24} md={12} lg={6}>
                <Title level={5}><CheckCircleOutlined /> 准时率</Title>
                <Text>船舶按计划时间到达目的地的比率，反映船期可靠性和时间管理能力。</Text>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Title level={5}><FireOutlined /> 燃油效率</Title>
                <Text>船舶单位航行距离的燃油消耗率，体现能源利用效率和环保指标。</Text>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Title level={5}><AimOutlined /> 安全指数</Title>
                <Text>综合考量航行事故、险情应对、安全检查合规等因素的综合安全绩效。</Text>
              </Col>
              <Col xs={24} md={12} lg={6}>
                <Title level={5}><UserOutlined /> 客户满意度</Title>
                <Text>根据客户反馈、投诉率、服务评分等指标计算的客户体验满意程度。</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {/* 高级筛选模态框 */}
      <Modal
        title="绩效数据高级筛选"
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <Button key="reset" onClick={() => filterForm.resetFields()}>
            重置
          </Button>,
          <Button key="cancel" onClick={() => setFilterModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => filterForm.submit()}>
            应用筛选
          </Button>
        ]}
        width={600}
      >
        <Form
          form={filterForm}
          layout="vertical"
          onFinish={handleFilter}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="船舶类型" name="shipType">
                <Select placeholder="选择船舶类型">
                  <Option value="all">全部船舶</Option>
                  <Option value="集装箱船">集装箱船</Option>
                  <Option value="散货船">散货船</Option>
                  <Option value="油轮">油轮</Option>
                  <Option value="滚装船">滚装船</Option>
                  <Option value="多用途船">多用途船</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="绩效等级" name="performanceLevel">
                <Checkbox.Group>
                  <Row>
                    <Col span={12}>
                      <Checkbox value="A">A级 (90-100)</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="B">B级 (80-89)</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="C">C级 (70-79)</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="D">D级 (&lt;70)</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">绩效指标范围</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="准时率范围 (%)" name="onTimeRateRange">
                <Select placeholder="选择准时率范围">
                  <Option value={[0, 100]}>全部</Option>
                  <Option value={[90, 100]}>90% 以上</Option>
                  <Option value={[80, 90]}>80% - 90%</Option>
                  <Option value={[70, 80]}>70% - 80%</Option>
                  <Option value={[0, 70]}>70% 以下</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="燃油效率范围 (%)" name="fuelEfficiencyRange">
                <Select placeholder="选择燃油效率范围">
                  <Option value={[0, 100]}>全部</Option>
                  <Option value={[90, 100]}>90% 以上</Option>
                  <Option value={[80, 90]}>80% - 90%</Option>
                  <Option value={[70, 80]}>70% - 80%</Option>
                  <Option value={[0, 70]}>70% 以下</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="安全指数范围 (%)" name="safetyScoreRange">
                <Select placeholder="选择安全指数范围">
                  <Option value={[0, 100]}>全部</Option>
                  <Option value={[90, 100]}>90% 以上</Option>
                  <Option value={[80, 90]}>80% - 90%</Option>
                  <Option value={[70, 80]}>70% - 80%</Option>
                  <Option value={[0, 70]}>70% 以下</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="客户满意度范围 (%)" name="customerSatisfactionRange">
                <Select placeholder="选择客户满意度范围">
                  <Option value={[0, 100]}>全部</Option>
                  <Option value={[90, 100]}>90% 以上</Option>
                  <Option value={[80, 90]}>80% - 90%</Option>
                  <Option value={[70, 80]}>70% - 80%</Option>
                  <Option value={[0, 70]}>70% 以下</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider orientation="left">排序设置</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="排序字段" name="sortField">
                <Select placeholder="选择排序字段">
                  <Option value="compositeScore">综合评分</Option>
                  <Option value="onTimeRate">准时率</Option>
                  <Option value="fuelEfficiency">燃油效率</Option>
                  <Option value="safetyScore">安全指数</Option>
                  <Option value="customerSatisfaction">客户满意度</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="排序方式" name="sortOrder">
                <Radio.Group>
                  <Radio value="descend">降序</Radio>
                  <Radio value="ascend">升序</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      {/* 船舶详情模态框 */}
      <Modal
        title={currentShip ? `${currentShip.shipName} 绩效详情` : '船舶绩效详情'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentShip && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="船舶ID">{currentShip.shipId}</Descriptions.Item>
              <Descriptions.Item label="船舶名称">{currentShip.shipName}</Descriptions.Item>
              <Descriptions.Item label="船长">{currentShip.captain}</Descriptions.Item>
              <Descriptions.Item label="船舶类型">{currentShip.shipType}</Descriptions.Item>
              <Descriptions.Item label="综合评分">
                <Tag color={getPerformanceLevel(getCompositeScore(currentShip)).color}>
                  {getCompositeScore(currentShip)} ({getPerformanceLevel(getCompositeScore(currentShip)).level}级)
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">绩效指标详情</Divider>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="准时率">
                  <Progress 
                    percent={currentShip.onTimeRate} 
                    status={currentShip.onTimeRate >= 90 ? "success" : currentShip.onTimeRate >= 75 ? "normal" : "exception"} 
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="燃油效率">
                  <Progress 
                    percent={currentShip.fuelEfficiency} 
                    status={currentShip.fuelEfficiency >= 90 ? "success" : currentShip.fuelEfficiency >= 75 ? "normal" : "exception"} 
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="安全指数">
                  <Progress 
                    percent={currentShip.safetyScore} 
                    status={currentShip.safetyScore >= 90 ? "success" : currentShip.safetyScore >= 75 ? "normal" : "exception"} 
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="客户满意度">
                  <Progress 
                    percent={currentShip.customerSatisfaction} 
                    status={currentShip.customerSatisfaction >= 90 ? "success" : currentShip.customerSatisfaction >= 75 ? "normal" : "exception"} 
                  />
                </Card>
              </Col>
            </Row>
            
            <Divider orientation="left">其他指标</Divider>
            
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic 
                  title="已完成任务" 
                  value={currentShip.completedTasks} 
                  prefix={<CheckCircleOutlined />} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="平均速度" 
                  value={currentShip.averageSpeed} 
                  suffix="节" 
                  prefix={<ThunderboltOutlined />} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="载重利用率" 
                  value={currentShip.loadCapacityUsage} 
                  suffix="%" 
                  prefix={<RocketOutlined />} 
                />
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Statistic 
                  title="总航行距离" 
                  value={currentShip.totalDistanceTraveled} 
                  suffix="海里" 
                  prefix={<GlobalOutlined />} 
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="维护指数" 
                  value={currentShip.maintenanceIndex} 
                  suffix="分" 
                  prefix={<ToolOutlined />} 
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceAnalysis; 