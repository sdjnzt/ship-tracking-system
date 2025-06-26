import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Form, Input, Button, Switch, 
  Tabs, Space, Slider, InputNumber, Select, Table, Tag, 
  Tooltip, Divider, Alert, List, Badge, Timeline, Descriptions,
  Radio, Popconfirm, message
} from 'antd';
import {
  SafetyCertificateOutlined, LockOutlined, EyeOutlined, 
  UserOutlined, SecurityScanOutlined, GlobalOutlined, 
  HistoryOutlined, KeyOutlined, ClockCircleOutlined, 
  SafetyOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, SettingOutlined, SaveOutlined,
  UndoOutlined, InfoCircleOutlined, BellOutlined, TeamOutlined,
  ApiOutlined, CloudServerOutlined, DatabaseOutlined, FireOutlined,
  ExportOutlined, CodeOutlined
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
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
      filters: [
        { text: '登录', value: 'login' },
        { text: '登出', value: 'logout' },
        { text: '密码修改', value: 'password_change' },
        { text: '设置修改', value: 'setting_change' },
        { text: '权限修改', value: 'permission_change' },
        { text: '安全警报', value: 'security_alert' },
      ],
      onFilter: (value: any, record: SecurityLog) => record.type === value,
      width: 120,
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 120,
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { text: string, color: string, icon: React.ReactNode }> = {
          success: { text: '成功', color: 'success', icon: <CheckCircleOutlined /> },
          failed: { text: '失败', color: 'error', icon: <CloseCircleOutlined /> },
          warning: { text: '警告', color: 'warning', icon: <ExclamationCircleOutlined /> },
        };
        const { text, color, icon } = statusMap[status] || { text: status, color: 'default', icon: <InfoCircleOutlined /> };
        return <Badge status={color as any} text={text} />;
      },
      filters: [
        { text: '成功', value: 'success' },
        { text: '失败', value: 'failed' },
        { text: '警告', value: 'warning' },
      ],
      onFilter: (value: any, record: SecurityLog) => record.status === value,
      width: 100,
    },
  ];

  // IP白名单表格列定义
  const ipColumns = [
    {
      title: 'IP地址/范围',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: IpWhitelist) => (
        <Space>
          <Popconfirm
            title="确定要删除这个IP白名单吗？"
            onConfirm={() => handleDeleteIpWhitelist(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<CloseCircleOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="security-settings">
      <div className="page-header">
        <div>
          <Title level={3}><SafetyCertificateOutlined /> 安全设置</Title>
          <Text type="secondary">管理系统安全策略，保障数据安全和访问控制</Text>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="security-tabs" type="card">
        <TabPane tab={<span><LockOutlined /> 密码策略</span>} key="password" />
        <TabPane tab={<span><SecurityScanOutlined /> 登录安全</span>} key="login" />
        <TabPane tab={<span><GlobalOutlined /> 访问控制</span>} key="access" />
        <TabPane tab={<span><HistoryOutlined /> 安全日志</span>} key="logs" />
      </Tabs>

      {activeTab === 'password' && (
        <Card className="settings-card">
          <Alert
            message="密码策略说明"
            description="密码策略用于规范用户密码的复杂度和安全性，包括密码长度、组成要求、过期策略等。合理的密码策略可以有效防止密码被破解。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordFormSubmit}
            initialValues={passwordSettings}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="minLength"
                  label="密码最小长度"
                  rules={[{ required: true, message: '请输入密码最小长度' }]}
                >
                  <Slider
                    min={6}
                    max={20}
                    marks={{
                      6: '6',
                      8: '8',
                      12: '12',
                      16: '16',
                      20: '20'
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="passwordExpiryDays"
                  label="密码过期天数"
                  rules={[{ required: true, message: '请输入密码过期天数' }]}
                >
                  <Slider
                    min={0}
                    max={180}
                    marks={{
                      0: '永不',
                      30: '30天',
                      90: '90天',
                      180: '180天'
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="preventReuseCount"
                  label="禁止重复使用最近密码数量"
                  rules={[{ required: true, message: '请输入数量' }]}
                >
                  <Select>
                    <Option value={0}>不限制</Option>
                    <Option value={3}>3个</Option>
                    <Option value={5}>5个</Option>
                    <Option value={10}>10个</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">密码复杂度要求</Divider>

            <Row gutter={24}>
              <Col span={6}>
                <Form.Item
                  name="requireUppercase"
                  valuePropName="checked"
                  label="要求大写字母"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="requireLowercase"
                  valuePropName="checked"
                  label="要求小写字母"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="requireNumbers"
                  valuePropName="checked"
                  label="要求数字"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="requireSpecialChars"
                  valuePropName="checked"
                  label="要求特殊字符"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

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
                  onClick={() => passwordForm.resetFields()}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'login' && (
        <Card className="settings-card">
          <Alert
            message="登录安全说明"
            description="登录安全设置用于规范用户登录行为，包括登录尝试次数限制、会话超时、双因素认证等。这些设置可以有效防止未授权访问和账户劫持。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={handleLoginFormSubmit}
            initialValues={loginSettings}
          >
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="maxLoginAttempts"
                  label="最大登录尝试次数"
                  rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
                >
                  <Select>
                    <Option value={3}>3次</Option>
                    <Option value={5}>5次</Option>
                    <Option value={10}>10次</Option>
                    <Option value={0}>不限制</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lockoutDuration"
                  label="账户锁定时长(分钟)"
                  rules={[{ required: true, message: '请输入账户锁定时长' }]}
                >
                  <Select>
                    <Option value={15}>15分钟</Option>
                    <Option value={30}>30分钟</Option>
                    <Option value={60}>1小时</Option>
                    <Option value={1440}>24小时</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="sessionTimeout"
                  label="会话超时时间(分钟)"
                  rules={[{ required: true, message: '请输入会话超时时间' }]}
                >
                  <Select>
                    <Option value={15}>15分钟</Option>
                    <Option value={30}>30分钟</Option>
                    <Option value={60}>1小时</Option>
                    <Option value={120}>2小时</Option>
                    <Option value={0}>永不超时</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">登录验证设置</Divider>

            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="enableTwoFactor"
                  valuePropName="checked"
                  label="启用双因素认证"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="requireCaptcha"
                  valuePropName="checked"
                  label="启用验证码"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="allowMultipleSessions"
                  valuePropName="checked"
                  label="允许多会话登录"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">IP限制</Divider>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="ipRestriction"
                  valuePropName="checked"
                  label="启用IP访问限制"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

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
                  onClick={() => loginForm.resetFields()}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {activeTab === 'access' && (
        <Row gutter={24}>
          <Col span={24}>
            <Card 
              title={<Space><GlobalOutlined /> IP白名单</Space>} 
              className="settings-card"
              extra={
                <Button 
                  type="primary" 
                  onClick={() => ipForm.resetFields()}
                >
                  添加IP
                </Button>
              }
            >
              <Alert
                message="IP白名单说明"
                description="IP白名单用于限制只有特定IP地址或IP地址范围的用户可以访问系统。可以使用CIDR表示法（如192.168.1.0/24）来指定IP范围。"
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />
              
              <Form
                form={ipForm}
                layout="inline"
                onFinish={handleAddIpWhitelist}
                style={{ marginBottom: 24 }}
              >
                <Form.Item
                  name="ip"
                  label="IP地址/范围"
                  rules={[{ required: true, message: '请输入IP地址或范围' }]}
                >
                  <Input placeholder="如: 192.168.1.1 或 192.168.1.0/24" style={{ width: 250 }} />
                </Form.Item>
                <Form.Item
                  name="description"
                  label="描述"
                  rules={[{ required: true, message: '请输入描述' }]}
                >
                  <Input placeholder="描述此IP的用途" style={{ width: 250 }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    添加
                  </Button>
                </Form.Item>
              </Form>
              
              <Table
                dataSource={ipWhitelist}
                columns={ipColumns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
          
          <Col span={24} style={{ marginTop: 24 }}>
            <Card 
              title={<Space><SafetyOutlined /> 安全防护</Space>} 
              className="settings-card"
            >
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'SQL注入防护',
                    description: '防止恶意SQL注入攻击，保护数据库安全',
                    icon: <DatabaseOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
                    enabled: true
                  },
                  {
                    title: 'XSS攻击防护',
                    description: '防止跨站脚本攻击，保护用户数据安全',
                    icon: <CodeOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
                    enabled: true
                  },
                  {
                    title: 'CSRF防护',
                    description: '防止跨站请求伪造攻击',
                    icon: <ApiOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
                    enabled: true
                  },
                  {
                    title: 'DDoS防护',
                    description: '防止分布式拒绝服务攻击',
                    icon: <CloudServerOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
                    enabled: false
                  },
                  {
                    title: '敏感数据加密',
                    description: '对敏感数据进行加密存储',
                    icon: <LockOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
                    enabled: true
                  },
                  {
                    title: '防火墙',
                    description: '系统级别的访问控制和防护',
                    icon: <FireOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
                    enabled: true
                  }
                ]}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Switch checked={item.enabled} />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {activeTab === 'logs' && (
        <Card className="settings-card">
          <Alert
            message="安全日志说明"
            description="安全日志记录了系统中与安全相关的操作和事件，包括用户登录、权限变更、安全设置修改等。定期审计安全日志有助于发现潜在的安全问题。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Table
            dataSource={logs}
            columns={logColumns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Card>
      )}
    </div>
  );
};

export default SecuritySettings; 