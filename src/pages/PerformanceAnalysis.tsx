import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Table, Statistic, 
  Select, Button, DatePicker, Tabs, Progress,
  Space, Spin, Divider, Tag, Radio, Tooltip
} from 'antd';
import {
  LineChartOutlined, BarChartOutlined, UserOutlined, 
  RocketOutlined, CheckCircleOutlined, ClockCircleOutlined,
  DollarOutlined, CalendarOutlined, AimOutlined, FireOutlined,
  ThunderboltOutlined, InfoCircleOutlined, SyncOutlined,
  FilterOutlined, TeamOutlined, GlobalOutlined,
  RiseOutlined, FallOutlined, PieChartOutlined
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
  
  // 生成模拟的绩效数据
  const generateMockPerformanceData = () => {
    const shipPrefixes = ['润杨物流-', '海丰航运-', '远洋集团-', '中远海运-', '中海集团-'];
    const captainLastNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '吴', '黄', '周'];
    
    const data: PerformanceData[] = [];
    
    for (let i = 1; i <= 15; i++) {
      const prefixIndex = Math.floor(Math.random() * shipPrefixes.length);
      const shipId = (i < 10) ? `00${i}` : `0${i}`;
      const captainIndex = Math.floor(Math.random() * captainLastNames.length);
      
      data.push({
        shipId: `ship-${shipId}`,
        shipName: `${shipPrefixes[prefixIndex]}${shipId}`,
        captain: `${captainLastNames[captainIndex]}船长`,
        completedTasks: Math.floor(Math.random() * 50) + 20,
        onTimeRate: Math.round((Math.random() * 20) + 80),
        fuelEfficiency: Math.round((Math.random() * 30) + 70),
        safetyScore: Math.round((Math.random() * 25) + 75),
        customerSatisfaction: Math.round((Math.random() * 15) + 85),
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
          <div className="performance-progress-text">{`${record.onTimeRate}%`}</div>
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
          <div className="performance-progress-text">{`${record.fuelEfficiency}%`}</div>
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
          <div className="performance-progress-text">{`${record.safetyScore}%`}</div>
        </div>
      ),
      sorter: (a: PerformanceData, b: PerformanceData) => a.safetyScore - b.safetyScore,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: () => (
        <div className="hover-buttons">
          <Button type="link" size="small">详情</Button>
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
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = currentDate.getMonth() - i;
      const actualMonth = monthIndex < 0 ? monthIndex + 12 : monthIndex;
      const monthName = months[actualMonth];
      
      monthlyData.push({
        month: monthName,
        '准时率': Math.round(Math.random() * 10 + 85),
        '燃油效率': Math.round(Math.random() * 15 + 75),
        '安全指数': Math.round(Math.random() * 8 + 88),
        '客户满意度': Math.round(Math.random() * 12 + 80),
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
        
        <Space size="large">
          <Radio.Group 
            value={periodType} 
            onChange={(e) => setPeriodType(e.target.value)} 
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
              setTimeout(() => {
                setPerformanceData(generateMockPerformanceData());
                setLoading(false);
              }, 800);
            }}
          >
            刷新数据
          </Button>
          
          <Select defaultValue="all" style={{ width: 150 }} placeholder="选择船舶类型">
            <Option value="all">全部船舶</Option>
            <Option value="container">集装箱船</Option>
            <Option value="bulk">散货船</Option>
            <Option value="tanker">油轮</Option>
          </Select>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="performance-tabs">
        <TabPane tab={<span><BarChartOutlined /> 绩效概览</span>} key="overview" />
        <TabPane tab={<span><ThunderboltOutlined /> 效率分析</span>} key="efficiency" />
        <TabPane tab={<span><DollarOutlined /> 成本分析</span>} key="cost" />
        <TabPane tab={<span><TeamOutlined /> 人员绩效</span>} key="personnel" />
        <TabPane tab={<span><GlobalOutlined /> 地域分析</span>} key="region" />
      </Tabs>
      
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
            extra={
              <Space>
                <Select 
                  defaultValue="all" 
                  style={{ width: 150 }} 
                  placeholder="船舶类型筛选"
                >
                  <Option value="all">全部船舶</Option>
                  <Option value="container">集装箱船</Option>
                  <Option value="bulk">散货船</Option>
                  <Option value="tanker">油轮</Option>
                </Select>
                <Button icon={<FilterOutlined />}>筛选</Button>
              </Space>
            }
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
                rowClassName={() => 'performance-table-row'}
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
    </div>
  );
};

export default PerformanceAnalysis; 