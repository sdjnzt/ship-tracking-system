import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Form, Input, Button, Switch, 
  Tabs, Space, Slider, InputNumber, Select, Table, Tag, 
  Tooltip, Divider, Alert, List, Badge, Timeline, Descriptions,
  Radio, Popconfirm, message, Modal
} from 'antd';
import {
  SafetyCertificateOutlined, LockOutlined, EyeOutlined, 
  UserOutlined, SecurityScanOutlined, GlobalOutlined, 
  HistoryOutlined, KeyOutlined, ClockCircleOutlined, 
  SafetyOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, SettingOutlined, SaveOutlined,
  UndoOutlined, InfoCircleOutlined, BellOutlined, TeamOutlined,
  ApiOutlined, CloudServerOutlined, DatabaseOutlined, FireOutlined,
  ExportOutlined, CodeOutlined, DeleteOutlined
} from '@ant-design/icons';
import '../styles/SecuritySettings.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 模拟安全日志数据
interface SecurityLog {
  id: string;
  type: 'login' | 'logout' | 'password_change' | 'setting_change' | 'permission_change' | 'security_alert';
  username: string;
  ip: string;
  timestamp: string;
  details: string;
  status: 'success' | 'failed' | 'warning';
}

const mockSecurityLogs: SecurityLog[] = [
  {
    id: 'log-001',
    type: 'login',
    username: 'admin',
    ip: '192.168.1.100',
    timestamp: '2025-06-25T08:30:00',
    details: '管理员登录系统',
    status: 'success'
  },
  {
    id: 'log-002',
    type: 'setting_change',
    username: 'admin',
    ip: '192.168.1.100',
    timestamp: '2025-06-25T09:15:00',
    details: '修改了密码策略设置',
    status: 'success'
  },
  {
    id: 'log-003',
    type: 'login',
    username: 'zhang.manager',
    ip: '192.168.1.101',
    timestamp: '2025-06-25T10:20:00',
    details: '用户登录失败，密码错误',
    status: 'failed'
  },
  {
    id: 'log-004',
    type: 'password_change',
    username: 'zhang.manager',
    ip: '192.168.1.101',
    timestamp: '2025-06-25T10:25:00',
    details: '用户重置了密码',
    status: 'success'
  },
  {
    id: 'log-005',
    type: 'security_alert',
    username: 'system',
    ip: '192.168.1.1',
    timestamp: '2025-06-25T11:30:00',
    details: '检测到异常登录尝试，IP: 203.0.113.1',
    status: 'warning'
  },
  {
    id: 'log-006',
    type: 'permission_change',
    username: 'admin',
    ip: '192.168.1.100',
    timestamp: '2025-06-25T14:45:00',
    details: '修改了用户"li.operator"的权限',
    status: 'success'
  }
];

// 模拟IP白名单数据
interface IpWhitelist {
  id: string;
  ip: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

const mockIpWhitelist: IpWhitelist[] = [
  {
    id: 'ip-001',
    ip: '192.168.1.0/24',
    description: '公司内网',
    createdBy: 'admin',
    createdAt: '2025-06-01T10:00:00'
  },
  {
    id: 'ip-002',
    ip: '203.0.113.42',
    description: '远程办公-张经理',
    createdBy: 'admin',
    createdAt: '2025-06-10T14:30:00'
  },
  {
    id: 'ip-003',
    ip: '198.51.100.0/24',
    description: '合作伙伴网络',
    createdBy: 'admin',
    createdAt: '2025-06-15T09:20:00'
  }
];

const SecuritySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('password');
  const [passwordForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const [ipForm] = Form.useForm();
  const [logs, setLogs] = useState<SecurityLog[]>(mockSecurityLogs);
  const [ipWhitelist, setIpWhitelist] = useState<IpWhitelist[]>(mockIpWhitelist);
  const [loading, setLoading] = useState<boolean>(false);

  // 密码策略设置
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    preventReuseCount: 5,
  });

  // 登录安全设置
  const [loginSettings, setLoginSettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 30, // 分钟
    sessionTimeout: 60, // 分钟
    enableTwoFactor: false,
    requireCaptcha: true,
    allowMultipleSessions: false,
    ipRestriction: false,
  });

  useEffect(() => {
    // 初始化表单值
    passwordForm.setFieldsValue(passwordSettings);
    loginForm.setFieldsValue(loginSettings);
  }, []);

  // 处理密码策略表单提交
  const handlePasswordFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setPasswordSettings(values);
      setLoading(false);
      message.success('密码策略设置已更新');
      
      // 添加日志
      const newLog: SecurityLog = {
        id: `log-${Date.now()}`,
        type: 'setting_change',
        username: 'admin', // 假设当前用户是admin
        ip: '192.168.1.100',
        timestamp: new Date().toISOString(),
        details: '修改了密码策略设置',
        status: 'success'
      };
      setLogs([newLog, ...logs]);
    }, 500);
  };

  // 处理登录安全表单提交
  const handleLoginFormSubmit = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoginSettings(values);
      setLoading(false);
      message.success('登录安全设置已更新');
      
      // 添加日志
      const newLog: SecurityLog = {
        id: `log-${Date.now()}`,
        type: 'setting_change',
        username: 'admin', // 假设当前用户是admin
        ip: '192.168.1.100',
        timestamp: new Date().toISOString(),
        details: '修改了登录安全设置',
        status: 'success'
      };
      setLogs([newLog, ...logs]);
    }, 500);
  };

  // 处理添加IP白名单
  const handleAddIpWhitelist = (values: any) => {
    const newIp: IpWhitelist = {
      id: `ip-${Date.now()}`,
      ip: values.ip,
      description: values.description,
      createdBy: 'admin', // 假设当前用户是admin
      createdAt: new Date().toISOString()
    };
    setIpWhitelist([...ipWhitelist, newIp]);
    ipForm.resetFields();
    message.success('IP白名单已添加');
  };

  // 处理删除IP白名单
  const handleDeleteIpWhitelist = (id: string) => {
    setIpWhitelist(ipWhitelist.filter(ip => ip.id !== id));
    message.success('IP白名单已删除');
  };

  // 处理安全审计日志导出
  const handleExportLogs = () => {
    message.success('安全审计日志已导出');
    
    // 创建一个导出文件
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 处理安全审计日志清空
  const handleClearLogs = () => {
    Modal.confirm({
      title: '确认清空安全日志',
      content: '此操作将清空所有安全审计日志记录，且不可恢复。确定要继续吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setLogs([]);
        message.success('安全审计日志已清空');
        
        // 添加清空日志的记录
        const newLog: SecurityLog = {
          id: `log-${Date.now()}`,
          type: 'setting_change',
          username: 'admin',
          ip: '192.168.1.100',
          timestamp: new Date().toISOString(),
          details: '清空了安全审计日志',
          status: 'success'
        };
        setLogs([newLog]);
      }
    });
  };

  // 处理安全扫描
  const handleSecurityScan = () => {
    setLoading(true);
    message.loading({ content: '正在进行安全扫描...', key: 'securityScan' });
    
    setTimeout(() => {
      setLoading(false);
      message.success({ content: '安全扫描完成，未发现异常', key: 'securityScan' });
      
      // 添加安全扫描日志
      const newLog: SecurityLog = {
        id: `log-${Date.now()}`,
        type: 'security_alert',
        username: 'admin',
        ip: '192.168.1.100',
        timestamp: new Date().toISOString(),
        details: '执行了系统安全扫描',
        status: 'success'
      };
      setLogs([newLog, ...logs]);
    }, 2000);
  };

  // 安全日志表格列定义
  const logColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: SecurityLog, b: SecurityLog) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      width: 180,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { text: string, icon: React.ReactNode, color: string }> = {
          login: { text: '登录', icon: <UserOutlined />, color: 'blue' },
          logout: { text: '登出', icon: <ExportOutlined />, color: 'default' },
          password_change: { text: '密码修改', icon: <KeyOutlined />, color: 'purple' },
          setting_change: { text: '设置修改', icon: <SettingOutlined />, color: 'cyan' },
          permission_change: { text: '权限修改', icon: <TeamOutlined />, color: 'orange' },
          security_alert: { text: '安全警报', icon: <ExclamationCircleOutlined />, color: 'red' },
        };
        const { text, icon, color } = typeMap[type] || { text: type, icon: <InfoCircleOutlined />, color: 'default' };
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: '登录', value: 'login' },
        { text: '登出', value: 'logout' },
        { text: '密码修改', value: 'password_change' },
        { text: '设置修改', value: 'setting_change' },
        { text: '权限修改', value: 'permission_change' },
        { text: '安全警报', value: 'security_alert' },
      ],
      onFilter: (value: React.Key | boolean, record: SecurityLog) => record.type === value,
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string, icon: React.ReactNode, color: string }> = {
          success: { text: '成功', icon: <CheckCircleOutlined />, color: 'success' },
          failed: { text: '失败', icon: <CloseCircleOutlined />, color: 'error' },
          warning: { text: '警告', icon: <ExclamationCircleOutlined />, color: 'warning' },
        };
        const { text, icon, color } = statusMap[status] || { text: status, icon: <InfoCircleOutlined />, color: 'default' };
        return (
          <Badge status={color as any} text={text} />
        );
      },
      filters: [
        { text: '成功', value: 'success' },
        { text: '失败', value: 'failed' },
        { text: '警告', value: 'warning' },
      ],
      onFilter: (value: React.Key | boolean, record: SecurityLog) => record.status === value,
    },
  ];

  return (
    <div className="security-settings">
      <div className="page-header">
        <div>
          <Title level={3}><SafetyCertificateOutlined /> 安全设置</Title>
          <Text type="secondary">管理系统安全策略、访问控制和安全审计</Text>
        </div>
        
        <Space size="middle">
          <Button 
            icon={<SecurityScanOutlined />} 
            onClick={handleSecurityScan}
            loading={loading}
          >
            安全扫描
          </Button>
          <Button 
            icon={<SaveOutlined />} 
            onClick={() => message.success('安全设置已保存')}
          >
            保存设置
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="security-tabs"
        tabBarGutter={8}
        type="card"
      >
        <TabPane tab={<span><LockOutlined /> 密码策略</span>} key="password" />
        <TabPane tab={<span><UserOutlined /> 登录安全</span>} key="login" />
        <TabPane tab={<span><GlobalOutlined /> IP白名单</span>} key="ip" />
        <TabPane tab={<span><HistoryOutlined /> 安全审计</span>} key="audit" />
      </Tabs>

      {activeTab === 'password' && (
        <Card title="密码策略设置" className="security-card">
          <Form
            form={passwordForm}
            layout="vertical"
            initialValues={passwordSettings}
            onFinish={handlePasswordFormSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="minLength"
                  label="密码最小长度"
                  rules={[{ required: true, message: '请输入密码最小长度' }]}
                >
                  <InputNumber min={6} max={20} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="passwordExpiryDays"
                  label="密码过期天数"
                  rules={[{ required: true, message: '请输入密码过期天数' }]}
                >
                  <InputNumber min={0} max={365} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="preventReuseCount"
                  label="禁止重复使用密码次数"
                  rules={[{ required: true, message: '请输入禁止重复使用密码次数' }]}
                >
                  <InputNumber min={0} max={20} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="requireUppercase"
                  valuePropName="checked"
                  label="必须包含大写字母"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="requireLowercase"
                  valuePropName="checked"
                  label="必须包含小写字母"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="requireNumbers"
                  valuePropName="checked"
                  label="必须包含数字"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="requireSpecialChars"
                  valuePropName="checked"
                  label="必须包含特殊字符"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存设置
                </Button>
                <Button 
                  onClick={() => {
                    passwordForm.setFieldsValue({
                      minLength: 8,
                      requireUppercase: true,
                      requireLowercase: true,
                      requireNumbers: true,
                      requireSpecialChars: true,
                      passwordExpiryDays: 90,
                      preventReuseCount: 5,
                    });
                  }}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'login' && (
        <Card title="登录安全设置" className="security-card">
          <Form
            form={loginForm}
            layout="vertical"
            initialValues={loginSettings}
            onFinish={handleLoginFormSubmit}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="maxLoginAttempts"
                  label="最大登录尝试次数"
                  rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lockoutDuration"
                  label="账户锁定时长（分钟）"
                  rules={[{ required: true, message: '请输入账户锁定时长' }]}
                >
                  <InputNumber min={1} max={1440} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="sessionTimeout"
                  label="会话超时时间（分钟）"
                  rules={[{ required: true, message: '请输入会话超时时间' }]}
                >
                  <InputNumber min={1} max={1440} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Divider />
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="enableTwoFactor"
                  valuePropName="checked"
                  label="启用双因素认证"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="requireCaptcha"
                  valuePropName="checked"
                  label="登录需要验证码"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="allowMultipleSessions"
                  valuePropName="checked"
                  label="允许多会话登录"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ipRestriction"
                  valuePropName="checked"
                  label="启用IP限制"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存设置
                </Button>
                <Button 
                  onClick={() => {
                    loginForm.setFieldsValue({
                      maxLoginAttempts: 5,
                      lockoutDuration: 30,
                      sessionTimeout: 60,
                      enableTwoFactor: false,
                      requireCaptcha: true,
                      allowMultipleSessions: false,
                      ipRestriction: false,
                    });
                  }}
                >
                  恢复默认
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'ip' && (
        <Card title="IP白名单设置" className="security-card">
          <Alert
            message="IP白名单说明"
            description="添加到白名单的IP地址将不受登录限制。可以添加单个IP地址或使用CIDR表示法添加IP段。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form
            form={ipForm}
            layout="inline"
            onFinish={handleAddIpWhitelist}
            style={{ marginBottom: 16 }}
          >
            <Form.Item
              name="ip"
              label="IP地址/范围"
              rules={[
                { required: true, message: '请输入IP地址' },
                {
                  pattern: /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/,
                  message: '请输入有效的IP地址或CIDR范围'
                }
              ]}
            >
              <Input placeholder="例如: 192.168.1.1 或 192.168.1.0/24" style={{ width: 250 }} />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <Input placeholder="例如: 公司内网" style={{ width: 250 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </Form.Item>
          </Form>
          
          <Table
            dataSource={ipWhitelist}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'IP地址/范围',
                dataIndex: 'ip',
                key: 'ip',
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
              },
              {
                title: '创建人',
                dataIndex: 'createdBy',
                key: 'createdBy',
              },
              {
                title: '创建时间',
                dataIndex: 'createdAt',
                key: 'createdAt',
                render: (text: string) => new Date(text).toLocaleString()
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Popconfirm
                    title="确定要删除此IP白名单吗？"
                    onConfirm={() => handleDeleteIpWhitelist(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                ),
              },
            ]}
          />
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card 
          title="安全审计日志" 
          className="security-card"
          extra={
            <Space>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExportLogs}
              >
                导出日志
              </Button>
              <Popconfirm
                title="确定要清空所有日志记录吗？此操作不可恢复。"
                onConfirm={handleClearLogs}
                okText="确定"
                cancelText="取消"
                okType="danger"
              >
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                >
                  清空日志
                </Button>
              </Popconfirm>
            </Space>
          }
        >
          <Table
            dataSource={logs}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            columns={logColumns}
          />
        </Card>
      )}
    </div>
  );
};

export default SecuritySettings; 