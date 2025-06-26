import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Form, Input, Button, Switch, 
  Tabs, Space, Slider, InputNumber, Select, Table, Tag, 
  Tooltip, Divider, Alert, List, Badge, Collapse, Descriptions,
  Radio, Popconfirm, message, Upload, TimePicker
} from 'antd';
import {
  SettingOutlined, GlobalOutlined, BgColorsOutlined, 
  ClockCircleOutlined, EyeOutlined, SyncOutlined, 
  BellOutlined, DatabaseOutlined, ApiOutlined, 
  SaveOutlined, UndoOutlined, CloudUploadOutlined,
  CloudDownloadOutlined, CheckCircleOutlined, InfoCircleOutlined,
  ToolOutlined, PieChartOutlined, EnvironmentOutlined,
  TranslationOutlined, UploadOutlined, CloudServerOutlined,
  RocketOutlined, CompassOutlined, ThunderboltOutlined,
  FileOutlined, DesktopOutlined, LayoutOutlined, UserOutlined,
  HistoryOutlined, DeleteOutlined
} from '@ant-design/icons';
import moment from 'moment';
import '../styles/SystemSettings.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = TimePicker;

// 定义系统设置接口
interface SystemConfig {
  general: {
    language: string;
    timeZone: string;
    dateFormat: string;
    theme: string;
    autoLogout: number;
  };
  display: {
    mapDefaultView: string;
    mapRefreshRate: number;
    dataRefreshRate: number;
    defaultShipMarkerSize: number;
    showShipNames: boolean;
    showShipDetails: boolean;
    enableAnimation: boolean;
    useSatelliteMap: boolean;
  };
  notification: {
    enableEmailNotifications: boolean;
    enableSmsNotifications: boolean;
    enablePushNotifications: boolean;
    alertLevels: string[];
    emailRecipients: string;
    scheduledReports: boolean;
    reportFrequency: string;
  };
  dataManagement: {
    dataRetentionPeriod: number;
    automaticDataCleanup: boolean;
    enableDataCompression: boolean;
    backupFrequency: string;
    backupLocation: string;
    maxBackupSets: number;
  };
  integration: {
    enableApiAccess: boolean;
    apiRateLimit: number;
    allowCors: boolean;
    enabledIntegrations: string[];
    weatherApiKey: string;
    portApiEndpoint: string;
  };
}

// 定义初始系统设置
const initialSystemConfig: SystemConfig = {
  general: {
    language: 'zh-CN',
    timeZone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    theme: 'light',
    autoLogout: 30,
  },
  display: {
    mapDefaultView: 'china-coastal',
    mapRefreshRate: 30,
    dataRefreshRate: 60,
    defaultShipMarkerSize: 5,
    showShipNames: true,
    showShipDetails: true,
    enableAnimation: true,
    useSatelliteMap: false,
  },
  notification: {
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    alertLevels: ['critical', 'warning'],
    emailRecipients: 'admin@example.com,operations@example.com',
    scheduledReports: true,
    reportFrequency: 'daily',
  },
  dataManagement: {
    dataRetentionPeriod: 365,
    automaticDataCleanup: true,
    enableDataCompression: true,
    backupFrequency: 'daily',
    backupLocation: '/backup/ship-tracking-data',
    maxBackupSets: 7,
  },
  integration: {
    enableApiAccess: true,
    apiRateLimit: 100,
    allowCors: true,
    enabledIntegrations: ['weather', 'ports', 'customs'],
    weatherApiKey: 'xxxxxx-demo-api-key-xxxxxx',
    portApiEndpoint: 'https://api.ports.example.com/v1',
  },
};

// 系统设置历史记录接口
interface ConfigChangeLog {
  id: string;
  timestamp: string;
  user: string;
  section: string;
  changes: string;
}

// 模拟系统设置历史记录
const mockConfigChangeLogs: ConfigChangeLog[] = [
  {
    id: 'change-001',
    timestamp: '2025-06-20T14:30:00',
    user: 'admin',
    section: '显示设置',
    changes: '修改了地图刷新率: 60秒 → 30秒',
  },
  {
    id: 'change-002',
    timestamp: '2025-06-15T11:20:00',
    user: 'admin',
    section: '通知设置',
    changes: '启用了短信通知功能',
  },
  {
    id: 'change-003',
    timestamp: '2025-06-10T09:45:00',
    user: 'admin',
    section: '数据管理',
    changes: '修改了数据保留期: 180天 → 365天',
  },
];

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [generalForm] = Form.useForm();
  const [displayForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [dataManagementForm] = Form.useForm();
  const [integrationForm] = Form.useForm();
  const [configLogs, setConfigLogs] = useState<ConfigChangeLog[]>(mockConfigChangeLogs);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(initialSystemConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [backupLoading, setBackupLoading] = useState<boolean>(false);
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);
  const [testingIntegration, setTestingIntegration] = useState<boolean>(false);

  useEffect(() => {
    // 初始化表单值
    generalForm.setFieldsValue(systemConfig.general);
    displayForm.setFieldsValue(systemConfig.display);
    notificationForm.setFieldsValue(systemConfig.notification);
    dataManagementForm.setFieldsValue(systemConfig.dataManagement);
    integrationForm.setFieldsValue(systemConfig.integration);
  }, []);

  // 处理常规设置表单提交
  const handleGeneralFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedConfig = {
        ...systemConfig,
        general: values
      };
      setSystemConfig(updatedConfig);
      setLoading(false);
      message.success('系统常规设置已更新');
      
      // 添加设置变更日志
      addConfigChangeLog('常规设置', '更新了系统常规设置');
    }, 500);
  };

  // 处理显示设置表单提交
  const handleDisplayFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedConfig = {
        ...systemConfig,
        display: values
      };
      setSystemConfig(updatedConfig);
      setLoading(false);
      message.success('显示设置已更新');
      
      // 添加设置变更日志
      addConfigChangeLog('显示设置', '更新了显示设置');
    }, 500);
  };

  // 处理通知设置表单提交
  const handleNotificationFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedConfig = {
        ...systemConfig,
        notification: values
      };
      setSystemConfig(updatedConfig);
      setLoading(false);
      message.success('通知设置已更新');
      
      // 添加设置变更日志
      addConfigChangeLog('通知设置', '更新了通知设置');
    }, 500);
  };

  // 处理数据管理设置表单提交
  const handleDataManagementFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedConfig = {
        ...systemConfig,
        dataManagement: values
      };
      setSystemConfig(updatedConfig);
      setLoading(false);
      message.success('数据管理设置已更新');
      
      // 添加设置变更日志
      addConfigChangeLog('数据管理', '更新了数据管理设置');
    }, 500);
  };

  // 处理集成设置表单提交
  const handleIntegrationFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      const updatedConfig = {
        ...systemConfig,
        integration: values
      };
      setSystemConfig(updatedConfig);
      setLoading(false);
      message.success('集成设置已更新');
      
      // 添加设置变更日志
      addConfigChangeLog('集成设置', '更新了API与集成设置');
    }, 500);
  };

  // 添加设置变更日志
  const addConfigChangeLog = (section: string, changes: string) => {
    const newLog: ConfigChangeLog = {
      id: `change-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'admin', // 假设当前用户是admin
      section,
      changes,
    };
    setConfigLogs([newLog, ...configLogs]);
  };

  // 重置表单到默认设置
  const resetToDefaults = (formType: string) => {
    switch (formType) {
      case 'general':
        generalForm.setFieldsValue(initialSystemConfig.general);
        break;
      case 'display':
        displayForm.setFieldsValue(initialSystemConfig.display);
        break;
      case 'notification':
        notificationForm.setFieldsValue(initialSystemConfig.notification);
        break;
      case 'dataManagement':
        dataManagementForm.setFieldsValue(initialSystemConfig.dataManagement);
        break;
      case 'integration':
        integrationForm.setFieldsValue(initialSystemConfig.integration);
        break;
      default:
        break;
    }
    message.info('已重置为默认设置，请点击保存以应用更改');
  };

  // 备份系统设置
  const backupSystemSettings = () => {
    setBackupLoading(true);
    setTimeout(() => {
      setBackupLoading(false);
      message.success('系统设置已成功备份');
      
      // 模拟下载文件
      const dataStr = JSON.stringify(systemConfig, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileName = `system-settings-backup-${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      // 添加设置变更日志
      addConfigChangeLog('系统备份', '创建了系统设置备份');
    }, 1000);
  };

  // 测试集成连接
  const testIntegrationConnection = (integrationType: string) => {
    setTestingIntegration(true);
    setTimeout(() => {
      setTestingIntegration(false);
      message.success(`成功连接到${integrationType}服务`);
    }, 1500);
  };

  // 配置历史记录表格列定义
  const configLogsColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleString('zh-CN');
      },
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '设置分类',
      dataIndex: 'section',
      key: 'section',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '变更详情',
      dataIndex: 'changes',
      key: 'changes',
    },
  ];

  return (
    <div className="system-settings-page">
      <div className="page-header">
        <div>
          <Title level={3}><SettingOutlined /> 系统设置</Title>
          <Text type="secondary">配置和管理系统的全局设置，包括界面显示、数据管理、通知和集成等</Text>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="settings-tabs">
        <TabPane tab={<span><GlobalOutlined /> 常规设置</span>} key="general" />
        <TabPane tab={<span><DesktopOutlined /> 显示设置</span>} key="display" />
        <TabPane tab={<span><BellOutlined /> 通知设置</span>} key="notification" />
        <TabPane tab={<span><DatabaseOutlined /> 数据管理</span>} key="dataManagement" />
        <TabPane tab={<span><ApiOutlined /> API与集成</span>} key="integration" />
        <TabPane tab={<span><HistoryOutlined /> 设置历史</span>} key="history" />
      </Tabs>

      {activeTab === 'general' && (
        <Card title={<Space><GlobalOutlined /> 常规设置</Space>} className="settings-card">
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={handleGeneralFormSubmit}
            initialValues={systemConfig.general}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="language"
                  label="系统语言"
                  rules={[{ required: true, message: '请选择系统语言' }]}
                >
                  <Select placeholder="选择系统语言">
                    <Option value="zh-CN">中文 (简体)</Option>
                    <Option value="en-US">English (US)</Option>
                    <Option value="ja-JP">日本語</Option>
                    <Option value="ko-KR">한국어</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="timeZone"
                  label="时区"
                  rules={[{ required: true, message: '请选择时区' }]}
                >
                  <Select placeholder="选择时区">
                    <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                    <Option value="Asia/Tokyo">日本标准时间 (UTC+9)</Option>
                    <Option value="America/New_York">美国东部时间 (UTC-5/4)</Option>
                    <Option value="Europe/London">格林威治标准时间 (UTC+0)</Option>
                    <Option value="Europe/Paris">中欧标准时间 (UTC+1)</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dateFormat"
                  label="日期格式"
                  rules={[{ required: true, message: '请选择日期格式' }]}
                >
                  <Select placeholder="选择日期格式">
                    <Option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</Option>
                    <Option value="DD/MM/YYYY HH:mm:ss">DD/MM/YYYY HH:mm:ss</Option>
                    <Option value="MM/DD/YYYY hh:mm:ss A">MM/DD/YYYY hh:mm:ss A</Option>
                    <Option value="YYYY年MM月DD日 HH时mm分ss秒">YYYY年MM月DD日 HH时mm分ss秒</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="theme"
                  label="系统主题"
                  rules={[{ required: true, message: '请选择系统主题' }]}
                >
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="light"><BgColorsOutlined /> 浅色</Radio.Button>
                    <Radio.Button value="dark"><BgColorsOutlined /> 深色</Radio.Button>
                    <Radio.Button value="auto"><BgColorsOutlined /> 自动</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="autoLogout"
              label="自动注销时间 (分钟)"
              rules={[{ required: true, message: '请设置自动注销时间' }]}
            >
              <Slider
                min={5}
                max={120}
                marks={{
                  5: '5分钟',
                  30: '30分钟',
                  60: '1小时',
                  120: '2小时',
                }}
              />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => resetToDefaults('general')}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'display' && (
        <Card title={<Space><DesktopOutlined /> 显示设置</Space>} className="settings-card">
          <Form
            form={displayForm}
            layout="vertical"
            onFinish={handleDisplayFormSubmit}
            initialValues={systemConfig.display}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="mapDefaultView"
                  label="默认地图视图"
                  rules={[{ required: true, message: '请选择默认地图视图' }]}
                >
                  <Select placeholder="选择默认地图视图">
                    <Option value="global">全球视图</Option>
                    <Option value="china-coastal">中国沿海</Option>
                    <Option value="east-asia">东亚地区</Option>
                    <Option value="pacific-ocean">太平洋</Option>
                    <Option value="indian-ocean">印度洋</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="useSatelliteMap" valuePropName="checked" label="使用卫星地图">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="mapRefreshRate"
                  label="地图刷新频率 (秒)"
                  rules={[{ required: true, message: '请设置地图刷新频率' }]}
                >
                  <Slider
                    min={5}
                    max={300}
                    marks={{
                      5: '5秒',
                      30: '30秒',
                      60: '1分钟',
                      300: '5分钟',
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataRefreshRate"
                  label="数据刷新频率 (秒)"
                  rules={[{ required: true, message: '请设置数据刷新频率' }]}
                >
                  <Slider
                    min={10}
                    max={600}
                    marks={{
                      10: '10秒',
                      60: '1分钟',
                      300: '5分钟',
                      600: '10分钟',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="defaultShipMarkerSize"
              label="默认船舶标记大小"
              rules={[{ required: true, message: '请设置默认船舶标记大小' }]}
            >
              <Slider
                min={1}
                max={10}
                marks={{
                  1: '小',
                  5: '中',
                  10: '大',
                }}
              />
            </Form.Item>
            
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="showShipNames" valuePropName="checked" label="显示船舶名称">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="showShipDetails" valuePropName="checked" label="显示船舶详情">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="enableAnimation" valuePropName="checked" label="启用动画效果">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => resetToDefaults('display')}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'notification' && (
        <Card title={<Space><BellOutlined /> 通知设置</Space>} className="settings-card">
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleNotificationFormSubmit}
            initialValues={systemConfig.notification}
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="enableEmailNotifications" valuePropName="checked" label="电子邮件通知">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="enableSmsNotifications" valuePropName="checked" label="短信通知">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="enablePushNotifications" valuePropName="checked" label="推送通知">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="alertLevels"
              label="需要通知的警报级别"
              rules={[{ required: true, message: '请选择要通知的警报级别' }]}
            >
              <Select mode="multiple" placeholder="选择警报级别">
                <Option value="critical">紧急 (重大异常)</Option>
                <Option value="warning">警告 (需要关注)</Option>
                <Option value="info">信息 (一般提示)</Option>
                <Option value="system">系统 (系统事件)</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="emailRecipients"
              label="邮件接收人 (多个邮箱用逗号分隔)"
              rules={[{ required: true, message: '请输入邮件接收人' }]}
            >
              <Input placeholder="例如: admin@example.com,operations@example.com" />
            </Form.Item>
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="scheduledReports" valuePropName="checked" label="启用定期报告">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="reportFrequency"
                  label="报告频率"
                  rules={[{ required: true, message: '请选择报告频率' }]}
                >
                  <Select placeholder="选择报告频率">
                    <Option value="daily">每日</Option>
                    <Option value="weekly">每周</Option>
                    <Option value="monthly">每月</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => resetToDefaults('notification')}
                >
                  恢复默认
                </Button>
                <Button type="dashed" onClick={() => message.success('发送测试通知成功!')}>
                  发送测试通知
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'dataManagement' && (
        <Card title={<Space><DatabaseOutlined /> 数据管理设置</Space>} className="settings-card">
          <Form
            form={dataManagementForm}
            layout="vertical"
            onFinish={handleDataManagementFormSubmit}
            initialValues={systemConfig.dataManagement}
          >
            <Alert
              message="数据管理注意事项"
              description="更改数据保留期可能会影响系统性能和存储空间。建议在非高峰期进行数据清理操作。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="dataRetentionPeriod"
                  label="数据保留期 (天)"
                  rules={[{ required: true, message: '请设置数据保留期' }]}
                >
                  <Slider
                    min={30}
                    max={730}
                    marks={{
                      30: '1个月',
                      90: '3个月',
                      180: '6个月',
                      365: '1年',
                      730: '2年',
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="automaticDataCleanup" valuePropName="checked" label="启用自动数据清理">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="enableDataCompression" valuePropName="checked" label="启用数据压缩">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="backupFrequency"
                  label="备份频率"
                  rules={[{ required: true, message: '请选择备份频率' }]}
                >
                  <Select placeholder="选择备份频率">
                    <Option value="daily">每日</Option>
                    <Option value="weekly">每周</Option>
                    <Option value="monthly">每月</Option>
                    <Option value="manual">仅手动</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="backupLocation"
                  label="备份位置"
                  rules={[{ required: true, message: '请输入备份位置' }]}
                >
                  <Input placeholder="例如: /backup/ship-tracking-data" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="maxBackupSets"
                  label="最大备份集数"
                  rules={[{ required: true, message: '请输入最大备份集数' }]}
                >
                  <InputNumber min={1} max={30} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={24}>
              <Col span={8}>
                <Button 
                  block 
                  icon={<CloudUploadOutlined />} 
                  size="large"
                  loading={backupLoading}
                  onClick={backupSystemSettings}
                >
                  备份系统设置
                </Button>
              </Col>
              <Col span={8}>
                <Upload>
                  <Button 
                    block 
                    icon={<CloudDownloadOutlined />} 
                    size="large"
                    loading={restoreLoading}
                  >
                    恢复系统设置
                  </Button>
                </Upload>
              </Col>
              <Col span={8}>
                <Popconfirm
                  title="确定要清理过期数据吗?"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => {
                    message.success('数据清理任务已启动，请在任务中心查看进度');
                  }}
                >
                  <Button block danger icon={<DeleteOutlined />} size="large">
                    清理过期数据
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
            
            <Form.Item style={{ marginTop: 24 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => resetToDefaults('dataManagement')}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'integration' && (
        <Card title={<Space><ApiOutlined /> API与集成设置</Space>} className="settings-card">
          <Form
            form={integrationForm}
            layout="vertical"
            onFinish={handleIntegrationFormSubmit}
            initialValues={systemConfig.integration}
          >
            <Alert
              message="API安全提示"
              description="启用API访问可能会带来潜在的安全风险。建议设置合理的速率限制并仅向受信任的来源提供访问权限。"
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item name="enableApiAccess" valuePropName="checked" label="启用API访问">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="allowCors" valuePropName="checked" label="允许跨域请求 (CORS)">
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="apiRateLimit"
                  label="API速率限制 (每分钟请求数)"
                  rules={[{ required: true, message: '请设置API速率限制' }]}
                >
                  <Slider
                    min={10}
                    max={1000}
                    marks={{
                      10: '低',
                      100: '中',
                      500: '高',
                      1000: '无限制',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="enabledIntegrations"
              label="启用的第三方集成"
              rules={[{ required: true, message: '请选择需要启用的集成' }]}
            >
              <Select mode="multiple" placeholder="选择需要启用的集成">
                <Option value="weather">气象服务</Option>
                <Option value="ports">港口信息</Option>
                <Option value="customs">海关数据</Option>
                <Option value="ais">AIS船舶数据</Option>
                <Option value="satellite">卫星图像</Option>
                <Option value="tides">潮汐数据</Option>
              </Select>
            </Form.Item>
            
            <Collapse defaultActiveKey={['weather']} style={{ marginBottom: 24 }}>
              <Panel header="气象服务设置" key="weather">
                <Form.Item
                  name="weatherApiKey"
                  label="气象API密钥"
                  rules={[{ required: true, message: '请输入气象API密钥' }]}
                >
                  <Input.Password placeholder="输入API密钥" />
                </Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => testIntegrationConnection('气象服务')} 
                  loading={testingIntegration}
                >
                  测试连接
                </Button>
              </Panel>
              <Panel header="港口信息设置" key="ports">
                <Form.Item
                  name="portApiEndpoint"
                  label="港口API端点"
                  rules={[{ required: true, message: '请输入港口API端点' }]}
                >
                  <Input placeholder="例如: https://api.ports.example.com/v1" />
                </Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => testIntegrationConnection('港口信息服务')} 
                  loading={testingIntegration}
                >
                  测试连接
                </Button>
              </Panel>
            </Collapse>
            
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                >
                  保存设置
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => resetToDefaults('integration')}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card title={<Space><HistoryOutlined /> 设置历史记录</Space>} className="settings-card">
          <Table
            dataSource={configLogs}
            columns={configLogsColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </div>
  );
};

export default SystemSettings; 