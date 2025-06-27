import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Badge, Divider, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
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
  SettingOutlined,
  GlobalOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined,
  ApartmentOutlined,
  CloudOutlined,
  ShopOutlined,
  ToolOutlined,
  QuestionCircleOutlined,
  BankOutlined
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

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '总览',
    },
    {
      type: 'divider',
    },
    {
      key: '/ship-tracking',
      icon: <RocketOutlined />,
      label: '船舶与货物',
      children: [
        {
          key: '/ship-tracking',
          label: '实时定位',
          icon: <EnvironmentOutlined />,
        },
        {
          key: '/cargo-tracking',
          label: '货物追踪',
          icon: <InboxOutlined />,
        },
      ],
    },
    {
      key: '/route-planning',
      icon: <EnvironmentOutlined />,
      label: '路径规划',
    },
    {
      key: '/anomaly-alert',
      icon: <WarningOutlined />,
      label: '异常预警',
    },
    {
      key: '/weather-forecast',
      icon: <CloudOutlined />,
      label: '天气预报',
    },
    {
      key: '/port-info',
      icon: <BankOutlined />,
      label: '港口信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'analysis',
      icon: <BarChartOutlined />,
      label: '数据分析',
      children: [
        {
          key: '/data-analysis',
          icon: <FileTextOutlined />,
          label: '数据报表',
        },
        {
          key: '/performance',
          icon: <LineChartOutlined />,
          label: '绩效分析',
        },
        // {
        //   key: '/prediction',
        //   icon: <BarChartOutlined />,
        //   label: '预测分析',
        // }
      ]
    },
    {
      key: 'management',
      icon: <TeamOutlined />,
      label: '系统管理',
      children: [
        {
          key: '/user-management',
          icon: <UserOutlined />,
          label: '用户管理',
        },
        {
          key: '/security',
          icon: <SafetyOutlined />,
          label: '安全设置',
        },
        // {
        //   key: '/maintenance',
        //   icon: <ToolOutlined />,
        //   label: '系统维护',
        // }
      ]
    },
    {
      type: 'divider',
    },
    // {
    //   key: '/help-center',
    //   icon: <QuestionCircleOutlined />,
    //   label: '帮助中心',
    // },
    {
      key: '/system-settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        // 处理退出登录逻辑
        // 此处省略实际注销代码
        navigate('/login');
      },
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
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
    {
      type: 'divider',
    },
    {
      key: '4',
      label: (
        <div style={{ textAlign: 'center' }}>
          <a href="#/notifications">查看全部通知</a>
        </div>
      ),
    }
  ];

  // 获取当前打开的子菜单
  const getOpenKeys = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      const mainPath = pathParts[1];
      if (mainPath === 'ship-tracking' || mainPath === 'cargo-tracking') {
        return ['tracking'];
      } else if (mainPath === 'route-planning' || mainPath === 'anomaly-alert' || mainPath === 'weather-forecast' || mainPath === 'port-info') {
        return ['navigation'];
      } else if (mainPath === 'data-analysis' || mainPath === 'performance' || mainPath === 'prediction') {
        return ['analysis'];
      } else if (mainPath === 'user-management' || mainPath === 'security' || mainPath === 'maintenance') {
        return ['management'];
      }
    }
    return [];
  };

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" width={230}>
        <div className="logo">
          {!collapsed && <span>中交润杨（山东）国际物流有限公司船舶物流追踪系统</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout className={`site-layout ${collapsed ? 'collapsed-layout' : ''}`}>
        <Header className="site-header">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          {/*<div className="company-title">中交润杨（山东）国际物流有限公司</div>*/}
          <div className="header-right">
            <Tooltip title="帮助">
              <span className="header-icon">
                <QuestionCircleOutlined />
              </span>
            </Tooltip>
            <Dropdown menu={{ items: notificationMenuItems }} placement="bottomRight" trigger={['click']}>
              <Badge count={3} overflowCount={99}>
                <div className="notification-icon">
                  <BellOutlined />
                </div>
              </Badge>
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