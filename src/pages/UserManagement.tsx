import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Table, Button, Modal, Form, Input, Select, 
  Avatar, Tag, Space, Tooltip, Popconfirm, message, Tabs, Divider,
  DatePicker, Switch, Badge, Drawer, List, Descriptions, Statistic,
  Progress, Alert, Upload, Image
} from 'antd';
import {
  UserOutlined, TeamOutlined, SettingOutlined, PlusOutlined,
  EditOutlined, DeleteOutlined, EyeOutlined, LockOutlined,
  UnlockOutlined, KeyOutlined, SafetyCertificateOutlined,
  CalendarOutlined, PhoneOutlined, MailOutlined, GlobalOutlined,
  FilterOutlined, SearchOutlined, ReloadOutlined, ExportOutlined,
  ImportOutlined, DownloadOutlined, UploadOutlined, InfoCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  UserAddOutlined, UserDeleteOutlined, UserSwitchOutlined,
  ApartmentOutlined, CrownOutlined, SecurityScanOutlined
} from '@ant-design/icons';
import { mockUsers, mockDepartments, rolePermissions, mockLoginHistory, UserData, DepartmentData, RolePermission } from '../data/mockData';
import { Pie, Column } from '@ant-design/plots';

import '../styles/UserManagement.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface UserFormData {
  username: string;
  realName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  remark?: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [roles, setRoles] = useState<RolePermission[]>([]);
  const [activeTab, setActiveTab] = useState<string>('users');
  const [userModalVisible, setUserModalVisible] = useState<boolean>(false);
  const [userDetailVisible, setUserDetailVisible] = useState<boolean>(false);
  const [roleModalVisible, setRoleModalVisible] = useState<boolean>(false);
  const [deptModalVisible, setDeptModalVisible] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [deptForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setDepartments(mockDepartments);
      setRoles(rolePermissions);
      setLoading(false);
    }, 500);
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'suspended': return 'red';
      default: return 'default';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '停用';
      case 'suspended': return '暂停';
      default: return '未知';
    }
  };

  // 获取角色标签颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'manager': return 'blue';
      case 'operator': return 'green';
      case 'viewer': return 'orange';
      default: return 'default';
    }
  };

  // 获取角色文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'manager': return '经理';
      case 'operator': return '操作员';
      case 'viewer': return '查看员';
      default: return '未知';
    }
  };

  // 用户表格列定义
  const userColumns = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 280,
      render: (record: UserData) => (
        <Space size="middle">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={48}
          />
          <div>
            <div>
              <Text strong style={{ fontSize: '15px' }}>{record.realName}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>@{record.username}</Text>
            </div>
            <div>
              <Text type="secondary">{record.department}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 220,
      render: (record: UserData) => (
        <Space direction="vertical" size={4}>
          <Space>
            <MailOutlined />
            <Text>{record.email}</Text>
          </Space>
          <Space>
            <PhoneOutlined />
            <Text>{record.phone}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: '角色',
      key: 'role',
      width: 120,
      render: (record: UserData) => (
        <Tag color={getRoleColor(record.role)} style={{ fontSize: '14px', padding: '4px 10px' }}>
          {getRoleText(record.role)}
        </Tag>
      ),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '经理', value: 'manager' },
        { text: '操作员', value: 'operator' },
        { text: '查看员', value: 'viewer' },
      ],
      onFilter: (value: boolean | React.Key, record: UserData) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return record.role === value;
        }
        return false;
      },
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (record: UserData) => (
        <Badge 
          status={record.status === 'active' ? 'success' : record.status === 'inactive' ? 'warning' : 'error'} 
          text={getStatusText(record.status)} 
        />
      ),
      filters: [
        { text: '正常', value: 'active' },
        { text: '停用', value: 'inactive' },
        { text: '暂停', value: 'suspended' },
      ],
      onFilter: (value: boolean | React.Key, record: UserData) => {
        if (typeof value === 'string' || typeof value === 'number') {
          return record.status === value;
        }
        return false;
      },
    },
    {
      title: '最后登录',
      key: 'lastLogin',
      width: 180,
      render: (record: UserData) => (
        <Space direction="vertical" size={0}>
          <Text>{new Date(record.lastLoginTime).toLocaleDateString()}</Text>
          <Text type="secondary">{new Date(record.lastLoginTime).toLocaleTimeString()}</Text>
        </Space>
      ),
      sorter: (a: UserData, b: UserData) => new Date(a.lastLoginTime).getTime() - new Date(b.lastLoginTime).getTime(),
    },
    {
      title: '登录次数',
      key: 'loginCount',
      dataIndex: 'loginCount',
      width: 100,
      sorter: (a: UserData, b: UserData) => a.loginCount - b.loginCount,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (record: UserData) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="编辑用户">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? '停用用户' : '启用用户'}>
            <Button 
              type="text" 
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleUserStatus(record)}
            />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button 
              type="text" 
              icon={<KeyOutlined />} 
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除用户">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 部门表格列定义
  const deptColumns = [
    {
      title: '部门信息',
      key: 'deptInfo',
      render: (record: DepartmentData) => (
        <Space>
          <Avatar icon={<ApartmentOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div>
              <Text strong>{record.name}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>({record.code})</Text>
            </div>
            <div>
              <Text type="secondary">{record.description}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '部门经理',
      key: 'manager',
      dataIndex: 'manager',
      render: (manager: string) => {
        const user = users.find(u => u.username === manager);
        return user ? user.realName : manager;
      },
    },
    {
      title: '成员数量',
      key: 'memberCount',
      dataIndex: 'memberCount',
      render: (count: number) => (
        <Tag color="blue">{count}人</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: DepartmentData) => (
        <Space>
          <Button type="text" icon={<EditOutlined />}>编辑</Button>
          <Button type="text" icon={<TeamOutlined />}>成员管理</Button>
          <Popconfirm
            title="确定要删除这个部门吗？"
            onConfirm={() => handleDeleteDepartment(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理查看用户详情
  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setUserDetailVisible(true);
  };

  // 处理编辑用户
  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      username: user.username,
      realName: user.realName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status,
      remark: user.remark,
    });
    setUserModalVisible(true);
  };

  // 处理添加用户
  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setUserModalVisible(true);
  };

  // 处理切换用户状态
  const handleToggleUserStatus = (user: UserData) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: newStatus as 'active' | 'inactive' | 'suspended' } : u
    );
    setUsers(updatedUsers);
    message.success(`用户${newStatus === 'active' ? '启用' : '停用'}成功`);
  };

  // 处理重置密码
  const handleResetPassword = (user: UserData) => {
    message.success(`用户 ${user.realName} 的密码已重置为默认密码`);
  };

  // 处理删除用户
  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    message.success('用户删除成功');
  };

  // 处理删除部门
  const handleDeleteDepartment = (deptId: string) => {
    const updatedDepts = departments.filter(d => d.id !== deptId);
    setDepartments(updatedDepts);
    message.success('部门删除成功');
  };

  // 处理用户表单提交
  const handleUserFormSubmit = (values: UserFormData) => {
    if (editingUser) {
      // 编辑用户
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              ...values,
              role: values.role as 'admin' | 'manager' | 'operator' | 'viewer',
              status: values.status as 'active' | 'inactive' | 'suspended',
            }
          : u
      );
      setUsers(updatedUsers);
      message.success('用户信息更新成功');
    } else {
      // 添加用户
      const newUser: UserData = {
        id: `user-${Date.now()}`,
        ...values,
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        lastLoginTime: new Date().toISOString(),
        createTime: new Date().toISOString(),
        permissions: roles.find(r => r.role === values.role)?.permissions || [],
        loginCount: 0,
        role: values.role as 'admin' | 'manager' | 'operator' | 'viewer',
        status: values.status as 'active' | 'inactive' | 'suspended',
      };
      setUsers([...users, newUser]);
      message.success('用户添加成功');
    }
    setUserModalVisible(false);
    userForm.resetFields();
  };

  // 生成统计数据
  const generateStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;

    const roleStats = [
      { role: 'admin', count: users.filter(u => u.role === 'admin').length },
      { role: 'manager', count: users.filter(u => u.role === 'manager').length },
      { role: 'operator', count: users.filter(u => u.role === 'operator').length },
      { role: 'viewer', count: users.filter(u => u.role === 'viewer').length },
    ];

    const deptStats = departments.map(dept => ({
      name: dept.name,
      count: users.filter(u => u.department === dept.name).length,
    }));

    return { totalUsers, activeUsers, inactiveUsers, suspendedUsers, roleStats, deptStats };
  };

  const stats = generateStats();

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <Title level={3}><UserOutlined /> 用户管理</Title>
          <Text type="secondary">管理系统用户、角色权限和部门组织架构，确保系统安全运行</Text>
        </div>
        
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            size="middle"
          >
            添加用户
          </Button>
          <Button icon={<ExportOutlined />}>导出数据</Button>
          <Button icon={<ImportOutlined />}>导入数据</Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              setLoading(true);
              loadData();
            }}
          >
            刷新
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        className="management-tabs"
        tabBarGutter={8}
        type="card"
      >
        <TabPane tab={<span><UserOutlined /> 用户管理</span>} key="users" />
        <TabPane tab={<span><TeamOutlined /> 部门管理</span>} key="departments" />
        <TabPane tab={<span><SettingOutlined /> 角色权限</span>} key="roles" />
        <TabPane tab={<span><SecurityScanOutlined /> 安全审计</span>} key="security" />
      </Tabs>

      {activeTab === 'users' && (
        <>
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><UserOutlined /> 总用户数</div>}
                  value={stats.totalUsers}
                  valueStyle={{ color: '#1890ff' }}
                  suffix={<small>人</small>}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={100} 
                    showInfo={false} 
                    strokeColor="#1890ff" 
                    size="small" 
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><CheckCircleOutlined /> 活跃用户</div>}
                  value={stats.activeUsers}
                  valueStyle={{ color: '#52c41a' }}
                  suffix={<small>人</small>}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={(stats.activeUsers / stats.totalUsers) * 100} 
                    showInfo={false} 
                    strokeColor="#52c41a" 
                    size="small" 
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><ClockCircleOutlined /> 停用用户</div>}
                  value={stats.inactiveUsers}
                  valueStyle={{ color: '#faad14' }}
                  suffix={<small>人</small>}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={(stats.inactiveUsers / stats.totalUsers) * 100} 
                    showInfo={false} 
                    strokeColor="#faad14" 
                    size="small" 
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="stat-card">
                <Statistic 
                  title={<div className="stat-title"><CloseCircleOutlined /> 暂停用户</div>}
                  value={stats.suspendedUsers}
                  valueStyle={{ color: '#ff4d4f' }}
                  suffix={<small>人</small>}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={(stats.suspendedUsers / stats.totalUsers) * 100} 
                    showInfo={false} 
                    strokeColor="#ff4d4f" 
                    size="small" 
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card 
                title={<Space><UserOutlined /> 用户列表</Space>} 
                className="table-card"
                extra={
                  <Space>
                    <Input 
                      placeholder="搜索用户..." 
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 200 }}
                      allowClear
                    />
                    <Select 
                      placeholder="状态筛选" 
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: 120 }}
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="all">全部状态</Option>
                      <Option value="active">正常</Option>
                      <Option value="inactive">停用</Option>
                      <Option value="suspended">暂停</Option>
                    </Select>
                    <Select 
                      placeholder="角色筛选" 
                      value={roleFilter}
                      onChange={setRoleFilter}
                      style={{ width: 120 }}
                      suffixIcon={<FilterOutlined />}
                    >
                      <Option value="all">全部角色</Option>
                      <Option value="admin">管理员</Option>
                      <Option value="manager">经理</Option>
                      <Option value="operator">操作员</Option>
                      <Option value="viewer">查看员</Option>
                    </Select>
                  </Space>
                }
              >
                <Table 
                  dataSource={users.filter(user => {
                    const matchesSearch = !searchText || 
                      user.realName.includes(searchText) || 
                      user.username.includes(searchText) ||
                      user.email.includes(searchText);
                    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
                    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
                    return matchesSearch && matchesStatus && matchesRole;
                  })} 
                  columns={userColumns} 
                  rowKey="id"
                  loading={loading}
                  pagination={{ 
                    pageSize: 8,
                    showSizeChanger: true,
                    pageSizeOptions: ['8', '16', '24'],
                    showTotal: (total) => `共 ${total} 条记录`
                  }}
                  scroll={{ x: 1200 }}
                  bordered={false}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title={<Space><CrownOutlined /> 角色分布</Space>} className="chart-card">
                <Pie 
                  data={stats.roleStats.map(item => ({
                    type: getRoleText(item.role),
                    value: item.count
                  }))}
                  angleField="value"
                  colorField="type"
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
        </>
      )}

      {activeTab === 'departments' && (
        <Card title={<Space><TeamOutlined /> 部门管理</Space>} className="table-card">
          <Table 
            dataSource={departments} 
            columns={deptColumns} 
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {activeTab === 'roles' && (
        <Card title={<Space><SettingOutlined /> 角色权限管理</Space>} className="table-card">
          <List
            dataSource={roles}
            renderItem={(role) => (
              <List.Item
                actions={[
                  <Button type="text" icon={<EditOutlined />}>编辑</Button>,
                  <Button type="text" icon={<EyeOutlined />}>查看权限</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<CrownOutlined />} style={{ backgroundColor: getRoleColor(role.role) }} />}
                  title={
                    <Space>
                      <Text strong>{getRoleText(role.role)}</Text>
                      <Tag color={getRoleColor(role.role)}>{role.role}</Tag>
                    </Space>
                  }
                  description={role.description}
                />
                <div>
                  <Text type="secondary">权限数量: {role.permissions.length}</Text>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title={<Space><SecurityScanOutlined /> 安全审计</Space>} className="table-card">
          <Alert
            message="安全审计功能"
            description="这里可以查看用户登录历史、操作日志、安全事件等信息"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table 
            dataSource={mockLoginHistory}
            columns={[
              {
                title: '用户',
                key: 'user',
                render: (record) => {
                  const user = users.find(u => u.id === record.userId);
                  return user ? user.realName : record.userId;
                }
              },
              {
                title: '登录时间',
                key: 'loginTime',
                dataIndex: 'loginTime',
                render: (time: string) => new Date(time).toLocaleString()
              },
              {
                title: 'IP地址',
                key: 'ipAddress',
                dataIndex: 'ipAddress'
              },
              {
                title: '位置',
                key: 'location',
                dataIndex: 'location'
              },
              {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                render: (status: string) => (
                  <Tag color={status === 'success' ? 'green' : 'red'}>
                    {status === 'success' ? '成功' : '失败'}
                  </Tag>
                )
              }
            ]}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {/* 用户添加/编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleUserFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="realName"
                label="真实姓名"
                rules={[{ required: true, message: '请输入真实姓名' }]}
              >
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  {roles.map(role => (
                    <Option key={role.role} value={role.role}>
                      {getRoleText(role.role)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  {departments.map(dept => (
                    <Option key={dept.id} value={dept.name}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="suspended">暂停</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setUserModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 用户详情抽屉 */}
      <Drawer
        title={
          <Space>
            <UserOutlined />
            用户详情
          </Space>
        }
        placement="right"
        width={600}
        open={userDetailVisible}
        onClose={() => setUserDetailVisible(false)}
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => {
                setUserDetailVisible(false);
                if (selectedUser) handleEditUser(selectedUser);
              }}
            >
              编辑
            </Button>
          </Space>
        }
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                src={selectedUser.avatar} 
                size={100} 
                icon={<UserOutlined />}
              />
              <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>{selectedUser.realName}</Title>
              <Space>
                <Tag color={getRoleColor(selectedUser.role)} style={{ fontSize: '14px' }}>
                  {getRoleText(selectedUser.role)}
                </Tag>
                <Badge 
                  status={selectedUser.status === 'active' ? 'success' : selectedUser.status === 'inactive' ? 'warning' : 'error'} 
                  text={getStatusText(selectedUser.status)} 
                />
              </Space>
            </div>
            
            <Card bordered={false} className="user-detail-card" style={{ marginBottom: 24 }}>
              <Descriptions column={1} bordered size="small" labelStyle={{ fontWeight: 500 }}>
                <Descriptions.Item label={<Space><UserOutlined /> 用户名</Space>}>{selectedUser.username}</Descriptions.Item>
                <Descriptions.Item label={<Space><MailOutlined /> 邮箱</Space>}>{selectedUser.email}</Descriptions.Item>
                <Descriptions.Item label={<Space><PhoneOutlined /> 手机号</Space>}>{selectedUser.phone}</Descriptions.Item>
                <Descriptions.Item label={<Space><TeamOutlined /> 部门</Space>}>{selectedUser.department}</Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined /> 创建时间</Space>}>
                  {new Date(selectedUser.createTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><ClockCircleOutlined /> 最后登录</Space>}>
                  {new Date(selectedUser.lastLoginTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><GlobalOutlined /> 最后登录IP</Space>}>{selectedUser.lastLoginIp || '-'}</Descriptions.Item>
                <Descriptions.Item label={<Space><InfoCircleOutlined /> 备注</Space>}>{selectedUser.remark || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card 
              title={<Space><SafetyCertificateOutlined /> 权限信息</Space>} 
              bordered={false} 
              className="user-detail-card"
            >
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>权限列表</Title>
                <div>
                  {selectedUser.permissions.map(permission => (
                    <Tag key={permission} color="blue" style={{ marginBottom: 8, marginRight: 8 }}>
                      {permission}
                    </Tag>
                  ))}
                </div>
              </div>

              {selectedUser.assignedShips && selectedUser.assignedShips.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Title level={5}>负责船舶</Title>
                  <div>
                    {selectedUser.assignedShips.map(ship => (
                      <Tag key={ship} color="green" style={{ marginBottom: 8, marginRight: 8 }}>
                        {ship}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.assignedPorts && selectedUser.assignedPorts.length > 0 && (
                <div>
                  <Title level={5}>负责港口</Title>
                  <div>
                    {selectedUser.assignedPorts.map(port => (
                      <Tag key={port} color="orange" style={{ marginBottom: 8, marginRight: 8 }}>
                        {port}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserManagement; 