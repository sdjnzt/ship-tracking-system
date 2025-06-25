import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  InboxOutlined,
  WarningOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '总览',
    },
    {
      key: '/ship-tracking',
      icon: <EnvironmentOutlined />,
      label: '实时定位',
    },
    {
      key: '/route-planning',
      icon: <RocketOutlined />,
      label: '路径规划',
    },
    {
      key: '/cargo-tracking',
      icon: <InboxOutlined />,
      label: '货物追踪',
    },
    {
      key: '/anomaly-alert',
      icon: <WarningOutlined />,
      label: '异常预警',
    },
    {
      key: '/data-analysis',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
  ];

  const userMenuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 处理退出登录逻辑
        // 此处省略实际注销代码
        navigate('/login');
      },
    },
  ];

  const notificationMenuItems = [
    {
      key: '1',
      label: (
        <div>
          <strong>船舶偏离航线</strong>
          <p>润杨物流-002 已偏离计划航线超过5海里</p>
          <span className="notification-time">5分钟前</span>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <strong>货物温度异常</strong>
          <p>润杨物流-005 上冷藏集装箱温度过高</p>
          <span className="notification-time">25分钟前</span>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <strong>船舶引擎故障</strong>
          <p>润杨物流-003 主引擎故障，暂时停航</p>
          <span className="notification-time">1小时前</span>
        </div>
      ),
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={230}>
        <div className="logo">
          {!collapsed && <span>船舶物流追踪系统</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-header">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div className="header-right">
            <Dropdown menu={{ items: notificationMenuItems }} placement="bottomRight" trigger={['click']}>
              <div className="notification-icon">
                <BellOutlined />
                <span className="badge">3</span>
              </div>
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">管理员</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="site-content">
          <div className="content-container">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 