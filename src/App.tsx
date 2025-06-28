import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ShipTracking from './pages/ShipTracking';
import CargoTracking from './pages/CargoTracking';
import DataReport from './pages/DataReport';
import RoutePlanning from './pages/RoutePlanning';
import AnomalyAlert from './pages/AnomalyAlert';
import WeatherForecast from './pages/WeatherForecast';
import PortInformation from './pages/PortInformation';
import PerformanceAnalysis from './pages/PerformanceAnalysis';
import UserManagement from './pages/UserManagement';
import SecuritySettings from './pages/SecuritySettings';
import SystemSettings from './pages/SystemSettings';
import './App.css';

// Import Ant Design styles
import 'antd/dist/antd.min.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ship-tracking" element={<ShipTracking />} />
          <Route path="/cargo-tracking" element={<CargoTracking />} />
          <Route path="/data-analysis" element={<DataReport />} />
          <Route path="/route-planning" element={<RoutePlanning />} />
          <Route path="/anomaly-alert" element={<AnomalyAlert />} />
          <Route path="/weather-forecast" element={<WeatherForecast />} />
          <Route path="/port-info" element={<PortInformation />} />
          <Route path="/performance" element={<PerformanceAnalysis />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/security" element={<SecuritySettings />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/ship-details/:shipId" element={<ShipTracking />} />
          {/* 其他路由可在此添加 */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
